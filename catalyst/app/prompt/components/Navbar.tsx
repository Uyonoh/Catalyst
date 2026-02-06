'use client'

import Link from 'next/link'


export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/10 glass-panel">
            <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="size-8 flex items-center justify-center text-cyan-400">
                        <span className="material-symbols-outlined !text-[32px]">auto_awesome_mosaic</span>
                    </div>
                    <h2 className="text-white text-xl font-black tracking-tight">Catalyst</h2>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href="#"
                            className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5"
                        >
                            Workspace
                        </Link>
                        <Link
                            href="#"
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            History
                        </Link>
                        <Link
                            href="#"
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        >
                            Settings
                        </Link>
                    </div>

                    {/* User actions */}
                    <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                        <button
                            className="flex items-center justify-center size-9 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            aria-label="Notifications"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
                        </button>

                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-white/10 cursor-pointer"
                            aria-label="User profile avatar showing a smiling person"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3g60JcD1O-zBbO1tv5aAO4luRtDDqXP0KVD03-sHIPWu0es_7MBZLIiTZKwJMRbY7uKc3GL_Rd2PWM_HYCZ8fFWvsjw7PFuFOvC6RGggy3x_TJ3191rRUx-gb_lbOPfvDd743xt5quIRn1zo7w8ct1914-i-eKbccHntDKYAD3m0ANNYFp73PEPlReRAq7GujQWJkwkGCN_MSef3JLE6S8pYxDLpflaXDzN2qtnS0gQhbcI0QIwdozgQhXK8kpOHsIHuhIXWf4K4")' }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}