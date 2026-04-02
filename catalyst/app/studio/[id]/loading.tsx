import { Skeleton } from "../../components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <main className="flex-1 w-full max-w-[1200px] mx-auto pt-24 pb-12 px-4 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col gap-2 w-1/2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24 rounded-xl" />
              <Skeleton className="h-10 w-24 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] w-full rounded-2xl glass-panel" />
            <Skeleton className="h-[500px] w-full rounded-2xl glass-panel" />
          </div>
        </main>
      </div>
    </>
  );
}
