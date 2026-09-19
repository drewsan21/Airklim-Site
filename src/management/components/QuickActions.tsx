export function QuickActions() {
  const actions = [
    {
      icon: '👥',
      label: 'Gestisci Utenti',
      description: 'Visualizza e gestisci tutti gli utenti',
      color: 'sky'
    },
    {
      icon: '📦',
      label: 'Gestisci Ordini',
      description: 'Visualizza e aggiorna ordini',
      color: 'green'
    },
    {
      icon: '🏷️',
      label: 'Gestisci Prodotti',
      description: 'Aggiungi o modifica prodotti',
      color: 'amber'
    },
    {
      icon: '📊',
      label: 'Visualizza Analytics',
      description: 'Statistiche e report',
      color: 'red'
    }
  ];

  const colorClasses = {
    sky: 'hover:border-sky-500/30 hover:bg-sky-500/5',
    green: 'hover:border-green-500/30 hover:bg-green-500/5',
    amber: 'hover:border-amber-500/30 hover:bg-amber-500/5',
    red: 'hover:border-red-500/30 hover:bg-red-500/5'
  };

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Azioni Rapide</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, i) => (
          <button
            key={i}
            className={`p-4 rounded-xl bg-white/5 border border-white/5 ${colorClasses[action.color as keyof typeof colorClasses]} transition-all text-left`}
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="text-white font-semibold text-sm mb-1">{action.label}</div>
            <div className="text-white/40 text-xs">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
