import { locationSearch, LocationResult } from './searchService';
import airportsData from '@/data/airports.json';

export interface AirportMapping {
  city: string;
  country: string;
  iata: string;
  airport: string;
  lat: number;
  lng: number;
}

/**
 * Get IATA code for a city using the enhanced search service
 * Returns null if no airport found
 */
export function getIATACode(city: string, country: string): string | null {
  if (!city || !country) return null;
  return locationSearch.getIATACode(city.trim(), country.trim());
}

/**
 * Get airport details by city and country
 */
export function getAirportByCity(
  city: string,
  country: string
): AirportMapping | null {
  if (!city || !country) return null;

  const iata = getIATACode(city, country);
  if (!iata) return null;

  // Find the full airport data
  const airport = airportsData.find(
    (a: any) =>
      a.iata === iata &&
      a.city.toLowerCase() === city.toLowerCase() &&
      a.country.toLowerCase() === country.toLowerCase()
  );

  if (!airport) return null;

  return {
    city: airport.city,
    country: airport.country,
    iata: airport.iata,
    airport: airport.name,
    lat: airport.lat,
    lng: airport.lng,
  };
}

/**
 * Search airports by query string
 * Supports city name, airport name, or IATA code
 */
export function searchAirports(query: string): AirportMapping[] {
  if (!query || query.length < 1) return [];

  const results = locationSearch.search(query);
  const airportResults: AirportMapping[] = [];

  results.forEach((result: LocationResult) => {
    if (result.type === 'airport' && result.iata) {
      const airportData = airportsData.find((a: any) => a.iata === result.iata);
      if (airportData) {
        airportResults.push({
          city: airportData.city,
          country: airportData.country,
          iata: airportData.iata,
          airport: airportData.name,
          lat: airportData.lat,
          lng: airportData.lng,
        });
      }
    }
  });

  return airportResults.slice(0, 10);
}

/**
 * Get all unique cities that have airports
 */
export function getAllCities(): string[] {
  const cities = new Set<string>();
  airportsData.forEach((airport: any) => {
    cities.add(airport.city);
  });
  return Array.from(cities).sort();
}

/**
 * Get all countries that have airports
 */
export function getAllCountries(): string[] {
  const countries = new Set<string>();
  airportsData.forEach((airport: any) => {
    countries.add(airport.country);
  });
  return Array.from(countries).sort();
}

/**
 * Format airport for display
 */
export function formatAirport(airport: AirportMapping): string {
  return `${airport.airport} (${airport.iata})`;
}

/**
 * Get multiple airports for a city (some cities have multiple airports)
 */
export function getAirportsByCity(
  city: string,
  country: string
): AirportMapping[] {
  return airportsData
    .filter(
      (a: any) =>
        a.city.toLowerCase() === city.toLowerCase() &&
        a.country.toLowerCase() === country.toLowerCase()
    )
    .map((a: any) => ({
      city: a.city,
      country: a.country,
      iata: a.iata,
      airport: a.name,
      lat: a.lat,
      lng: a.lng,
    }));
}
