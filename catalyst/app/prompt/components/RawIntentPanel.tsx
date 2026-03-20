'use client'

import { useState, useRef, useEffect } from 'react'
import GlassPanel from './GlassPanel'
import { usePrompt } from '../../context/PromptContext'

const MODELS = [
    { id: 'midjourney', name: 'Midjourney v6', type: 'Img', icon: 'palette', color: 'cyan' },
    { id: 'claude', name: 'Claude 3 Opus', type: 'Txt', icon: 'auto_awesome', color: 'purple' },
    { id: 'gpt', name: 'GPT-4 Turbo', type: 'Txt', icon: 'chat', color: 'green' },
    { id: 'llama', name: 'Llama 3', type: 'Txt', icon: 'terminal', color: 'orange' },
    { id: 'dalle', name: 'DALL-E 3', type: 'Img', icon: 'image', color: 'pink' },
    { id: 'stablediffusion', name: 'Stable Diffusion', type: 'Img', icon: 'filter_frames', color: 'blue' },
]

export default function RawIntentPanel() {
    const { input, setInput, selectedModel: selectedModelId, setSelectedModel: setSelectedModelId } = usePrompt()
    const selectedModel = MODELS.find(m => m.id === selectedModelId) || MODELS[0]
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleModelSelect = (model: typeof MODELS[0]) => {
        setSelectedModelId(model.id)
        setIsDropdownOpen(false)
        console.log(`Model selected: ${model.name}`)
    }

    const getModelColor = (color: string) => {
        const colors: Record<string, string> = {
            cyan: 'text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-500/10',
            purple: 'text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:bg-purple-500/10',
            green: 'text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:bg-green-500/10',
            orange: 'text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:bg-orange-500/10',
            pink: 'text-pink-400 border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:bg-pink-500/10',
            blue: 'text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-blue-500/10',
        }
        return colors[color] || colors.cyan
    }

    return (
        <div className="relative group flex flex-col h-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-primary rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
            <div className="relative flex flex-col glass-panel rounded-xl p-4 md:p-6 h-full">
                {/* Header Section - Mobile Optimized */}
                <div className="flex flex-col gap-3 mb-4">
                    {/* Title Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-cyan-500/20 p-1.5 md:p-2 rounded-lg text-cyan-400">
                                <span className="material-symbols-outlined text-lg md:text-xl">edit_note</span>
                            </div>
                            <span className="text-xs md:text-sm font-bold text-slate-200 uppercase tracking-wider">
                                Raw Intent
                            </span>
                        </div>
                        {/* Desktop Model Selection */}
                        <div className="relative" ref={dropdownRef}>
                            {/* Desktop/Tablet Toggle */}
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`hidden sm:flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 rounded-lg bg-[#101922] border ${getModelColor(selectedModel.color)} text-sm font-bold transition-all focus:outline-none active:scale-95`}
                                aria-label="Select AI model"
                                aria-expanded={isDropdownOpen}
                            >
                                <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                                    {selectedModel.icon}
                                </span>
                                <span className="hidden sm:inline">{selectedModel.name}</span>
                                <span className="material-symbols-outlined text-[18px] md:text-[20px] opacity-70 transition-transform duration-200" style={{
                                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}>
                                    expand_more
                                </span>
                            </button>

                            {/* Mobile Toggle Indicator */}
                            <div className="sm:hidden flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-medium">Model:</span>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#101922] border ${getModelColor(selectedModel.color).split(' shadow')[0]} text-xs font-bold transition-all active:scale-95`}
                                    aria-label="Change AI model"
                                >
                                    <span className="material-symbols-outlined text-[16px]">
                                        {selectedModel.icon}
                                    </span>
                                    <span className="text-[10px] font-semibold">
                                        {selectedModel.id === 'midjourney' ? 'MJ' :
                                            selectedModel.id === 'claude' ? 'CLD' :
                                                selectedModel.id === 'gpt' ? 'GPT' :
                                                    selectedModel.id === 'llama' ? 'LLM' :
                                                        selectedModel.id === 'dalle' ? 'DAL' : 'SD'}
                                    </span>
                                </button>
                            </div>

                            {/* Unified Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-72 md:w-80 z-50">
                                    <div className="glass-panel-dark rounded-xl p-2 border border-white/20 shadow-2xl shadow-black/50 animate-fadeIn">
                                        <div className="max-h-64 overflow-y-auto pr-1 thin-scrollbar">
                                            {MODELS.map((model) => (
                                                <button
                                                    key={model.id}
                                                    onClick={() => handleModelSelect(model)}
                                                    className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all hover:bg-white/5 ${selectedModel.id === model.id ? 'bg-cyan-500/10 border border-cyan-500/30' : 'border border-transparent'}`}
                                                    aria-label={`Select ${model.name}`}
                                                >
                                                    <div className={`p-2 rounded-lg ${getModelColor(model.id === selectedModel.id ? model.color : 'slate').replace('text-', 'bg-').replace('/50', '/20').replace(/hover.*$/, '').replace(/shadow.*$/, '').trim()}`}>
                                                        <span className="material-symbols-outlined text-[20px]">{model.icon}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-white text-sm md:text-base truncate">{model.name}</div>
                                                        <div className="text-xs text-slate-400 truncate">AI {model.type === 'Img' ? 'Image Generation' : 'Text Model'}</div>
                                                    </div>
                                                    <span className={`text-[10px] md:text-xs px-2 py-1 rounded flex-shrink-0 ${selectedModel.id === model.id ? 'bg-cyan-900/40 text-cyan-200' : 'bg-slate-800/40 text-slate-400'}`}>
                                                        {model.type}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        {/* Quick Stats Footer - Desktop Only */}
                                        <div className="hidden md:block mt-2 pt-2 border-t border-white/10">
                                            <div className="px-3 py-2 text-xs text-slate-400">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                                                        <span>Token Usage</span>
                                                    </span>
                                                    <span>450/1000</span>
                                                </div>
                                                <div className="w-full bg-slate-800 rounded-full h-1">
                                                    <div
                                                        className="bg-cyan-500 h-1 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                                                        style={{ width: '45%' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

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