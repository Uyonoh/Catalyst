import { ReactNode } from 'react'

interface GlassPanelProps {
    children: ReactNode
    className?: string
    hoverable?: boolean
    gradientBorder?: boolean
}

export default function GlassPanel({
    children,
    className = '',
    hoverable = false,
    gradientBorder = false
}: GlassPanelProps) {
    if (gradientBorder) {
        return (
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-primary rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                <div className={`relative glass-panel rounded-xl p-6 ${className}`}>
                    {children}
                </div>
            </div>
        )
    }

    return (
        <div className={`glass-panel rounded-xl ${className} ${hoverable ? 'hover:bg-white/5 transition-colors' : ''}`}>
            {children}
        </div>
    )
}