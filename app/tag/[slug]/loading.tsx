import React from 'react';

export default function TagLoading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      {/* Tag Header Skeleton */}
      <div className="flex flex-col items-center text-center mb-16 space-y-4">
        <div className="h-4 w-24 bg-muted animate-pulse rounded-full" />
        <div className="h-12 w-64 bg-muted animate-pulse rounded-md" />
        <div className="h-6 w-full max-w-md bg-muted animate-pulse rounded-md" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 space-y-4">
            <div className="aspect-video w-full bg-muted animate-pulse rounded-xl" />
            <div className="space-y-3">
              <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
              <div className="h-7 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-md opacity-60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
