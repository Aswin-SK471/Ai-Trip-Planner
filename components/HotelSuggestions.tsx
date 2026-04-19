'use client';

interface Hotel {
  id: string;
  name: string;
  pricePerNight: number;
  rating: number;
  area: string;
  image: string;
  amenities: string[];
  description: string;
}

interface HotelSuggestionsProps {
  destination: string;
  budget: number;
  nights: number;
  onHotelSelect?: (hotel: Hotel) => void;
  selectedHotel?: Hotel | null;
}

const mockHotels: { [key: string]: Hotel[] } = {
  'paris': [
    {
      id: '1',
      name: 'Le Marais Boutique Hotel',
      pricePerNight: 180,
      rating: 4.5,
      area: 'Le Marais',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Breakfast', 'Gym', 'Spa'],
      description: 'Charming boutique hotel in historic Le Marais district'
    },
    {
      id: '2',
      name: 'Eiffel Tower View Hotel',
      pricePerNight: 220,
      rating: 4.7,
      area: 'Champ de Mars',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Restaurant', 'Bar', 'Concierge'],
      description: 'Modern hotel with stunning Eiffel Tower views'
    },
    {
      id: '3',
      name: 'Montmartre Garden Inn',
      pricePerNight: 150,
      rating: 4.3,
      area: 'Montmartre',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Garden', 'Breakfast'],
      description: 'Cozy inn near Sacré-Coeur with beautiful gardens'
    },
    {
      id: '4',
      name: 'Luxury Champs-Élysées',
      pricePerNight: 350,
      rating: 4.9,
      area: 'Champs-Élysées',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Concierge'],
      description: '5-star luxury hotel on the famous Champs-Élysées'
    },
    {
      id: '5',
      name: 'Latin Quarter Residence',
      pricePerNight: 120,
      rating: 4.2,
      area: 'Latin Quarter',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Kitchen', 'Laundry'],
      description: 'Budget-friendly residence in the heart of the Latin Quarter'
    }
  ],
  'london': [
    {
      id: '6',
      name: 'Covent Garden Boutique',
      pricePerNight: 200,
      rating: 4.6,
      area: 'Covent Garden',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym'],
      description: 'Stylish boutique hotel in vibrant Covent Garden'
    },
    {
      id: '7',
      name: 'Tower Bridge View',
      pricePerNight: 180,
      rating: 4.4,
      area: 'Tower Bridge',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Breakfast', 'Bar'],
      description: 'Modern hotel with iconic Tower Bridge views'
    },
    {
      id: '8',
      name: 'Notting Hill Charm',
      pricePerNight: 160,
      rating: 4.5,
      area: 'Notting Hill',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Garden', 'Breakfast'],
      description: 'Quaint hotel in charming Notting Hill neighborhood'
    },
    {
      id: '9',
      name: 'Mayfair Luxury',
      pricePerNight: 400,
      rating: 4.9,
      area: 'Mayfair',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Spa', 'Restaurant', 'Bar', 'Gym', 'Concierge'],
      description: 'Ultra-luxury hotel in prestigious Mayfair district'
    },
    {
      id: '10',
      name: 'Cambridge Residence',
      pricePerNight: 110,
      rating: 4.1,
      area: 'Cambridge',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Kitchen', 'Laundry'],
      description: 'Affordable residence near Cambridge University'
    }
  ],
  'new york': [
    {
      id: '11',
      name: 'Times Square Central',
      pricePerNight: 250,
      rating: 4.3,
      area: 'Times Square',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym'],
      description: 'Modern hotel in the heart of Times Square'
    },
    {
      id: '12',
      name: 'Central Park View',
      pricePerNight: 300,
      rating: 4.7,
      area: 'Upper West Side',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Spa', 'Restaurant', 'Bar', 'Concierge'],
      description: 'Luxury hotel with stunning Central Park views'
    },
    {
      id: '13',
      name: 'Brooklyn Bridge Inn',
      pricePerNight: 180,
      rating: 4.4,
      area: 'Brooklyn Heights',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Breakfast', 'Bar'],
      description: 'Charming inn near Brooklyn Bridge with Manhattan views'
    },
    {
      id: '14',
      name: 'SoHo Boutique',
      pricePerNight: 280,
      rating: 4.6,
      area: 'SoHo',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Restaurant', 'Bar', 'Gym'],
      description: 'Trendy boutique hotel in fashionable SoHo district'
    },
    {
      id: '15',
      name: 'East Village Budget',
      pricePerNight: 120,
      rating: 4.0,
      area: 'East Village',
      image: '/api/placeholder/400/300',
      amenities: ['WiFi', 'Kitchen'],
      description: 'Budget-friendly hotel in vibrant East Village'
    }
  ]
};

