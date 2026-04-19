'use client';

import { useState, useRef, useEffect } from 'react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
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

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Compare using local time to avoid timezone issues
    const dateLocal = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return dateLocal < todayLocal;
  };

  const formatDateLocal = (date: Date) => {
    // Use UTC methods to avoid timezone offset issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateLocal = (dateStr: string) => {
    // Parse date string in local timezone
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const isDateSelected = (date: Date) => {
    if (!startDate && !endDate) return false;
    const dateStr = formatDateLocal(date);
    return dateStr === startDate || dateStr === endDate;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const dateStr = formatDateLocal(date);
    return dateStr > startDate && dateStr < endDate;
  };

  const isDateHovered = (date: Date) => {
    if (!hoveredDate || !startDate || endDate) return false;
    const dateStr = formatDateLocal(date);
    const hoveredStr = formatDateLocal(hoveredDate);
    return dateStr > startDate && dateStr < hoveredStr;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    // Use local time to avoid timezone offset issues
    const dateStr = formatDateLocal(date);
    
    if (!selectingEnd) {
      // Select start date
      onChange(dateStr, '');
      setSelectingEnd(true);
    } else {
      // Select end date
      if (dateStr < startDate) {
        // If clicked date is before start date, make it the new start date
        onChange(dateStr, '');
        setSelectingEnd(true);
      } else {
        // Valid end date
        onChange(startDate, dateStr);
        setSelectingEnd(false);
        setIsOpen(false);
      }
    }
  };

  const handleDateHover = (date: Date) => {
    if (!isDateDisabled(date) && selectingEnd && startDate && !endDate) {
      setHoveredDate(date);
    }
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
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return 'Select dates';
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const inRange = isDateInRange(date);
      const hovered = isDateHovered(date);

      days.push(
        <button
          key={day}
          type="button"
          disabled={disabled}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => handleDateHover(date)}
          onMouseLeave={() => setHoveredDate(null)}
          className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${
            disabled
              ? 'text-gray-400 cursor-not-allowed'
              : selected
              ? 'bg-blue-500 text-white'
              : inRange || hovered
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-900 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className={`${!startDate ? 'text-gray-500' : 'text-gray-900'}`}>
              {formatDateRange()}
            </span>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl">
          <div className="p-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            {/* Instructions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {selectingEnd ? 'Select return date' : 'Select departure date'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
