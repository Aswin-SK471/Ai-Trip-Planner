import { NextRequest, NextResponse } from 'next/server';
import { generateItinerary, ItineraryRequest } from '@/lib/aiPlanner';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      origin,
      destination,
      startDate,
      endDate,
      adults,
      children,
      infants,
      budget,
      interests
    } = body;

    // Validate required fields
    if (!destination || !startDate || !endDate || !budget) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const itineraryRequest: ItineraryRequest = {
      origin,
      destination,
      startDate,
      endDate,
      budget,
      passengers: {
        adults: adults || 1,
        children: children || 0,
        infants: infants || 0
      },
      interests: interests || []
    };

    // Generate multiple itinerary options
    const response = await generateItinerary(itineraryRequest);

    return NextResponse.json({
      success: true,
      ...response
    });

  } catch (error) {
    console.error('Itinerary API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

