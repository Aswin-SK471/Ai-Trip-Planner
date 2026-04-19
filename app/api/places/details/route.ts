import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('place_id');
    
    if (!placeId) {
      return NextResponse.json(
        { error: 'place_id parameter is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.error('Google Places API key is not configured');
      return NextResponse.json(
        { error: 'Google Places API is not configured' },
        { status: 500 }
      );
    }

    // Call Google Place Details API
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,geometry,address,formatted_address,place_id&key=${apiKey}`;
    
    console.log('Calling Google Place Details API:', detailsUrl.replace(apiKey, 'API_KEY_HIDDEN'));
    
    const response = await fetch(detailsUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Place Details API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Google Place Details API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Google Place Details API returned error status:', data.status, data.error_message);
      return NextResponse.json(
        { error: `Google Place Details API error: ${data.status}` },
        { status: 400 }
      );
    }

    const place = data.result;
    
    // Transform the place data to our format
    const placeDetails = {
      place_id: place.place_id,
      name: place.name || place.formatted_address,
      formatted_address: place.formatted_address,
      geometry: {
        location: {
          lat: place.geometry?.location?.lat,
          lng: place.geometry?.location?.lng
        }
      },
      address: place.formatted_address
    };

    return NextResponse.json({
      status: 'OK',
      place: placeDetails
    });

  } catch (error) {
    console.error('Place Details API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
