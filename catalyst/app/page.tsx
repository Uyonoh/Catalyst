import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingHero from "./components/landing/LandingHero";
import LandingFeatures from "./components/landing/LandingFeatures";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Catalyst Prompt Studio | Professional Prompt Optimization",
  description:
    "Transform your raw ideas into high-performance AI prompts with our Studio and professional library.",
};

export default async function LandingPage() {
  return (
    <>
      <Header />

      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#258cf4]/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0"></div>

      <main className="flex-1 relative z-10">
        <LandingHero />

        <LandingFeatures />
        <section className="py-16 bg-white/[0.01] border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to elevate your AI workflow?
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join professionals using Catalyst Prompt Studio to build the
              future of AI communication.
            </p>
            <div className="flex justify-center">
              <Link
                href="/studio"
                className="group relative flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
