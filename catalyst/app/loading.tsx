import { CardSkeleton, Skeleton } from "./components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#258cf4]/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0"></div>

      <main className="flex-1 w-full max-w-[1200px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
        {/* Hero Section Skeleton */}
        <section className="py-12 md:py-20 flex flex-col items-center text-center">
          <Skeleton className="h-4 w-32 mb-6" />
          <Skeleton className="h-12 md:h-16 w-3/4 mb-6" />
          <Skeleton className="h-6 w-1/2 mb-10" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </section>

        {/* Quick Access Models Skeleton */}
        <section className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl glass-panel" />
          ))}
        </section>

        {/* Stats Overview Skeleton */}
        <section className="py-10 grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-10 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </section>

        {/* Recent Prompts Skeleton */}
        <div className="mt-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
