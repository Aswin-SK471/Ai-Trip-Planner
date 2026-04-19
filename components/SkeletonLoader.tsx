'use client';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'flight' | 'input' | 'button' | 'itinerary' | 'hotel';
  lines?: number;
}

export default function SkeletonLoader({ 
  className = '', 
  variant = 'text',
  lines = 1 
}: SkeletonLoaderProps) {
  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse ${
              i === 0 ? 'w-3/4' : i === lines - 1 ? 'w-1/2' : 'w-full'
            }`}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="space-y-4">
          <div className="h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-full animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === 'flight') {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-24 animate-pulse" />
                <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-16 animate-pulse" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-16 animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-12 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-12 animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-16 animate-pulse" />
            </div>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full animate-pulse" />
            </div>
            <div className="text-right space-y-1">
              <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-12 animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-16 animate-pulse" />
            </div>
          </div>
          <div className="h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === 'input') {
    return (
      <div className={`h-12 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl animate-pulse ${className}`} />
    );
  }

  if (variant === 'button') {
    return (
      <div className={`h-12 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl animate-pulse ${className}`} />
    );
  }

  if (variant === 'itinerary') {
    return (
      <div className={`glass-card p-6 rounded-2xl ${className}`}>
        <div className="space-y-4">
          <div className="h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-1/3 animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
                <div className="h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'hotel') {
    return (
      <div className={`glass-card overflow-hidden rounded-2xl ${className}`}>
        <div className="h-48 bg-gradient-to-r from-slate-700 to-slate-600 animate-pulse" />
        <div className="p-4 space-y-4">
          <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-1/2 animate-pulse" />
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full w-16 animate-pulse" />
            ))}
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded w-1/4 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded animate-pulse ${className}`} />
  );
}
