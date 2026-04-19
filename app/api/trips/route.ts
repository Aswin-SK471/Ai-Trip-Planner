import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      // Guest mode - return empty array
      return NextResponse.json({ 
        success: true, 
        trips: [],
        isGuest: true 
      });
    }

    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json({ 
        success: true, 
        trips: [],
        isGuest: true 
      });
    }

    // Query database for trips
    const [rows] = await db.execute(
      'SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC',
      [user.id]
    );

    const trips = (rows as any[]).map(row => ({
      id: row.id.toString(),
      user_id: row.user_id.toString(),
      origin: row.origin,
      destination: row.destination,
      startDate: row.start_date,
      endDate: row.end_date,
      budget: parseFloat(row.budget),
      selectedFlight: typeof row.flight_json === 'string' ? JSON.parse(row.flight_json) : row.flight_json,
      selectedHotel: typeof row.hotel_json === 'string' ? JSON.parse(row.hotel_json) : row.hotel_json,
      itinerary: typeof row.itinerary_json === 'string' ? JSON.parse(row.itinerary_json) : row.itinerary_json,
      passengers: typeof row.passengers === 'string' ? JSON.parse(row.passengers) : row.passengers,
      createdAt: row.created_at
    }));

    return NextResponse.json({ 
      success: true, 
      trips,
      isGuest: false 
    });

  } catch (error) {
    console.error('GET trips error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch trips' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      origin,
      destination,
      start_date,
      end_date,
      budget,
      flight_json,
      hotel_json,
      itinerary_json,
      passengers
    } = body;

    // Validate required fields
    if (!destination || !start_date || !end_date || !budget) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: destination, dates, and budget are required' 
      }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required to save trips',
        isGuest: true 
      }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired token',
        isGuest: true 
      }, { status: 401 });
    }

    const flightJsonStr = flight_json ? JSON.stringify(flight_json) : null;
    const hotelJsonStr = hotel_json ? JSON.stringify(hotel_json) : null;
    const itineraryJsonStr = itinerary_json ? JSON.stringify(itinerary_json) : null;
    const passengersStr = passengers ? JSON.stringify(passengers) : JSON.stringify({ adults: 1, children: 0, infants: 0 });

    const [result] = await db.execute(
      `INSERT INTO trips (
        user_id, origin, destination, start_date, end_date, budget, 
        flight_json, hotel_json, itinerary_json, passengers
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id, origin || '', destination, start_date, end_date, budget,
        flightJsonStr, hotelJsonStr, itineraryJsonStr, passengersStr
      ]
    );

    const insertId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      trip: {
        id: insertId.toString(),
        user_id: user.id,
        origin,
        destination,
        start_date,
        end_date,
        budget,
      }
    });

  } catch (error) {
    console.error('POST trips error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save trip' 
    }, { status: 500 });
  }
}
