import { Skeleton } from "../../components/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex flex-col gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-12 w-32 rounded-xl self-end mt-4" />
      </div>
    </div>
  );
}
