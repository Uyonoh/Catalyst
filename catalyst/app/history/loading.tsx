import { Skeleton } from "../components/Skeleton";

export default function Loading() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <main className="flex-1 w-full max-w-[1200px] mx-auto pt-24 pb-12 px-4 md:px-8">
          <div className="flex flex-col gap-2 mb-12">
            <Skeleton className="h-10 md:h-12 w-1/2 mb-4" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          
          <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center">
             <Skeleton variant="circle" width={80} height={80} className="mb-6" />
             <Skeleton className="h-8 w-48 mb-2" />
             <Skeleton className="h-4 w-64 mb-8" />
             <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </main>
      </div>
    </>
  );
}
