'use client';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: 'indigo' | 'orange' | 'green' | 'red' | 'purple';
}

const colorMap = {
  indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
  orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-400',
  green:  'from-green-500/20 to-green-500/5 border-green-500/20 text-green-400',
  red:    'from-red-500/20 to-red-500/5 border-red-500/20 text-red-400',
  purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
};

export function StatCard({ title, value, icon, color = 'indigo' }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${colors} animate-fadeInUp`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
        <span className={`${colors.split(' ').find(c => c.startsWith('text-'))}`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
    </div>
  );
}
