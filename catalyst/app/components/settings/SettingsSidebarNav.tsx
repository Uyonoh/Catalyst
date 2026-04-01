"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Key, CreditCard, BarChart2, Lock, Bell, LogOut } from "lucide-react";
import { useUser } from "../../context/AuthContext";

const NAV_ITEMS = [
  { title: "General", href: "/settings/general", icon: Settings },
  { title: "API Keys", href: "/settings/api-keys", icon: Key },
  { title: "Subscriptions", href: "/settings/subscriptions", icon: CreditCard },
  { title: "Live Analysis", href: "/settings/live-analysis", icon: BarChart2 },
  { title: "Privacy", href: "/settings/privacy", icon: Lock },
  { title: "Notifications", href: "/settings/notifications", icon: Bell },
];

export default function SettingsSidebarNav() {
  const pathname = usePathname();
  const { signOut } = useUser();

  return (
    <nav className="flex flex-row lg:flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:py-3 rounded-xl transition-all group whitespace-nowrap ${
              isActive
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Icon
              className={`size-4 sm:size-5 transition-colors ${
                isActive
                  ? "text-cyan-400"
                  : "text-slate-500 group-hover:text-slate-300"
              }`}
            />
            <span className="font-medium text-sm sm:text-base">{item.title}</span>
          </Link>
        );
      })}

      <div className="hidden lg:block my-2 h-px bg-white/10 mx-4" />

      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:py-3 rounded-xl transition-all text-red-500/70 hover:text-red-400 hover:bg-red-500/5 group whitespace-nowrap border border-transparent"
      >
        <LogOut className="size-4 sm:size-5 transition-colors text-red-500/50 group-hover:text-red-400" />
        <span className="font-medium text-sm sm:text-base">Sign Out</span>
      </button>
    </nav>
  );
}
