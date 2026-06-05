export function DetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded mb-5" />

      {/* Image */}
      <div className="h-72 w-full bg-gray-200 dark:bg-white/10 rounded-2xl mb-4" />

      {/* Type badge + name */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded-full" />
        <div className="h-6 w-40 bg-gray-200 dark:bg-white/10 rounded" />
      </div>

      {/* Species/breed line */}
      <div className="h-4 w-48 bg-gray-200 dark:bg-white/10 rounded mb-4" />

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 dark:bg-white/10 rounded-xl"
          />
        ))}
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-24 bg-gray-200 dark:bg-white/10 rounded" />
        <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/10 rounded" />
        <div className="h-4 w-4/6 bg-gray-200 dark:bg-white/10 rounded" />
      </div>

      {/* Poster card */}
      <div className="h-16 w-full bg-gray-200 dark:bg-white/10 rounded-xl mb-4" />

      {/* Button */}
      <div className="h-10 w-full bg-gray-200 dark:bg-white/10 rounded-xl" />
    </div>
  );
}
