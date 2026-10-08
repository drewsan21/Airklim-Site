import React, { useEffect, useState } from 'react';

// Re-export hooks from their dedicated lightweight module so existing
// consumers of './ErrorTracking' keep working. App.tsx imports the hooks
// directly from './ErrorTrackingHooks' to avoid pulling this module's
// UI components into the main bundle (they are lazy-loaded instead).
export { useErrorHandler, usePerformanceMonitoring } from './ErrorTrackingHooks';

// ===== ERROR TRACKING & MONITORING (UI COMPONENTS) =====

/**
 * Error Boundary Component
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🐛 Error caught by boundary:', error, errorInfo);
    
    // Save to localStorage
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    localStorage.setItem('airklim-last-error', JSON.stringify(errorData));
    
    // In production: send to error tracking service (Sentry, etc.)
    // fetch('/api/error', { method: 'POST', body: JSON.stringify(errorData) });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md bg-slate-900 rounded-2xl border border-red-500/20 p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-3">Qualcosa è andato storto</h2>
            <p className="text-white/60 mb-6">
              Ci scusiamo per l'inconveniente. Il nostro team è stato notificato e sta lavorando per risolvere il problema.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
            >
              Ricarica Pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Uptime Monitoring Component
 */
export function UptimeMonitor() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastChecked, setLastChecked] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastChecked(new Date());
      console.log('✅ Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastChecked(new Date());
      console.log('❌ Connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection every 30 seconds
    const interval = setInterval(() => {
      setIsOnline(navigator.onLine);
      setLastChecked(new Date());
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-red-500/90 backdrop-blur-sm text-white px-4 py-3 text-center text-sm font-semibold">
          ⚠️ Sei offline. Alcune funzionalità potrebbero non essere disponibili.
        </div>
      )}

      {/* Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs border border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-white/60">{isOnline ? 'Online' : 'Offline'}</span>
          <span className="text-white/40">•</span>
          <span className="text-white/40">{lastChecked.toLocaleTimeString('it-IT')}</span>
        </div>
      </div>
    </>
  );
}

/**
 * Error Log Viewer (Admin)
 */
export function ErrorLogViewer() {
  const [showLogs, setShowLogs] = useState(false);
  const [errors, setErrors] = useState<Array<{
    type: string;
    data: any;
    timestamp: string;
  }>>([]);

  useEffect(() => {
    if (!showLogs) return;

    const collectedErrors: Array<{ type: string; data: any; timestamp: string }> = [];

    // Load errors from localStorage
    const lastError = localStorage.getItem('airklim-last-error');
    if (lastError) {
      collectedErrors.push({ type: 'Component Error', data: JSON.parse(lastError), timestamp: JSON.parse(lastError).timestamp });
    }

    const globalError = localStorage.getItem('airklim-global-error');
    if (globalError) {
      collectedErrors.push({ type: 'Global Error', data: JSON.parse(globalError), timestamp: JSON.parse(globalError).timestamp });
    }

    const promiseError = localStorage.getItem('airklim-promise-error');
    if (promiseError) {
      collectedErrors.push({ type: 'Promise Error', data: JSON.parse(promiseError), timestamp: JSON.parse(promiseError).timestamp });
    }

    setErrors(collectedErrors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, [showLogs]);

  const clearLogs = () => {
    localStorage.removeItem('airklim-last-error');
    localStorage.removeItem('airklim-global-error');
    localStorage.removeItem('airklim-promise-error');
    setErrors([]);
  };

  return (
    <>
      {/* Error Log Button (Admin) */}
      <button
        onClick={() => setShowLogs(true)}
        className="fixed bottom-88 left-6 z-40 w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg border border-white/10 transition-all hover:scale-110 lg:left-[280px]"
        aria-label="Error Logs"
        title="Error Logs"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {errors.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {errors.length}
          </span>
        )}
      </button>

      {/* Error Log Panel */}
      {showLogs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowLogs(false)}>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Error Logs</h2>
              <div className="flex gap-2">
                <button
                  onClick={clearLogs}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-semibold transition-all"
                >
                  Pulisci Log
                </button>
                <button onClick={() => setShowLogs(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {errors.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">Nessun errore</h3>
                <p className="text-white/60">Tutto funziona correttamente!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {errors.map((error, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">
                        {error.type}
                      </span>
                      <span className="text-xs text-white/40">
                        {new Date(error.timestamp).toLocaleString('it-IT')}
                      </span>
                    </div>
                    <div className="text-sm text-white/60 font-mono bg-black/30 rounded-lg p-3 overflow-x-auto">
                      <pre>{JSON.stringify(error.data, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
