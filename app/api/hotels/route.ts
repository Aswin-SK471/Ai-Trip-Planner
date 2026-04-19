import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { destination, budget } = await request.json();

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination is required' },
        { status: 400 }
      );
    }

    // Mock hotel data - in production, this would integrate with a real hotel API
    // For now, returning curated mock data
    const mockHotels = [
      {
        id: '1',
        name: `The Grand ${destination} Palace`,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop',
        pricePerNight: 250,
        rating: 4.8,
        reviewCount: 1230,
        location: 'City Center',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
        type: 'luxury',
        distance: 0.5
      },
      {
        id: '2',
        name: `Comfort Inn ${destination}`,
        image: 'https://images.unsplash.com/photo-1618097261904-4b0051e63b1d?w=500&h=400&fit=crop',
        pricePerNight: 120,
        rating: 4.3,
        reviewCount: 856,
        location: 'Downtown',
        amenities: ['WiFi', 'Gym', 'Restaurant', 'Parking'],
        type: 'mid-range',
        distance: 1.2
      },
      {
        id: '3',
        name: `Budget Star ${destination}`,
        image: 'https://images.unsplash.com/photo-1611748572055-a91d1a1a1c49?w=500&h=400&fit=crop',
        pricePerNight: 60,
        rating: 4.0,
        reviewCount: 542,
        location: 'Near Station',
        amenities: ['WiFi', 'Breakfast included', '24hr Reception'],
        type: 'budget',
        distance: 2.5
      },
      {
        id: '4',
        name: `Luxury Suites ${destination}`,
        image: 'https://images.unsplash.com/photo-1608541407954-0fb2b025ef11?w=500&h=400&fit=crop',
        pricePerNight: 320,
        rating: 4.9,
        reviewCount: 2100,
        location: 'Premium District',
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Concierge'],
        type: 'luxury',
        distance: 1.0
      },
      {
        id: '5',
        name: `Modern Stay ${destination}`,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&h=400&fit=crop',
        pricePerNight: 150,
        rating: 4.4,
        reviewCount: 723,
        location: 'Business District',
        amenities: ['WiFi', 'Gym', 'Restaurant'],
        type: 'mid-range',
        distance: 3.0
      },
      {
        id: '6',
        name: `Traveler's Rest ${destination}`,
        image: 'https://images.unsplash.com/photo-1618097261904-4b0051e63b1d?w=500&h=400&fit=crop',
        pricePerNight: 75,
        rating: 3.9,
        reviewCount: 421,
        location: 'Tourist Area',
        amenities: ['WiFi', 'Common Kitchen', 'Lounge'],
        type: 'budget',
        distance: 1.8
      }
    ];

    return NextResponse.json({
      success: true,
      hotels: mockHotels
    });

  } catch (error) {
    console.error('Hotels API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
