import { AdminActivity } from '../../types/admin';

interface RecentActivityProps {
  activities: AdminActivity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: AdminActivity['type']) => {
    switch (type) {
      case 'user_registered':
        return '👤';
      case 'order_created':
        return '📦';
      case 'product_updated':
        return '🏷️';
      case 'backup_completed':
        return '💾';
      case 'login_success':
        return '🔐';
      case 'login_failed':
        return '⚠️';
      default:
        return '📋';
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

  return (
    <div className="bg-white/[0.02] rounded-2xl border border-white/10 p-6">
      <h3 className="text-xl font-bold text-white mb-6">Attività Recente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
            <div className="text-2xl">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.description}</p>
              <p className="text-white/40 text-xs mt-1">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
