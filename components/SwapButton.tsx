'use client';

import { useState } from 'react';

interface SwapButtonProps {
  onSwap: () => void;
  disabled?: boolean;
}

export default function SwapButton({ onSwap, disabled = false }: SwapButtonProps) {
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsRotating(true);
    onSwap();
    
    // Reset rotation after animation
    setTimeout(() => {
      setIsRotating(false);
    }, 300);
  };

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`p-3 rounded-full border-2 transition-all duration-200 ${
          disabled
            ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100'
            : 'border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
        aria-label="Swap origin and destination"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isRotating ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      </button>
    </div>
  );
}
