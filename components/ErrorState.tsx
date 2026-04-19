'use client';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'card' | 'inline' | 'full';
  className?: string;
}

export default function ErrorState({ 
  title = 'Something went wrong',
  message = 'Please try again or contact support if the problem persists.',
  onRetry,
  variant = 'card',
  className = ''
}: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 text-red-400 ${className}`}>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 mb-6 max-w-md">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/50"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`glass-card p-6 rounded-2xl border border-red-400/30 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-slate-400 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
