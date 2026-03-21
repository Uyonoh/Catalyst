"use client";

export default function HeroSection() {
  return (
    <section className="mb-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <p className="text-cyan-400 font-medium tracking-wider text-sm uppercase mb-2">
            Dashboard
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              Architect
            </span>
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Your neural networks are primed and ready.
          </p>
        </div>
        {/* CTA Button with Blue-to-Cyan Gradient */}
        <button className="group relative flex items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-gradient-to-r from-[--color-primary] to-cyan-500 text-white shadow-[0_0_20px_rgba(37,140,244,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95">
          <div
            className="absolute -translate-x-2 inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 origin-left"
            style={{ width: "120%" }}
          ></div>
          <span className="material-symbols-outlined mr-2 z-10 text-[20px]">
            add_circle
          </span>
          <span className="text-base font-bold tracking-wide z-10">
            New Prompt
          </span>
        </button>
      </div>
    </section>
  );
}
