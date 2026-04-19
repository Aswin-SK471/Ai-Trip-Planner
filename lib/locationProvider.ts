import { searchGooglePlaces, getAirportCodeFromCity } from './googlePlacesProvider';

// Location Provider Types
export interface LocationSuggestion {
  id: string;
  displayName: string;
  lat: number;
  lon: number;
  placeType?: string;
  country?: string;
  state?: string;
  city?: string;
  airportCode?: string;
}

export interface LocationProvider {
  search(query: string): Promise<LocationSuggestion[]>;
  name: string;
}

// Provider Configuration
export type LocationProviderType = 'google' | 'airport' | 'auto';

// Major Airports & Cities Database (Local - Fast & Reliable - COMPREHENSIVE)
const MAJOR_AIRPORTS = [
  // USA
  { id: 'JFK', city: 'New York', country: 'USA', code: 'JFK', display: 'New York (JFK)', lat: 40.6413, lon: -73.7781 },
  { id: 'LAX', city: 'Los Angeles', country: 'USA', code: 'LAX', display: 'Los Angeles (LAX)', lat: 33.9425, lon: -118.4081 },
  { id: 'ORD', city: 'Chicago', country: 'USA', code: 'ORD', display: 'Chicago (ORD)', lat: 41.9742, lon: -87.9073 },
  { id: 'DFW', city: 'Dallas', country: 'USA', code: 'DFW', display: 'Dallas (DFW)', lat: 32.8975, lon: -97.038 },
  { id: 'DEN', city: 'Denver', country: 'USA', code: 'DEN', display: 'Denver (DEN)', lat: 39.8561, lon: -104.6737 },
  { id: 'SFO', city: 'San Francisco', country: 'USA', code: 'SFO', display: 'San Francisco (SFO)', lat: 37.6213, lon: -122.379 },
  { id: 'MIA', city: 'Miami', country: 'USA', code: 'MIA', display: 'Miami (MIA)', lat: 25.7959, lon: -80.2870 },
  { id: 'BOS', city: 'Boston', country: 'USA', code: 'BOS', display: 'Boston (BOS)', lat: 42.3656, lon: -71.0096 },
  // Europe
  { id: 'LHR', city: 'London', country: 'UK', code: 'LHR', display: 'London (LHR)', lat: 51.4700, lon: -0.4543 },
  { id: 'CDG', city: 'Paris', country: 'France', code: 'CDG', display: 'Paris (CDG)', lat: 49.0097, lon: 2.5479 },
  { id: 'DUB', city: 'Dublin', country: 'Ireland', code: 'DUB', display: 'Dublin (DUB)', lat: 53.4264, lon: -6.2499 },
  { id: 'AMS', city: 'Amsterdam', country: 'Netherlands', code: 'AMS', display: 'Amsterdam (AMS)', lat: 52.3086, lon: 4.7639 },
  { id: 'FCO', city: 'Rome', country: 'Italy', code: 'FCO', display: 'Rome (FCO)', lat: 41.8002, lon: 12.2389 },
  { id: 'MAD', city: 'Madrid', country: 'Spain', code: 'MAD', display: 'Madrid (MAD)', lat: 40.4719, lon: -3.6289 },
  { id: 'BCN', city: 'Barcelona', country: 'Spain', code: 'BCN', display: 'Barcelona (BCN)', lat: 41.2974, lon: 2.0833 },
  { id: 'BRU', city: 'Brussels', country: 'Belgium', code: 'BRU', display: 'Brussels (BRU)', lat: 50.9010, lon: 4.4844 },
  { id: 'IST', city: 'Istanbul', country: 'Turkey', code: 'IST', display: 'Istanbul (IST)', lat: 41.2619, lon: 28.7298 },
  { id: 'PRG', city: 'Prague', country: 'Czech Republic', code: 'PRG', display: 'Prague (PRG)', lat: 50.1008, lon: 14.2600 },
  { id: 'VIE', city: 'Vienna', country: 'Austria', code: 'VIE', display: 'Vienna (VIE)', lat: 48.1101, lon: 16.5697 },
  { id: 'ZRH', city: 'Zurich', country: 'Switzerland', code: 'ZRH', display: 'Zurich (ZRH)', lat: 47.4647, lon: 8.5492 },
  { id: 'MIL', city: 'Milan', country: 'Italy', code: 'MIL', display: 'Milan (MIL)', lat: 45.6260, lon: 8.7488 },
  // Asia
  { id: 'NRT', city: 'Tokyo', country: 'Japan', code: 'NRT', display: 'Tokyo (NRT)', lat: 35.7629, lon: 140.3807 },
  { id: 'HND', city: 'Tokyo', country: 'Japan', code: 'HND', display: 'Tokyo Haneda (HND)', lat: 35.5494, lon: 139.7798 },
  { id: 'ICN', city: 'Seoul', country: 'South Korea', code: 'ICN', display: 'Seoul Incheon (ICN)', lat: 37.4602, lon: 126.4407 },
  { id: 'SYD', city: 'Sydney', country: 'Australia', code: 'SYD', display: 'Sydney (SYD)', lat: -33.9461, lon: 151.1772 },
  { id: 'SIN', city: 'Singapore', country: 'Singapore', code: 'SIN', display: 'Singapore (SIN)', lat: 1.3521, lon: 103.8198 },
  { id: 'HKG', city: 'Hong Kong', country: 'Hong Kong', code: 'HKG', display: 'Hong Kong (HKG)', lat: 22.2903, lon: 113.9050 },
  { id: 'BKK', city: 'Bangkok', country: 'Thailand', code: 'BKK', display: 'Bangkok (BKK)', lat: 13.9011, lon: 100.7501 },
  { id: 'PVG', city: 'Shanghai', country: 'China', code: 'PVG', display: 'Shanghai (PVG)', lat: 31.1438, lon: 121.8050 },
  { id: 'PEK', city: 'Beijing', country: 'China', code: 'PEK', display: 'Beijing (PEK)', lat: 40.0801, lon: 116.5847 },
  // Middle East
  { id: 'DXB', city: 'Dubai', country: 'UAE', code: 'DXB', display: 'Dubai (DXB)', lat: 25.2048, lon: 55.2708 },
  { id: 'DOH', city: 'Doha', country: 'Qatar', code: 'DOH', display: 'Doha (DOH)', lat: 25.2731, lon: 51.6126 },
  // India (MAJOR FOCUS)
  { id: 'DEL', city: 'Delhi', country: 'India', code: 'DEL', display: 'Delhi (DEL)', lat: 28.5644, lon: 77.1033 },
  { id: 'BOM', city: 'Mumbai', country: 'India', code: 'BOM', display: 'Mumbai (BOM)', lat: 19.0896, lon: 72.8656 },
  { id: 'BLR', city: 'Bangalore', country: 'India', code: 'BLR', display: 'Bangalore (BLR)', lat: 13.1939, lon: 77.7068 },
  { id: 'MAA', city: 'Chennai', country: 'India', code: 'MAA', display: 'Chennai (MAA)', lat: 12.9920, lon: 80.1609 },
  { id: 'CCU', city: 'Kolkata', country: 'India', code: 'CCU', display: 'Kolkata (CCU)', lat: 22.6545, lon: 88.4467 },
  { id: 'COK', city: 'Kochi', country: 'India', code: 'COK', display: 'Kochi (COK)', lat: 10.1815, lon: 76.3867 },
  { id: 'HYD', city: 'Hyderabad', country: 'India', code: 'HYD', display: 'Hyderabad (HYD)', lat: 17.3850, lon: 78.4867 },
  { id: 'JAI', city: 'Jaipur', country: 'India', code: 'JAI', display: 'Jaipur (JAI)', lat: 26.8124, lon: 75.8049 },
  { id: 'PNQ', city: 'Pune', country: 'India', code: 'PNQ', display: 'Pune (PNQ)', lat: 18.5824, lon: 73.9191 },
  // Americas
  { id: 'MEX', city: 'Mexico City', country: 'Mexico', code: 'MEX', display: 'Mexico City (MEX)', lat: 19.4363, lon: -99.0718 },
  { id: 'YYZ', city: 'Toronto', country: 'Canada', code: 'YYZ', display: 'Toronto (YYZ)', lat: 43.6772, lon: -79.6306 },
  { id: 'YVR', city: 'Vancouver', country: 'Canada', code: 'YVR', display: 'Vancouver (YVR)', lat: 49.1900, lon: -123.1794 },
];

