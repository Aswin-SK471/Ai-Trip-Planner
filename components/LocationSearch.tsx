'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface LocationSuggestion {
  id: string;
  displayName: string;
  city?: string;
  country?: string;
  state?: string;
  type?: 'city' | 'country' | 'state' | 'airport';
  iata?: string;
  source?: 'google' | 'local' | 'airport';
  lat?: number;
  lng?: number;
}

interface LocationSearchProps {
  value: string;
  onChange: (value: string, suggestion?: LocationSuggestion) => void;
  placeholder?: string;
  onSelect?: (suggestion: LocationSuggestion) => void;
  className?: string;
}

export default function LocationSearch({
  value,
  onChange,
  placeholder = 'Search location...',
  onSelect,
  className = '',
}: LocationSearchProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `/api/places?input=${encodeURIComponent(query.trim())}`,
        {
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions);
        setIsOpen(data.suggestions.length > 0);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Search error:', err);
        setError('Unable to search locations');
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle input change with debounce
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      setSelectedIndex(-1);
      setError(null);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        fetchSuggestions(newValue);
      }, 300);
    },
    [onChange, fetchSuggestions]
  );

  // Handle suggestion selection
  const handleSelect = useCallback(
    (suggestion: LocationSuggestion) => {
      onChange(suggestion.displayName, suggestion);
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      onSelect?.(suggestion);
      inputRef.current?.blur();
    },
    [onChange, onSelect]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, suggestions, selectedIndex, handleSelect]
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce and abort on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onBlur={() => {
            // Add a small delay to let handleSelect fire if they clicked a suggestion
            setTimeout(() => {
              if (inputRef.current && suggestions.length > 0 && inputRef.current.value.length > 0) {
                // Auto-select the first suggestion if they haven't explicitly clicked one
                onChange(suggestions[0].displayName, suggestions[0]);
                onSelect?.(suggestions[0]);
              }
              setIsOpen(false);
            }, 200);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 rounded-xl border text-white bg-white/5 border-white/10 placeholder-gray-400 caret-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/8 transition-all duration-200"
          autoComplete="off"
        />

        {isLoading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setIsOpen(false);
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Error state */}
      {error && isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-red-500/10 border border-red-400/30 rounded-xl px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && !error && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <div className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.id}-${index}`}
                type="button"
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full px-4 py-3 text-left border-b border-white/5 last:border-b-0 transition-all duration-150 ${
                  index === selectedIndex
                    ? 'bg-blue-500/20 border-l-2 border-l-blue-400'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-slate-400">
                    {suggestion.type === 'airport' || suggestion.iata ? (
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : suggestion.type === 'country' ? (
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${index === selectedIndex ? 'text-blue-400' : 'text-white'}`}>
                      {suggestion.displayName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {suggestion.country}
                      {suggestion.state && ` • ${suggestion.state}`}
                      {suggestion.iata && ` • ${suggestion.iata}`}
                    </p>
                  </div>
                  {suggestion.source && (
                    <span className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded">
                      {suggestion.source === 'google' ? 'Google' : suggestion.source === 'airport' ? 'Airport' : 'Data'}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {isOpen && !isLoading && suggestions.length === 0 && !error && value.length >= 2 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-8 text-center">
            <p className="text-gray-400 text-sm">No locations found</p>
          </div>
        </div>
      )}
    </div>
  );
}
