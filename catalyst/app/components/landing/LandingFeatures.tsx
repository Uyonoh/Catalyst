import Image from "next/image";
import { Sparkles, Library, Layers } from "lucide-react";

const features = [
  {
    title: "Dual-Engine Prompt & Media Studio",
    description:
      "Transform raw ideas into high-performance instructions across GPT-4o, Claude 3.5 Sonnet, Gemini, and Midjourney. Fine-tune system context, output format (JSON, Markdown, Code), and lighting/style parameters in real-time.",
    icon: <Sparkles className="w-6 h-6 text-cyan-400" />,
    image: "/landing/feature_studio.png",
    reversed: false,
  },
  {
    title: "Community & Curated Prompt Library",
    description:
      "Discover, bookmark, and import battle-tested prompts directly into your studio workspace. Filter seamlessly by category, tags, and AI model architecture.",
    icon: <Library className="w-6 h-6 text-cyan-400" />,
    image: "/landing/feature_library.png",
    reversed: true,
  },
  {
    title: "Transparent & Flexible Plans",
    description:
      "Scale seamlessly from the free Spark tier to high-capacity Nova and Ultra plans. Unlock deep prompt analysis, custom model integrations, and unlimited managed workspaces.",
    icon: <Layers className="w-6 h-6 text-cyan-400" />,
    image: "/landing/feature_pricing.png",
    reversed: false,
  },
];

export default function LandingFeatures() {
  return (
    <section className="pt-24 pb-12 relative z-10 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Designed for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              clarity.
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We stripped away the clutter to give you a powerful core feature set
            that respects your focus and workflow.
          </p>
        </div>

        <div className="space-y-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-16 ${
                feature.reversed ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mt-4">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  {feature.description}
                </p>
                <div className="pt-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-full"></div>
                </div>
              </div>

              {/* Image Content */}
              <div className="flex-1 w-full pb-[100%] lg:pb-0 relative">
                <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2 overflow-hidden group">
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={800}
                    height={600}
                    className="rounded-xl w-full h-auto object-cover border border-white/[0.03] shadow-2xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
