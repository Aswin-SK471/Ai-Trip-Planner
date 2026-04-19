// Google Places API Provider
import { LocationSuggestion } from './locationProvider';

export interface GooglePlaceResult {
  placeId: string;
  displayName: string;
  lat: number;
  lon: number;
  city?: string;
  country?: string;
}

// Airport code mapping for major cities
const CITY_TO_AIRPORT_MAP: Record<string, string> = {
  'New York': 'JFK',
  'Los Angeles': 'LAX',
  'Chicago': 'ORD',
  'Dallas': 'DFW',
  'Denver': 'DEN',
  'San Francisco': 'SFO',
  'Miami': 'MIA',
  'Boston': 'BOS',
  'London': 'LHR',
  'Paris': 'CDG',
  'Dublin': 'DUB',
  'Amsterdam': 'AMS',
  'Rome': 'FCO',
  'Madrid': 'MAD',
  'Barcelona': 'BCN',
  'Brussels': 'BRU',
  'Istanbul': 'IST',
  'Prague': 'PRG',
  'Vienna': 'VIE',
  'Zurich': 'ZRH',
  'Milan': 'MIL',
  'Tokyo': 'NRT',
  'Seoul': 'ICN',
  'Sydney': 'SYD',
  'Singapore': 'SIN',
  'Hong Kong': 'HKG',
  'Bangkok': 'BKK',
  'Shanghai': 'PVG',
  'Beijing': 'PEK',
  'Dubai': 'DXB',
  'Doha': 'DOH',
  'Delhi': 'DEL',
  'Mumbai': 'BOM',
  'Bangalore': 'BLR',
  'Chennai': 'MAA',
  'Kolkata': 'CCU',
  'Kochi': 'COK',
  'Hyderabad': 'HYD',
  'Jaipur': 'JAI',
  'Pune': 'PNQ',
  'Mexico City': 'MEX',
  'Toronto': 'YYZ',
  'Vancouver': 'YVR',
};

/**
 * Search Google Places API for locations
 * Uses the Google Places API via a server-side route to avoid CORS issues
 */
export async function searchGooglePlaces(
  query: string,
  apiKey: string
): Promise<GooglePlaceResult[]> {
  try {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    // Call our backend endpoint which will call Google Places API
    const response = await fetch('/api/places/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        apiKey,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      console.error('Google Places API error:', data.error);
      return [];
    }

    // Transform Google Places results to our format
    return data.results.map((result: any) => ({
      placeId: result.place_id,
      displayName: result.name,
      lat: result.geometry.location.lat,
      lon: result.geometry.location.lng,
      city: result.name,
      country: extractCountryFromAddress(result.formatted_address),
    }));
  } catch (error) {
    console.error('Google Places search error:', error);
    return [];
  }
}

/**
 * Extract country from formatted address
 */
function extractCountryFromAddress(address: string): string {
  const parts = address.split(',').map(p => p.trim());
  return parts[parts.length - 1] || '';
}

/**
 * Get airport code for a city
 */
export function getAirportCodeFromCity(cityName: string): string | undefined {
  if (!cityName) return undefined;

  // Direct lookup
  if (CITY_TO_AIRPORT_MAP[cityName]) {
    return CITY_TO_AIRPORT_MAP[cityName];
  }

  // Try partial match
  for (const [city, code] of Object.entries(CITY_TO_AIRPORT_MAP)) {
    if (city.toLowerCase().includes(cityName.toLowerCase()) || 
        cityName.toLowerCase().includes(city.toLowerCase())) {
      return code;
    }
  }

  return undefined;
}

/**
 * Format location for display
 */
export function formatLocationDisplay(suggestion: LocationSuggestion): string {
  if (suggestion.city && suggestion.country) {
    return `${suggestion.city}, ${suggestion.country}`;
  }
  return suggestion.displayName;
}
