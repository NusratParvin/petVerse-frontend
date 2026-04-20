import React from "react";

const PetListSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden border-steel-blue/30 dark:border-lime-burst/25 bg-steel-blue/10 dark:bg-lime-burst/5">
      <div className="divide-y divide-steel-blue/25 dark:divide-lime-burst/15 px-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5 px-0 py-2">
            <div className="w-7 h-7 rounded-lg bg-steel-blue/25 dark:bg-lime-burst/15 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="h-3 w-20 bg-steel-blue/20 dark:bg-white/10 rounded animate-pulse mb-1" />
              <div className="h-2 w-12 bg-steel-blue/20 dark:bg-white/10 rounded animate-pulse" />
            </div>
            <div className="w-3 h-3 bg-steel-blue/20 dark:bg-white/10 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetListSkeleton;
