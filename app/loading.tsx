import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Logo/Brand Animation */}
        <div className="relative">
          <div className="font-serif text-3xl font-black tracking-tighter animate-pulse">
            MONOCHROME
          </div>
          <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-foreground scale-x-0 animate-expand-width origin-left" />
        </div>

        {/* Progress indicator */}
        <div className="w-48 h-[2px] bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-foreground animate-progress-loading" />
        </div>

        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground animate-in fade-in slide-in-from-bottom-2 duration-1000">
          Fast updates across world news
        </p>
      </div>
    </div>
  );
}
