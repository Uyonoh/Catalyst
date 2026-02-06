'use client'

import { useState } from 'react'
import GlassPanel from './GlassPanel'

const SETTINGS = [
    {
        id: 'creativity',
        title: 'Creativity',
        description: 'Allow model to hallucinate details.',
        icon: 'shutter_speed',
        color: 'purple',
        defaultValue: 75,
        type: 'slider' as const,
    },
    {
        id: 'precision',
        title: 'Precision',
        description: 'Adherence to raw intent.',
        icon: 'ads_click',
        color: 'cyan',
        defaultValue: 50,
        type: 'slider' as const,
    },
    {
        id: 'length',
        title: 'Length',
        description: 'Output verbosity level.',
        icon: 'straighten',
        color: 'green',
        defaultValue: 25,
        type: 'slider' as const,
    },
    {
        id: 'token',
        title: 'Token Usage',
        description: '450 / 1000 credits.',
        icon: 'bolt',
        color: 'slate',
        defaultValue: 45,
        type: 'progress' as const,
    },
]

export default function OptimizationSettings() {
    const [settings, setSettings] = useState(
        SETTINGS.reduce((acc, setting) => {
            acc[setting.id] = setting.defaultValue
            return acc
        }, {} as Record<string, number>)
    )

    const handleReset = () => {
        const defaultSettings = SETTINGS.reduce((acc, setting) => {
            acc[setting.id] = setting.defaultValue
            return acc
        }, {} as Record<string, number>)
        setSettings(defaultSettings)
    }

    const handleSliderChange = (id: string, value: number) => {
        setSettings(prev => ({ ...prev, [id]: value }))
    }

    const getLevelLabel = (value: number, type: string) => {
        if (type === 'progress') return '2d Left'
        if (value > 66) return 'High'
        if (value > 33) return 'Medium'
        return 'Low'
    }

    const getColorStyles = (color: string) => {
        const colorMap: Record<string, { bg: string; text: string; border: string; accent: string }> = {
            purple: {
                bg: 'bg-purple-500/20',
                text: 'text-purple-300',
                border: 'border-purple-500/30',
                accent: 'accent-purple-500'
            },
            cyan: {
                bg: 'bg-cyan-500/20',
                text: 'text-cyan-300',
                border: 'border-cyan-500/30',
                accent: 'accent-cyan-500'
            },
            green: {
                bg: 'bg-green-500/20',
                text: 'text-green-300',
                border: 'border-green-500/30',
                accent: 'accent-green-500'
            },
            slate: {
                bg: 'bg-slate-800',
                text: 'text-slate-400',
                border: 'border-slate-500/30',
                accent: 'accent-slate-500'
            }
        }
        return colorMap[color] || colorMap.slate
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-400">tune</span>
                    Optimization Settings
                </h2>
                <button
                    onClick={handleReset}
                    className="text-sm text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
                >
                    Reset Defaults
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SETTINGS.map((setting) => {
                    const colors = getColorStyles(setting.color)
                    const levelLabel = getLevelLabel(settings[setting.id], setting.type)

                    return (
                        <GlassPanel
                            key={setting.id}
                            hoverable
                            className="p-5 rounded-xl cursor-pointer group border border-white/5 hover:border-cyan-500/30"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div
                                    className={`p-2 rounded-lg bg-[#1b2127] ${setting.color === 'slate' ? 'text-slate-400 group-hover:text-white' : `text-${setting.color}-400 group-hover:text-${setting.color}-300`} transition-colors`}
                                    style={setting.color === 'slate' ? {} : undefined}
                                >
                                    <span className="material-symbols-outlined">{setting.icon}</span>
                                </div>
                                <span
                                    className={`text-xs font-bold ${colors.bg} ${colors.text} px-2 py-1 rounded`}
                                >
                                    {levelLabel}
                                </span>
                            </div>

                            <h3 className="text-white font-bold mb-1">{setting.title}</h3>
                            <p className="text-slate-400 text-sm">{setting.description}</p>

                            {setting.type === 'slider' ? (
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={settings[setting.id]}
                                    onChange={(e) => handleSliderChange(setting.id, parseInt(e.target.value))}
                                    className={`w-full mt-4 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer ${colors.accent}`}
                                />
                            ) : (
                                <div className="w-full bg-slate-800 rounded-full h-1 mt-6">
                                    <div
                                        className="bg-cyan-500 h-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                        style={{ width: `${settings[setting.id]}%` }}
                                    />
                                </div>
                            )}
                        </GlassPanel>
                    )
                })}
            </div>
        </>
    )
}