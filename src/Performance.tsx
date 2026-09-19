import { useEffect, useState } from 'react';

// ===== PERFORMANCE OPTIMIZATION HOOKS =====

/**
 * Lazy loading images with Intersection Observer
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E');
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imageRef);
    return () => observer.disconnect();
  }, [src, imageRef]);

  return { imageSrc, setImageRef };
}

/**
 * Debounce hook for search inputs
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Virtual scroll hook for long lists
 */
export function useVirtualScroll(itemHeight: number, containerHeight: number, totalItems: number) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, totalItems);
  const visibleItems = Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight: totalItems * itemHeight,
    offsetY: startIndex * itemHeight,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop)
  };
}

/**
 * Prefetch images on hover
 */
export function usePrefetchOnHover() {
  const prefetchImage = (src: string) => {
    const img = new Image();
    img.src = src;
  };

  return { prefetchImage };
}

/**
 * Monitor Core Web Vitals
 */
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Report Web Vitals to console (in production, send to analytics)
    const reportVital = (name: string, value: number) => {
      console.log(`📊 ${name}:`, value);
      // In production: send to analytics service
      // fetch('/api/analytics/web-vitals', { method: 'POST', body: JSON.stringify({ name, value }) });
    };

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      reportVital('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        reportVital('FID', (entry as any).processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          reportVital('CLS', clsValue);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });

  }, []);
}

/**
 * Optimize images with srcSet for responsive images
 */
export function getResponsiveImageSrc(baseSrc: string, sizes: number[] = [320, 640, 960, 1280, 1920]) {
  const srcSet = sizes.map(size => `${baseSrc}?w=${size} ${size}w`).join(', ');
  const sizesAttr = '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw';
  
  return { srcSet, sizes: sizesAttr };
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  useEffect(() => {
    // Preload critical images
    const criticalImages: string[] = [
      // Add your critical image URLs here
    ];

    criticalImages.forEach((src: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload fonts
    const fonts: string[] = [
      // Add your font URLs here
    ];

    fonts.forEach((href: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);
}

/**
 * Optimize re-renders with memoization
 */
export function useOptimizedRender<T>(data: T, dependencies: any[]): T {
  const [optimizedData, setOptimizedData] = useState(data);

  useEffect(() => {
    setOptimizedData(data);
  }, dependencies);

  return optimizedData;
}

/**
 * Cache API responses
 */
export function useCachedFetch<T>(url: string, options?: RequestInit, ttl: number = 3600000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cacheKey = `cache_${url}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        setData(data);
        setLoading(false);
        return;
      }
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setData(result);
        localStorage.setItem(cacheKey, JSON.stringify({ data: result, timestamp: Date.now() }));
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options, ttl]);

  return { data, loading, error };
}

/**
 * Optimize scroll performance with requestAnimationFrame
 */
export function useOptimizedScroll(callback: (scrollY: number) => void) {
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          callback(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback]);
}

/**
 * Image optimization component
 */
export function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  responsiveSizes = [320, 640, 960, 1280, 1920],
  ...props 
}: React.ImgHTMLAttributes<HTMLImageElement> & { responsiveSizes?: number[] }) {
  const { imageSrc, setImageRef } = useLazyImage(src || '');
  const responsiveProps = src ? getResponsiveImageSrc(src, responsiveSizes) : { srcSet: '', sizes: '' };

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt || ''}
      className={className}
      loading="lazy"
      decoding="async"
      srcSet={responsiveProps.srcSet}
      sizes={responsiveProps.sizes}
      {...props}
    />
  );
}

/**
 * Virtual list component for long lists
 */
export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  className = ''
}: {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}) {
  const containerRef = useState<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef[0]) {
        setContainerHeight(containerRef[0].clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [containerRef]);

  const { visibleItems, totalHeight, offsetY, onScroll } = useVirtualScroll(
    itemHeight,
    containerHeight,
    items.length
  );

  return (
    <div
      ref={containerRef[0] ? undefined : (el) => { if (el) containerRef[0] = el; }}
      className={`overflow-y-auto ${className}`}
      onScroll={onScroll}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((index) => (
            <div key={index} style={{ height: itemHeight }}>
              {renderItem(items[index], index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
