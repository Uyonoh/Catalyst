'use client'

import GlassPanel from './GlassPanel'

const ENTITIES = [
    { label: 'Subject: Cat', color: 'cyan' as const },
    { label: 'Style: Cyberpunk', color: 'purple' as const },
    { label: 'Env: Neon City', color: 'blue' as const },
    { label: 'Time: Night', color: 'emerald' as const },
]

const getEntityStyles = (color: 'cyan' | 'purple' | 'blue' | 'emerald') => {
    const styles = {
        cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
        purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
        blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
        emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    }
    return styles[color]
}

export default function LiveAnalysisPanel() {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify({
            core_subject: "cat",
            modifiers: ["cyberpunk", "neon"],
            atmosphere: "raining",
            lighting: "cinematic_night"
        }, null, 2))
    }

    return (
        <GlassPanel className="border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
                        <span className="material-symbols-outlined">query_stats</span>
                    </div>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                        Live Analysis
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                    </span>
                    Real-time Parsing
                </div>
            </div>

            <div className="flex flex-col gap-6 flex-1">
                {/* Intent Clarity */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Intent Clarity</span>
                        <span className="text-cyan-400 font-bold">85%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full w-[85%] shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                        />
                    </div>
                </div>

                {/* Detected Entities */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Detected Entities
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {ENTITIES.map((entity) => (
                            <span
                                key={entity.label}
                                className={`px-3 py-1 rounded-full border text-xs font-medium ${getEntityStyles(entity.color)}`}
                            >
                                {entity.label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Syntax Preview */}
                <div className="flex-1 flex flex-col space-y-2 min-h-[140px]">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Syntax Preview
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono">JSON_STRUCTURE</span>
                    </div>

                    <div className="code-preview flex-1 rounded-lg p-4 overflow-hidden relative group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={copyToClipboard}
                                className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                                aria-label="Copy code"
                            >
                                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                            </button>
                        </div>

                        <code className="text-sm font-mono leading-relaxed block text-slate-300">
                            <span className="text-purple-400">{'{'}</span><br />
                            &nbsp;&nbsp;<span className="text-blue-400">"core_subject"</span>: <span className="text-emerald-300">"cat"</span>,<br />
                            &nbsp;&nbsp;<span className="text-blue-400">"modifiers"</span>: [<span className="text-emerald-300">"cyberpunk"</span>, <span className="text-emerald-300">"neon"</span>],<br />
                            &nbsp;&nbsp;<span className="text-blue-400">"atmosphere"</span>: <span className="text-emerald-300">"raining"</span>,<br />
                            &nbsp;&nbsp;<span className="text-blue-400">"lighting"</span>: <span className="text-emerald-300">"cinematic_night"</span><br />
                            <span className="text-purple-400">{'}'}</span>
                        </code>
                    </div>
                </div>
            </div>
        </GlassPanel>
    )
}