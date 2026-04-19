'use client';

import { useState } from 'react';

interface BudgetSliderProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BudgetSlider({ value, onChange }: BudgetSliderProps) {
  const [budget, setBudget] = useState(parseInt(value) || 1000);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(budget.toString());

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBudget = parseInt(e.target.value);
    setBudget(newBudget);
    onChange(newBudget.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const newBudget = Math.max(100, Math.min(5000, parseInt(inputValue) || 1000));
    setBudget(newBudget);
    setInputValue(newBudget.toString());
    onChange(newBudget.toString());
    setIsEditing(false);
  };

  const getBudgetLabel = () => {
    return `$${budget.toLocaleString()}`;
  };

  const getPercentage = () => {
    return ((budget - 100) / (5000 - 100)) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <span>💰</span> Budget per Adult
          </label>
          <p className="text-xs text-slate-500 mt-1">Applies to travellers 18+</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyPress={(e) => e.key === 'Enter' && handleInputBlur()}
              autoFocus
              className="glass-input w-24 text-right"
              min="100"
              max="5000"
            />
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            {getBudgetLabel()}
          </button>
        )}
      </div>

      <div className="relative h-8 flex items-center">
        {/* Track background */}
        <div className="absolute inset-0 h-2 bg-white/10 rounded-full">
          {/* Active track */}
          <div
            className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-150"
            style={{ width: `${getPercentage()}%` }}
          />
        </div>

        {/* Range input */}
        <input
          type="range"
          min="100"
          max="5000"
          step="50"
          value={budget}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          aria-label="Budget per person"
        />

        {/* Thumb */}
        <div
          className="absolute w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white rounded-full shadow-lg transition-all hover:scale-110 cursor-grab active:cursor-grabbing"
          style={{ left: `calc(${getPercentage()}% - 12px)` }}
        />
      </div>

      {/* Budget markers */}
      <div className="flex justify-between text-xs text-slate-500 font-medium">
        <span>$100</span>
        <span>$2,500</span>
        <span>$5,000</span>
      </div>
    </div>
  );
}
