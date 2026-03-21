import Navbar from './components/Navbar'
import Header from './components/Header'
import Footer from './components/Footer'
import RawIntentPanel from './components/RawIntentPanel'
import LiveAnalysisPanel from './components/LiveAnalysisPanel'
import OptimizationSettings from './components/OptimizationSettings'
import { WorkspaceProvider } from '../context/WorkspaceContext'

export default function WorkspacePage() {
    return (
        <WorkspaceProvider>
            {/* Background gradient blurs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col gap-6 md:gap-8">
                    <Header />

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

                <Footer />
            </div>

            {/* Bottom gradient line */}
            <div className="fixed bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent pointer-events-none" />
        </WorkspaceProvider>
    )
}

