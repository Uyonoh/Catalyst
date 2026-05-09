import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingHero from "./components/landing/LandingHero";
import LandingFeatures from "./components/landing/LandingFeatures";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalyst | Professional Prompt Optimization",
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
        <section className="py-24 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-white mb-6">
              Ready to elevate your AI workflow?
            </h2>
            <p className="text-slate-400 mb-10">
              Join professionals using Catalyst to build the future of AI
              communication.
            </p>
            <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full mb-10" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
