import { useLeadStats } from '@/hooks/useLeads';
import { Users, UserPlus, PhoneCall, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  {
    key: 'total' as const,
    label: 'Total Leads',
    icon: Users,
    gradient: 'from-violet-500 to-indigo-500',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    key: 'new' as const,
    label: 'New',
    icon: UserPlus,
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    key: 'contacted' as const,
    label: 'Contacted',
    icon: PhoneCall,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    key: 'converted' as const,
    label: 'Converted',
    icon: TrendingUp,
    gradient: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
];

export function StatsCards() {
  const { data, isLoading } = useLeadStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const value = isLoading ? null : (data?.[stat.key] ?? 0);
        const total = data?.total ?? 0;
        const pct = stat.key !== 'total' && total > 0 ? Math.round(((data?.[stat.key] ?? 0) / total) * 100) : null;

        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07, ease: 'easeOut' }}
            className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-shadow duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                  {isLoading ? '—' : value}
                </p>
                {pct !== null && !isLoading && (
                  <p className="text-xs text-muted-foreground mt-1">{pct}% of total</p>
                )}
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg} transition-transform duration-200 group-hover:scale-110`}>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            {/* Mini progress bar */}
            {pct !== null && !isLoading && (
              <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.07 + 0.3, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
