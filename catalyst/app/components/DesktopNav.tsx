"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    active: "text-cyan-400",
    inactive: "text-white hover:text-cyan-300 hover:bg-white/5",
    title: "Go to dashboard",
  },
  {
    name: "Library",
    href: "/library",
    active: "text-cyan-400",
    inactive: "text-white hover:text-cyan-300 hover:bg-white/5",
    title: "Browse your prompt library",
  },
  {
    name: "Studio",
    href: "/studio",
    active: "text-purple-400",
    inactive: "text-white hover:text-cyan-400 hover:bg-white/5",
    title: "Design and test new prompts",
  },
  {
    name: "History",
    href: "/history",
    active: "text-yellow-400",
    inactive: "text-slate-400 hover:text-white hover:bg-white/5",
    title: "View your prompt history",
  },
];

interface userProps {
  user: boolean;
}

export default function NavLinks({ user }: userProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1">
      {links.map((link) => {
        // Check if the current path matches the link"s href
        const isActive = pathname === link.href;
        if (!user) {
          if (link.name == "Dashboard" || link.name == "History") {
            return;
          }
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
              isActive
                ? link.active // Active styles
                : link.inactive // Inactive styles
            }`}
            title={link.title}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
