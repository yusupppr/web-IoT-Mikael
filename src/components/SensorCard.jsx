import React from 'react';

export function SensorCard({ label, value, unit, icon: Icon, status, lastUpdated }) {
  const isStale = status === 'stale';
  const hasNoData = status === 'no-data';

  const displayValue = hasNoData ? '—' : `${value}${unit ? `${unit}` : ''}`;

  return (
    <div className={`
      bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl 
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
      ${isStale ? 'opacity-50 grayscale' : 'opacity-100'}
      flex flex-col gap-6 relative overflow-hidden group cursor-pointer
    `}>
      {/* Subtle background glow effect */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500"></div>

      <div className="flex items-center justify-between text-muted-foreground z-10">
        <h3 className="font-medium text-sm uppercase tracking-wider">{label}</h3>
        <div className="p-2 bg-primary/50 rounded-lg text-accent">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      <div className="flex-1 flex items-end z-10">
        <span className={`text-5xl font-bold tracking-tight ${isStale ? 'text-muted-foreground' : 'text-foreground'}`}>
          {displayValue}
        </span>
      </div>

      <div className="text-xs text-muted-foreground flex justify-between items-center z-10 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${hasNoData ? 'bg-muted' : isStale ? 'bg-yellow-500' : 'bg-accent'}`}></span>
          <span>{hasNoData ? 'Waiting for data' : isStale ? 'Stale' : 'Live'}</span>
        </div>
        {lastUpdated && !hasNoData && (
          <span className="opacity-70 font-mono">
            {new Intl.DateTimeFormat('id-ID', {
              hour: '2-digit', minute: '2-digit', second: '2-digit'
            }).format(lastUpdated)}
          </span>
        )}
      </div>
    </div>
  );
}
