import { useState } from 'react';

// ===== VIDEO TYPE =====
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  category: string;
}

// ===== VIDEO DATA =====
const videos: Video[] = [
  {
    id: 'panasonic-etherea-demo',
    title: 'Panasonic Etherea: Demo Completa',
    description: 'Scopri tutte le funzionalità della gamma Etherea: nanoe™ X, Aerowings 2.0, controllo Wi-Fi e molto altro.',
    thumbnail: 'https://images.unsplash.com/photo-1631545308456-7b5e2e990a5e?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    duration: '5:32',
    category: 'Prodotti'
  },
  {
    id: 'installazione-guida',
    title: 'Come Viene Installato un Climatizzatore',
    description: 'Segui passo passo il processo di installazione professionale di un climatizzatore Panasonic.',
    thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    duration: '8:15',
    category: 'Installazione'
  },
  {
    id: 'manutenzione-filtri',
    title: 'Come Pulire i Filtri del Climatizzatore',
    description: 'Guida pratica alla pulizia dei filtri per mantenere il tuo climatizzatore efficiente.',
    thumbnail: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    duration: '3:45',
    category: 'Manutenzione'
  },
  {
    id: 'nanoe-x-spiegazione',
    title: 'nanoe™ X: Come Funziona',
    description: 'Scopri la tecnologia rivoluzionaria di Panasonic che purifica l\'aria eliminando il 99% di batteri e virus.',
    thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    duration: '4:20',
    category: 'Tecnologia'
  },
  {
    id: 'tcl-breezein-review',
    title: 'TCL BreezeIN: Review Completa',
    description: 'Analisi dettagliata della serie BreezeIN di TCL: Gentle Breeze, Wi-Fi, efficienza energetica.',
    thumbnail: 'https://images.unsplash.com/photo-1631545308456-7b5e2e990a5e?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    duration: '6:10',
    category: 'Prodotti'
  },
  {
    id: 'conto-termico-guida',
    title: 'Conto Termico 3.0: Come Richiederlo',
    description: 'Guida completa per ottenere gli incentivi statali fino al 65% per il tuo nuovo climatizzatore.',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    duration: '7:30',
    category: 'Incentivi'
  }
];

// ===== VIDEO SECTION COMPONENT =====
export function VideoSection() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <section id="video" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Video & Tutorial</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Guarda i Nostri Video<br />
            <span className="text-gradient">Demo, Guide e Tutorial</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Video professionali per aiutarti a conoscere i prodotti, l'installazione e la manutenzione.
          </p>
        </div>

        {/* Featured Video */}
        {selectedVideo ? (
          <div className="mb-12">
            <div className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={selectedVideo.videoUrl}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{selectedVideo.title}</h3>
                <p className="text-white/60">{selectedVideo.description}</p>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="mt-4 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
                >
                  ← Torna alla galleria
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <div
              onClick={() => setSelectedVideo(videos[0])}
              className="group cursor-pointer bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden hover:border-sky-500/30 transition-all"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={videos[0].thumbnail}
                  alt={videos[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-sky-500/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 rounded text-white text-sm">
                  {videos[0].duration}
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs text-sky-400 mb-2">{videos[0].category}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{videos[0].title}</h3>
                <p className="text-white/60">{videos[0].description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(1).map(video => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="group cursor-pointer bg-white/[0.02] rounded-xl border border-white/10 overflow-hidden hover:border-sky-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-sky-500/80 flex items-center justify-center">
                    <svg className="w-7 h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs">
                  {video.duration}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-xs text-sky-400">{video.category}</div>
                <h4 className="font-semibold text-white group-hover:text-sky-400 transition-colors line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-sm text-white/50 line-clamp-2">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
