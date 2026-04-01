"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, Key, CreditCard, BarChart2, Lock, Bell } from "lucide-react";
import { cn } from "@/lib/utils"; // Not sure if cn exists, I'll use template literals if not

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

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              isActive
                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Icon className={`size-5 transition-colors ${
              isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
            }`} />
            <span className="font-medium">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