const genericHotels: Hotel[] = [
  {
    id: 'generic1',
    name: 'City Center Hotel',
    pricePerNight: 150,
    rating: 4.3,
    area: 'City Center',
    image: '/api/placeholder/400/300',
    amenities: ['WiFi', 'Breakfast', 'Gym'],
    description: 'Comfortable hotel in the heart of the city'
  },
  {
    id: 'generic2',
    name: 'Airport Hotel',
    pricePerNight: 100,
    rating: 4.1,
    area: 'Airport Area',
    image: '/api/placeholder/400/300',
    amenities: ['WiFi', 'Shuttle', 'Restaurant'],
    description: 'Convenient hotel near airport with shuttle service'
  },
  {
    id: 'generic3',
    name: 'Beach Resort',
    pricePerNight: 200,
    rating: 4.5,
    area: 'Beach Front',
    image: '/api/placeholder/400/300',
    amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
    description: 'Beautiful beachfront resort with full amenities'
  }
];

function getHotelsForDestination(destination: string, budget: number, nights: number): Hotel[] {
  const normalizedDest = destination.toLowerCase();
  let availableHotels = mockHotels[normalizedDest] || genericHotels;
  
  // Filter hotels within budget (allow some flexibility)
  const maxPricePerNight = (budget * 0.3) / nights; // Assume 30% of budget for hotels
  availableHotels = availableHotels.filter(hotel => hotel.pricePerNight <= maxPricePerNight * 1.5);
  
  // Sort by rating and price
  return availableHotels.sort((a, b) => {
    const scoreA = a.rating - (a.pricePerNight / 100);
    const scoreB = b.rating - (b.pricePerNight / 100);
    return scoreB - scoreA;
  }).slice(0, 5);
}

function renderStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
      </svg>
    );
  }
  
  if (hasHalfStar) {
    stars.push(
      <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" opacity="0.5"/>
      </svg>
    );
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
      </svg>
    );
  }
  
  return stars;
}

export default function HotelSuggestions({ 
  destination, 
  budget, 
  nights, 
  onHotelSelect, 
  selectedHotel 
}: HotelSuggestionsProps) {
  const hotels = getHotelsForDestination(destination, budget, nights);

  if (hotels.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Hotel Suggestions
          </h3>
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <p className="text-gray-500 text-sm">No hotels found within your budget</p>
            <p className="text-gray-400 text-xs mt-1">Try adjusting your budget or search parameters</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          Hotel Suggestions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((hotel) => {
            const isSelected = selectedHotel?.id === hotel.id;
            const totalPrice = hotel.pricePerNight * nights;
            
            return (
              <div
                key={hotel.id}
                className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                  isSelected 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                {/* Hotel Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://picsum.photos/seed/${hotel.id}/400/300.jpg`;
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow">
                    {hotel.area}
                  </div>
                </div>
                
                {/* Hotel Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                      {hotel.name}
                    </h4>
                    <div className="flex items-center ml-2">
                      {renderStars(hotel.rating)}
                      <span className="text-xs text-gray-600 ml-1">{hotel.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {hotel.description}
                  </p>
                  
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{hotel.amenities.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        ${hotel.pricePerNight}
                        <span className="text-xs text-gray-500 font-normal">/night</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        ${totalPrice} total ({nights} nights)
                      </p>
                    </div>
                  </div>
                  
                  {/* Select Button */}
                  <button
                    type="button"
                    onClick={() => onHotelSelect?.(hotel)}
                    className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Select Hotel'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
