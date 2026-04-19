'use client';

interface InterestsSelectorProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
}

const interestOptions = [
  { 
    id: 'adventure', 
    label: 'Adventure', 
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    color: 'from-orange-500 to-red-500' 
  },
  { 
    id: 'food', 
    label: 'Food', 
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    color: 'from-orange-400 to-yellow-500' 
  },
  { 
    id: 'culture', 
    label: 'Culture', 
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>,
    color: 'from-purple-500 to-pink-500' 
  },
  { 
    id: 'nature', 
    label: 'Nature', 
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    color: 'from-green-500 to-emerald-500' 
  },
  { 
    id: 'shopping', 
    label: 'Shopping', 
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    color: 'from-pink-500 to-rose-500' 
  },
  { 
    id: 'nightlife', 
    label: 'Nightlife', 
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'from-indigo-500 to-blue-500' 
  },
  { 
    id: 'relaxation', 
    label: 'Relaxation', 
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'from-cyan-500 to-blue-500' 
  },
  { 
    id: 'historical', 
    label: 'Historical', 
    icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    color: 'from-amber-600 to-orange-600' 
  },
];

export default function InterestsSelector({ selectedInterests, onChange }: InterestsSelectorProps) {
  const handleInterestToggle = (interestId: string) => {
    const newInterests = selectedInterests.includes(interestId)
      ? selectedInterests.filter(id => id !== interestId)
      : [...selectedInterests, interestId];
    onChange(newInterests);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">Travel Interests</h3>
          <p className="text-xs text-slate-500">Choose your travel preferences</p>
        </div>
        <div className="text-sm font-medium px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/50 text-blue-300">
          {selectedInterests.length}/{interestOptions.length}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {interestOptions.map((interest) => {
          const isSelected = selectedInterests.includes(interest.id);
          
          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => handleInterestToggle(interest.id)}
              className={`group relative p-4 rounded-xl transition-all duration-300 ${
                isSelected
                  ? `glass-card border-blue-400/50 bg-gradient-to-br ${interest.color}/20 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.2)]`
                  : 'glass-card hover:border-blue-400/30 hover:scale-[1.02]'
              }`}
            >
              {/* Animated gradient background on hover */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${interest.color}`}></div>
              
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`text-slate-300 transition-all duration-300 ${isSelected ? 'scale-110 drop-shadow-lg text-white' : 'group-hover:scale-105 group-hover:text-white'}`}>
                  {interest.icon}
                </div>
                <div className={`text-sm font-medium text-center transition-colors ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {interest.label}
                </div>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center animate-pulse shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedInterests.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-2">
          {selectedInterests.map((id) => {
            const interest = interestOptions.find(i => i.id === id);
            return (
              <div key={id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50">
                <span className="text-sm font-medium text-blue-300">{interest?.label}</span>
                <button
                  onClick={() => handleInterestToggle(id)}
                  className="ml-1 text-blue-400 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
