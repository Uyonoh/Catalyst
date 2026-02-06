'use client'

import React from 'react'
import GlassPanel from './GlassPanel'
import { usePrompt } from '../../context/PromptContext'
import { useParsing } from '../../hooks/useParsing'
import { EntityType } from '../../lib/parsing/types'

const getEntityStyles = (type: EntityType) => {
    const styles: Record<EntityType, string> = {
        subject: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
        style: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
        modifier: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
        atmosphere: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        lighting: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
        persona: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
        instruction: 'bg-slate-500/10 border-slate-500/30 text-slate-300',
    }
    return styles[type] || styles.subject
}

export default function LiveAnalysisPanel() {
    const { input } = usePrompt()
    const { result, isLoading, error } = useParsing(input)

    const copyToClipboard = () => {
        if (!result) return
        navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    }

    const clarityPercent = result ? Math.round(result.intentClarity * 100) : 0

    return (
        <GlassPanel
            gradientBorder
            className="border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] p-4 md:p-6 flex flex-col h-full"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400">
                        <span className="material-symbols-outlined">query_stats</span>
                    </div>
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                        Live Analysis
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 self-start sm:self-auto">
                    <span className="relative flex h-2 w-2">
                        {isLoading ? (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        ) : null}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoading ? 'bg-cyan-500' : 'bg-slate-600'}`} />
                    </span>
                    {isLoading ? 'Real-time Parsing...' : 'Waiting for Input'}
                </div>
            </div>

            <div className="flex flex-col gap-6 flex-1">
                {/* Intent Clarity */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Intent Clarity ({result?.intent || 'Unknown'})</span>
                        <span className="text-cyan-400 font-bold">{clarityPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${clarityPercent}%` }}
                        />
                    </div>
                </div>

                {/* Detected Entities */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Detected Entities
                    </span>
                    <div className="flex flex-wrap gap-2 min-h-[32px]">
                        {result?.entities && result.entities.length > 0 ? (
                            result.entities.map((entity, i) => (
                                <span
                                    key={i}
                                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-all animate-fadeIn ${getEntityStyles(entity.type)}`}
                                >
                                    {entity.label}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-slate-600 italic">No entities detected yet</span>
                        )}
                    </div>
                </div>

                {/* Syntax Preview */}
                <div className="flex-1 flex flex-col space-y-2 min-h-[140px]">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Syntax Preview
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono hidden sm:inline">JSON_STRUCTURE</span>
                    </div>

                    <div className="code-preview flex-1 rounded-lg p-4 overflow-hidden relative group bg-black/20 border border-white/5">
                        {result && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                                    aria-label="Copy code"
                                >
                                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                </button>
                            </div>
                        )}

                        <code className="text-sm font-mono leading-relaxed block text-slate-300 overflow-x-auto">
                            {result ? (
                                <pre className="whitespace-pre-wrap">
                                    <span className="text-purple-400">{'{'}</span><br />
                                    &nbsp;&nbsp;<span className="text-blue-400">"intent"</span>: <span className="text-emerald-300">"{result.intent}"</span>,<br />
                                    &nbsp;&nbsp;<span className="text-blue-400">"clarity"</span>: <span className="text-emerald-300">{result.intentClarity}</span>,<br />
                                    &nbsp;&nbsp;<span className="text-blue-400">"entities"</span>: <span className="text-purple-400">[</span><br />
                                    {result.entities.map((e, i) => (
                                        <React.Fragment key={i}>
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">{'{'}</span> <span className="text-blue-400">"type"</span>: <span className="text-emerald-300">"{e.type}"</span>, <span className="text-blue-400">"val"</span>: <span className="text-emerald-300">"{e.value}"</span> <span className="text-purple-400">{'}'}</span>{i < result.entities.length - 1 ? ',' : ''}<br />
                                        </React.Fragment>
                                    ))}
                                    &nbsp;&nbsp;<span className="text-purple-400">]</span><br />
                                    <span className="text-purple-400">{'}'}</span>
                                </pre>
                            ) : (
                                <span className="text-slate-600 italic">Waiting for parsing results...</span>
                            )}
                        </code>
                    </div>
                </div>
            </div>
        </GlassPanel>
    )
}
