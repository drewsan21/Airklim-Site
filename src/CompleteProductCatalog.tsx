import { useState } from 'react';
import { getAllProducts, getProductsByCategory, getProductsByBrand, getProductStats } from './data/completeProducts2026';
import { useCart } from './hooks';

// ===== COMPLETE PRODUCT CATALOG SECTION =====
export function CompleteProductCatalog() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'residential' | 'commercial' | 'tcl'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const handleAddToCart = (product: any) => {
    addItem({ productId: product.id, name: product.name, brand: product.brand, price: product.price, image: product.image });
    setJustAdded(product.id);
    setTimeout(() => setJustAdded(null), 1500);
  };
  
  const allProducts = getAllProducts();
  const stats = getProductStats();
  
  // Filtra prodotti in base al filtro attivo
  const filteredProducts = allProducts.filter(product => {
    if (activeFilter === 'residential') {
      return ['Etherea', 'TZ', 'Console'].includes(product.category);
    } else if (activeFilter === 'commercial') {
      return product.category === 'PACi NX';
    } else if (activeFilter === 'tcl') {
      return product.brand === 'TCL';
    }
    return true;
  });
  
  // Filtra per categoria se selezionata
  const finalProducts = selectedCategory === 'all' 
    ? filteredProducts 
    : filteredProducts.filter(p => p.category === selectedCategory || p.subcategory === selectedCategory);
  
  // Ottieni categorie disponibili
  const categories = Array.from(new Set(filteredProducts.map(p => p.category)));
  
  return (
    <section id="catalogo-completo" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Catalogo Completo 2026
          </h2>
          <p className="text-white/60 text-lg mb-6">
            {stats.total} prodotti Panasonic e TCL con specifiche tecniche complete
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-sky-400">{stats.total}</div>
              <div className="text-sm text-white/60">Prodotti Totali</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-sky-400">{stats.byBrand.panasonic}</div>
              <div className="text-sm text-white/60">Panasonic</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-sky-400">{stats.byBrand.tcl}</div>
              <div className="text-sm text-white/60">TCL</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-sky-400">€{stats.priceRange.min} - €{stats.priceRange.max}</div>
              <div className="text-sm text-white/60">Range Prezzi</div>
            </div>
          </div>
        </div>
        
        {/* Filtri */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => { setActiveFilter('all'); setSelectedCategory('all'); }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-sky-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Tutti ({stats.total})
          </button>
          <button
            onClick={() => { setActiveFilter('residential'); setSelectedCategory('all'); }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeFilter === 'residential'
                ? 'bg-sky-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Residenziale ({stats.byCategory.etherea + stats.byCategory.tz + stats.byCategory.console})
          </button>
          <button
            onClick={() => { setActiveFilter('commercial'); setSelectedCategory('all'); }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeFilter === 'commercial'
                ? 'bg-sky-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Commerciale ({stats.byCategory.paciNX})
          </button>
          <button
            onClick={() => { setActiveFilter('tcl'); setSelectedCategory('all'); }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeFilter === 'tcl'
                ? 'bg-sky-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            TCL ({stats.byBrand.tcl})
          </button>
        </div>
        
        {/* Filtri per categoria */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Tutte le categorie
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
        
        {/* Griglia Prodotti */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {finalProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-sky-500/30 transition-all group"
            >
              {/* Immagine */}
              <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231e293b" width="400" height="300"/%3E%3Ctext fill="%2364748b" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle"%3EImmagine Prodotto%3C/text%3E%3C/svg%3E';
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-sky-500/90 text-white text-xs font-semibold rounded-full">
                    {product.brand}
                  </span>
                </div>
              </div>
              
              {/* Contenuto */}
              <div className="p-5">
                <div className="mb-2">
                  <span className="text-xs text-white/40 uppercase tracking-wider">
                    {product.category} {product.subcategory && `• ${product.subcategory}`}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Specifiche principali */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="text-xs text-white/40">Potenza</div>
                    <div className="text-sm font-semibold text-white">{product.power} kW</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="text-xs text-white/40">SEER</div>
                    <div className="text-sm font-semibold text-white">{(product.specifications as any).seer || 'N/A'}</div>
                  </div>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.features.slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-sky-500/10 text-sky-400 rounded-full border border-sky-500/20"
                    >
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-white/5 text-white/40 rounded-full">
                      +{product.features.length - 3}
                    </span>
                  )}
                </div>
                
                {/* Prezzo e stock */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <div className="text-2xl font-bold text-sky-400">€{product.price.toLocaleString()}</div>
                    <div className="text-xs text-white/40">IVA esclusa</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold ${
                      product.stock > 20 ? 'text-green-400' :
                      product.stock > 10 ? 'text-amber-400' :
                      'text-red-400'
                    }`}>
                      {product.stock} disponibili
                    </div>
                    <div className="text-xs text-white/40">{product.model}</div>
                  </div>
                </div>

                {/* Aggiungi al carrello */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`mt-4 w-full py-3 rounded-xl font-semibold transition-all ${
                    justAdded === product.id
                      ? 'bg-green-500 text-white'
                      : 'bg-sky-500 hover:bg-sky-400 text-white hover:shadow-lg hover:shadow-sky-500/25'
                  }`}
                >
                  {justAdded === product.id ? '✓ Aggiunto al carrello!' : '🛒 Aggiungi al carrello'}
                </button>
                <p className="text-[11px] text-white/30 mt-2 text-center">
                  Clienti privati: installatore certificato collegato automaticamente in base alla tua zona.
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-12 bg-gradient-to-r from-sky-500/10 to-blue-600/10 rounded-2xl border border-sky-500/20 p-8">
          <h3 className="text-2xl font-bold text-white mb-4">Riepilogo Catalogo</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-sky-400 mb-1">{stats.byCategory.etherea}</div>
              <div className="text-sm text-white/60">Etherea</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-400 mb-1">{stats.byCategory.tz}</div>
              <div className="text-sm text-white/60">TZ Super-Compatta</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-400 mb-1">{stats.byCategory.console}</div>
              <div className="text-sm text-white/60">Console</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sky-400 mb-1">{stats.byCategory.paciNX}</div>
              <div className="text-sm text-white/60">PACi NX Commerciale</div>
            </div>
          </div>
        </div>
        
        {/* Nota importante */}
        <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h4 className="font-bold text-amber-400 mb-2">Nota Importante</h4>
              <p className="text-sm text-white/70">
                Le immagini mostrate sono rappresentazioni AI realistiche dei prodotti. Per le immagini ufficiali 
                Panasonic 2026, contattare <strong>marketing@eu.panasonic.com</strong> o registrarsi al portale 
                <strong> PRO Partner</strong> su <a href="https://panasonicproclub.com" className="text-sky-400 hover:underline" target="_blank" rel="noopener noreferrer">panasonicproclub.com</a>.
                <br /><br />
                I prezzi e la disponibilità dello stock sono indicativi e devono essere confermati con il listino ufficiale Panasonic 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
