import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Import the same storage from main trips route
interface Trip {
  id: string;
  user_id?: string;
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  flight_json: any;
  hotel_json: any;
  itinerary_json: any;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  created_at: string;
}

// This would be shared with the main trips route in a real app
let trips: Trip[] = [];

// Helper function to get user from token
async function getUserFromToken(token: string | undefined) {
  if (!token) return null;
  
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Trip ID is required' 
      }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required',
        isGuest: true 
      }, { status: 401 });
    }

    // Find the trip
    const trip = trips.find(t => t.id === id && t.user_id === user.id);

    if (!trip) {
      return NextResponse.json({ 
        success: false, 
        error: 'Trip not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      trip: {
        id: trip.id,
        origin: trip.origin,
        destination: trip.destination,
        start_date: trip.start_date,
        end_date: trip.end_date,
        budget: trip.budget,
        flight_json: trip.flight_json,
        hotel_json: trip.hotel_json,
        itinerary_json: trip.itinerary_json,
        passengers: trip.passengers,
        created_at: trip.created_at
      }
    });

  } catch (error) {
    console.error('GET trip by ID error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch trip' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Trip ID is required' 
      }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required',
        isGuest: true 
      }, { status: 401 });
    }

    // Find and update the trip
    const tripIndex = trips.findIndex(t => t.id === id && t.user_id === user.id);

    if (tripIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Trip not found' 
      }, { status: 404 });
    }

    // Update trip with provided fields
    const updatedTrip = {
      ...trips[tripIndex],
      ...body,
      id: trips[tripIndex].id, // Preserve ID
      user_id: trips[tripIndex].user_id, // Preserve user ID
      created_at: trips[tripIndex].created_at // Preserve creation date
    };

    trips[tripIndex] = updatedTrip;

    return NextResponse.json({
      success: true,
      trip: {
        id: updatedTrip.id,
        origin: updatedTrip.origin,
        destination: updatedTrip.destination,
        start_date: updatedTrip.start_date,
        end_date: updatedTrip.end_date,
        budget: updatedTrip.budget,
        flight_json: updatedTrip.flight_json,
        hotel_json: updatedTrip.hotel_json,
        itinerary_json: updatedTrip.itinerary_json,
        passengers: updatedTrip.passengers,
        created_at: updatedTrip.created_at
      }
    });

  } catch (error) {
    console.error('PUT trip error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update trip' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Trip ID is required' 
      }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required',
        isGuest: true 
      }, { status: 401 });
    }

    // Find and delete the trip
    const tripIndex = trips.findIndex(t => t.id === id && t.user_id === user.id);

    if (tripIndex === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Trip not found' 
      }, { status: 404 });
    }

    trips.splice(tripIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    console.error('DELETE trip error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete trip' 
    }, { status: 500 });
  }
}
