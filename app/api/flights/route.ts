import { NextRequest, NextResponse } from 'next/server';
import { searchFlights, convertAmadeusFlightToStandard, type FlightSearchParams } from '@/lib/amadeus';

// Comprehensive list of valid IATA codes
const VALID_IATA_CODES = new Set([
  'JFK', 'LAX', 'ORD', 'DFW', 'DEN', 'SFO', 'MIA', 'BOS', 'SEA', 'LAS', 'MCO', 'PHX', 'SAN', 'HNL',
  'LHR', 'CDG', 'BCN', 'MAD', 'FCO', 'VCE', 'FLR', 'MIL', 'AMS', 'BER', 'VIE', 'PRG', 'IST',
  'DXB', 'DOH', 'NRT', 'HND', 'KIX', 'BKK', 'SIN', 'HKG', 'PVG', 'PEK', 'DEL', 'BOM', 'BLR',
  'SYD', 'MEL', 'BNE', 'YYZ', 'YVR', 'MEX', 'CUN', 'GIG', 'GRU', 'EZE', 'CAI', 'LOS', 'CPT', 'JNB',
  'NYC', 'CHI', 'DAL', 'DEN', 'LON', 'PAR', 'TYO', 'BAN', 'MUM', 'ARN', 'MUC', 'EDI', 'DUB',
  'ZRH', 'BRU', 'ICN', 'CCU', 'MAA', 'COK', 'HYD', 'JAI', 'PNQ', 'AMD', 'BLR'
]);

// Strict IATA validation function
function isValidIATACode(code: string): boolean {
  if (!code || code.length !== 3) return false;
  const upperCode = code.toUpperCase();
  // We accept any 3-letter uppercase code so that users can search global airports
  return /^[A-Z]{3}$/.test(upperCode);
}

// Format and validate IATA airport code STRICTLY
function getValidAirportCode(location: string): string | null {
  // First: Trim and normalize the input
  const normalizedLocation = location.trim().toLowerCase();
  
  // If already in valid IATA format, return it
  if (isValidIATACode(normalizedLocation)) {
    return normalizedLocation.toUpperCase();
  }

  // Try to map city name to airport code
  const cityName = normalizedLocation.split(',')[0].trim();
  
  // Comprehensive city to airport code mapping
  const cityToCode: { [key: string]: string } = {
    'New York': 'JFK', 'Los Angeles': 'LAX', 'Chicago': 'ORD', 'Dallas': 'DFW',
    'Denver': 'DEN', 'San Francisco': 'SFO', 'Miami': 'MIA', 'Boston': 'BOS',
    'Seattle': 'SEA', 'Las Vegas': 'LAS', 'Orlando': 'MCO', 'Phoenix': 'PHX',
    'San Diego': 'SAN', 'Honolulu': 'HNL',
    'London': 'LHR', 'Paris': 'CDG', 'Barcelona': 'BCN', 'Madrid': 'MAD',
    'Rome': 'FCO', 'Venice': 'VCE', 'Florence': 'FLR', 'Milan': 'MIL',
    'Amsterdam': 'AMS', 'Berlin': 'BER', 'Vienna': 'VIE', 'Prague': 'PRG',
    'Istanbul': 'IST', 'Dubai': 'DXB', 'Doha': 'DOH',
    'Tokyo': 'NRT', 'Osaka': 'KIX', 'Bangkok': 'BKK', 'Singapore': 'SIN',
    'Hong Kong': 'HKG', 'Shanghai': 'PVG', 'Beijing': 'PEK', 'Delhi': 'DEL',
    'Mumbai': 'BOM', 'Bangalore': 'BLR', 'Sydney': 'SYD', 'Melbourne': 'MEL',
    'Toronto': 'YYZ', 'Vancouver': 'YVR', 'Mexico City': 'MEX', 'Cancun': 'CUN',
    'Rio de Janeiro': 'GIG', 'São Paulo': 'GRU', 'Buenos Aires': 'EZE',
    'Cairo': 'CAI', 'Cape Town': 'CPT', 'Johannesburg': 'JNB',
  };

  // Try exact match first (case-insensitive)
  let code = cityToCode[cityName];
  
  // If no exact match, try case-insensitive search
  if (!code) {
    for (const [key, value] of Object.entries(cityToCode)) {
      if (key.toLowerCase() === cityName.toLowerCase()) {
        code = value;
        break;
      }
    }
  }
  
  return code && isValidIATACode(code) ? code : null;
}

// Validate and format date (must be YYYY-MM-DD and in future)
function validateDate(dateStr: string): { valid: boolean; formatted: string; error?: string } {
  if (!dateStr) {
    return { valid: false, formatted: '', error: 'Date is required' };
  }

  // Check format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { valid: false, formatted: '', error: 'Date must be in YYYY-MM-DD format' };
  }

  // Parse date
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { valid: false, formatted: '', error: 'Invalid date' };
  }

  // Check if date is in the future (allow same day)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return { valid: false, formatted: '', error: 'Cannot search for past dates' };
  }

  return { valid: true, formatted: dateStr };
}

