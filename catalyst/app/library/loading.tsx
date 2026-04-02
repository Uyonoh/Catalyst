import { CardSkeleton, Skeleton } from "../components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#258cf4]/05 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/05 blur-[120px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <main className="flex-1 w-full max-w-[1200px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
          {/* Library Hero Skeleton */}
          <div className="py-12 md:py-20 flex flex-col items-center text-center">
             <Skeleton className="h-4 w-32 mb-6" />
             <Skeleton className="h-12 md:h-16 w-3/4 mb-6" />
             <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Featured items skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <Skeleton className="h-[200px] w-full rounded-2xl glass-panel" />
            <Skeleton className="h-[200px] w-full rounded-2xl glass-panel" />
          </div>

          {/* Search bar skeleton */}
          <div className="mb-8">
            <Skeleton className="h-12 w-full rounded-xl glass-panel" />
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-2 mb-10 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full flex-shrink-0" />
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
