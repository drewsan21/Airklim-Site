/**
 * SEO Avanzato
 * Schema markup, sitemap dinamica, breadcrumb, meta tags ottimizzati, canonical URLs
 */

import { useEffect, useState } from 'react';

// ===== SCHEMA MARKUP GENERATOR =====
export function useSchemaMarkup() {
  useEffect(() => {
    // Organization Schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AIRKLIM',
      url: 'https://airklim.it',
      logo: 'https://airklim.it/logo.png',
      description: 'Distributore ufficiale Panasonic PRO Partner di climatizzazione professionale in Sicilia',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Via Ciachea, 2/e - Zona Industriale',
        addressLocality: 'Carini',
        addressRegion: 'Palermo',
        postalCode: '90044',
        addressCountry: 'IT'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+39-091-8691680',
        contactType: 'customer service',
        areaServed: 'IT',
        availableLanguage: 'Italian'
      },
      sameAs: [
        'https://www.facebook.com/airklim',
        'https://www.instagram.com/airklim'
      ]
    };

    // LocalBusiness Schema
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'AIRKLIM',
      image: 'https://airklim.it/og-image.jpg',
      '@id': 'https://airklim.it',
      url: 'https://airklim.it',
      telephone: '+39-091-8691680',
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Via Ciachea, 2/e - Zona Industriale',
        addressLocality: 'Carini',
        addressRegion: 'Palermo',
        postalCode: '90044',
        addressCountry: 'IT'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 38.1157,
        longitude: 13.2833
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:30',
        closes: '18:00'
      },
      sameAs: [
        'https://www.facebook.com/airklim',
        'https://www.instagram.com/airklim'
      ]
    };

    // Product Schema (for each product)
    const generateProductSchema = (product: any) => ({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.image,
      description: product.description,
      brand: {
        '@type': 'Brand',
        name: product.brand
      },
      sku: product.sku || product.id,
      offers: {
        '@type': 'Offer',
        url: `https://airklim.it/product/${product.id}`,
        priceCurrency: 'EUR',
        price: product.price,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition'
      },
      aggregateRating: product.rating ? {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1
      } : undefined
    });

    // FAQ Schema
    const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });

    // BreadcrumbList Schema
    const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url
      }))
    });

    // Inject schemas into document
    const injectSchema = (schema: any) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    injectSchema(organizationSchema);
    injectSchema(localBusinessSchema);

    return () => {
      // Cleanup schemas on unmount
      const schemas = document.querySelectorAll('script[type="application/ld+json"]');
      schemas.forEach(schema => schema.remove());
    };
  }, []);
}

// ===== DYNAMIC SITEMAP GENERATOR =====
export function generateSitemap(products: any[], pages: string[]) {
  const baseUrl = 'https://airklim.it';
  const currentDate = new Date().toISOString().split('T')[0];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${pages.map(page => `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${products.map(product => `
  <url>
    <loc>${baseUrl}/product/${product.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  return sitemap;
}

// ===== BREADCRUMB COMPONENT =====
export function Breadcrumb({ items }: { items: Array<{ name: string; url: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg className="w-4 h-4 text-white/30 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {index === items.length - 1 ? (
              <span className="text-white/60">{item.name}</span>
            ) : (
              <a href={item.url} className="text-sky-400 hover:text-sky-300 transition-colors">
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ===== META TAGS OPTIMIZER =====
export function useMetaTags(title: string, description: string, keywords?: string, image?: string) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update or create meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Update Open Graph tags
    const ogTags = {
      'og:title': title,
      'og:description': description,
      'og:image': image || 'https://airklim.it/og-image.jpg',
      'og:url': window.location.href,
      'og:type': 'website'
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Update Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': image || 'https://airklim.it/twitter-image.jpg'
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);
  }, [title, description, keywords, image]);
}

// ===== SEO ANALYSIS TOOL =====
export function SEOAnalysis({ url }: { url: string }) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSEO = async () => {
    setLoading(true);
    
    // Simulated SEO analysis
    setTimeout(() => {
      setAnalysis({
        title: {
          score: 95,
          issues: [],
          recommendations: []
        },
        metaDescription: {
          score: 90,
          issues: [],
          recommendations: ['Considera di aggiungere una call-to-action']
        },
        headings: {
          score: 85,
          issues: [],
          recommendations: ['Aggiungi più H2 per migliorare la struttura']
        },
        images: {
          score: 80,
          issues: ['3 immagini senza alt text'],
          recommendations: ['Aggiungi alt text descrittivo a tutte le immagini']
        },
        links: {
          score: 95,
          issues: [],
          recommendations: []
        },
        mobile: {
          score: 100,
          issues: [],
          recommendations: []
        },
        speed: {
          score: 88,
          issues: ['Alcune immagini non ottimizzate'],
          recommendations: ['Comprimi le immagini per migliorare la velocità']
        },
        overallScore: 90
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Analisi SEO</h3>
        <button
          onClick={analyzeSEO}
          disabled={loading}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 text-white rounded-lg text-sm font-medium transition-all"
        >
          {loading ? 'Analisi in corso...' : 'Analizza'}
        </button>
      </div>

      {analysis && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <span className="text-white font-semibold">Punteggio Complessivo</span>
            <span className="text-3xl font-bold text-green-400">{analysis.overallScore}/100</span>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(analysis).filter(([key]) => key !== 'overallScore').map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className={`text-2xl font-bold ${
                    value.score >= 90 ? 'text-green-400' :
                    value.score >= 70 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {value.score}
                  </span>
                </div>
                {value.issues.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-red-400 mb-1">Problemi:</div>
                    <ul className="text-xs text-white/60 space-y-1">
                      {value.issues.map((issue: string, i: number) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {value.recommendations.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-sky-400 mb-1">Suggerimenti:</div>
                    <ul className="text-xs text-white/60 space-y-1">
                      {value.recommendations.map((rec: string, i: number) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== KEYWORD RESEARCH TOOL =====
export function KeywordResearch() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchKeywords = () => {
    if (!keyword) return;
    
    setLoading(true);
    
    // Simulated keyword research
    setTimeout(() => {
      setResults([
        { keyword: 'climatizzatori panasonic sicilia', volume: 1200, difficulty: 45, cpc: 2.5 },
        { keyword: 'condizionatori palermo', volume: 880, difficulty: 38, cpc: 2.2 },
        { keyword: 'pompe di calore aquarea', volume: 650, difficulty: 52, cpc: 3.1 },
        { keyword: 'installazione climatizzatori', volume: 1500, difficulty: 55, cpc: 2.8 },
        { keyword: 'manutenzione climatizzatori', volume: 420, difficulty: 30, cpc: 1.9 }
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Ricerca Keyword</h3>
      
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Inserisci keyword..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
        />
        <button
          onClick={searchKeywords}
          disabled={loading}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 text-white rounded-xl font-semibold transition-all"
        >
          {loading ? 'Ricerca...' : 'Cerca'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-sm font-semibold text-white/70">Keyword</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white/70">Volume</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white/70">Difficoltà</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-white/70">CPC</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white">{result.keyword}</td>
                  <td className="px-4 py-3 text-center text-white">{result.volume.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.difficulty < 40 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      result.difficulty < 60 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {result.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-white">€{result.cpc.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
