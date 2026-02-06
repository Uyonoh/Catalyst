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
    },
    {
        id: 'precision',
        title: 'Precision',
        description: 'Adherence to raw intent.',
        icon: 'ads_click',
        color: 'cyan',
        defaultValue: 50,
    },
    {
        id: 'length',
        title: 'Length',
        description: 'Output verbosity level.',
        icon: 'straighten',
        color: 'green',
        defaultValue: 25,
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

    const getLevelLabel = (value: number) => {
        if (value > 66) return 'High'
        if (value > 33) return 'Medium'
        return 'Short'
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SETTINGS.map((setting) => (
                    <GlassPanel
                        key={setting.id}
                        hoverable
                        className="p-5 rounded-xl cursor-pointer group border border-white/5 hover:border-cyan-500/30"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg bg-[#1b2127] text-${setting.color}-400 group-hover:text-${setting.color}-300 transition-colors`}>
                                <span className="material-symbols-outlined">{setting.icon}</span>
                            </div>
                            <span className={`text-xs font-bold bg-${setting.color}-500/20 text-${setting.color}-300 px-2 py-1 rounded`}>
                                {getLevelLabel(settings[setting.id])}
                            </span>
                        </div>

                        <h3 className="text-white font-bold mb-1">{setting.title}</h3>
                        <p className="text-slate-400 text-sm">{setting.description}</p>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings[setting.id]}
                            onChange={(e) => handleSliderChange(setting.id, parseInt(e.target.value))}
                            className={`w-full mt-4 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${setting.color}-500`}
                        />
                    </GlassPanel>
                ))}
            </div>
        </>
    )
}