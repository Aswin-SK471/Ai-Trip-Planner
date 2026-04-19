import { NextRequest, NextResponse } from 'next/server';
import { locationSearch } from '@/lib/searchService';

// Session token management for Google Places
const sessionTokens = new Map<string, { token: string; expires: number }>();

function generateSessionToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function getSessionToken(sessionId?: string): string {
  const now = Date.now();

  if (sessionId && sessionTokens.has(sessionId)) {
    const session = sessionTokens.get(sessionId)!;
    if (now < session.expires) {
      return session.token;
    }
    sessionTokens.delete(sessionId);
  }

  const newToken = generateSessionToken();
  const newSessionId = Math.random().toString(36).substring(2, 15);
  sessionTokens.set(newSessionId, {
    token: newToken,
    expires: now + 30 * 60 * 1000, // 30 minutes
  });

  return newToken;
}

/**
 * Normalize Google Places results to our format
 */
function normalizeGoogleResult(prediction: any) {
  const structuredFormatting = prediction.structured_formatting || {};
  const terms = prediction.terms || [];

  let name = structuredFormatting.main_text || prediction.description || '';
  let country = '';

  // Extract country from terms (usually the last complete term)
  if (terms.length > 0) {
    const lastTerm = terms[terms.length - 1];
    country = lastTerm.value;
  }

  // Extract secondary text as fallback
  if (!country && structuredFormatting.secondary_text) {
    country = structuredFormatting.secondary_text.split(',').pop()?.trim() || '';
  }

  return {
    id: `google-${prediction.place_id}`,
    displayName: `${name}, ${country}`,
    type: 'city',
    city: name,
    country: country,
    source: 'google',
    confidence: 88,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const input = searchParams.get('input');
    const sessionId = searchParams.get('session');

    // Validate input
    if (!input || input.trim().length < 1) {
      return NextResponse.json({
        success: true,
        suggestions: [],
        sources: [],
      });
    }

    const cleanInput = input.trim();
    const sessionToken = getSessionToken(sessionId || undefined);
    const results: any[] = [];
    const sources: Set<string> = new Set();

    try {
      // Use enhanced location search service for hybrid search
      const searchResults = locationSearch.search(cleanInput);

      // Convert to API response format
      if (searchResults && searchResults.length > 0) {
        results.push(
          ...searchResults.map((result) => ({
            id: result.id,
            displayName: result.displayName,
            type: result.type,
            city: result.city,
            country: result.country,
            state: result.state,
            iata: result.iata,
            airportName: result.airportName,
            lat: result.lat,
            lng: result.lng,
            source: result.source,
            confidence: result.confidence,
            primaryAirport: result.primaryAirport,
          }))
        );

        // Track sources
        if (searchResults.some((r) => r.source === 'airport')) {
          sources.add('airport');
        }
        if (searchResults.some((r) => r.source === 'city')) {
          sources.add('local');
        }
        if (searchResults.some((r) => r.source === 'country')) {
          sources.add('local');
        }
      }

      // Optional: Try Google Places API if available and we want more results
      if (process.env.GOOGLE_PLACES_API_KEY && results.length < 5) {
        try {
          const googleUrl = new URL(
            'https://maps.googleapis.com/maps/api/place/autocomplete/json'
          );
          googleUrl.searchParams.set('input', cleanInput);
          googleUrl.searchParams.set('key', process.env.GOOGLE_PLACES_API_KEY);
          googleUrl.searchParams.set('sessiontoken', sessionToken);
          googleUrl.searchParams.set('types', '(cities)');

          const googleResponse = await fetch(googleUrl.toString(), {
            signal: AbortSignal.timeout(3000), // 3 second timeout
          });

          if (googleResponse.ok) {
            const googleData = await googleResponse.json();

            if (googleData.status === 'OK' && googleData.predictions) {
              const googleResults = googleData.predictions
                .slice(0, 3)
                .map((prediction: any) => normalizeGoogleResult(prediction));

              results.push(...googleResults);
              sources.add('google');
            }
          }
        } catch (error) {
          console.warn('Google Places API fetch failed:', error);
          // Continue with local results if Google fails
        }
      }

      // Deduplicate by city + country + iata
      const deduped = new Map<string, any>();
      results.forEach((result) => {
        const key = `${result.city?.toLowerCase() || ''}-${result.country?.toLowerCase() || ''}-${result.iata || 'none'}`;
        if (!deduped.has(key)) {
          deduped.set(key, result);
        }
      });

      // Return sorted and limited results
      const finalResults = Array.from(deduped.values())
        .sort((a, b) => {
          // Prioritize by confidence/score
          const confA = a.confidence || 0;
          const confB = b.confidence || 0;
          if (confA !== confB) return confB - confA;

          // Prefer airports, then cities, then countries
          const typeOrder = { airport: 3, city: 2, country: 1 };
          const orderA = typeOrder[a.type as keyof typeof typeOrder] || 0;
          const orderB = typeOrder[b.type as keyof typeof typeOrder] || 0;
          return orderB - orderA;
        })
        .slice(0, 15);

      return NextResponse.json({
        success: true,
        suggestions: finalResults,
        sources: Array.from(sources),
        query: cleanInput,
        count: finalResults.length,
      });
    } catch (error) {
      console.error('Location search failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Location search failed',
          suggestions: [],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Places API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', suggestions: [] },
      { status: 500 }
    );
  }
}
