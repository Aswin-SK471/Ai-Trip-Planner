'use client';

interface AISuggestionsProps {
  onSuggestionApply: (updates: {
    budget?: string;
    adults?: number;
    children?: number;
    infants?: number;
    startDate?: string;
    endDate?: string;
  }) => void;
  currentBudget: string;
  currentAdults: number;
  currentChildren: number;
  currentInfants: number;
}

interface Suggestion {
  id: string;
  label: string;
  emoji: string;
  description: string;
  budget: number;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  tripDays: number;
  color: string;
}

const suggestions: Suggestion[] = [
  {
    id: 'weekend',
    label: 'Weekend Getaway',
    emoji: '🌅',
    description: 'Perfect for a quick 2-3 day trip',
    budget: 800,
    passengers: { adults: 2, children: 0, infants: 0 },
    tripDays: 3,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'luxury',
    label: 'Luxury Trip',
    emoji: '👑',
    description: 'Premium experience with comfort',
    budget: 3000,
    passengers: { adults: 2, children: 0, infants: 0 },
    tripDays: 7,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'budget',
    label: 'Budget Trip',
    emoji: '💚',
    description: 'Affordable travel without compromising',
    budget: 600,
    passengers: { adults: 2, children: 0, infants: 0 },
    tripDays: 5,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'adventure',
    label: 'Adventure',
    emoji: '⛰️',
    description: 'Exciting activities and experiences',
    budget: 1500,
    passengers: { adults: 2, children: 0, infants: 0 },
    tripDays: 6,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'family',
    label: 'Family Friendly',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Perfect for families with kids',
    budget: 2000,
    passengers: { adults: 2, children: 2, infants: 0 },
    tripDays: 7,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'solo',
    label: 'Solo Travel',
    emoji: '🧘',
    description: 'Independent exploration',
    budget: 1000,
    passengers: { adults: 1, children: 0, infants: 0 },
    tripDays: 5,
    color: 'from-indigo-500 to-blue-500'
  }
];

export default function AISuggestions({
  onSuggestionApply,
  currentBudget,
  currentAdults,
  currentChildren,
  currentInfants
}: AISuggestionsProps) {
  const handleSuggestionClick = (suggestion: Suggestion) => {
    // Calculate dates based on trip duration using local date format
    const today = new Date();
    
    // Format start date as YYYY-MM-DD (local)
    const startYear = today.getFullYear();
    const startMonth = String(today.getMonth() + 1).padStart(2, '0');
    const startDay = String(today.getDate()).padStart(2, '0');
    const startDate = `${startYear}-${startMonth}-${startDay}`;
    
    // Calculate end date
    const endDate = new Date(today.getTime() + suggestion.tripDays * 24 * 60 * 60 * 1000);
    const endYear = endDate.getFullYear();
    const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
    const endDay = String(endDate.getDate()).padStart(2, '0');
    const formattedEndDate = `${endYear}-${endMonth}-${endDay}`;

    onSuggestionApply({
      budget: suggestion.budget.toString(),
      adults: suggestion.passengers.adults,
      children: suggestion.passengers.children,
      infants: suggestion.passengers.infants,
      startDate,
      endDate: formattedEndDate
    });
  };

  return (
    <div className="glass-card p-6 border border-white/10">
      <div className="mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✨</span>
          <h3 className="text-lg font-bold text-white">AI Suggestions</h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">Quick presets to jumpstart your trip</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {suggestions.map((suggestion) => {
          const isCurrentMatch = 
            parseInt(currentBudget) === suggestion.budget &&
            currentAdults === suggestion.passengers.adults &&
            currentChildren === suggestion.passengers.children &&
            currentInfants === suggestion.passengers.infants;

          return (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`group relative p-4 rounded-lg border transition-all duration-300 overflow-hidden text-left ${
                isCurrentMatch 
                  ? `border-white/30 bg-gradient-to-br ${suggestion.color} shadow-lg shadow-blue-500/20` 
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {/* Background gradient overlay for non-selected */}
              {!isCurrentMatch && (
                <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              )}
              
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{suggestion.emoji}</span>
                  <span className={`font-bold text-sm ${isCurrentMatch ? 'text-white' : 'text-white'}`}>
                    {suggestion.label}
                  </span>
                </div>
                
                <p className={`text-xs leading-tight ${isCurrentMatch ? 'text-white/90' : 'text-slate-400'}`}>
                  {suggestion.description}
                </p>
                
                <div className="flex justify-between items-center pt-1">
                  <span className={`text-sm font-bold ${isCurrentMatch ? 'text-white' : 'text-green-300'}`}>
                    ${suggestion.budget}
                  </span>
                  <span className={`text-xs ${isCurrentMatch ? 'text-white/70' : 'text-slate-500'}`}>
                    {suggestion.tripDays}d
                  </span>
                </div>

                {suggestion.passengers.children > 0 && (
                  <div className={`text-xs pt-1 ${isCurrentMatch ? 'text-white/70' : 'text-slate-500'}`}>
                    👨‍👩‍👧‍👦 Family friendly
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-slate-500 text-center">
          💡 Click a suggestion to auto-fill your trip details
        </p>
      </div>
    </div>
  );
}
