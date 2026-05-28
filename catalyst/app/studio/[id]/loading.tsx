import { Skeleton } from "../../components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <main className="flex-1 w-full max-w-[1000px] mx-auto pt-24 pb-12 px-4 sm:px-6 flex flex-col gap-6 md:gap-8">
          <div className="flex items-center gap-4 mb-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex flex-col gap-1 w-1/2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Editor Skeleton */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Skeleton className="h-[480px] w-full rounded-2xl glass-panel" />
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
                <Skeleton className="h-12 w-32 rounded-xl" />
                <Skeleton className="h-12 w-36 rounded-xl" />
              </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Skeleton className="h-[180px] w-full rounded-2xl glass-panel" />
              <Skeleton className="h-[240px] w-full rounded-2xl glass-panel" />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
