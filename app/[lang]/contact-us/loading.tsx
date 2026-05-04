import { Skeleton } from "@/shared/ui";

export default function ContactUsLoading() {
  return (
    <div className="space-y-6 pt-[40px]">
      <div className="w-full space-y-6 rounded-[13px] bg-bg-text-block px-5 py-6">
        <Skeleton className="h-10 w-1/2 rounded-lg" />
        <Skeleton className="h-5 w-3/4 rounded-lg" />
        <Skeleton className="my-4 h-px w-full rounded" />
        <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2">
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-24 rounded-lg" />
          <Skeleton className="h-32 rounded-lg tablet:col-span-2" />
        </div>
      </div>
    </div>
  );
}
