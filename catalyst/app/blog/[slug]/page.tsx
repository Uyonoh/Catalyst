import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  getBlogPost,
  getBlogPosts,
  getAllBlogSlugs,
  BlogSection,
  BlogPost,
} from "../../lib/blog";
import {
  ArrowLeft,
  Clock,
  ArrowRight,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Info,
  Tag,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Catalyst Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPost(slug), getBlogPosts()]);

  if (!post) notFound();

  // Related posts (exclude current, take up to 3)
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <Header />

      {/* Ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#258cf4]/5 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none z-0" />

      <main className="flex-1 relative z-10">
        {/* ── Article Header ──────────────────────────────────── */}
        <section className="relative pt-12 pb-10 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-b ${post.cover_gradient} opacity-40 pointer-events-none`}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm font-medium mb-10 group transition-colors duration-200"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Blog
            </Link>

            {/* Category & meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${post.category_color}`}
              >
                {post.category}
              </span>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <Clock className="size-3.5" />
                <span>{post.read_time}</span>
              </div>
              <span className="text-slate-500 text-xs">
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-5">
              {post.title}
            </h1>

            <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-8">
              {post.subtitle}
            </p>

            {/* Author chip */}
            <div className="flex items-center gap-3 py-4 border-t border-b border-white/10">
              <div
                className={`size-10 rounded-full bg-gradient-to-br ${post.author_color} flex items-center justify-center text-white text-sm font-black`}
              >
                {post.author_initials}
              </div>
              <div>
                <p className="text-white text-sm font-bold">{post.author_name}</p>
                <p className="text-slate-500 text-xs">{post.author_role}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Article Body ──────────────────────────────────────── */}
        <section className="pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col gap-8">
              {post.content.map((section, i) => (
                <ContentBlock key={i} section={section} />
              ))}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-3">
                <Tag className="size-4 text-slate-500" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs font-medium hover:border-cyan-500/20 hover:text-cyan-400 transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Related Posts ─────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="pb-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
              <h2 className="text-xl font-black text-white mb-10 tracking-tight">
                More Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((p) => (
                  <RelatedCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

/* ── Related Card ──────────────────────────────────────────────── */
function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col glass-panel rounded-2xl border border-white/10 p-6 hover:border-cyan-500/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(37,140,244,0.08)]"
    >
      <div
        className={`size-12 rounded-2xl ${post.icon_bg} flex items-center justify-center ${post.icon_color} mb-4 group-hover:scale-110 transition-transform`}
      >
        <BookOpen className="size-5" />
      </div>
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${post.category_color} mb-3 w-fit`}
      >
        {post.category}
      </span>
      <h3 className="text-white font-bold leading-tight text-base group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
        {post.title}
      </h3>
      <p className="text-slate-400 text-sm line-clamp-2 flex-1">{post.excerpt}</p>
      <div className="flex items-center gap-2 text-cyan-500 text-xs font-bold mt-4 group-hover:gap-3 transition-all duration-200">
        <span>Read</span>
        <ArrowRight className="size-3" />
      </div>
    </Link>
  );
}

/* ── Content Renderer ──────────────────────────────────────────── */
function ContentBlock({ section }: { section: BlogSection }) {
  switch (section.type) {
    case "heading":
      return section.level === 2 ? (
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-4">
          {section.text}
        </h2>
      ) : (
        <h3 className="text-xl font-bold text-white tracking-tight mt-2">
          {section.text}
        </h3>
      );

    case "paragraph":
      return (
        <p className="text-slate-300 leading-[1.85] text-base md:text-[17px]">
          {section.text}
        </p>
      );

    case "list":
      return (
        <ul className="flex flex-col gap-4">
          {section.items?.map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-[6px] shrink-0 size-1.5 rounded-full bg-cyan-400" />
              <span
                className="text-slate-300 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: renderInline(item) }}
              />
            </li>
          ))}
        </ul>
      );

    case "callout": {
      const calloutStyles = {
        tip: {
          border: "border-emerald-500/30",
          bg: "bg-emerald-500/5",
          icon: <Lightbulb className="size-5 text-emerald-400 shrink-0 mt-0.5" />,
          label: "tip",
          labelColor: "text-emerald-400",
        },
        warning: {
          border: "border-orange-500/30",
          bg: "bg-orange-500/5",
          icon: <AlertTriangle className="size-5 text-orange-400 shrink-0 mt-0.5" />,
          label: "warning",
          labelColor: "text-orange-400",
        },
        info: {
          border: "border-blue-500/30",
          bg: "bg-blue-500/5",
          icon: <Info className="size-5 text-blue-400 shrink-0 mt-0.5" />,
          label: "note",
          labelColor: "text-blue-400",
        },
      };
      const variant = section.variant ?? "info";
      const style = calloutStyles[variant];
      return (
        <div
          className={`rounded-2xl border ${style.border} ${style.bg} p-5 flex gap-4 items-start`}
        >
          {style.icon}
          <div>
            <span
              className={`text-[11px] font-black uppercase tracking-wider ${style.labelColor} block mb-1`}
            >
              {style.label}
            </span>
            <p className="text-slate-300 text-sm leading-relaxed">
              {section.text}
            </p>
          </div>
        </div>
      );
    }

    case "code":
      return (
        <div className="code-preview rounded-2xl overflow-hidden">
          {section.language && (
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                {section.language}
              </span>
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-500/50" />
                <div className="size-2.5 rounded-full bg-yellow-500/50" />
                <div className="size-2.5 rounded-full bg-emerald-500/50" />
              </div>
            </div>
          )}
          <pre className="p-5 overflow-x-auto text-sm leading-relaxed text-slate-200">
            <code>{section.text}</code>
          </pre>
        </div>
      );

    case "divider":
      return (
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
      );

    default:
      return null;
  }
}

/** Converts **bold** markdown to <strong> tags */
function renderInline(text: string): string {
  return text.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="text-white font-semibold">$1</strong>'
  );
}
