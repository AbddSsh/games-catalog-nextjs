import { Skeleton } from "@/shared/ui";

export default function Loading() {
  return (
    <div className="space-y-6 pt-[40px]">
      {/* Hero skeleton */}
      <Skeleton className="h-64 w-full rounded-[20px] md:h-80" />

      {/* Section title */}
      <Skeleton className="h-8 w-48" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
