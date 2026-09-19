import { useState } from 'react';

// ===== GALLERY IMAGE TYPE =====
interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  description?: string;
}

// ===== GALLERY DATA =====
const galleryImages: GalleryImage[] = [
  // Residential Installations
  {
    id: 'res-1',
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
    alt: 'Villa moderna con climatizzazione Panasonic',
    category: 'Residenziale',
    title: 'Villa Moderna - Palermo',
    description: 'Sistema multi-split Panasonic Etherea per villa di 250mq'
  },
  {
    id: 'res-2',
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    alt: 'Appartamento con climatizzatore a parete',
    category: 'Residenziale',
    title: 'Appartamento Signorile - Catania',
    description: 'Installazione Panasonic Etherea XZ in soggiorno'
  },
  {
    id: 'res-3',
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    alt: 'Camera da letto con climatizzatore silenzioso',
    category: 'Residenziale',
    title: 'Camera da Letto - Messina',
    description: 'Panasonic Z25 per massimo silenzio (19dB)'
  },
  {
    id: 'res-4',
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    alt: 'Soggiorno con climatizzatore design',
    category: 'Residenziale',
    title: 'Soggiorno Open Space - Siracusa',
    description: 'Sistema dual split per ambiente open space'
  },

  // Commercial Installations
  {
    id: 'com-1',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    alt: 'Ufficio moderno con climatizzazione VRF',
    category: 'Commerciale',
    title: 'Ufficio Direzionale - Palermo',
    description: 'Sistema VRF ECOi per 500mq di uffici'
  },
  {
    id: 'com-2',
    src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    alt: 'Negozio retail con climatizzazione',
    category: 'Commerciale',
    title: 'Boutique Fashion - Catania',
    description: 'Cassette 600x600 per negozio di abbigliamento'
  },
  {
    id: 'com-3',
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    alt: 'Ristorante con climatizzazione invisibile',
    category: 'Commerciale',
    title: 'Ristorante Gourmet - Taormina',
    description: 'Sistema canalizzato per sala ristorante 120 posti'
  },
  {
    id: 'com-4',
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
    alt: 'Palestra con climatizzazione professionale',
    category: 'Commerciale',
    title: 'Fitness Center - Agrigento',
    description: 'Sistema VRF per palestra di 800mq'
  },

  // Hotel & Hospitality
  {
    id: 'hot-1',
    src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
    alt: 'Camera hotel di lusso con climatizzatore',
    category: 'Hotel',
    title: 'Hotel 5 Stelle - Cefalù',
    description: '40 camere con Panasonic Etherea Z35'
  },
  {
    id: 'hot-2',
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    alt: 'Suite hotel con climatizzazione',
    category: 'Hotel',
    title: 'Resort di Lusso - Mondello',
    description: 'Sistema centralizzato per 80 suite'
  },

  // Heat Pumps
  {
    id: 'hp-1',
    src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
    alt: 'Pompa di calore Panasonic Aquarea installata',
    category: 'Riscaldamento',
    title: 'Villa con Aquarea - Enna',
    description: 'Pompa di calore 12kW per riscaldamento e ACS'
  },
  {
    id: 'hp-2',
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    alt: 'Impianto riscaldamento a pavimento',
    category: 'Riscaldamento',
    title: 'Nuova Costruzione - Ragusa',
    description: 'Aquarea 16kW con impianto radiante a pavimento'
  }
];

// ===== GALLERY SECTION COMPONENT =====
export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const categories = ['all', ...Array.from(new Set(galleryImages.map(img => img.category)))];
  
  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Galleria Lavori</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3">
            Le Nostre Installazioni<br />
            <span className="text-gradient">Progetti Reali in Sicilia</span>
          </h2>
          <p className="text-white/50 mt-6 max-w-2xl mx-auto text-lg">
            Scopri alcuni dei nostri lavori più recenti: residenziale, commerciale, hotel e riscaldamento.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Tutti i Progetti' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(image => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl aspect-[4/3]"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-xs text-sky-400 mb-2">{image.category}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{image.title}</h3>
                  {image.description && (
                    <p className="text-sm text-white/70">{image.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto rounded-2xl"
              />
              <div className="mt-6 text-center">
                <div className="text-sm text-sky-400 mb-2">{selectedImage.category}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-white/60">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/50 mb-4">Vuoi vedere altri progetti o richiedere un preventivo?</p>
          <a
            href="#contatti"
            className="inline-flex items-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/25"
          >
            Richiedi Preventivo Gratuito
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
