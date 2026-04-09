import React from "react";

const PetCardLoader = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg overflow-hidden animate-pulse bg-white/85 dark:bg-white/5 border border-steel-blue/12 dark:border-white/7"
        >
          <div className="h-28 bg-steel-blue/5 dark:bg-white/3" />
          <div className="p-4">
            <div className="h-4 w-24 rounded mb-2 bg-steel-blue/8 dark:bg-white/6" />
            <div className="h-3 w-32 rounded bg-steel-blue/5 dark:bg-white/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetCardLoader;
