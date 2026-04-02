import { Skeleton } from "../components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <main className="flex-1 w-full max-w-[1100px] mx-auto pt-16 pb-12 px-4 sm:px-6 flex flex-col gap-6 md:gap-8 relative z-10">
        <section className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 w-full max-w-[500px]">
            <Skeleton className="h-12 md:h-16 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </section>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Skeleton className="h-[400px] w-full rounded-2xl glass-panel" />
          </div>
          <div className="hidden lg:block lg:w-[50%]">
            <Skeleton className="h-[400px] w-full rounded-2xl glass-panel" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Skeleton className="h-[200px] w-full rounded-2xl glass-panel" />
        </div>
      </main>
    </>
  );
}
