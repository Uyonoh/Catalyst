"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SettingsSidebarNav from "../components/settings/SettingsSidebarNav";
import { useUser } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="size-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative z-10 min-h-screen flex flex-col bg-background-dark">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[30%] w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[140px]" />
      </div>

      <Header />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto pt-24 pb-12 px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 px-4">
                <h1 className="text-3xl font-black text-white tracking-tight">Settings</h1>
                <p className="text-slate-500 text-sm">Manage your Catalyst account</p>
              </div>
              
              {/* Mobile horizontal scroll, Desktop vertical list */}
              <div className="w-full overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                <div className="min-w-max lg:min-w-0">
                  <SettingsSidebarNav />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="flex-1 w-full min-w-0">
            <div className="glass-panel p-6 md:p-10 rounded-3xl animate-fadeIn border-white/5">
              {children}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
