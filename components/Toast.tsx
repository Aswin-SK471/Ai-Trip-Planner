'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let toastIdCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev =>
      prev.map(t => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  const iconColors: Record<ToastType, string> = {
    success: 'text-emerald-400 bg-emerald-400/10',
    error: 'text-red-400 bg-red-400/10',
    info: 'text-blue-400 bg-blue-400/10',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} ${toast.exiting ? 'toast-exit' : ''}`}
            onClick={() => dismissToast(toast.id)}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${iconColors[toast.type]}`}
            >
              {icons[toast.type]}
            </div>
            <p className="text-sm text-slate-200 flex-1">{toast.message}</p>
            <button
              className="text-slate-500 hover:text-slate-300 transition-colors text-lg"
              onClick={(e) => {
                e.stopPropagation();
                dismissToast(toast.id);
              }}
            >
              ×
            </button>
            <div className="toast-progress" />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
