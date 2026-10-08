import { useEffect, useState } from 'react';

// ===== ERROR TRACKING HOOKS (lightweight, statically imported) =====
// These hooks are intentionally kept in their own module so that App.tsx can
// import them statically without pulling the heavier ErrorTracking UI
// components (ErrorBoundary / UptimeMonitor / ErrorLogViewer) into the main
// bundle. Those components are lazy-loaded from './ErrorTracking'.

/**
 * Global Error Handler Hook
 */
export function useErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🐛 Global error:', event.error);
      
      const errorData = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      localStorage.setItem('airklim-global-error', JSON.stringify(errorData));
      
      // In production: send to error tracking service
      // fetch('/api/error/global', { method: 'POST', body: JSON.stringify(errorData) });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🐛 Unhandled promise rejection:', event.reason);
      
      const errorData = {
        message: 'Unhandled Promise Rejection',
        reason: String(event.reason),
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href
      };
      
      localStorage.setItem('airklim-promise-error', JSON.stringify(errorData));
      
      // In production: send to error tracking service
      // fetch('/api/error/promise', { method: 'POST', body: JSON.stringify(errorData) });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

/**
 * Performance Monitoring Hook
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState({
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    ttfb: 0 // Time to First Byte
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return;

    // Measure TTFB
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
    }

    // Measure FCP
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcp = entries[0].startTime;
      setMetrics(prev => ({ ...prev, fcp }));
      console.log('📊 FCP:', fcp, 'ms');
    });
    fcpObserver.observe({ entryTypes: ['paint'] });

    // Measure LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lcp = entries[entries.length - 1].startTime;
      setMetrics(prev => ({ ...prev, lcp }));
      console.log('📊 LCP:', lcp, 'ms');
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Measure FID
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fid = (entries[0] as any).processingStart - entries[0].startTime;
      setMetrics(prev => ({ ...prev, fid }));
      console.log('📊 FID:', fid, 'ms');
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Measure CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      });
      console.log('📊 CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return metrics;
}
