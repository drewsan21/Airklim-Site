import { useState, useEffect } from 'react';
import { UserManagementData } from '../../types/admin';

export function UsersManagement() {
  const [users, setUsers] = useState<UserManagementData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserManagementData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Carica utenti da localStorage
    const storedUsers = JSON.parse(localStorage.getItem('airklim-users') || '[]');
    const orders = JSON.parse(localStorage.getItem('airklim-orders') || '[]');
    
    const usersWithData: UserManagementData[] = storedUsers.map((user: any) => {
      const userOrders = orders.filter((o: any) => o.userId === user.id);
      const totalSpent = userOrders.reduce((sum: number, o: any) => sum + o.total, 0);
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role,
        phone: user.phone,
        company: user.company,
        vatNumber: user.vatNumber,
        verified: user.verified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        totalOrders: userOrders.length,
        totalSpent,
        status: user.verified ? 'active' : 'pending'
      };
    });
    
    setUsers(usersWithData);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSuspendUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleExportUsers = () => {
    const csv = [
      ['Nome', 'Cognome', 'Email', 'Ruolo', 'Telefono', 'Azienda', 'Ordini', 'Spesa Totale', 'Stato', 'Data Registrazione'].join(','),
      ...filteredUsers.map(u => [
        u.name,
        u.surname,
        u.email,
        u.role,
        u.phone || '',
        u.company || '',
        u.totalOrders,
        u.totalSpent,
        u.status,
        new Date(u.createdAt).toLocaleDateString('it-IT')
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utenti_airklim_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestione Utenti</h1>
          <p className="text-white/50">Visualizza e gestisci tutti gli utenti della piattaforma</p>
        </div>
        <button
          onClick={handleExportUsers}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
        >
          📥 Esporta CSV
        </button>
      </div>

      {/* Filtri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="🔍 Cerca per nome, cognome o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
        >
          <option value="all">Tutti i ruoli</option>
          <option value="admin">Admin</option>
          <option value="professionista">Professionista</option>
          <option value="privato">Privato</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
        >
          <option value="all">Tutti gli stati</option>
          <option value="active">Attivo</option>
          <option value="suspended">Sospeso</option>
          <option value="pending">In attesa</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{users.length}</div>
          <div className="text-sm text-white/50">Utenti Totali</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{users.filter(u => u.status === 'active').length}</div>
          <div className="text-sm text-white/50">Attivi</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-amber-400">{users.filter(u => u.role === 'professionista').length}</div>
          <div className="text-sm text-white/50">Professionisti</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-sky-400">€{users.reduce((sum, u) => sum + u.totalSpent, 0).toLocaleString()}</div>
          <div className="text-sm text-white/50">Fatturato Totale</div>
        </div>
      </div>

      {/* Tabella Utenti */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Utente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Ruolo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Ordini</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Spesa</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Stato</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white/70">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.name[0]}{user.surname[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.name} {user.surname}</div>
                        <div className="text-sm text-white/50">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      user.role === 'professionista' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">{user.totalOrders}</td>
                  <td className="px-6 py-4 text-white font-semibold">€{user.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      user.status === 'suspended' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {user.status === 'active' ? 'Attivo' : user.status === 'suspended' ? 'Sospeso' : 'In attesa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedUser(user); setShowModal(true); }}
                        className="px-3 py-1 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-lg text-xs font-medium transition-all"
                      >
                        👁️ Dettagli
                      </button>
                      <button
                        onClick={() => handleSuspendUser(user.id)}
                        className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium transition-all"
                      >
                        {user.status === 'active' ? '⏸️ Sospendi' : '▶️ Attiva'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-all"
                      >
                        🗑️ Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dettagli Utente */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Dettagli Utente</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedUser.name[0]}{selectedUser.surname[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedUser.name} {selectedUser.surname}</h3>
                  <p className="text-white/50">{selectedUser.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    selectedUser.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    selectedUser.role === 'professionista' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Telefono</div>
                  <div className="text-white font-semibold">{selectedUser.phone || 'Non fornito'}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Azienda</div>
                  <div className="text-white font-semibold">{selectedUser.company || 'N/A'}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">P.IVA</div>
                  <div className="text-white font-semibold">{selectedUser.vatNumber || 'N/A'}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Data Registrazione</div>
                  <div className="text-white font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString('it-IT')}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Ordini Totali</div>
                  <div className="text-2xl font-bold text-white">{selectedUser.totalOrders}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Spesa Totale</div>
                  <div className="text-2xl font-bold text-green-400">€{selectedUser.totalSpent.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleSuspendUser(selectedUser.id);
                    setShowModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold transition-all"
                >
                  {selectedUser.status === 'active' ? '⏸️ Sospendi Utente' : '▶️ Riattiva Utente'}
                </button>
                <button
                  onClick={() => {
                    handleDeleteUser(selectedUser.id);
                    setShowModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-400 text-white rounded-xl font-semibold transition-all"
                >
                  🗑️ Elimina Utente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
