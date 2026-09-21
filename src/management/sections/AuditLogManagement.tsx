import { useState, useEffect } from 'react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export function AuditLogManagement() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Genera log di esempio
    const sampleLogs: AuditLog[] = [
      {
        id: 'log-001',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user: 'Mario Rossi',
        userEmail: 'admin@example.com',
        action: 'login',
        resource: 'authentication',
        details: 'Login amministratore effettuato con successo',
        ipAddress: '192.168.1.100',
        severity: 'info'
      },
      {
        id: 'log-002',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        user: 'Luigi Bianchi',
        userEmail: 'professionist@example.com',
        action: 'create',
        resource: 'order',
        resourceId: 'ORD-2026-001234',
        details: 'Nuovo ordine creato per €1,250.00',
        ipAddress: '192.168.1.101',
        severity: 'info'
      },
      {
        id: 'log-003',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        user: 'Mario Rossi',
        userEmail: 'admin@example.com',
        action: 'update',
        resource: 'product',
        resourceId: 'prod-001',
        details: 'Prezzo prodotto aggiornato da €1,100.00 a €1,190.00',
        ipAddress: '192.168.1.100',
        severity: 'warning'
      },
      {
        id: 'log-004',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        user: 'Sistema',
        userEmail: 'system@airklim.it',
        action: 'backup',
        resource: 'database',
        details: 'Backup automatico completato con successo (245 MB)',
        ipAddress: '127.0.0.1',
        severity: 'info'
      },
      {
        id: 'log-005',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        user: 'Giuseppe Verdi',
        userEmail: 'user@example.com',
        action: 'login_failed',
        resource: 'authentication',
        details: 'Tentativo di login fallito - Password errata',
        ipAddress: '192.168.1.102',
        severity: 'warning'
      },
      {
        id: 'log-006',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        user: 'Mario Rossi',
        userEmail: 'admin@example.com',
        action: 'delete',
        resource: 'user',
        resourceId: 'user-045',
        details: 'Utente eliminato: test@example.com',
        ipAddress: '192.168.1.100',
        severity: 'error'
      },
      {
        id: 'log-007',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        user: 'Sistema',
        userEmail: 'system@airklim.it',
        action: 'security',
        resource: 'firewall',
        details: 'Tentativo di accesso bloccato da IP sospetto: 45.33.32.156',
        ipAddress: '45.33.32.156',
        severity: 'critical'
      },
      {
        id: 'log-008',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        user: 'Luigi Bianchi',
        userEmail: 'professionist@example.com',
        action: 'export',
        resource: 'orders',
        details: 'Esportazione ordini CSV (156 record)',
        ipAddress: '192.168.1.101',
        severity: 'info'
      }
    ];

    const stored = localStorage.getItem('airklim-audit-logs');
    if (stored) {
      try {
        setLogs(JSON.parse(stored));
      } catch (e) {
        setLogs(sampleLogs);
        localStorage.setItem('airklim-audit-logs', JSON.stringify(sampleLogs));
      }
    } else {
      setLogs(sampleLogs);
      localStorage.setItem('airklim-audit-logs', JSON.stringify(sampleLogs));
    }
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resourceId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const diffHours = (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);
      
      if (filterDate === 'today' && diffHours > 24) matchesDate = false;
      if (filterDate === 'week' && diffHours > 168) matchesDate = false;
      if (filterDate === 'month' && diffHours > 720) matchesDate = false;
    }
    
    return matchesSearch && matchesAction && matchesSeverity && matchesDate;
  });

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      login: '🔐 Login',
      login_failed: '⚠️ Login Fallito',
      logout: '🚪 Logout',
      create: '➕ Crea',
      update: '✏️ Modifica',
      delete: '🗑️ Elimina',
      export: '📥 Esporta',
      backup: '💾 Backup',
      security: '🛡️ Sicurezza'
    };
    return labels[action] || action;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'error': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'critical': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diff < 60) return 'Pochi secondi fa';
    if (diff < 3600) return `${Math.floor(diff / 60)} minuti fa`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
    return `${Math.floor(diff / 86400)} giorni fa`;
  };

  const handleExportLogs = () => {
    const csv = [
      ['Timestamp', 'Utente', 'Email', 'Azione', 'Risorsa', 'ID Risorsa', 'Dettagli', 'IP', 'Severità'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString('it-IT'),
        log.user,
        log.userEmail,
        log.action,
        log.resource,
        log.resourceId || '',
        log.details,
        log.ipAddress,
        log.severity
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleClearLogs = () => {
    if (confirm('Sei sicuro di voler eliminare tutti i log? Questa azione non può essere annullata.')) {
      setLogs([]);
      localStorage.removeItem('airklim-audit-logs');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Audit Log</h1>
          <p className="text-white/50">Log di tutte le attività del sistema</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportLogs}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
          >
            📥 Esporta CSV
          </button>
          <button
            onClick={handleClearLogs}
            className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-semibold transition-all border border-red-500/20"
          >
            🗑️ Pulisci Log
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{logs.length}</div>
          <div className="text-sm text-white/50">Log Totali</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-sky-400">{logs.filter(l => l.severity === 'info').length}</div>
          <div className="text-sm text-white/50">Info</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-amber-400">{logs.filter(l => l.severity === 'warning').length}</div>
          <div className="text-sm text-white/50">Warning</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-red-400">{logs.filter(l => l.severity === 'error' || l.severity === 'critical').length}</div>
          <div className="text-sm text-white/50">Errori</div>
        </div>
      </div>

      {/* Filtri */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="🔍 Cerca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-sky-500 outline-none"
        />
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
        >
          <option value="all">Tutte le azioni</option>
          <option value="login">Login</option>
          <option value="login_failed">Login Fallito</option>
          <option value="create">Crea</option>
          <option value="update">Modifica</option>
          <option value="delete">Elimina</option>
          <option value="export">Esporta</option>
          <option value="backup">Backup</option>
          <option value="security">Sicurezza</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
        >
          <option value="all">Tutte le severità</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
          <option value="critical">Critical</option>
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

      {/* Lista Log */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">Nessun log trovato</h3>
            <p className="text-white/50">Prova a modificare i filtri di ricerca</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                onClick={() => { setSelectedLog(log); setShowModal(true); }}
                className="p-4 hover:bg-white/5 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(log.severity)}`}>
                    {log.severity === 'info' && 'ℹ️'}
                    {log.severity === 'warning' && '⚠️'}
                    {log.severity === 'error' && '❌'}
                    {log.severity === 'critical' && '🚨'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{getActionLabel(log.action)}</span>
                      <span className="text-sm text-white/50">•</span>
                      <span className="text-sm text-white/70">{log.resource}</span>
                      {log.resourceId && (
                        <>
                          <span className="text-sm text-white/50">•</span>
                          <span className="text-sm text-sky-400 font-mono">{log.resourceId}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-white/60 mb-2">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span>{log.user} ({log.userEmail})</span>
                      <span>•</span>
                      <span className="font-mono">{log.ipAddress}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dettagli Log */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Dettagli Log</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Timestamp</div>
                  <div className="text-white font-semibold">{new Date(selectedLog.timestamp).toLocaleString('it-IT')}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Severità</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(selectedLog.severity)}`}>
                    {selectedLog.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-white/50 mb-1">Utente</div>
                <div className="text-white font-semibold">{selectedLog.user}</div>
                <div className="text-sm text-white/60">{selectedLog.userEmail}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Azione</div>
                  <div className="text-white font-semibold">{getActionLabel(selectedLog.action)}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-white/50 mb-1">Risorsa</div>
                  <div className="text-white font-semibold">{selectedLog.resource}</div>
                  {selectedLog.resourceId && (
                    <div className="text-sm text-sky-400 font-mono mt-1">{selectedLog.resourceId}</div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-white/50 mb-1">Dettagli</div>
                <div className="text-white">{selectedLog.details}</div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-sm text-white/50 mb-1">Indirizzo IP</div>
                <div className="text-white font-mono">{selectedLog.ipAddress}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
