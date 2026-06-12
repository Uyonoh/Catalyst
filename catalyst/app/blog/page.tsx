import { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { blogPosts } from "./data";
import { BookOpen, Clock, ArrowRight, Rss } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Catalyst Prompt Studio",
  description:
    "Expert guides, techniques, and insights on prompt engineering, AI models, and the future of AI communication — from the Catalyst team.",
};

export default function BlogPage() {
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);

  return (
    <>
      <Header />

      {/* Ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#258cf4]/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />

      <main className="flex-1 relative z-10">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative pt-14 pb-20 overflow-hidden">
          {/* top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6">
                <Rss className="size-3" />
                <span>The Catalyst Blog</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
                Insights on{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Prompt Engineering
                </span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Expert guides, in-depth techniques, and practical insights to
                help you get more from every AI interaction.
              </p>
            </div>

            {/* ── Featured Post ─────────────────────────────────── */}
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="relative glass-panel rounded-3xl border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(37,140,244,0.1)]">
                {/* gradient bg strip */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${featured.coverGradient} pointer-events-none`}
                />

                <div className="relative z-10 p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
                  {/* Left: text */}
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${featured.categoryColor}`}
                      >
                        {featured.category}
                      </span>
                      <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold">
                        Featured
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                      {featured.title}
                    </h2>
                    <p className="text-slate-400 leading-relaxed text-base md:text-lg line-clamp-3">
                      {featured.excerpt}
                    </p>

                    <div className="flex items-center gap-5 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        <span>{featured.readTime}</span>
                      </div>
                      <span>{featured.publishedAt}</span>
                    </div>

                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mt-2 group-hover:gap-4 transition-all duration-300">
                      <span>Read Article</span>
                      <ArrowRight className="size-4" />
                    </div>
                  </div>

                  {/* Right: decorative card */}
                  <div className="relative aspect-[4/3] rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden flex items-center justify-center">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${featured.coverGradient} opacity-60`}
                    />
                    <div
                      className={`size-20 rounded-3xl ${featured.iconBg} flex items-center justify-center ${featured.iconColor} relative z-10`}
                    >
                      <BookOpen className="size-10" />
                    </div>
                    {/* decorative grid lines */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute left-0 right-0 border-t border-white/20"
                          style={{ top: `${(i + 1) * 16.666}%` }}
                        />
                      ))}
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 border-l border-white/20"
                          style={{ left: `${(i + 1) * 16.666}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Post Grid ─────────────────────────────────────────── */}
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="text-xl font-black text-white tracking-tight">
                All Articles
                <span className="ml-3 text-sm font-medium text-slate-500">
                  {blogPosts.length} posts
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter CTA ─────────────────────────────────────── */}
        <section className="pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="relative glass-panel rounded-3xl border border-white/10 p-8 md:p-12 text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[200%] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <div className="size-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mx-auto mb-6">
                  <Rss className="size-7" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
                  Stay Sharp. Stay Ahead.
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  New articles on prompt engineering, AI model analysis, and
                  workflow optimization — delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40 transition-colors text-sm"
                  />
                  <button className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:-translate-y-0.5">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ── Blog Card ─────────────────────────────────────────────────── */
import { BlogPost } from "./data";

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
      <div className="flex flex-col h-full glass-panel rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(37,140,244,0.08)] hover:-translate-y-1">
        {/* Card header stripe */}
        <div
          className={`relative h-36 bg-gradient-to-br ${post.coverGradient} border-b border-white/5 flex items-center justify-center overflow-hidden`}
        >
          <div
            className={`size-14 rounded-2xl ${post.iconBg} flex items-center justify-center ${post.iconColor} group-hover:scale-110 transition-transform duration-300`}
          >
            <BookOpen className="size-7" />
          </div>
          {/* decorative dots */}
          <div className="absolute bottom-3 right-4 flex gap-1.5 opacity-30">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="size-1.5 rounded-full bg-white" />
            ))}
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-col gap-3 p-6 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${post.categoryColor}`}
            >
              {post.category}
            </span>
          </div>

          <h3 className="text-white font-bold text-lg leading-tight group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/5">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="size-3" />
                <span>{post.readTime}</span>
              </div>
              <span>{post.publishedAt}</span>
            </div>
            <ArrowRight className="size-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
