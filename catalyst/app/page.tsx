import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/home/HeroSection";
import QuickAccessModels from "./components/home/QuickAccessModels";
import StatsOverview from "./components/home/StatsOverview";
import RecentPrompts from "./components/home/RecentPrompts";

export default function Home() {
  return (
    <>
      <Header />

      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#258cf4]/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0"></div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
        <HeroSection />
        <QuickAccessModels />
        <StatsOverview />
        <RecentPrompts />
      </main>
      <Footer />
    </>
  );
}
