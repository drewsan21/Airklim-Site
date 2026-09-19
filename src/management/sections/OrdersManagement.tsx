import { useState, useEffect } from 'react';
import { OrderManagementData } from '../../types/admin';

export function OrdersManagement() {
  const [orders, setOrders] = useState<OrderManagementData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderManagementData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('airklim-orders') || '[]');
    const users = JSON.parse(localStorage.getItem('airklim-users') || '[]');
    
    const ordersWithUser: OrderManagementData[] = storedOrders.map((order: any) => {
      const user = users.find((u: any) => u.id === order.userId);
      return {
        ...order,
        userEmail: user?.email || 'N/A'
      };
    });
    
    setOrders(ordersWithUser);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filterDate === 'today' && diffDays > 0) matchesDate = false;
      if (filterDate === 'week' && diffDays > 7) matchesDate = false;
      if (filterDate === 'month' && diffDays > 30) matchesDate = false;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderManagementData['status']) => {
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: newStatus } : o
    ));
  };

  const handleExportOrders = () => {
    const csv = [
      ['ID Ordine', 'Email Utente', 'Totale', 'Stato', 'Data', 'Indirizzo Spedizione'].join(','),
      ...filteredOrders.map(o => [
        o.id,
        o.userEmail,
        o.total,
        o.status,
        new Date(o.createdAt).toLocaleDateString('it-IT'),
        o.shippingAddress
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ordini_airklim_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'processing': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'shipped': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'delivered': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'In Attesa',
      confirmed: 'Confermato',
      processing: 'In Lavorazione',
      shipped: 'Spedito',
      delivered: 'Consegnato',
      cancelled: 'Annullato'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestione Ordini</h1>
          <p className="text-white/50">Visualizza e gestisci tutti gli ordini</p>
        </div>
        <button
          onClick={handleExportOrders}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
        >
          📥 Esporta CSV
        </button>
      </div>

      {/* Filtri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Cerca per ID ordine o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
        >
          <option value="all">Tutti gli stati</option>
          <option value="pending">In Attesa</option>
          <option value="confirmed">Confermato</option>
          <option value="processing">In Lavorazione</option>
          <option value="shipped">Spedito</option>
          <option value="delivered">Consegnato</option>
          <option value="cancelled">Annullato</option>
        </select>
        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
        >
          <option value="all">Tutte le date</option>
          <option value="today">Oggi</option>
          <option value="week">Ultima settimana</option>
          <option value="month">Ultimo mese</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{orders.length}</div>
          <div className="text-sm text-white/50">Ordini Totali</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-amber-400">{orders.filter(o => o.status === 'pending').length}</div>
          <div className="text-sm text-white/50">In Attesa</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">€{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</div>
          <div className="text-sm text-white/50">Fatturato Totale</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-sky-400">€{orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : '0'}</div>
          <div className="text-sm text-white/50">Valore Medio</div>
        </div>
      </div>

      {/* Tabella Ordini */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">ID Ordine</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Utente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Totale</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Stato</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Data</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-sm text-white">{order.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">{order.userEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">€{order.total.toLocaleString()}</div>
                    <div className="text-xs text-white/40">{order.items.length} articoli</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white text-sm">{new Date(order.createdAt).toLocaleDateString('it-IT')}</div>
                    <div className="text-xs text-white/40">{new Date(order.createdAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                        className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-xs font-medium transition-all"
                      >
                        👁️ Dettagli
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                          className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs font-medium transition-all"
                        >
                          ✓ Conferma
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'processing')}
                          className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium transition-all"
                        >
                          ⚙️ Lavora
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'shipped')}
                          className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-xs font-medium transition-all"
                        >
                          📦 Spedisci
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dettagli Ordine */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Dettagli Ordine</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">ID Ordine</div>
                  <div className="text-white font-mono font-semibold">{selectedOrder.id}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Email Utente</div>
                  <div className="text-white font-semibold">{selectedOrder.userEmail}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Data Ordine</div>
                  <div className="text-white font-semibold">{new Date(selectedOrder.createdAt).toLocaleString('it-IT')}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Stato</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-white/50 mb-2">Indirizzo Spedizione</div>
                <div className="text-white">{selectedOrder.shippingAddress}</div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Articoli Ordine</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <div className="text-white font-semibold">{item.name}</div>
                        <div className="text-sm text-white/50">Quantità: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">€{(item.price * item.quantity).toLocaleString()}</div>
                        <div className="text-xs text-white/40">€{item.price} cad.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-white">Totale Ordine</div>
                  <div className="text-3xl font-bold text-green-400">€{selectedOrder.total.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'confirmed');
                      setShowModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-semibold transition-all"
                  >
                    ✓ Conferma Ordine
                  </button>
                )}
                {selectedOrder.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'processing');
                      setShowModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-xl font-semibold transition-all"
                  >
                    ⚙️ Inizia Lavorazione
                  </button>
                )}
                {selectedOrder.status === 'processing' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'shipped');
                      setShowModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
                  >
                    📦 Segna come Spedito
                  </button>
                )}
                {selectedOrder.status === 'shipped' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'delivered');
                      setShowModal(false);
                    }}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-semibold transition-all"
                  >
                    ✓ Segna come Consegnato
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
