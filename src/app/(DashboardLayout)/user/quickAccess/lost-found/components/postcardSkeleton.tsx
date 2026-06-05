export function PostCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5 animate-pulse">
      {/* Image area */}
      <div className="h-44 bg-gray-200 dark:bg-white/10" />
      <div className="p-3 space-y-2.5">
        {/* Name + time */}
        <div className="flex justify-between gap-2">
          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-2/5" />
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/5" />
        </div>
        {/* Species line */}
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-3/5" />
        {/* Location */}
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-2/5" />
        {/* Description */}
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-4/5" />
        {/* Button */}
        <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-lg mt-1" />
      </div>
    </div>
  );
}

// Grid of skeletons for the listing page
export function PostCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
