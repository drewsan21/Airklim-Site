interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'sky' | 'green' | 'amber' | 'red';
}

export function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  const colorClasses = {
    sky: 'from-sky-500/10 to-blue-600/10 border-sky-500/20',
    green: 'from-green-500/10 to-emerald-600/10 border-green-500/20',
    amber: 'from-amber-500/10 to-orange-600/10 border-amber-500/20',
    red: 'from-red-500/10 to-pink-600/10 border-red-500/20'
  };

  const textColorClasses = {
    sky: 'text-sky-400',
    green: 'text-green-400',
    amber: 'text-amber-400',
    red: 'text-red-400'
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} border`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${textColorClasses[color]} bg-white/5 flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-sm font-semibold ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/50">{title}</div>
    </div>
  );
}
