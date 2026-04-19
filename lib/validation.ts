// Validation utilities for flight booking

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// IATA code validation (3 letters, uppercase)
export function validateIATACode(code: string): ValidationResult {
  if (!code || typeof code !== 'string') {
    return { isValid: false, error: 'Airport code is required' };
  }

  const cleanCode = code.trim().toUpperCase();
  
  if (cleanCode.length !== 3) {
    return { isValid: false, error: 'Airport code must be exactly 3 letters' };
  }

  if (!/^[A-Z]{3}$/.test(cleanCode)) {
    return { isValid: false, error: 'Airport code must contain only letters' };
  }

  return { isValid: true };
}

// Common IATA codes for validation
export const COMMON_IATA_CODES = new Set([
  'JFK', 'LAX', 'ORD', 'DFW', 'DEN', 'SFO', 'MIA', 'BOS', 'ATL', 'LAS', 'SEA',
  'LHR', 'CDG', 'AMS', 'FRA', 'MUC', 'FCO', 'BCN', 'MAD', 'ARN', 'CPH',
  'DXB', 'DOH', 'IST', 'TLV', 'CAI', 'JNB', 'CPT', 'NBO', 'LOS', 'ACC',
  'NRT', 'HND', 'ICN', 'PVG', 'PEK', 'CAN', 'SZX', 'HKG', 'SIN', 'BKK',
  'SYD', 'MEL', 'AKL', 'BNE', 'PER', 'CHC', 'WLG',
  'DEL', 'BOM', 'BLR', 'MAA', 'CCU', 'HYD', 'PNQ', 'AMD', 'JAI',
  'YYZ', 'YVR', 'YUL', 'MEX', 'GRU', 'GIG', 'EZE', 'SCL', 'LIM',
]);

// Enhanced IATA validation against known codes
export function validateAirportCode(code: string): ValidationResult {
  const basicValidation = validateIATACode(code);
  if (!basicValidation.isValid) {
    return basicValidation;
  }

  const cleanCode = code.trim().toUpperCase();
  
  // Check against known codes for better validation
  if (!COMMON_IATA_CODES.has(cleanCode)) {
    return { 
      isValid: false, 
      error: 'Unknown airport code. Please enter a valid airport code.' 
    };
  }

  return { isValid: true };
}

// Date validation
export function validateDepartureDate(date: string): ValidationResult {
  if (!date) {
    return { isValid: false, error: 'Departure date is required' };
  }

  const departureDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  if (isNaN(departureDate.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  if (departureDate < today) {
    return { isValid: false, error: 'Departure date cannot be in the past' };
  }

  // Check if date is too far in future (more than 1 year)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  if (departureDate > maxDate) {
    return { isValid: false, error: 'Departure date cannot be more than 1 year in advance' };
  }

  return { isValid: true };
}

export function validateReturnDate(returnDate: string, departureDate: string): ValidationResult {
  if (!returnDate) {
    return { isValid: true }; // Return date is optional for one-way
  }

  const returnDt = new Date(returnDate);
  const departureDt = new Date(departureDate);

  if (isNaN(returnDt.getTime())) {
    return { isValid: false, error: 'Invalid return date format' };
  }

  if (returnDt <= departureDt) {
    return { isValid: false, error: 'Return date must be after departure date' };
  }

  return { isValid: true };
}

// Passenger validation
export function validatePassengers(adults: number, children: number = 0, infants: number = 0): ValidationResult {
  if (adults < 1) {
    return { isValid: false, error: 'At least 1 adult is required' };
  }

  if (adults > 9) {
    return { isValid: false, error: 'Maximum 9 adults allowed' };
  }

  const totalPassengers = adults + children + infants;
  if (totalPassengers > 9) {
    return { isValid: false, error: 'Maximum 9 passengers allowed' };
  }

  if (infants > adults) {
    return { isValid: false, error: 'Number of infants cannot exceed number of adults' };
  }

  if (children < 0 || infants < 0) {
    return { isValid: false, error: 'Number of children/infants cannot be negative' };
  }

  return { isValid: true };
}

// Budget validation
export function validateBudget(budget: number): ValidationResult {
  if (!budget || budget <= 0) {
    return { isValid: false, error: 'Budget must be greater than 0' };
  }

  if (budget > 100000) {
    return { isValid: false, error: 'Budget seems unusually high' };
  }

  return { isValid: true };
}

// Flight search parameters validation
export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  maxPrice?: number;
}

export function validateFlightSearchParams(params: FlightSearchParams): ValidationResult {
  // Validate origin
  const originValidation = validateAirportCode(params.originLocationCode);
  if (!originValidation.isValid) {
    return { isValid: false, error: `Invalid origin airport: ${originValidation.error}` };
  }

  // Validate destination
  const destinationValidation = validateAirportCode(params.destinationLocationCode);
  if (!destinationValidation.isValid) {
    return { isValid: false, error: `Invalid destination airport: ${destinationValidation.error}` };
  }

  // Check same origin and destination
  if (params.originLocationCode.trim().toUpperCase() === params.destinationLocationCode.trim().toUpperCase()) {
    return { isValid: false, error: 'Origin and destination cannot be the same' };
  }

  // Validate dates
  const departureValidation = validateDepartureDate(params.departureDate);
  if (!departureValidation.isValid) {
    return departureValidation;
  }

  const returnValidation = validateReturnDate(params.returnDate || '', params.departureDate);
  if (!returnValidation.isValid) {
    return returnValidation;
  }

  // Validate passengers
  const passengerValidation = validatePassengers(
    params.adults, 
    params.children || 0, 
    params.infants || 0
  );
  if (!passengerValidation.isValid) {
    return passengerValidation;
  }

  // Validate budget if provided
  if (params.maxPrice) {
    const budgetValidation = validateBudget(params.maxPrice);
    if (!budgetValidation.isValid) {
      return budgetValidation;
    }
  }

  return { isValid: true };
}

// City name to airport code mapping
export function mapCityToAirport(cityName: string): string | null {
  const cityMap: Record<string, string> = {
    'new york': 'JFK',
    'los angeles': 'LAX',
    'chicago': 'ORD',
    'london': 'LHR',
    'paris': 'CDG',
    'tokyo': 'NRT',
    'dubai': 'DXB',
    'singapore': 'SIN',
    'sydney': 'SYD',
    'mumbai': 'BOM',
    'delhi': 'DEL',
    'bangalore': 'BLR',
    'toronto': 'YYZ',
    'vancouver': 'YVR',
    'mexico city': 'MEX',
    'são paulo': 'GRU',
    'rio de janeiro': 'GIG',
    'buenos aires': 'EZE',
    'cairo': 'CAI',
    'lagos': 'LOS',
    'cape town': 'CPT',
    'moscow': 'SVO',
    'istanbul': 'IST',
    'rome': 'FCO',
    'madrid': 'MAD',
    'barcelona': 'BCN',
    'amsterdam': 'AMS',
    'frankfurt': 'FRA',
    'munich': 'MUC',
    'stockholm': 'ARN',
    'copenhagen': 'CPH',
    'oslo': 'OSL',
    'helsinki': 'HEL',
    'warsaw': 'WAW',
    'prague': 'PRG',
    'budapest': 'BUD',
    'athens': 'ATH',
    'vienna': 'VIE',
    'zurich': 'ZRH',
    'brussels': 'BRU',
    'dublin': 'DUB',
    'lisbon': 'LIS',
    'milan': 'MXP',
    'berlin': 'BER',
  };

  const normalizedCity = cityName.toLowerCase().trim();
  return cityMap[normalizedCity] || null;
}
