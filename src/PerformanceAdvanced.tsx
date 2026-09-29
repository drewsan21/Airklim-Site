/**
 * Performance Avanzata
 * CDN, Service Worker, Code Splitting, Image Optimization, Caching
 */

import { useEffect, useState } from 'react';

// ===== SERVICE WORKER REGISTRATION =====
export function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope);
            
            // Check for updates
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      console.log('🔄 New content available, please refresh.');
                    } else {
                      console.log('✅ Content cached for offline use.');
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error);
          });
      });
    }
  }, []);
}

// ===== CODE SPLITTING HELPER =====
export function lazyLoadComponent(importFn: () => Promise<any>) {
  return importFn().catch((error) => {
    console.error('Error loading component:', error);
    return null;
  });
}

// ===== IMAGE OPTIMIZATION =====
export function useImageOptimization() {
  const [supportedFormats, setSupportedFormats] = useState<string[]>(['jpg', 'png']);

  useEffect(() => {
    // Check browser support for modern image formats
    const canvas = document.createElement('canvas');
    if (canvas.toDataURL) {
      const formats: string[] = [];
      
      // Check WebP support
      canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0 && formats.push('webp');
      
      // Check AVIF support
      canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0 && formats.push('avif');
      
      setSupportedFormats(['jpg', 'png', ...formats]);
    }
  }, []);

  const getOptimizedImageUrl = (baseUrl: string, width?: number, quality: number = 80) => {
    const format = supportedFormats.includes('avif') ? 'avif' : 
                   supportedFormats.includes('webp') ? 'webp' : 'jpg';
    
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    params.set('q', quality.toString());
    params.set('fm', format);
    
    return `${baseUrl}?${params.toString()}`;
  };

  return { getOptimizedImageUrl, supportedFormats };
}

// ===== PRELOAD CRITICAL RESOURCES =====
export function usePreloadResources() {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/images/hero-bg.jpg',
      '/images/logo.png'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const criticalFonts = [
      '/fonts/inter-var.woff2'
    ];

    criticalFonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = href;
      document.head.appendChild(link);
    });

    // Preconnect to external domains
    const preconnectDomains = [
      'https://images.unsplash.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, []);
}

// ===== PERFORMANCE MONITORING =====
export function usePerformanceMonitoring() {
  useEffect(() => {
    if ('performance' in window) {
      // Monitor page load performance
      window.addEventListener('load', () => {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        console.log('📊 Performance Metrics:', {
          'Page Load Time': `${loadTime}ms`,
          'DOM Ready Time': `${domReadyTime}ms`,
          'First Paint': performance.getEntriesByType('paint')[0]?.startTime || 'N/A'
        });

        // Report to analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'performance_metrics', {
            page_load_time: loadTime,
            dom_ready_time: domReadyTime
          });
        }
      });

      // Monitor long tasks
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn('⚠️ Long task detected:', {
                duration: `${entry.duration}ms`,
                name: entry.name
              });
            }
          });
        });

        observer.observe({ entryTypes: ['longtask'] });
      }
    }
  }, []);
}

// ===== LAZY IMAGE COMPONENT =====
export function LazyImage({ src, alt, className, width, height }: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imgRef, setImgRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef) {
      observer.observe(imgRef);
    }

    return () => observer.disconnect();
  }, [imgRef]);

  return (
    <img
      ref={setImgRef}
      src={isInView ? src : ''}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      width={width}
      height={height}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
    />
  );
}

// ===== VIRTUAL SCROLL COMPONENT =====
export function VirtualScroll({ items, itemHeight, containerHeight, renderItem }: {
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, items.length);
  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== CDN CONFIGURATION =====
export function configureCDN() {
  const cdnUrl = import.meta.env.VITE_CDN_URL || 'https://cdn.airklim.it';
  
  // Replace all asset URLs with CDN URLs
  const replaceAssetUrls = () => {
    const images = document.querySelectorAll('img[src]');
    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith(cdnUrl)) {
        img.setAttribute('src', `${cdnUrl}${src}`);
      }
    });

    const links = document.querySelectorAll('link[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith(cdnUrl)) {
        link.setAttribute('href', `${cdnUrl}${href}`);
      }
    });
  };

  // Run on initial load
  replaceAssetUrls();

  // Run on DOM changes
  const observer = new MutationObserver(replaceAssetUrls);
  observer.observe(document.body, { childList: true, subtree: true });

  return () => observer.disconnect();
}

// ===== CACHE STRATEGY =====
export function useCacheStrategy() {
  useEffect(() => {
    // Configure cache headers for static assets
    if ('caches' in window) {
      caches.open('airklim-cache-v1').then((cache) => {
        // Cache critical resources
        const criticalResources = [
          '/',
          '/index.html',
          '/manifest.json'
        ];

        cache.addAll(criticalResources).catch((error) => {
          console.error('Error caching resources:', error);
        });
      });
    }
  }, []);

  const clearCache = async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('✅ Cache cleared');
    }
  };

  return { clearCache };
}

// ===== PERFORMANCE BUDGET =====
export function checkPerformanceBudget() {
  const budget = {
    maxBundleSize: 500 * 1024, // 500KB
    maxImageSize: 200 * 1024, // 200KB
    maxFirstLoad: 3000, // 3 seconds
    maxInteractive: 5000 // 5 seconds
  };

  // Check bundle size
  const scripts = document.querySelectorAll('script[src]');
  let totalBundleSize = 0;
  
  scripts.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && src.includes('/assets/')) {
      // In production, you'd fetch the actual file size
      // This is a simplified check
      totalBundleSize += 100 * 1024; // Assume 100KB per script
    }
  });

  if (totalBundleSize > budget.maxBundleSize) {
    console.warn('⚠️ Bundle size exceeds budget:', {
      current: `${(totalBundleSize / 1024).toFixed(2)}KB`,
      budget: `${(budget.maxBundleSize / 1024).toFixed(2)}KB`
    });
  }

  return {
    withinBudget: totalBundleSize <= budget.maxBundleSize,
    currentSize: totalBundleSize,
    budget: budget.maxBundleSize
  };
}
