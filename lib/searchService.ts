import airportsData from '@/data/airports.json';
import locationsData from '@/data/locations.json';

/** Unified location suggestion with all necessary data */
export interface LocationResult {
  id: string;
  displayName: string;
  type: 'city' | 'country' | 'airport';
  city: string;
  country: string;
  state?: string;
  iata?: string;
  airportName?: string;
  lat: number;
  lng: number;
  source: 'airport' | 'city' | 'country';
  confidence: number; // 0-100, higher = more relevant
  primaryAirport?: string;
}

interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  major?: boolean;
}

interface Location {
  name: string;
  country: string;
  state?: string;
  type: 'city' | 'country';
  iata?: string;
  popularity?: number;
  lat?: number;
  lng?: number;
  primaryAirport?: string;
}

/**
 * Enhanced production-grade location search service
 * Combines airports, cities, and countries with intelligent ranking
 */
export class LocationSearchService {
  private airports: Map<string, Airport> = new Map();
  private locations: Map<string, Location> = new Map();
  private cityToAirports: Map<string, Airport[]> = new Map();
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.initialized) return;

    // Load and index airports
    airportsData.forEach((airport: any) => {
      const key = airport.iata.toUpperCase();
      this.airports.set(key, {
        iata: airport.iata,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        lat: airport.lat,
        lng: airport.lng,
        major: airport.major,
      });

      // Index by city for quick lookup
      const cityKey = `${airport.city.toLowerCase()}-${airport.country.toLowerCase()}`;
      if (!this.cityToAirports.has(cityKey)) {
        this.cityToAirports.set(cityKey, []);
      }
      this.cityToAirports.get(cityKey)!.push(airport);
    });

    // Load and index locations (cities and countries)
    locationsData.forEach((location: any) => {
      const key = `${location.name.toLowerCase()}-${location.country.toLowerCase()}`;
      this.locations.set(key, {
        name: location.name,
        country: location.country,
        state: location.state,
        type: location.type,
        iata: location.iata,
        popularity: location.popularity || 50,
        lat: location.lat,
        lng: location.lng,
        primaryAirport: location.primaryAirport,
      });
    });

    this.initialized = true;
  }

  /**
   * Normalize and clean input strings
   */
  private normalizeInput(input: string): string {
    return input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
  }

  /**
   * Calculate similarity score between query and text (0-100)
   */
  private calculateSimilarity(query: string, text: string): number {
    const norm = this.normalizeInput(text);
    const normQuery = this.normalizeInput(query);

    // Exact match
    if (norm === normQuery) return 100;

    // Starts with match (highest priority)
    if (norm.startsWith(normQuery)) return 90;

    // Contains match
    if (norm.includes(normQuery)) return 70;

    // Levenshtein-like scoring for typos
    return this.levenshteinScore(normQuery, norm);
  }

  /**
   * Calculate levenshtein distance score (0-100)
   */
  private levenshteinScore(a: string, b: string): number {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 100;

    const distance = this.levenshteinDistance(a, b);
    return Math.max(0, 100 - (distance / maxLen) * 100 * 10);
  }

  /**
   * Calculate levenshtein distance
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b[i - 1] === a[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Search for locations with intelligent ranking
   */
  public search(query: string): LocationResult[] {
    this.initialize();

    const cleanQuery = query.trim();
    if (cleanQuery.length === 0) return [];

    const results: Map<string, LocationResult> = new Map();

    // Search airports
    this.searchAirports(cleanQuery, results);

    // Search cities and countries
    this.searchLocations(cleanQuery, results);

    // Convert to array and sort by confidence DESC
    return Array.from(results.values())
      .sort((a, b) => {
        // Primary sort by confidence
        if (b.confidence !== a.confidence) return b.confidence - a.confidence;

        // Secondary sort: prefer cities over countries, airports over generic
        const typeScore = { airport: 3, city: 2, country: 1 };
        const typeA = typeScore[a.type] || 0;
        const typeB = typeScore[b.type] || 0;
        return typeB - typeA;
      })
      .slice(0, 15); // Limit to 15 results
  }

  /**
   * Search airports by city, IATA code, or airport name
   */
  private searchAirports(query: string, results: Map<string, LocationResult>) {
    const normQuery = this.normalizeInput(query);

    this.airports.forEach((airport) => {
      let confidence = 0;

      // Check IATA code (highest priority if exact match)
      if (airport.iata.toUpperCase() === query.toUpperCase()) {
        confidence = 100;
      } else if (airport.iata.toUpperCase().startsWith(query.toUpperCase())) {
        confidence = 95;
      } else {
        // Check city name
        const cityScore = this.calculateSimilarity(query, airport.city);
        // Check airport name
        const nameScore = this.calculateSimilarity(query, airport.name);
        confidence = Math.max(cityScore, nameScore);
      }

      if (confidence >= 50) {
        const id = `airport-${airport.iata}`;
        results.set(id, {
          id,
          displayName: `${airport.city}, ${airport.country}`,
          type: 'airport',
          city: airport.city,
          country: airport.country,
          iata: airport.iata,
          airportName: airport.name,
          lat: airport.lat,
          lng: airport.lng,
          source: 'airport',
          confidence,
        });
      }
    });
  }

  /**
   * Search cities and countries
   */
  private searchLocations(query: string, results: Map<string, LocationResult>) {
    this.locations.forEach((location) => {
      // Score based on name match (primary)
      const nameScore = this.calculateSimilarity(query, location.name);

      // Score based on country match (secondary)
      const countryScore = this.calculateSimilarity(query, location.country) * 0.5;

      const confidence = Math.max(nameScore, countryScore);

      if (confidence >= 40) {
        const id = `${location.type}-${location.name.toLowerCase()}-${location.country.toLowerCase()}`;

        // Check if we already have an airport result for this city
        // If so, we can enhance it or create a separate city entry
        if (
          location.type === 'city' &&
          results.has(`airport-${location.primaryAirport}`)
        ) {
          // Great—airport already indexed, skip duplicate city
          return;
        }

        // Boost confidence for more popular cities
        const popularity = location.popularity || 50;
        const boostedConfidence = Math.min(
          100,
          confidence * (1 + popularity / 200)
        );

        results.set(id, {
          id,
          displayName:
            location.type === 'country'
              ? location.name
              : `${location.name}, ${location.country}`,
          type: location.type,
          city: location.name,
          country: location.country,
          state: location.state,
          iata: location.iata,
          lat: location.lat || 0,
          lng: location.lng || 0,
          source: location.type === 'country' ? 'country' : 'city',
          confidence: boostedConfidence,
          primaryAirport: location.primaryAirport,
        });
      }
    });
  }

  /**
   * Get the primary airport for a city
   */
  public getPrimaryAirport(
    city: string,
    country: string
  ): Airport | LocationResult | null {
    this.initialize();

    // Try to find in locations first (has primaryAirport link)
    const locKey = `${city.toLowerCase()}-${country.toLowerCase()}`;
    const location = this.locations.get(locKey);

    if (location && location.primaryAirport) {
      const airport = this.airports.get(location.primaryAirport);
      if (airport) return airport;
    }

    // Fallback: find first airport in city
    const cityKey = `${city.toLowerCase()}-${country.toLowerCase()}`;
    const cityAirports = this.cityToAirports.get(cityKey);
    if (cityAirports && cityAirports.length > 0) {
      // Prefer major airports
      const majorAirport = cityAirports.find((a) => a.major);
      return majorAirport || cityAirports[0];
    }

    return null;
  }

  /**
   * Get IATA code for a city
   */
  public getIATACode(city: string, country: string): string | null {
    const airport = this.getPrimaryAirport(city, country);
    return airport && 'iata' in airport ? (airport.iata ?? null) : null;
  }

  /**
   * Check if a location is valid (city or country exists)
   */
  public isValidLocation(name: string, country: string): boolean {
    this.initialize();
    const key = `${name.toLowerCase()}-${country.toLowerCase()}`;
    return this.locations.has(key);
  }
}

// Export singleton instance
export const locationSearch = new LocationSearchService();
