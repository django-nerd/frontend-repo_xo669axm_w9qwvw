import React from 'react';
import { Mic, Volume2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full px-6 py-4 border-b border-neutral-200/60 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600 text-white grid place-items-center shadow-lg shadow-purple-600/30">
            <Mic size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Talking Cat</h1>
            <p className="text-xs text-neutral-500">Say something — the cat repeats it with a funny voice</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-neutral-500">
          <Volume2 size={18} />
          <span className="text-sm">Interactive audio demo</span>
        </div>
      </div>
    </header>
  );
}
