'use client'

export default function Header() {
    return (
        <header className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Catalyst Workspace
            </h1>
            <p className="text-slate-400 text-base md:text-lg">
                Transform your raw ideas into optimized prompts with live analysis.
            </p>
        </header>
    )
}
