"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Settings, Key, CreditCard, BarChart2, Lock, Bell } from "lucide-react";

const ICON_MAP: Record<string, any> = {
  settings: Settings,
  key: Key,
  payments: CreditCard,
  insights: BarChart2,
  lock: Lock,
  notifications: Bell,
};

export default function SettingsPage() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full max-w-[1200px] mx-auto pt-24 pb-12 px-4 md:px-8">
          <div className="flex flex-col gap-2 mb-12 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Settings & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Security</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Customize your Catalyst Studio experience and manage your API integrations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
            {[
              { title: "General", icon: "settings", desc: "User profile, language, and theme preferences." },
              { title: "API Keys", icon: "key", desc: "Manage OpenAI, Anthropic, and Google AI keys." },
              { title: "Subscriptions", icon: "payments", desc: "View plan details, billing, and invoices." },
              { title: "Live Analysis", icon: "insights", desc: "Configure depth and frequency of analysis." },
              { title: "Privacy", icon: "lock", desc: "Control data usage and prompt transparency." },
              { title: "Notifications", icon: "notifications", desc: "Set up email alerts for long-running batch prompts." },
            ].map((item) => (
              <div 
                key={item.title} 
                className="glass-panel p-8 rounded-3xl hover:border-cyan-500/30 transition-all cursor-pointer group hover:-translate-y-1"
              >
                <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-cyan-500/10 transition-colors">
                  {(() => {
                    const Icon = ICON_MAP[item.icon];
                    return Icon ? <Icon className="size-6 text-slate-500 group-hover:text-cyan-400" /> : null;
                  })()}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
