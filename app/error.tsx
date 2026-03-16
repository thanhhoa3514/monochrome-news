"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full" />
          <AlertTriangle className="h-16 w-16 mx-auto text-destructive relative" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-black tracking-tight">Something Went Wrong</h1>
          <p className="text-muted-foreground">
            We encountered an error while processing your request. This might be a temporary issue with our services.
          </p>
        </div>

        {error.digest && (
          <div className="bg-muted p-3 rounded-md">
            <code className="text-[10px] font-mono opacity-60 uppercase tracking-wider">
              Error ID: {error.digest}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button 
            onClick={() => reset()}
            variant="default"
            className="w-full sm:w-auto gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button 
            asChild
            variant="outline"
            className="w-full sm:w-auto gap-2"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              Back Home
            </Link>
          </Button>
        </div>
        
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/40">
          Monochrome News Network &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