// Local Airport Provider (Fast & Reliable)
class LocalAirportProvider implements LocationProvider {
  name = 'Airports';

  async search(query: string): Promise<LocationSuggestion[]> {
    if (!query.trim() || query.length < 1) {
      return [];
    }

    const lowercaseQuery = query.toLowerCase();

    // Search by city name, airport code, or display name
    const results = MAJOR_AIRPORTS.filter(airport => {
      const matchCity = airport.city.toLowerCase().includes(lowercaseQuery);
      const matchCode = airport.code.toLowerCase().includes(lowercaseQuery);
      const matchDisplay = airport.display.toLowerCase().includes(lowercaseQuery);
      
      return matchCity || matchCode || matchDisplay;
    })
    .slice(0, 10)
    .map(airport => ({
      id: airport.code,
      airportCode: airport.code,
      displayName: airport.display,
      city: airport.city,
      country: airport.country,
      placeType: 'airport',
      lat: airport.lat,
      lon: airport.lon,
    }));

    return results;
  }
}

// Main Search Function
export async function searchLocations(
  query: string,
  providerType: LocationProviderType = 'auto',
  apiKey?: string
): Promise<LocationSuggestion[]> {
  try {
    // Try Google Places API if available and enabled
    if ((providerType === 'google' || providerType === 'auto') && apiKey) {
      console.log('🌍 Searching with Google Places...');
      const googleResults = await searchGooglePlaces(query, apiKey);
      
      if (googleResults.length > 0) {
        // Convert Google results to LocationSuggestion format
        return googleResults.map(result => ({
          id: result.placeId,
          displayName: result.displayName,
          lat: result.lat,
          lon: result.lon,
          city: result.city,
          country: result.country,
          placeType: 'city',
          airportCode: result.city ? getAirportCodeFromCity(result.city) || undefined : undefined,
        }));
      }
    }

    // Fallback to local airport provider
    console.log('📍 Falling back to local airport provider...');
    const provider = new LocalAirportProvider();
    return provider.search(query);
  } catch (error) {
    console.error('Location search error:', error);
    // Final fallback to local
    const provider = new LocalAirportProvider();
    return provider.search(query);
  }
}
