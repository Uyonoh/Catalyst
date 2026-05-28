import Link from "next/link";
import { PlusCircle } from "lucide-react";

interface HeroSectionProps {
  userName?: string;
}

export default function HeroSection({ userName = "Architect" }: HeroSectionProps) {
  // Format user name (capitalize first letter)
  const formattedName = userName.trim()
    ? userName.charAt(0).toUpperCase() + userName.slice(1)
    : "Architect";

  return (
    <section className="mb-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-cyan-400 font-medium tracking-wider text-sm uppercase mb-2">
            Dashboard
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Welcome back,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {formattedName}
            </span>
          </h1>
          <p className="text-slate-400 mt-2 text-base">
            Your neural networks are primed and ready for prompt synthesis.
          </p>
        </div>
        {/* CTA Button with Blue-to-Cyan Gradient */}
        <Link href="/studio">
          <button className="group relative flex items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-gradient-to-r from-[--color-primary] to-cyan-500 text-white shadow-[0_0_20px_rgba(37,140,244,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer shrink-0">
            <div
              className="absolute -translate-x-2 inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 origin-left"
              style={{ width: "120%" }}
            ></div>
            <PlusCircle className="size-5 mr-2 z-10" />
            <span className="text-base font-bold tracking-wide z-10">
              New Prompt
            </span>
          </button>
        </Link>
      </div>
    </section>
  );
}
