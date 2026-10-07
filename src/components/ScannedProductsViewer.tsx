import React, { useState } from 'react';
import { allProducts, getProductStats, getProductsByBrand, getProductsByCategory } from '../data/completeProductsDatabase';

const ScannedProductsViewer: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'Panasonic' | 'TCL'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = getProductStats();

  // Filtra prodotti
  let filteredProducts = allProducts;

  if (filter !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.brand === filter);
  }

  if (categoryFilter !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === categoryFilter);
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const categories = [...new Set(allProducts.map(p => p.category))];

  return (
    <div className="bg-slate-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          📦 Prodotti Scansionati ({filteredProducts.length})
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Totale:</span>
          <span className="text-lg font-bold text-blue-400">{stats.total}</span>
        </div>
      </div>

      {/* Filtri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Filtro Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Brand
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full px-4 py-2 bg-slate-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tutti i Brand ({stats.total})</option>
            <option value="Panasonic">Panasonic ({stats.panasonic})</option>
            <option value="TCL">TCL ({stats.tcl})</option>
          </select>
        </div>

        {/* Filtro Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Categoria
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tutte le Categorie</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat} ({getProductsByCategory(cat).length})
              </option>
            ))}
          </select>
        </div>

        {/* Ricerca */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Cerca
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cerca prodotto..."
            className="w-full px-4 py-2 bg-slate-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-3xl font-bold text-blue-400">{stats.residential}</div>
          <div className="text-sm text-gray-400">Residenziali</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-3xl font-bold text-green-400">{stats.commercial}</div>
          <div className="text-sm text-gray-400">Commerciali</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-3xl font-bold text-yellow-400">€{stats.avgPrice.toFixed(0)}</div>
          <div className="text-sm text-gray-400">Prezzo Medio</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="text-3xl font-bold text-purple-400">{stats.totalStock}</div>
          <div className="text-sm text-gray-400">Stock Totale</div>
        </div>
      </div>

      {/* Lista Prodotti */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white">{product.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    product.brand === 'Panasonic' 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {product.brand}
                  </span>
                </div>
                <p className="text-sm text-gray-400 font-mono">{product.model}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">€{product.price}</div>
                <div className="text-sm text-gray-400">
                  Stock: <span className={product.stock > 20 ? 'text-green-400' : product.stock > 10 ? 'text-yellow-400' : 'text-red-400'}>
                    {product.stock}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-500">Potenza</div>
                <div className="text-sm font-semibold text-white">{product.power} kW</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">BTU</div>
                <div className="text-sm font-semibold text-white">{product.btu}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">SEER</div>
                <div className="text-sm font-semibold text-white">{product.specifications.seer}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">SCOP</div>
                <div className="text-sm font-semibold text-white">{product.specifications.scop}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {product.features.slice(0, 5).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs"
                >
                  {feature}
                </span>
              ))}
              {product.features.length > 5 && (
                <span className="px-2 py-1 bg-slate-700 text-gray-400 rounded text-xs">
                  +{product.features.length - 5}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400">{product.description}</p>

            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Categoria: <span className="text-gray-300">{product.category}</span></span>
                <span>Sottocategoria: <span className="text-gray-300">{product.subcategory}</span></span>
                <span>Tipo: <span className="text-gray-300">{product.type}</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">Nessun prodotto trovato</h3>
          <p className="text-gray-400">Prova a modificare i filtri di ricerca</p>
        </div>
      )}
    </div>
  );
};

export default ScannedProductsViewer;
