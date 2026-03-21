'use client'

import React from 'react'
import GlassPanel from './GlassPanel'
import { usePrompt } from '../../context/PromptContext'
import ModelSelector, { MODELS } from './ModelSelector'

export default function RawIntentPanel() {
    const { input, setInput, selectedModel: selectedModelId, isLoading, result } = usePrompt()
    const selectedModel = MODELS.find(m => m.id === selectedModelId) || MODELS[0]

    return (
        <div className="relative group flex flex-col h-full">
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${isLoading ? 'from-cyan-400 to-primary rounded-2xl blur-md opacity-75 animate-pulse' : 'from-cyan-500 to-primary rounded-2xl blur opacity-30 group-hover:opacity-60'} transition-all duration-500`} />
            <div className="relative flex flex-col glass-panel rounded-xl p-4 md:p-6 h-full">
                {/* Header Section - Mobile Optimized */}
                <div className="flex flex-col gap-3 mb-4">
                    {/* Title Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-cyan-500/20 p-1.5 md:p-2 rounded-lg text-cyan-400">
                                <span className="material-symbols-outlined text-lg md:text-xl">edit_note</span>
                            </div>
                            <span className="text-xs hidden sm:block md:text-sm font-bold text-slate-200 uppercase tracking-wider">
                                Raw Intent
                            </span>
                            {/* Mobile Analysis Indicator */}
                            <div className="md:hidden flex items-center gap-1.5 ml-1 transition-opacity duration-300">
                                {isLoading ? (
                                    <>
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                                        </span>
                                        <span className="text-[9px] uppercase text-cyan-400 font-bold tracking-widest animate-pulse">Analyzing</span>
                                    </>
                                ) : result ? (
                                    <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                                        <span className="material-symbols-outlined text-[10px] text-emerald-400">bolt</span>
                                        <span className="text-[8px] uppercase text-emerald-400 font-bold tracking-wider pt-[1px]">Ready</span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        {/* Desktop Model Selection */}
                        <ModelSelector />

                    </div>

                </div>

                {/* Textarea */}
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full flex-1 bg-transparent border-none text-base md:text-xl text-white placeholder:text-slate-600 focus:ring-0 resize-none leading-relaxed focus:outline-none min-h-[120px] md:min-h-[150px]"
                    placeholder="Describe what you want to create... (e.g. 'I want a picture of a cyberpunk cat in a neon city raining at night')"
                    aria-label="Prompt input"
                />

                {/* Action Buttons - Mobile: Icons only in a grid */}
                <div className="flex justify-between">
                    <div className="flex gap-1">
                        <button
                            className="p-3 md:p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                            title="Upload Image"
                            aria-label="Upload Image"
                        >
                            <span className="material-symbols-outlined text-[24px] md:text-[20px]">add_photo_alternate</span>
                        </button>
                        <button
                            className="p-3 md:p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                            title="Voice Input"
                            aria-label="Voice Input"
                        >
                            <span className="material-symbols-outlined text-[24px] md:text-[20px]">mic</span>
                        </button>
                        <button
                            className="p-3 md:p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
                            title="Prompt History"
                            aria-label="Prompt History"
                        >
                            <span className="material-symbols-outlined text-[24px] md:text-[20px]">history</span>
                        </button>
                    </div>

                    {/* Mobile: Token Counter (Moved from dropdown for cleaner access) */}
                    <div className="flex md:hidden items-center gap-2 pr-2 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-[14px] text-cyan-400">bolt</span>
                        <span className="font-mono font-medium">450/1000</span>
                    </div>
                </div>

                {/* Catalyze Button - Better mobile sizing */}
                <button
                    className={`relative overflow-hidden bg-gradient-to-r from-cyan-500 to-primary text-white font-bold py-3 px-6 rounded-lg shadow-neon hover:shadow-neon-strong transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 w-full sm:w-auto ${!input.trim() ? 'opacity-70' : ''}`}
                    onClick={() => console.log('Catalyze clicked with:', { input, model: selectedModel })}
                    disabled={!input.trim()}
                    aria-label="Generate prompt"
                >
                    <div className={`absolute inset-0 bg-white/20 hover:bg-transparent transition-colors ${!input.trim() ? 'opacity-50' : ''}`} />
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <span>Catalyze</span>
                </button>
            </div>
        </div>
        // </div >
    )
}