// Amadeus API integration with OAuth2
// Reference: https://amadeus.com/en/developers

// @ts-ignore - No types available for amadeus module
import Amadeus from 'amadeus';

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

// OAuth2 token management
async function getAccessToken(): Promise<string | null> {
  const now = Date.now();
  
  // Return cached token if still valid
  if (tokenCache && now < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  // Get new token
  try {
    const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY || '',
        client_secret: process.env.AMADEUS_API_SECRET || '',
      }),
    });

    if (!response.ok) {
      console.error('❌ Failed to get Amadeus access token:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Cache token with 5-minute buffer before expiry
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: now + (data.expires_in * 1000) - (5 * 60 * 1000),
    };

    console.log('✅ Obtained new Amadeus access token');
    return tokenCache.accessToken;
  } catch (error) {
    console.error('❌ Error getting Amadeus access token:', error);
    return null;
  }
}

// Initialize Amadeus client with OAuth2
function getAmadeusClient() {
  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
    return null;
  }
  
  return new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET,
  });
}

export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
      stops?: Array<any>;
      class?: string;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
      includedCheckedBags: {
        weight: number;
        weightUnit: string;
      };
    }>;
  }>;
}

export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  maxPrice?: number;
  currencyCode?: string;
}

/**
 * Search for flight offers using Amadeus API
 */
export async function searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
  try {
    if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
      console.warn('⚠️ Amadeus credentials not configured, returning empty results');
      return [];
    }

    console.log('🔍 Searching flights with Amadeus:', {
      origin: params.originLocationCode,
      destination: params.destinationLocationCode,
      departureDate: params.departureDate,
      returnDate: params.returnDate || 'N/A (One-way)',
      adults: params.adults,
    });

    // Get OAuth2 token
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('Failed to obtain Amadeus access token');
    }

    // Build request parameters
    const requestParams = new URLSearchParams({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      max: '10', // Return up to 10 results
    });

    // Add optional return date for round-trip
    if (params.returnDate) {
      requestParams.append('returnDate', params.returnDate);
    }

    // Add max price if budget provided
    if (params.maxPrice) {
      requestParams.append('maxPrice', params.maxPrice.toString());
    }

    // Add children/infants if provided
    if (params.children && params.children > 0) {
      requestParams.append('children', params.children.toString());
    }
    if (params.infants && params.infants > 0) {
      requestParams.append('infants', params.infants.toString());
    }

    // Make direct API call with parameters
    const apiUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers?${requestParams.toString()}`;
    
    console.log(`📍 Amadeus API URL: ${apiUrl.replace(process.env.AMADEUS_API_KEY || 'KEY', 'xxx')}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Amadeus API Error:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    console.log(`✅ Found ${data.data?.length || 0} flights from Amadeus`);

    return data.data || [];
  } catch (error: any) {
    console.error('❌ Amadeus API Error:', {
      message: error.message,
      status: error.response?.status,
    });

    // Return empty array on error - caller will use mock fallback
    return [];
  }
}

/**
 * Validate airport IATA codes
 * Can be used to verify if airport codes are valid before searching
 */
export async function validateAirportCode(code: string): Promise<boolean> {
  try {
    if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
      return false;
    }

    // Amadeus provides airport lookup via reference data
    // For now, return true for known codes
    const knownCodes = [
      'JFK', 'LAX', 'ORD', 'DFW', 'DEN', 'SFO', 'MIA', 'BOS',
      'LHR', 'CDG', 'DUB', 'AMS', 'FCO', 'MAD', 'BCN', 'BRU',
      'NRT', 'HND', 'ICN', 'SYD', 'SIN', 'HKG', 'BKK', 'PVG', 'PEK',
      'DXB', 'DOH',
      'DEL', 'BOM', 'BLR', 'MAA', 'CCU', 'COK', 'HYD', 'JAI', 'PNQ',
      'MEX', 'YYZ', 'YVR',
      'IST', 'PRG', 'VIE', 'ZRH', 'MIL'
    ];

    return knownCodes.includes(code.toUpperCase());
  } catch (error) {
    console.error('Error validating airport code:', error);
    return false;
  }
}

/**
 * Convert flight offer to standard flight format
 */
export function convertAmadeusFlightToStandard(offer: FlightOffer, index: number) {
  const itinerary = offer.itineraries[0]; // Outbound
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];

  return {
    id: `amadeus-${index}-${offer.id}`,
    airline: firstSegment.carrierCode,
    price: Math.round(parseFloat(offer.price.total)),
    currency: offer.price.currency || 'INR',
    duration: itinerary.duration || '6h 30m',
    departure: `${firstSegment.departure.at}`,
    arrival: `${lastSegment.arrival.at}`,
    type: 'Outbound',
    stops: (firstSegment.stops?.length || 0),
    aircraft: firstSegment.aircraft.code,
  };
}

