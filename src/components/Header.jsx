import React from 'react';
import { ConnectionStatus } from './ConnectionStatus';
import { Activity } from 'lucide-react';

export function Header({ status }) {
  return (
    <header className="relative z-20 max-w-6xl w-full mx-auto px-4">
      <div className="bg-card/40 backdrop-blur-md border border-white/10 shadow-lg rounded-2xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/20 rounded-xl text-accent">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Smart Room Dashboard</h1>
        </div>
        <ConnectionStatus status={status} />
      </div>
    </header>
  );
}
