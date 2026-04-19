import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/places/search
 * Search for places using Google Places API
 * Handles CORS and server-side API calls
 */
export async function POST(request: NextRequest) {
  try {
    const { query, apiKey } = await request.json();

    if (!query || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing query or API key' },
        { status: 400 }
      );
    }

    // Call Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&key=${apiKey}&components=country:*`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return NextResponse.json(
        { success: false, error: data.error_message || data.status },
        { status: 400 }
      );
    }

    // For each prediction, get place details to get coordinates
    const resultsWithDetails = await Promise.all(
      data.predictions.slice(0, 8).map(async (prediction: any) => {
        try {
          // Get place details to extract coordinates
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=geometry,formatted_address&key=${apiKey}`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          if (detailsData.result && detailsData.result.geometry) {
            return {
              place_id: prediction.place_id,
              name: prediction.main_text,
              formatted_address: prediction.description,
              geometry: {
                location: {
                  lat: detailsData.result.geometry.location.lat,
                  lng: detailsData.result.geometry.location.lng,
                },
              },
            };
          }
        } catch (error) {
          console.error('Error fetching place details:', error);
        }

        // Fallback: extract coordinates from prediction
        return {
          place_id: prediction.place_id,
          name: prediction.main_text,
          formatted_address: prediction.description,
          geometry: {
            location: {
              lat: 0,
              lng: 0,
            },
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      results: resultsWithDetails.filter(r => r),
    });
  } catch (error) {
    console.error('Places search error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
