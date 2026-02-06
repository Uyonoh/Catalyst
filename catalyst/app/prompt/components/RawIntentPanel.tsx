'use client'

import { useState } from 'react'
import GlassPanel from './GlassPanel'

export default function RawIntentPanel() {
    const [input, setInput] = useState('')

    return (
        <div className="relative group flex flex-col h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-primary rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex flex-col glass-panel rounded-xl p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-cyan-500/20 p-2 rounded-lg text-cyan-400">
                            <span className="material-symbols-outlined">edit_note</span>
                        </div>
                        <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                            Raw Intent
                        </span>
                    </div>

                    <div className="relative group z-20">
                        <button
                            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#101922] border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] text-cyan-400 text-sm font-bold hover:bg-cyan-500/10 transition-all focus:outline-none"
                            onClick={() => console.log('Model dropdown clicked')}
                        >
                            <span className="material-symbols-outlined text-[20px]">palette</span>
                            <span>Midjourney v6</span>
                            <span className="material-symbols-outlined text-[20px] text-cyan-500/70">expand_more</span>
                        </button>
                    </div>
                </div>

                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full flex-1 bg-transparent border-none text-xl text-white placeholder:text-slate-600 focus:ring-0 resize-none leading-relaxed"
                    placeholder="Describe what you want to create... (e.g. 'I want a picture of a cyberpunk cat in a neon city raining at night')"
                    rows={5}
                />

                <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5">
                    <div className="flex gap-2">
                        <button
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Upload Image"
                            aria-label="Upload Image"
                        >
                            <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                        </button>
                        <button
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Voice Input"
                            aria-label="Voice Input"
                        >
                            <span className="material-symbols-outlined text-[20px]">mic</span>
                        </button>
                    </div>

                    <button
                        className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-primary text-white font-bold py-3 px-8 rounded-lg shadow-neon hover:shadow-neon-strong transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                        onClick={() => console.log('Catalyze clicked')}
                    >
                        <div className="absolute inset-0 bg-white/20 hover:bg-transparent transition-colors" />
                        <span className="relative flex items-center gap-2">
                            <span className="material-symbols-outlined">auto_awesome</span>
                            Catalyze
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}