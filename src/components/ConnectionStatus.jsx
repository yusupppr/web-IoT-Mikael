import React from 'react';

export function ConnectionStatus({ status }) {
  let colorClass = '';
  let label = '';
  let pulse = false;

  switch (status) {
    case 'connected':
      colorClass = 'bg-accent';
      label = 'Connected';
      break;
    case 'reconnecting':
      colorClass = 'bg-yellow-500';
      label = 'Reconnecting...';
      pulse = true;
      break;
    case 'connecting':
      colorClass = 'bg-yellow-500';
      label = 'Connecting...';
      pulse = true;
      break;
    case 'error':
    case 'offline':
    default:
      colorClass = 'bg-destructive';
      label = 'Disconnected';
      break;
  }

  return (
    <div className="flex items-center gap-2 bg-primary/50 border border-white/5 px-3 py-1.5 rounded-full shadow-inner text-foreground text-xs font-semibold uppercase tracking-wider">
      <div className="relative flex h-2 w-2">
        {pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorClass}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${colorClass}`}></span>
      </div>
      <span>{label}</span>
    </div>
  );
}
