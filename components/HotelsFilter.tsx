'use client';

import { useState, useEffect } from 'react';
import SkeletonLoader from './SkeletonLoader';

export interface Hotel {
  id: string;
  name: string;
  image: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  location: string;
  amenities: string[];
  type: 'luxury' | 'mid-range' | 'budget';
  distance: number; // km from city center
}

interface HotelsFilterProps {
  destination: string;
  onSelectHotel: (hotel: Hotel) => void;
  selectedHotel?: Hotel;
  budget: number;
}

export default function HotelsFilter({
  destination,
  onSelectHotel,
  selectedHotel,
  budget
}: HotelsFilterProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'luxury' | 'mid-range' | 'budget'>('all');

  useEffect(() => {
    const fetchHotels = async () => {
      if (!destination) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/hotels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination, budget })
        });

        if (!response.ok) throw new Error('Failed to fetch hotels');
        const data = await response.json();
        setHotels(data.hotels || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hotels');
        // Use fallback mock data
        setHotels(generateMockHotels(destination));
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [destination, budget]);

  const filteredHotels = hotels.filter(h => 
    filterType === 'all' ? true : h.type === filterType
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <SkeletonLoader key={i} variant="hotel" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'luxury', 'mid-range', 'budget'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type as any)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
              filterType === type
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                : 'bg-white/10 text-slate-300 hover:bg-white/20'
            }`}
          >
            {type === 'all' ? 'All Hotels' : type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHotels.map(hotel => (
          <button
            key={hotel.id}
            onClick={() => onSelectHotel(hotel)}
            className={`group text-left transition-all duration-300 ${
              selectedHotel?.id === hotel.id
                ? 'ring-2 ring-blue-500 scale-105'
                : 'hover:scale-105'
            }`}
          >
            <div className="glass-card overflow-hidden border border-white/10 h-full hover:border-blue-500/50 transition-all">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="20" text-anchor="middle" dy=".3em" fill="%239CA3AF" font-family="sans-serif"%3EHotel Image%3C/text%3E%3C/svg%3E';
                  }}
                />
                {/* Type Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                    hotel.type === 'luxury' ? 'bg-yellow-500/80 text-yellow-900' :
                    hotel.type === 'mid-range' ? 'bg-blue-500/80 text-blue-900' :
                    'bg-green-500/80 text-green-900'
                  }`}>
                    {hotel.type === 'luxury' ? '✨ Luxury' : hotel.type === 'mid-range' ? '⭐ Mid-Range' : '💚 Budget'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white text-sm leading-tight flex-1">{hotel.name}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-white font-semibold text-xs">{hotel.rating}</span>
                  </div>
                </div>

                {/* Location */}
                <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                  <span>📍</span> {hotel.location} • {hotel.distance.toFixed(1)}km
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {hotel.amenities.slice(0, 3).map((amenity, i) => (
                    <span key={i} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                      {amenity}
                    </span>
                  ))}
                  {hotel.amenities.length > 3 && (
                    <span className="text-xs text-slate-500">+{hotel.amenities.length - 3} more</span>
                  )}
                </div>

                {/* Price & Rating */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <p className="text-xs text-slate-500">Price per night</p>
                    <p className="text-lg font-bold gradient-text">${hotel.pricePerNight}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{hotel.reviewCount} reviews</p>
                    <p className="text-sm font-semibold text-green-400">
                      {hotel.rating >= 4.5 ? '✓ Great' : hotel.rating >= 4 ? 'Good' : 'Fair'}
                    </p>
                  </div>
                </div>

                {/* Selected State */}
                {selectedHotel?.id === hotel.id && (
                  <div className="mt-3 p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg text-center">
                    <p className="text-xs text-blue-300 font-semibold">✓ Selected</p>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredHotels.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-slate-400">No hotels found in this category</p>
        </div>
      )}
    </div>
  );
}

// Mock hotel data generator
function generateMockHotels(destination: string): Hotel[] {
  const hotels: Hotel[] = [
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

  return hotels;
}
