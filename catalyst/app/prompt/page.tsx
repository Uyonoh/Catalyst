import Navbar from './components/Navbar'
import RawIntentPanel from './components/RawIntentPanel'
import LiveAnalysisPanel from './components/LiveAnalysisPanel'
import OptimizationSettings from './components/OptimizationSettings'

export default function PromptPage() {
    return (
        <>
            {/* Background gradient blurs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto px-6 py-8 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        Catalyst Workspace
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Transform your raw ideas into optimized prompts with live analysis.
                    </p>
                </div>

                {/* Main workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[450px]">
                    <RawIntentPanel />
                    <LiveAnalysisPanel />
                </div>

                {/* Settings section - Now full width */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-12 flex flex-col gap-4">
                        <OptimizationSettings />
                    </div>
                </div>
            </main>

            {/* Bottom gradient line */}
            <div className="fixed bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />
        </>
    )
}