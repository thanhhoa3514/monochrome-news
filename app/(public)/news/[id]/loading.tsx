import React from 'react';

export default function NewsDetailLoading() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Article Header Skeleton */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-4 w-32 bg-muted animate-pulse rounded-full" />
          <div className="space-y-3">
            <div className="h-12 w-full bg-muted animate-pulse rounded-md" />
            <div className="h-12 w-2/3 bg-muted animate-pulse rounded-md" />
          </div>
          
          <div className="flex items-center gap-4 border-y py-6">
            <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-muted animate-pulse rounded-md" />
              <div className="h-3 w-48 bg-muted animate-pulse rounded-md opacity-60" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
              <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image Skeleton */}
      <div className="container mx-auto px-4 mb-12">
        <div className="max-w-5xl mx-auto aspect-[21/9] w-full bg-muted animate-pulse rounded-2xl" />
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-11/12 bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
              <div className="h-4 w-4/5 bg-muted animate-pulse rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
