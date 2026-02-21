"use client"; // Error boundaries must be client components

import { useEffect } from "react";
import { EmptyState } from "@/components/news/empty-state";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global boundary caught error:", error);
    }, [error]);

    return (
        <div className="container min-h-[60vh] flex flex-col items-center justify-center p-8">
            <EmptyState
                title="Something went wrong!"
                description={error.message || "An unexpected error occurred while loading this page."}
            />
            <button
                onClick={() => reset()}
                className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90"
                style={{
                    marginTop: '1.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#FF0000',
                    color: 'white',
                    borderRadius: '0.375rem',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                Try again
            </button>
        </div>
    );
}
