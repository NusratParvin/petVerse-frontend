"use client";

import Link from "next/link";

export const Header = () => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
        <h1 className="text-base font-bold text-gray-900 dark:text-white">
          🤖 AI Insurance Finder
        </h1>
        <Link
          href="/user/quickAccess/insurance"
          className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs hover:text-steel-blue dark:hover:text-lime-burst transition-colors w-fit"
        >
          ← Back to Insurances
        </Link>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 ms-6">
        Answer a few questions — we'll match your pet to the best UAE plan
      </p>
    </div>
  );
};
