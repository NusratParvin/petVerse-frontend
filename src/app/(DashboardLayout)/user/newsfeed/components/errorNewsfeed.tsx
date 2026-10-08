"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorNewsfeed() {
  return (
    <div className="mx-auto mt-10 flex w-2/3 max-w-lg items-center justify-center rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 shadow-sm dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
      <AlertTriangle className="mr-3 h-6 w-6 shrink-0" />
      <div>
        <h2 className="mb-1 text-base font-bold">Error loading articles</h2>
        <p className="text-sm">Something went wrong. Please try again later.</p>
      </div>
    </div>
  );
}
