import React from 'react';

export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="mb-12 space-y-4">
        <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
        <div className="h-4 w-full max-w-2xl bg-muted animate-pulse rounded-md" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[16/9] w-full bg-muted animate-pulse rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
              <div className="h-6 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
