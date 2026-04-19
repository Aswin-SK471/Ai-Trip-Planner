'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ size = 'md', text, fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500 animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>
      {text && <p className="text-sm text-slate-400 font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}
