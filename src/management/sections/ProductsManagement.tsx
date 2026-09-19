import { useState, useEffect } from 'react';
import { ProductManagementData } from '../../types/admin';

export function ProductsManagement() {
  const [products, setProducts] = useState<ProductManagementData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductManagementData | null>(null);

  useEffect(() => {
    // Carica prodotti da localStorage o usa dati di default
    const storedProducts = JSON.parse(localStorage.getItem('airklim-products') || '[]');
    
    if (storedProducts.length === 0) {
      // Dati di esempio
      const defaultProducts: ProductManagementData[] = [
        {
          id: 'prod-001',
          name: 'Panasonic Etherea Z35',
          brand: 'Panasonic',
          category: 'Climatizzatori',
          price: 1190,
          stock: 30,
          status: 'active',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-15T00:00:00.000Z'
        },
        {
          id: 'prod-002',
          name: 'TCL BreezeIN 12000',
          brand: 'TCL',
          category: 'Climatizzatori',
          price: 590,
          stock: 45,
          status: 'active',
          createdAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-15T00:00:00.000Z'
        },
        {
          id: 'prod-003',
          name: 'Panasonic Aquarea 9kW',
          brand: 'Panasonic',
          category: 'Pompe di Calore',
          price: 4990,
          stock: 8,
          status: 'active',
          createdAt: '2026-01-03T00:00:00.000Z',
          updatedAt: '2026-01-15T00:00:00.000Z'
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('airklim-products', JSON.stringify(defaultProducts));
    } else {
      setProducts(storedProducts);
    }
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = filterBrand === 'all' || product.brand === filterBrand;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const brands = Array.from(new Set(products.map(p => p.brand)));

  const handleAddProduct = (product: Omit<ProductManagementData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: ProductManagementData = {
      ...product,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts([...products, newProduct]);
    localStorage.setItem('airklim-products', JSON.stringify([...products, newProduct]));
    setShowAddModal(false);
  };

  const handleUpdateProduct = (productId: string, updates: Partial<ProductManagementData>) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
    localStorage.setItem('airklim-products', JSON.stringify(products));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      setProducts(products.filter(p => p.id !== productId));
      localStorage.setItem('airklim-products', JSON.stringify(products.filter(p => p.id !== productId)));
    }
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    const status = newStock === 0 ? 'out_of_stock' : 'active';
    handleUpdateProduct(productId, { stock: newStock, status });
  };

  const handleExportProducts = () => {
    const csv = [
      ['ID', 'Nome', 'Brand', 'Categoria', 'Prezzo', 'Stock', 'Stato', 'Data Creazione'].join(','),
      ...filteredProducts.map(p => [
        p.id,
        p.name,
        p.brand,
        p.category,
        p.price,
        p.stock,
        p.status,
        new Date(p.createdAt).toLocaleDateString('it-IT')
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prodotti_airklim_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestione Prodotti</h1>
          <p className="text-white/50">Aggiungi, modifica o elimina prodotti dal catalogo</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportProducts}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
          >
            📥 Esporta CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
          >
            ➕ Aggiungi Prodotto
          </button>
        </div>
      </div>

      {/* Filtri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Cerca per nome o brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
        />
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
        >
          <option value="all">Tutti i brand</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
        >
          <option value="all">Tutti gli stati</option>
          <option value="active">Attivo</option>
          <option value="inactive">Inattivo</option>
          <option value="out_of_stock">Esaurito</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{products.length}</div>
          <div className="text-sm text-white/50">Prodotti Totali</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{products.filter(p => p.status === 'active').length}</div>
          <div className="text-sm text-white/50">Attivi</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-red-400">{products.filter(p => p.stock === 0).length}</div>
          <div className="text-sm text-white/50">Esauriti</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-amber-400">{products.filter(p => p.stock > 0 && p.stock < 10).length}</div>
          <div className="text-sm text-white/50">Stock Basso</div>
        </div>
      </div>

      {/* Griglia Prodotti */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white/[0.02] rounded-2xl border border-white/10 p-6 hover:border-sky-500/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-white/50">{product.brand} • {product.category}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                product.status === 'inactive' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {product.status === 'active' ? 'Attivo' : product.status === 'inactive' ? 'Inattivo' : 'Esaurito'}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Prezzo</span>
                <span className="text-xl font-bold text-sky-400">€{product.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Stock</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 1))}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
                  >
                    -
                  </button>
                  <span className="text-white font-semibold w-8 text-center">{product.stock}</span>
                  <button
                    onClick={() => handleUpdateStock(product.id, product.stock + 1)}
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingProduct(product)}
                className="flex-1 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-sm font-medium transition-all"
              >
                ✏️ Modifica
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-all"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Aggiungi/Modifica Prodotto */}
      {(showAddModal || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          onSave={(product) => {
            if (editingProduct) {
              handleUpdateProduct(editingProduct.id, product);
            } else {
              handleAddProduct(product as any);
            }
          }}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

// Componente Form Modal
function ProductFormModal({ product, onSave, onClose }: {
  product: ProductManagementData | null;
  onSave: (product: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    category: product?.category || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    status: product?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {product ? 'Modifica Prodotto' : 'Aggiungi Prodotto'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Nome Prodotto</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              placeholder="Es: Panasonic Etherea Z35"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Brand</label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              placeholder="Es: Panasonic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Categoria</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              placeholder="Es: Climatizzatori"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Prezzo (€)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Stock</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Stato</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
            >
              <option value="active">Attivo</option>
              <option value="inactive">Inattivo</option>
              <option value="out_of_stock">Esaurito</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
            >
              {product ? 'Salva Modifiche' : 'Aggiungi Prodotto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
