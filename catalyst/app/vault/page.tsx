import Navbar from '../prompt/components/Navbar'
import Footer from '../prompt/components/Footer'
import GlassPanel from '../prompt/components/GlassPanel'

export default function VaultPage() {
    return (
        <>
            {/* Background gradient blurs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8 flex flex-col">
                    {/* Hero Section */}
                    <div className="flex flex-col gap-2 mb-8">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
                            Prompt Vault
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Manage, optimize, and deploy your library of saved AI prompts. Your creative arsenal, organized.
                        </p>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        {/* Search */}
                        <div className="flex-1 group">
                            <div className="flex w-full items-center rounded-xl h-12 glass-panel border border-white/10 overflow-hidden px-4 transition-all duration-300 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                <span className="material-symbols-outlined text-cyan-400 mr-3">search</span>
                                <input className="w-full bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-base focus:outline-none" placeholder="Search prompts by keyword, model, or snippet..." type="text"/>
                                <div className="hidden sm:flex text-xs text-slate-500 border border-white/10 rounded px-2 py-0.5">⌘K</div>
                            </div>
                        </div>
                        {/* Sort/View Options */}
                        <div className="flex gap-2 shrink-0">
                            <button className="h-12 px-4 rounded-xl glass-panel text-white hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-colors active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                <span className="text-sm font-medium">Filter</span>
                            </button>
                            <button className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-primary text-white flex items-center justify-center hover:opacity-90 transition-colors shadow-neon active:scale-95">
                                <span className="material-symbols-outlined">add</span>
                            </button>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 dropdown-scroll">
                        <button className="whitespace-nowrap h-8 px-4 rounded-full bg-white text-[#101922] text-xs font-bold shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-transform active:scale-95">
                            All Prompts
                        </button>
                        <button className="whitespace-nowrap h-8 px-4 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/50 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95">
                            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                            #Creative
                        </button>
                        <button className="whitespace-nowrap h-8 px-4 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-green-400/50 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            #Coding
                        </button>
                        <button className="whitespace-nowrap h-8 px-4 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-purple-400/50 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95">
                            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                            #Marketing
                        </button>
                        <button className="whitespace-nowrap h-8 px-4 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-orange-400/50 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95">
                            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                            #Data Analysis
                        </button>
                        <button className="whitespace-nowrap h-8 px-4 rounded-full glass-panel border border-white/10 text-slate-300 hover:text-white hover:border-primary/50 text-xs font-medium transition-all flex items-center gap-1.5 active:scale-95">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            #Writing
                        </button>
                    </div>

                    {/* Grid Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <GlassPanel hoverable className="p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-opacity opacity-50 group-hover:opacity-100" />
                            <div className="flex justify-between items-start z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                        <span className="material-symbols-outlined">description</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors">SEO Blog Generator</h3>
                                        <p className="text-slate-500 text-xs mt-0.5">Updated 2h ago</p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="More options">
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                            </div>
                            <div className="h-[1px] w-full bg-white/5" />
                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-mono opacity-80 code-preview p-2 rounded border border-white/10">
                                Act as an SEO expert. Write a 1500-word comprehensive guide on &quot;Future of AI in Marketing&quot;. Include H2, H3 headers, meta description, and focus on keywords: [keywords_list]...
                            </p>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] font-semibold text-green-400 uppercase tracking-wide">GPT-4 Turbo</span>
                                    <span className="text-slate-500 text-xs font-medium">#Marketing</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Copy">
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Edit">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Card 2 */}
                        <GlassPanel hoverable className="p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20">
                                        <span className="material-symbols-outlined">terminal</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors">Python Debugger</h3>
                                        <p className="text-slate-500 text-xs mt-0.5">Updated 1d ago</p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="More options">
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                            </div>
                            <div className="h-[1px] w-full bg-white/5" />
                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-mono opacity-80 code-preview p-2 rounded border border-white/10">
                                Analyze the following Python script for memory leaks and efficiency issues. Suggest optimizations using the latest libraries for data processing...
                            </p>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-semibold text-purple-400 uppercase tracking-wide">Claude 3 Opus</span>
                                    <span className="text-slate-500 text-xs font-medium">#Coding</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Copy">
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Edit">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Card 3 */}
                        <GlassPanel hoverable className="p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors">Email Polisher</h3>
                                        <p className="text-slate-500 text-xs mt-0.5">Updated 3d ago</p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="More options">
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                            </div>
                            <div className="h-[1px] w-full bg-white/5" />
                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-mono opacity-80 code-preview p-2 rounded border border-white/10">
                                Rewrite this email to sound more professional but empathetic. The context is explaining a project delay to a client due to unforeseen technical debt...
                            </p>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[10px] font-semibold text-orange-400 uppercase tracking-wide">Llama 3</span>
                                    <span className="text-slate-500 text-xs font-medium">#Business</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Copy">
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Edit">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                            </div>
                        </GlassPanel>

                        {/* Card 4 */}
                        <GlassPanel hoverable className="p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-opacity opacity-50 group-hover:opacity-100" />
                            <div className="flex justify-between items-start z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                        <span className="material-symbols-outlined">palette</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors">Midjourney Sci-Fi</h3>
                                        <p className="text-slate-500 text-xs mt-0.5">Updated 1w ago</p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="More options">
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                            </div>
                            <div className="h-[1px] w-full bg-white/5" />
                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-mono opacity-80 code-preview p-2 rounded border border-white/10">
                                /imagine prompt: A futuristic cyberpunk city street at night, neon rain, reflections on wet pavement, cinematic lighting, 8k resolution, highly detailed...
                            </p>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-semibold text-cyan-400 uppercase tracking-wide">Midjourney v6</span>
                                    <span className="text-slate-500 text-xs font-medium">#Creative</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Copy">
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Edit">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                            </div>
                        </GlassPanel>
                        
                        {/* Card 5 */}
                        <GlassPanel hoverable className="p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
                                        <span className="material-symbols-outlined">database</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors">SQL Join Builder</h3>
                                        <p className="text-slate-500 text-xs mt-0.5">Updated 1w ago</p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="More options">
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                            </div>
                            <div className="h-[1px] w-full bg-white/5" />
                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-mono opacity-80 code-preview p-2 rounded border border-white/10">
                                Create a complex SQL query that joins 'Users', 'Orders', and 'Products' tables. Calculate LTV per user and filter for users who have purchased in the last 30 days...
                            </p>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] font-semibold text-green-400 uppercase tracking-wide">GPT-4 Turbo</span>
                                    <span className="text-slate-500 text-xs font-medium">#Data</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Copy">
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Edit">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                            </div>
                        </GlassPanel>
                        
                        {/* Card 6 */}
                        <GlassPanel hoverable className="p-5 flex flex-col gap-4 group cursor-pointer relative overflow-hidden active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start z-10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
                                        <span className="material-symbols-outlined">code</span>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors">React Hook Gen</h3>
                                        <p className="text-slate-500 text-xs mt-0.5">Updated 2w ago</p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="More options">
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                            </div>
                            <div className="h-[1px] w-full bg-white/5" />
                            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 font-mono opacity-80 code-preview p-2 rounded border border-white/10">
                                Create a custom React hook called useLocalStorage that handles setting, getting, and listening for changes in local storage keys with TypeScript support...
                            </p>
                            <div className="mt-auto pt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] font-semibold text-purple-400 uppercase tracking-wide">Claude 3 Opus</span>
                                    <span className="text-slate-500 text-xs font-medium">#Dev</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Copy">
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                    </button>
                                    <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-cyan-400 transition-colors" title="Edit">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                            </div>
                        </GlassPanel>

                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}
