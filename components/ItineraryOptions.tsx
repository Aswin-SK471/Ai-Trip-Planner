'use client';

import { ItineraryOption } from '@/lib/aiPlanner';
import SkeletonLoader from './SkeletonLoader';

interface ItineraryOptionsProps {
  options: ItineraryOption[];
  onSelectOption: (option: ItineraryOption) => void;
  selectedOption?: ItineraryOption;
  isLoading?: boolean;
}

const styleColors: Record<string, string> = {
  budget: 'from-green-600 to-emerald-600',
  'mid-range': 'from-blue-600 to-cyan-600',
  luxury: 'from-yellow-600 to-orange-600',
  adventure: 'from-orange-600 to-red-600',
  culture: 'from-purple-600 to-pink-600',
  relaxation: 'from-pink-600 to-rose-600'
};

const getStyleIcon = (style: string) => {
  switch (style) {
    case 'budget':
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case 'mid-range':
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
    case 'luxury':
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
    case 'adventure':
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    case 'culture':
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
    case 'relaxation':
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    default:
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  }
};

export default function ItineraryOptions({
  options,
  onSelectOption,
  selectedOption,
  isLoading
}: ItineraryOptionsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-6">Generating Itinerary Options...</h3>
        {[1, 2, 3].map(i => (
          <SkeletonLoader key={i} variant="itinerary" />
        ))}
      </div>
    );
  }

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Choose Your Itinerary</h3>
        <p className="text-slate-400">We've created {options.length} personalized options for your trip</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelectOption(option)}
            className={`group text-left transition-all duration-300 ${
              selectedOption?.id === option.id
                ? 'ring-2 ring-blue-500 scale-105'
                : 'hover:scale-105'
            }`}
          >
            <div
              className={`glass-card border border-white/10 overflow-hidden h-full hover:border-white/30 transition-all bg-gradient-to-br ${styleColors[option.style] || 'from-blue-600 to-purple-600'}/5`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${styleColors[option.style] || 'from-blue-600 to-purple-600'} p-4 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        {getStyleIcon(option.style)}
                      </div>
                      <h4 className="text-lg font-bold">{option.name}</h4>
                    </div>
                    <p className="text-sm opacity-90 leading-relaxed">{option.description}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Key metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Per Day</p>
                    <p className="text-lg font-bold gradient-text">${option.estimatedCostPerDay}</p>
                  </div>
                  <div className="text-center border-l border-r border-white/10">
                    <p className="text-xs text-slate-500 mb-1">Total Budget</p>
                    <p className="text-lg font-bold text-white">${option.totalBudget.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Trip Score</p>
                    <p className="text-lg font-bold text-green-400">{option.tripScore.overall.toFixed(1)}/10</p>
                  </div>
                </div>

                {/* Budget Breakdown */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Budget Breakdown</p>
                  <div className="space-y-1">
                    {[
                      { label: 'Flights', value: option.budgetAllocation.flights, color: 'bg-blue-500' },
                      { label: 'Hotels', value: option.budgetAllocation.hotels, color: 'bg-purple-500' },
                      { label: 'Activities', value: option.budgetAllocation.activities, color: 'bg-pink-500' },
                      { label: 'Food', value: option.budgetAllocation.food, color: 'bg-orange-500' }
                    ].map(item => {
                      const percentage = (item.value / option.totalBudget) * 100;
                      return (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-400">{item.label}</span>
                            <span className="text-xs font-semibold text-white">${item.value.toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color} transition-all duration-300`}
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details */}
                <div className="pt-3 border-t border-white/10 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Activities per day:</span>
                    <span className="font-semibold text-white">
                      {Math.round(option.days.reduce((sum, d) => sum + d.activities.length, 0) / option.days.length)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Activity Quality:</span>
                    <span className="font-semibold text-white">
                      {option.tripScore.activityDensity > 7 ? 'Excellent' : option.tripScore.activityDensity > 5 ? 'Good' : 'Moderate'}
                    </span>
                  </div>
                </div>

                {/* Selected Badge */}
                {selectedOption?.id === option.id && (
                  <div className="mt-4 py-2 px-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <p className="text-xs text-blue-300 font-semibold">✓ Selected</p>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
