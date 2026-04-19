'use client';

import { useState, useRef, useEffect } from 'react';

interface PassengerSelectorProps {
  adults: number;
  children: number;
  infants: number;
  onChange: (adults: number, children: number, infants: number) => void;
}

export default function PassengerSelector({ adults, children, infants, onChange }: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTotalPassengers = () => adults + children + infants;

  const updatePassengers = (type: 'adults' | 'children' | 'infants', delta: number) => {
    let newAdults = adults;
    let newChildren = children;
    let newInfants = infants;

    switch (type) {
      case 'adults':
        newAdults = Math.max(1, adults + delta); // At least 1 adult
        break;
      case 'children':
        newChildren = Math.max(0, children + delta);
        break;
      case 'infants':
        newInfants = Math.max(0, infants + delta);
        break;
    }

    onChange(newAdults, newChildren, newInfants);
  };

  const getPassengerLabel = () => {
    const total = getTotalPassengers();
    if (total === 1) return '1 Passenger';
    return `${total} Passengers`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full glass-input flex items-center justify-between text-slate-300 hover:border-blue-400/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>👥</span>
          <span className="font-medium text-white">{getPassengerLabel()}</span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="glass-dropdown mt-2 p-4 space-y-4">
          {/* Adults */}
          <div className="flex items-center justify-between py-3 px-3 bg-white/5 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-white">Adults</div>
              <div className="text-xs text-slate-400">18+ years</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updatePassengers('adults', -1)}
                disabled={adults <= 1}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="text-white font-bold">−</span>
              </button>
              <span className="w-6 text-center font-bold text-white">{adults}</span>
              <button
                type="button"
                onClick={() => updatePassengers('adults', 1)}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-blue-400/50 transition-all"
              >
                <span className="text-white font-bold">+</span>
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between py-3 px-3 bg-white/5 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-white">Children</div>
              <div className="text-xs text-slate-400">2-17 years</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updatePassengers('children', -1)}
                disabled={children <= 0}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="text-white font-bold">−</span>
              </button>
              <span className="w-6 text-center font-bold text-white">{children}</span>
              <button
                type="button"
                onClick={() => updatePassengers('children', 1)}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-blue-400/50 transition-all"
              >
                <span className="text-white font-bold">+</span>
              </button>
            </div>
          </div>

          {/* Infants */}
          <div className="flex items-center justify-between py-3 px-3 bg-white/5 rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-white">Infants</div>
              <div className="text-xs text-slate-400">Under 2 years</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updatePassengers('infants', -1)}
                disabled={infants <= 0}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="text-white font-bold">−</span>
              </button>
              <span className="w-6 text-center font-bold text-white">{infants}</span>
              <button
                type="button"
                onClick={() => updatePassengers('infants', 1)}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-blue-400/50 transition-all"
              >
                <span className="text-white font-bold">+</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