// Generate realistic flight prices based on days until departure
function generateFlightPrice(daysUntilDeparture: number, baseFare: number = 100): number {
  // Higher price if booking last minute (within 3 days)
  if (daysUntilDeparture <= 3) return Math.round(baseFare * 1.8);
  // Good deal if booking 7-14 days in advance
  if (daysUntilDeparture <= 14) return Math.round(baseFare * 1.1);
  // Best price if booking early (30+ days)
  if (daysUntilDeparture >= 30) return Math.round(baseFare * 0.8);
  return baseFare;
}

// Generate mock flights for a given date (fallback when Amadeus unavailable)
function generateMockFlightsForDate(date: string, origin: string, destination: string, tripType: 'outbound' | 'return' = 'outbound'): Array<{
  id: string;
  airline: string;
  price: number;
  duration: string;
  departure: string;
  arrival: string;
  type: string;
  source: string;
}> {
  const airlines = ['Delta', 'United', 'American', 'Southwest', 'JetBlue', 'Alaska', 'IndiGo', 'Air India', 'SpiceJet'];
  
  const daysUntilDeparture = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const baseFare = Math.floor(Math.random() * 200) + 150; // $150-$350 base
  
  return Array.from({ length: 3 }, (_, i) => {
    const hour = 6 + (i * 5); // Stagger departures: 6am, 11am, 4pm
    const departHour = hour % 24;
    const durationHours = 5 + Math.random() * 3;
    const arrivalHour = (departHour + Math.ceil(durationHours)) % 24;
    
    return {
      id: `mock-${origin}-${destination}-${date}-${tripType}-${i}`,
      airline: airlines[i % airlines.length],
      price: generateFlightPrice(daysUntilDeparture, baseFare + (i * 30)),
      duration: `${Math.floor(durationHours)}h ${Math.floor((durationHours % 1) * 60)}m`,
      departure: `${date}T${String(departHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      arrival: `${date}T${String(arrivalHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      type: tripType === 'outbound' ? 'Outbound' : 'Return',
      source: 'mock',
    };
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract and normalize parameters (TRIM ALL INPUTS)
    const originInput = (data.origin || data.originLocationCode || '').toString().trim();
    const destinationInput = (data.destination || data.destinationLocationCode || '').toString().trim();
    const departureInput = (data.departureDate || data.startDate || '').toString().trim();
    const returnInput = (data.returnDate || data.endDate || '').toString().trim();
    const budget = data.budget ? parseInt(data.budget) : undefined;
    const tripType = data.tripType || 'round-trip';
    const passengers = data.passengers || { adults: 1, children: 0, infants: 0 };

    // ===== STRICT VALIDATION PHASE =====
    
    // Validate origin
    if (!originInput || originInput.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Origin city/airport is required' },
        { status: 400 }
      );
    }

    const originCode = getValidAirportCode(originInput);
    if (!originCode) {
      return NextResponse.json(
        { success: false, error: `Invalid origin: "${originInput}". Please provide a valid city or IATA code.` },
        { status: 400 }
      );
    }

    // Validate destination
    if (!destinationInput || destinationInput.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Destination city/airport is required' },
        { status: 400 }
      );
    }

    const destinationCode = getValidAirportCode(destinationInput);
    if (!destinationCode) {
      return NextResponse.json(
        { success: false, error: `Invalid destination: "${destinationInput}". Please provide a valid city or IATA code.` },
        { status: 400 }
      );
    }

    // Check that origin != destination
    if (originCode === destinationCode) {
      return NextResponse.json(
        { success: false, error: 'Origin and destination cannot be the same' },
        { status: 400 }
      );
    }

    // Validate departure date
    const depDateValidation = validateDate(departureInput);
    if (!depDateValidation.valid) {
      return NextResponse.json(
        { success: false, error: `Invalid departure date: ${depDateValidation.error}` },
        { status: 400 }
      );
    }
    const departureDate = depDateValidation.formatted;

    // Validate return date if provided
    let returnDate: string | undefined = undefined;
    if (returnInput && returnInput.length > 0) {
      const retDateValidation = validateDate(returnInput);
      if (!retDateValidation.valid) {
        return NextResponse.json(
          { success: false, error: `Invalid return date: ${retDateValidation.error}` },
          { status: 400 }
        );
      }
      returnDate = retDateValidation.formatted;

      // Check that return date >= departure date
      if (new Date(returnDate) < new Date(departureDate)) {
        return NextResponse.json(
          { success: false, error: 'Return date must be on or after departure date' },
          { status: 400 }
        );
      }
    } else if (tripType === 'round-trip') {
      return NextResponse.json(
        { success: false, error: 'Return date is required for round-trip flights' },
        { status: 400 }
      );
    }

    // Validate passengers
    const adults = Math.min(Math.max(passengers.adults || 1, 1), 9); // 1-9 adults
    const children = Math.max(passengers.children || 0, 0);
    const infants = Math.max(passengers.infants || 0, 0);

    console.log(`✈️ VALIDATED Flight Search Request:
      Origin: ${originInput} → ${originCode}
      Destination: ${destinationInput} → ${destinationCode}
      Departure: ${departureDate}
      Return: ${returnDate || 'N/A (One-way)'}
      Trip Type: ${tripType}
      Passengers: Adults=${adults}, Children=${children}, Infants=${infants}
      Budget: ${budget ? `₹${budget}/person` : 'No limit'}`);

    let allFlights: any[] = [];
    let flightSource = 'mock';

    // ===== API SEARCH PHASE =====
    // Try Amadeus API first (if credentials available)
    if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
      console.log('🔍 Attempting Amadeus API search...');
      
      try {
        const amadeusParams: FlightSearchParams = {
          originLocationCode: originCode,
          destinationLocationCode: destinationCode,
          departureDate,
          adults: adults,
          children: children,
          infants: infants,
        };

        if (returnDate) {
          amadeusParams.returnDate = returnDate;
        }

        if (budget) {
          amadeusParams.maxPrice = Math.floor(budget * adults);
        }

        const amadeusFlights = await searchFlights(amadeusParams);

        if (amadeusFlights && amadeusFlights.length > 0) {
          console.log(`✅ Amadeus returned ${amadeusFlights.length} flights`);
          
          // Convert Amadeus flights to standard format
          allFlights = amadeusFlights.map((offer, index) => {
            const converted = convertAmadeusFlightToStandard(offer, index);
            return { ...converted, source: 'amadeus', dateSearched: departureDate };
          });
          
          flightSource = 'amadeus';
        } else {
          console.log('⏭️ Amadeus returned no flights, generating mock alternatives...');
        }
      } catch (error) {
        console.error('⚠️ Amadeus API error:', error);
        console.log('🔄 Falling back to mock flights for demo...');
      }
    } else {
      console.log('⚠️ Amadeus credentials not configured, generating demo flights...');
    }

    // ===== FALLBACK MOCK GENERATION =====
    if (allFlights.length === 0) {
      // Generate outbound flights
      const outboundFlights = generateMockFlightsForDate(departureDate, originCode, destinationCode, 'outbound');
      allFlights.push(...outboundFlights);

      // Generate return flights if round-trip
      if (tripType === 'round-trip' && returnDate) {
        const returnFlights = generateMockFlightsForDate(returnDate, destinationCode, originCode, 'return');
        allFlights.push(...returnFlights);
      }

      flightSource = 'mock';
    } else if (tripType === 'round-trip' && returnDate && !allFlights.some(f => f.type === 'Return')) {
      // If Amadeus provided outbound but no return, add mock return flights
      const returnFlights = generateMockFlightsForDate(returnDate, destinationCode, originCode, 'return');
      allFlights.push(...returnFlights);
    }

    // ===== FILTERING & SORTING =====
    // Filter by budget if provided
    if (budget) {
      const beforeFilter = allFlights.length;
      allFlights = allFlights.filter(flight => flight.price <= budget);
      console.log(`💰 Budget filter: ${beforeFilter} → ${allFlights.length} flights`);
    }

    // Sort by price (ascending)
    allFlights.sort((a, b) => a.price - b.price);

    // Ensure we have both outbound and return if round-trip
    let hasOutbound = allFlights.some(f => f.type === 'Outbound');
    let hasReturn = allFlights.some(f => f.type === 'Return');

    // ===== RESPONSE =====
    return NextResponse.json({
      success: true,
      flights: allFlights,
      count: allFlights.length,
      source: flightSource,
      hasOutbound,
      hasReturn,
      searchParams: {
        origin: originCode,
        destination: destinationCode,
        originName: originInput,
        destinationName: destinationInput,
        departureDate,
        returnDate: returnDate || null,
        tripType,
        passengers: { adults, children, infants },
        budget: budget || null,
        searchedAt: new Date().toISOString()
      },
      message: flightSource === 'amadeus' 
        ? '✅ Real-time results from Amadeus API'
        : '📊 Demo flights (configure Amadeus API credentials for real data)',
    });

  } catch (error: any) {
    console.error('❌ Flights API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Unable to search flights. Please try again.',
        flights: []
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Fallback for GET requests - return demo flights
  const searchParams = request.nextUrl.searchParams;
  const departureDate = searchParams.get('departureDate') || new Date().toISOString().split('T')[0];
  const origin = searchParams.get('origin') || 'DEL';
  const destination = searchParams.get('destination') || 'BOM';

  const mockFlights = generateMockFlightsForDate(departureDate, origin, destination, 'outbound');

  return NextResponse.json({
    success: true,
    flights: mockFlights,
    source: 'mock-demo',
    searchParams: { origin, destination, departureDate }
  });
}
