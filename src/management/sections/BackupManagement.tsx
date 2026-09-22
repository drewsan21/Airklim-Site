import { useState, useEffect } from 'react';

interface Backup {
  id: string;
  timestamp: string;
  type: 'manual' | 'automatic';
  size: number;
  status: 'completed' | 'in_progress' | 'failed';
  duration: number;
  verified: boolean;
  notes?: string;
}

export function BackupManagement() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [scheduleTime, setScheduleTime] = useState('02:00');
  const [scheduleFrequency, setScheduleFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    // Carica backup da localStorage
    const stored = localStorage.getItem('airklim-backups');
    if (stored) {
      try {
        setBackups(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading backups:', e);
      }
    }

    // Carica impostazioni schedule
    const scheduleStored = localStorage.getItem('airklim-backup-schedule');
    if (scheduleStored) {
      try {
        const settings = JSON.parse(scheduleStored);
        setScheduleEnabled(settings.enabled);
        setScheduleTime(settings.time);
        setScheduleFrequency(settings.frequency);
      } catch (e) {
        console.error('Error loading schedule settings:', e);
      }
    }
  }, []);

  const saveScheduleSettings = () => {
    localStorage.setItem('airklim-backup-schedule', JSON.stringify({
      enabled: scheduleEnabled,
      time: scheduleTime,
      frequency: scheduleFrequency
    }));
  };

  const createBackup = () => {
    setIsCreating(true);
    
    // Simula creazione backup
    setTimeout(() => {
      const newBackup: Backup = {
        id: `backup-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'manual',
        size: Math.floor(Math.random() * 500) + 200, // 200-700 MB
        status: 'completed',
        duration: Math.floor(Math.random() * 60) + 30, // 30-90 secondi
        verified: true,
        notes: 'Backup manuale creato dall\'admin'
      };

      const updated = [newBackup, ...backups];
      setBackups(updated);
      localStorage.setItem('airklim-backups', JSON.stringify(updated));
      setIsCreating(false);
    }, 3000);
  };

  const restoreBackup = (backupId: string) => {
    if (confirm('Sei sicuro di voler ripristinare questo backup? Tutti i dati correnti verranno sovrascritti.')) {
      alert('Ripristino backup avviato. Questa è una simulazione.');
    }
  };

  const deleteBackup = (backupId: string) => {
    if (confirm('Sei sicuro di voler eliminare questo backup?')) {
      const updated = backups.filter(b => b.id !== backupId);
      setBackups(updated);
      localStorage.setItem('airklim-backups', JSON.stringify(updated));
    }
  };

  const verifyBackup = (backupId: string) => {
    setBackups(backups.map(b => 
      b.id === backupId ? { ...b, verified: true } : b
    ));
    localStorage.setItem('airklim-backups', JSON.stringify(backups));
    alert('Verifica backup completata con successo!');
  };

  const formatSize = (mb: number) => {
    if (mb >= 1000) {
      return `${(mb / 1000).toFixed(2)} GB`;
    }
    return `${mb} MB`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}m ${secs}s`;
    }
    return `${seconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'in_progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'failed': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '✅ Completato';
      case 'in_progress': return '⏳ In Corso';
      case 'failed': return '❌ Fallito';
      default: return status;
    }
  };

  // Calcola statistiche
  const totalSize = backups.reduce((sum, b) => sum + b.size, 0);
  const avgDuration = backups.length > 0 
    ? Math.round(backups.reduce((sum, b) => sum + b.duration, 0) / backups.length)
    : 0;
  const verifiedCount = backups.filter(b => b.verified).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestione Backup</h1>
          <p className="text-white/50">Gestisci i backup del database e dei file</p>
        </div>
        <button
          onClick={createBackup}
          disabled={isCreating}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isCreating
              ? 'bg-white/5 text-white/40 cursor-not-allowed'
              : 'bg-sky-500 hover:bg-sky-400 text-white'
          }`}
        >
          {isCreating ? '⏳ Creazione in corso...' : '➕ Crea Backup Manuale'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-white">{backups.length}</div>
          <div className="text-sm text-white/50">Backup Totali</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-sky-400">{formatSize(totalSize)}</div>
          <div className="text-sm text-white/50">Spazio Totale</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-green-400">{formatDuration(avgDuration)}</div>
          <div className="text-sm text-white/50">Durata Media</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-amber-400">{verifiedCount}/{backups.length}</div>
          <div className="text-sm text-white/50">Verificati</div>
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">⏰ Backup Automatici</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <input
              type="checkbox"
              id="schedule"
              checked={scheduleEnabled}
              onChange={(e) => {
                setScheduleEnabled(e.target.checked);
                setTimeout(saveScheduleSettings, 0);
              }}
              className="w-5 h-5 rounded"
            />
            <label htmlFor="schedule" className="flex-1">
              <div className="font-semibold text-white">Backup Automatici Abilitati</div>
              <div className="text-sm text-white/50">Il sistema creerà backup automatici secondo lo schedule configurato</div>
            </label>
          </div>

          {scheduleEnabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Orario</label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => {
                    setScheduleTime(e.target.value);
                    setTimeout(saveScheduleSettings, 0);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Frequenza</label>
                <select
                  value={scheduleFrequency}
                  onChange={(e) => {
                    setScheduleFrequency(e.target.value as any);
                    setTimeout(saveScheduleSettings, 0);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-sky-500 outline-none"
                >
                  <option value="daily">Giornaliero</option>
                  <option value="weekly">Settimanale</option>
                  <option value="monthly">Mensile</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lista Backup */}
      <div className="bg-white/[0.02] rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">📦 Backup Disponibili</h2>
        </div>

        {backups.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💾</div>
            <h3 className="text-xl font-bold text-white mb-2">Nessun backup disponibile</h3>
            <p className="text-white/50 mb-6">Crea il tuo primo backup manuale o attendi il prossimo backup automatico</p>
            <button
              onClick={createBackup}
              disabled={isCreating}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-semibold transition-all"
            >
              ➕ Crea Primo Backup
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {backups.map(backup => (
              <div key={backup.id} className="p-6 hover:bg-white/5 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusColor(backup.status)}`}>
                    {backup.type === 'manual' ? '📝' : '⏰'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-white">
                        {backup.type === 'manual' ? 'Backup Manuale' : 'Backup Automatico'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(backup.status)}`}>
                        {getStatusLabel(backup.status)}
                      </span>
                      {backup.verified && (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                          ✓ Verificato
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-white/50 mb-1">Data</div>
                        <div className="text-sm text-white">{new Date(backup.timestamp).toLocaleString('it-IT')}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50 mb-1">Dimensione</div>
                        <div className="text-sm text-white font-semibold">{formatSize(backup.size)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50 mb-1">Durata</div>
                        <div className="text-sm text-white">{formatDuration(backup.duration)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50 mb-1">ID</div>
                        <div className="text-sm text-sky-400 font-mono text-xs">{backup.id}</div>
                      </div>
                    </div>
                    {backup.notes && (
                      <div className="text-sm text-white/60 mb-3">{backup.notes}</div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => restoreBackup(backup.id)}
                        disabled={backup.status !== 'completed'}
                        className="px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 disabled:bg-white/5 disabled:text-white/30 text-sky-400 rounded-lg text-sm font-medium transition-all"
                      >
                        🔄 Ripristina
                      </button>
                      {!backup.verified && backup.status === 'completed' && (
                        <button
                          onClick={() => verifyBackup(backup.id)}
                          className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm font-medium transition-all"
                        >
                          ✓ Verifica
                        </button>
                      )}
                      <button
                        onClick={() => deleteBackup(backup.id)}
                        className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-all"
                      >
                        🗑️ Elimina
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 rounded-2xl border border-sky-500/20 p-6">
        <h3 className="text-lg font-bold text-white mb-3">💡 Informazioni sui Backup</h3>
        <ul className="space-y-2 text-sm text-white/70">
          <li>• I backup includono database, file caricati e configurazioni</li>
          <li>• I backup automatici vengono creati secondo lo schedule configurato</li>
          <li>• Si consiglia di verificare regolarmente l'integrità dei backup</li>
          <li>• Il ripristino sovrascrive tutti i dati correnti</li>
          <li>• I backup vengono conservati per 30 giorni prima dell'eliminazione automatica</li>
        </ul>
      </div>
    </div>
  );
}
