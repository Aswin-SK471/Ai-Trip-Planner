'use client';

interface DestinationInsightsProps {
  destination: string;
}

interface CityInsights {
  bestTime: string;
  activities: string[];
  avgBudget: number;
  weather: string;
  currency: string;
  language: string;
}

const cityInsights: { [key: string]: CityInsights } = {
  'london': {
    bestTime: 'May - September',
    activities: ['Museums', 'Historic Tours', 'Shopping', 'Theater', 'Pubs'],
    avgBudget: 1200,
    weather: 'Mild with occasional rain',
    currency: 'GBP (£)',
    language: 'English'
  },
  'paris': {
    bestTime: 'April - June, September - October',
    activities: ['Fine Dining', 'Museums', 'Walking Tours', 'Shopping', 'Cafes'],
    avgBudget: 1400,
    weather: 'Pleasant continental climate',
    currency: 'EUR ()',
    language: 'French'
  },
  'new york': {
    bestTime: 'April - June, September - November',
    activities: ['Broadway Shows', 'Museums', 'Shopping', 'Central Park', 'Food Tours'],
    avgBudget: 1600,
    weather: 'Four distinct seasons',
    currency: 'USD ($)',
    language: 'English'
  },
  'tokyo': {
    bestTime: 'March - May, October - November',
    activities: ['Temples', 'Shopping', 'Food Markets', 'Gardens', 'Technology'],
    avgBudget: 1500,
    weather: 'Four seasons with humid summers',
    currency: 'JPY (¥)',
    language: 'Japanese'
  },
  'rome': {
    bestTime: 'April - June, September - October',
    activities: ['Historic Sites', 'Art Museums', 'Food Tours', 'Shopping', 'Fountains'],
    avgBudget: 1300,
    weather: 'Mediterranean climate',
    currency: 'EUR ()',
    language: 'Italian'
  },
  'barcelona': {
    bestTime: 'May - June, September - October',
    activities: ['Beaches', 'Architecture', 'Tapas Tours', 'Shopping', 'Nightlife'],
    avgBudget: 1100,
    weather: 'Mediterranean with mild winters',
    currency: 'EUR ()',
    language: 'Spanish, Catalan'
  },
  'amsterdam': {
    bestTime: 'April - September',
    activities: ['Canal Tours', 'Museums', 'Biking', 'Anne Frank House', 'Flower Markets'],
    avgBudget: 1300,
    weather: 'Mild maritime climate',
    currency: 'EUR ()',
    language: 'Dutch, English'
  },
  'dubai': {
    bestTime: 'November - March',
    activities: ['Shopping Malls', 'Desert Safari', 'Burj Khalifa', 'Beaches', 'Gold Souk'],
    avgBudget: 1800,
    weather: 'Hot desert climate',
    currency: 'AED (AED)',
    language: 'Arabic, English'
  },
  'singapore': {
    bestTime: 'February - April',
    activities: ['Gardens by the Bay', 'Shopping', 'Food Courts', 'Sentosa', 'Night Safari'],
    avgBudget: 1400,
    weather: 'Tropical rainforest climate',
    currency: 'SGD ($)',
    language: 'English, Mandarin, Malay, Tamil'
  },
  'sydney': {
    bestTime: 'September - November, March - May',
    activities: ['Opera House', 'Beaches', 'Harbor Bridge', 'Wildlife', 'Surfing'],
    avgBudget: 1500,
    weather: 'Temperate climate',
    currency: 'AUD ($)',
    language: 'English'
  }
};

const genericInsights: CityInsights = {
  bestTime: 'Spring and Fall',
  activities: ['Sightseeing', 'Local Cuisine', 'Cultural Sites', 'Shopping', 'Nature'],
  avgBudget: 1200,
  weather: 'Varies by season',
  currency: 'Local Currency',
  language: 'Local Language'
};

function getCityInsights(destination: string): CityInsights {
  const normalizedDest = destination.toLowerCase();
  
  // Check for exact matches
  if (cityInsights[normalizedDest]) {
    return cityInsights[normalizedDest];
  }
  
  // Check for partial matches
  for (const city in cityInsights) {
    if (normalizedDest.includes(city) || city.includes(normalizedDest)) {
      return cityInsights[city];
    }
  }
  
  return genericInsights;
}

export default function DestinationInsights({ destination }: DestinationInsightsProps) {
  if (!destination) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌍</span>
          <h3 className="text-lg font-semibold text-white">Destination Insights</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-slate-400 text-sm">Select a destination to see insights</p>
        </div>
      </div>
    );
  }

  const insights = getCityInsights(destination);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🌍</span>
        <h3 className="text-lg font-semibold text-white">Destination Insights</h3>
      </div>
      
      <div className="space-y-4">
        {/* Best Time to Visit */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-blue-400/30 transition-colors">
          <div className="flex items-start gap-3">
            <span className="text-xl">📅</span>
            <div>
              <p className="text-sm font-medium text-slate-300">Best Time to Visit</p>
              <p className="text-sm text-slate-400 mt-1">{insights.bestTime}</p>
            </div>
          </div>
        </div>

        {/* Popular Activities */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-purple-400/30 transition-colors">
          <div className="flex items-start gap-3">
            <span className="text-xl">🎯</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-300 mb-2">Popular Activities</p>
              <div className="flex flex-wrap gap-2">
                {insights.activities.map((activity, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/30 hover:border-purple-400 transition-colors"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Average Budget */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-green-400/30 transition-colors">
          <div className="flex items-start gap-3">
            <span className="text-xl">💰</span>
            <div>
              <p className="text-sm font-medium text-slate-300">Average Daily Budget</p>
              <p className="text-sm text-slate-400 mt-1">${insights.avgBudget} per person</p>
            </div>
          </div>
        </div>

        {/* Weather */}
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-orange-400/30 transition-colors">
          <div className="flex items-start gap-3">
            <span className="text-xl">🌤️</span>
            <div>
              <p className="text-sm font-medium text-slate-300">Weather</p>
              <p className="text-sm text-slate-400 mt-1">{insights.weather}</p>
            </div>
          </div>
        </div>

        {/* Currency & Language */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-colors">
            <div className="flex items-start gap-3">
              <span className="text-xl">💵</span>
              <div>
                <p className="text-xs font-medium text-slate-300 uppercase">Currency</p>
                <p className="text-sm text-slate-400 mt-1">{insights.currency}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-pink-400/30 transition-colors">
            <div className="flex items-start gap-3">
              <span className="text-xl">🗣️</span>
              <div>
                <p className="text-xs font-medium text-slate-300 uppercase">Language</p>
                <p className="text-sm text-slate-400 mt-1">{insights.language}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
