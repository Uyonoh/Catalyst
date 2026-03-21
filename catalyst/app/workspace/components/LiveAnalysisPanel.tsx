'use client'

import React, { useState } from 'react'
import GlassPanel from './GlassPanel'
import { useWorkspace } from '../../context/WorkspaceContext'

const getMetadataStyles = (type: string) => {
    const styles: Record<string, string> = {
        domain: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
        intent: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
        tone: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
        format: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
        variable: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
    }
    return styles[type] || 'bg-slate-500/10 border-slate-500/30 text-slate-300'
}

export default function LiveAnalysisPanel() {
    const { input, selectedModel, result, isLoading, error } = useWorkspace()
    const [showDetails, setShowDetails] = useState(false)

    const copyToClipboard = () => {
        if (!result) return
        navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    }

    const confidencePercent = result?.metadata?.confidenceScore 
        ? Math.round(result.metadata.confidenceScore * 100) 
        : 0

    // Prepare entities from metadata
    const entities: { type: string, label: string }[] = []
    if (result?.metadata) {
        const meta = result.metadata
        if (meta.detectedDomain) entities.push({ type: 'domain', label: meta.detectedDomain.split('_').join(' ') })
        if (meta.primaryIntent) entities.push({ type: 'intent', label: meta.primaryIntent })
        if (meta.constraints?.tone) entities.push({ type: 'tone', label: meta.constraints.tone })
        if (meta.constraints?.outputFormat) entities.push({ type: 'format', label: meta.constraints.outputFormat })
        if (meta.variables) {
            Object.keys(meta.variables).forEach(v => {
                entities.push({ type: 'variable', label: `{{${v}}}` })
            })
        }
    }

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
                        Engine Analysis
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 self-start sm:self-auto">
                    <span className="relative flex h-2 w-2">
                        {isLoading ? (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        ) : null}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoading ? 'bg-cyan-500' : 'bg-slate-600'}`} />
                    </span>
                    {isLoading ? 'Real-time Parsing...' : result ? 'Analysis Complete' : 'Waiting for Input'}
                </div>
            </div>

            {/* Mobile Toggle Details */}
            <div className="md:hidden flex justify-center mb-2">
                <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-400 transition-colors bg-cyan-500/10 px-3 py-1.5 rounded-full"
                >
                    <span>{showDetails ? 'Hide Engine Details' : 'Show Engine Details'}</span>
                    <span className="material-symbols-outlined text-[16px]">
                        {showDetails ? 'expand_less' : 'expand_more'}
                    </span>
                </button>
            </div>

            <div className="flex flex-col gap-6 flex-1">
                <div className={`flex-col gap-6 ${showDetails ? 'flex' : 'hidden md:flex'} animate-fadeIn`}>
                    {/* Confidence Score */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Confidence Score ({result?.metadata?.primaryIntent || 'Unknown'})</span>
                            <span className="text-cyan-400 font-bold">{confidencePercent}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                            <div
                                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${confidencePercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Detected Metadata */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Extracted Metadata
                        </span>
                        <div className="flex flex-wrap gap-2 min-h-[32px]">
                            {entities.length > 0 ? (
                                entities.map((entity, i) => (
                                    <span
                                        key={i}
                                        className={`px-3 py-1 rounded-full border text-xs font-medium transition-all animate-fadeIn ${getMetadataStyles(entity.type)}`}
                                    >
                                        {entity.label}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-600 italic">No metadata detected yet</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Syntax Preview */}
                <div className="flex-1 flex flex-col space-y-2 min-h-[140px]">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Compilation Preview
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono hidden sm:inline">{result?.model || 'GENERATING'}</span>
                    </div>

                    <div className={`code-preview flex-1 rounded-lg p-4 overflow-hidden relative group bg-black/20 border transition-all duration-300 ${isLoading ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-white/5'}`}>
                        {/* Refreshing Overlay for Mobile */}
                        {isLoading && (
                            <div className="absolute inset-0 z-10 bg-[#101922]/40 backdrop-blur-[1px] flex items-center justify-center animate-fadeIn">
                                <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full border border-cyan-500/30 shadow-2xl">
                                    <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-tighter">Refreshing Engine</span>
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white"
                                    aria-label="Copy code"
                                >
                                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                </button>
                            </div>
                        )}

                        <code className={`text-sm font-mono leading-relaxed block text-slate-300 overflow-x-auto transition-opacity duration-300 ${isLoading ? 'opacity-40' : 'opacity-100'}`}>
                            {result ? (
                                <div className="space-y-4 max-h-[200px] md:max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                                    {result.systemInstruction && (
                                        <div>
                                            <span className="text-slate-500 text-[10px] block mb-1 uppercase">System Instruction</span>
                                            <div className="text-blue-300 bg-blue-500/5 p-2 rounded border border-blue-500/10">
                                                {result.systemInstruction}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-slate-500 text-[10px] block mb-1 uppercase">Formatted Prompt</span>
                                        <pre className="whitespace-pre-wrap text-emerald-300 p-2 bg-emerald-500/5 rounded border border-emerald-500/10 overflow-x-auto">
                                            {typeof result.formattedPrompt === 'string' 
                                                ? result.formattedPrompt 
                                                : JSON.stringify(result.formattedPrompt, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-slate-600 italic">Waiting for compiler results...</span>
                            )}
                        </code>
                    </div>
                </div>
            </div>
        </GlassPanel>
    )
}

