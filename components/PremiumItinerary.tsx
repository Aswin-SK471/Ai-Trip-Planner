'use client';

import { useState } from 'react';
import { ItineraryOption, Activity } from '@/lib/aiPlanner';

interface PremiumItineraryProps {
  itinerary: ItineraryOption;
  onEditActivity?: (dayNumber: number, activityIndex: number, updates: Partial<Activity>) => void;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'food':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    case 'culture':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
    case 'nature':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
    case 'shopping':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
    case 'adventure':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    case 'nightlife':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case 'relaxation':
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    default:
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
  }
};

export default function PremiumItinerary({
  itinerary,
  onEditActivity
}: PremiumItineraryProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Day 1 expanded by default
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());

  const toggleDayExpansion = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const toggleActivitySelection = (activityId: string) => {
    const newSelected = new Set(selectedActivities);
    if (newSelected.has(activityId)) {
      newSelected.delete(activityId);
    } else {
      newSelected.add(activityId);
    }
    setSelectedActivities(newSelected);
  };

  const calculateDateForDay = (dayNumber: number) => {
    const startDate = new Date(itinerary.startDate);
    const date = new Date(startDate.getTime() + (dayNumber - 1) * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {itinerary.name} - {itinerary.numberOfDays} Days
        </h2>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="badge border-blue-500/50 text-blue-300">
            Score: {itinerary.tripScore.overall.toFixed(1)}/10
          </span>
          <span className="badge border-purple-500/50 text-purple-300">
            ${itinerary.estimatedCostPerDay}/day avg
          </span>
          <span className="badge border-green-500/50 text-green-300">
            Total: ${itinerary.totalBudget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6">
        {/* Continuous gradient timeline line */}
        <div className="absolute left-6 top-8 bottom-8 w-1 rounded-full bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 opacity-60" />

        {/* Days */}
        <div className="space-y-6">
          {itinerary.days.map((day, index) => {
            const activityId = `day-${day.day}`;
            const isExpanded = expandedDay === day.day;

            return (
              <div key={day.day} className="relative z-10 w-full">
                {/* Timeline Dot with click handler */}
                <button
                  onClick={() => toggleDayExpansion(day.day)}
                  className="absolute -left-6 top-6 w-12 h-12 rounded-full border-[3px] border-[#0a0e1a] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20"
                >
                  <span className="text-white font-bold">{day.day}</span>
                </button>

                {/* Day Card */}
                <div className="ml-[3rem] glass-card border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20">
                  {/* Day Header */}
                  <button
                    onClick={() => toggleDayExpansion(day.day)}
                    className="w-full text-left p-6 hover:bg-white/5 transition-colors focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{day.title}</h3>
                        <p className="text-sm text-slate-400">{calculateDateForDay(day.day)}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-slate-500 mb-1 tracking-wider uppercase">Budget</p>
                          <p className="text-xl font-bold gradient-text">${Math.round(day.budget || 0)}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-white/10' : 'bg-transparent'}`}>
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Activities - Expandable */}
                  <div 
                    className={`transition-all duration-500 ease-in-out origin-top border-t border-white/10 ${isExpanded ? 'max-h-[2000px] opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0 overflow-hidden border-t-0'}`}
                  >
                    <div className="p-4 sm:p-6 space-y-4 bg-white/[0.02]">
                      {day.activities.map((activity, actIndex) => {
                        const actId = `${activityId}-${actIndex}`;
                        const isSelected = selectedActivities.has(actId);

                        return (
                          <div
                            key={actIndex}
                            className={`activity-card ${isSelected ? 'border-blue-500/50 bg-blue-500/10' : ''}`}
                            style={{ animationDelay: `${actIndex * 100}ms` }}
                          >
                            <div className="timeline-line"></div>
                            <div className="timeline-dot"></div>

                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                              {/* Icon */}
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 text-white">
                                  {getActivityIcon(activity.type || 'culture')}
                                </div>
                              </div>

                              {/* Activity Content */}
                              <div className="flex-1 min-w-0 pt-1">
                                <h4 className="text-lg text-white font-semibold mb-1 leading-tight">
                                  {activity.activity}
                                </h4>
                                
                                {activity.description && (
                                  <p className="text-sm text-slate-400 mb-3 leading-relaxed">
                                    {activity.description}
                                  </p>
                                )}
                                
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <span className="badge text-blue-300 border-blue-400/20 bg-blue-400/10">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {activity.time} {activity.duration ? `(${activity.duration}h)` : ''}
                                  </span>
                                  
                                  {activity.cost !== undefined && (
                                    <span className="badge text-emerald-300 border-emerald-400/20 bg-emerald-400/10">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      ${activity.cost}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Select Button */}
                              <button
                                onClick={() => toggleActivitySelection(actId)}
                                className={`flex-shrink-0 mt-3 sm:mt-0 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm ${
                                  isSelected
                                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-700'
                                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                                }`}
                              >
                                {isSelected ? 'Liked ✓' : 'Like ♡'}
                              </button>
                            </div>
                          </div>
                        );
                       })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 glass-card border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none -mr-32 -mt-32"></div>
        {[
          {
            label: 'Total Activities',
            value: itinerary.days.reduce((sum, d) => sum + d.activities.length, 0),
            icon: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3-10l-3 3m0 0l-3-3m3 3V10" /></svg>
          },
          {
            label: 'Days',
            value: itinerary.numberOfDays,
            icon: <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          },
          {
            label: 'Total Cost',
            value: `$${itinerary.totalBudget.toLocaleString()}`,
            icon: <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          },
          {
            label: 'Rating',
            value: `${itinerary.tripScore.overall.toFixed(1)}/10`,
            icon: <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          }
        ].map((item, i) => (
          <div key={i} className="text-center relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              {item.icon}
            </div>
            <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-semibold">{item.label}</p>
            <p className="text-lg font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
