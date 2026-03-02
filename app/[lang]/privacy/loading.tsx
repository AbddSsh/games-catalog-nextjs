import { Skeleton } from "@/shared/ui";

export default function PrivacyLoading() {
  return (
    <div className="space-y-6 pt-[40px]">
      <div className="w-full space-y-6 rounded-[13px] bg-bg-text-block px-5 py-6">
        <Skeleton className="h-10 w-2/3 rounded-lg" />
        <Skeleton className="h-5 w-1/4 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-4/5 rounded-lg" />
        </div>
        <Skeleton className="my-4 h-px w-full rounded" />
        <Skeleton className="h-7 w-1/2 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
        </div>
        <Skeleton className="my-4 h-px w-full rounded" />
        <Skeleton className="h-7 w-1/3 rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
