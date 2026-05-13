import { Skeleton } from "@heroui/react";

/*  Loading skeleton  */
export const LoadingSkeleton = () => (
  <div className="p-4 md:p-8 space-y-5 max-w-7xl mx-auto">
    {/* <Skeleton className="h-6 w-36 rounded-md" /> */}
    <Skeleton className="h-56 w-full rounded-md" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-32 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-40 rounded-md" />
        <Skeleton className="h-52 rounded-md" />
      </div>
    </div>
  </div>
);
