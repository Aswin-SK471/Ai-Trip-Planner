'use client';

import { Hotel } from './HotelsFilter';
import { ItineraryOption } from '@/lib/aiPlanner';

interface TripSummaryCardProps {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  budget: string;
  selectedHotel?: Hotel | null;
  selectedItinerary?: ItineraryOption | null;
}

export default function TripSummaryCard({
  origin,
  destination,
  startDate,
  endDate,
  adults,
  children,
  infants,
  budget,
  selectedHotel,
  selectedItinerary
}: TripSummaryCardProps) {
  const getTotalPassengers = () => adults + children + infants;
  const getPassengerLabel = () => {
    const total = getTotalPassengers();
    if (total === 1) return '1 Passenger';
    return `${total} Passengers`;
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) return 'Select dates';
    if (startDate && !endDate) {
      const start = new Date(startDate);
      return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${days} days)`;
    }
    return 'Select dates';
  };

  const getBudgetDisplay = () => {
    const budgetNum = parseInt(budget) || 0;
    return budgetNum > 0 ? `$${budgetNum.toLocaleString()}` : 'Not set';
  };

  const isComplete = () => {
    return origin && destination && startDate && endDate && budget;
  };

  return (
    <div className="glass-card p-6 border border-white/10">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <h3 className="text-lg font-bold text-white">Trip Summary</h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">Your trip overview at a glance</p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Route */}
        <div className="space-y-2 p-3 rounded-lg bg-white/5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Route</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-blue-300 truncate">{origin || 'Origin'}</div>
            </div>
            <div className="flex items-center text-slate-500 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-purple-300 truncate text-right">{destination || 'Destination'}</div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 p-3 rounded-lg bg-white/5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Dates</div>
          <div className="flex items-center gap-2 text-slate-200">
            <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className={`text-sm font-medium ${!startDate ? 'text-slate-500' : 'text-white'}`}>
              {formatDateRange()}
            </span>
          </div>
        </div>

        {/* Passengers */}
        <div className="space-y-2 p-3 rounded-lg bg-white/5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Passengers</div>
          <div className="flex items-center gap-2 text-slate-200">
            <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="text-sm font-medium">{getPassengerLabel()}</span>
            {getTotalPassengers() > 1 && (
              <span className="ml-1 text-xs text-slate-500">
                ({adults}A{children > 0 && `, ${children}C`}{infants > 0 && `, ${infants}I`})
              </span>
            )}
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2 p-3 rounded-lg bg-white/5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Budget</div>
          <div className="flex items-center gap-2 text-slate-200">
            <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className={`text-sm font-medium ${!budget ? 'text-slate-500' : 'text-green-300'}`}>
              {getBudgetDisplay()} <span className="text-xs text-slate-500">/person</span>
            </span>
          </div>
        </div>

        {/* Hotel (if selected) */}
        {selectedHotel && (
          <div className="space-y-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Hotel</div>
            <div className="text-sm font-medium text-white">{selectedHotel.name}</div>
            <div className="text-xs text-slate-400">${selectedHotel.pricePerNight}/night • ★{selectedHotel.rating}</div>
          </div>
        )}

        {/* Itinerary (if selected) */}
        {selectedItinerary && (
          <div className="space-y-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Itinerary</div>
            <div className="text-sm font-medium text-white">{selectedItinerary.name}</div>
            <div className="text-xs text-slate-400">Score: {selectedItinerary.tripScore.overall.toFixed(1)}/10 • {selectedItinerary.numberOfDays} days</div>
          </div>
        )}

        {/* Status */}
        <div className="pt-3 border-t border-white/10">
          <div className={`flex items-center gap-2 text-sm font-medium ${isComplete() ? 'text-green-400' : 'text-amber-400'}`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isComplete() ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
              )}
            </svg>
            {selectedItinerary ? 'Trip planned!' : selectedHotel ? 'Generate itinerary' : 'Choose hotel & itinerary'}
          </div>
        </div>
      </div>
    </div>
  );
}
