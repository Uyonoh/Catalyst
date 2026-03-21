import Header from "../components/Header";
import Footer from "../components/Footer";
import VaultBackground from "../components/vault/VaultBackground";
import VaultHero from "../components/vault/VaultHero";
import VaultFeatured from "../components/vault/VaultFeatured";
import VaultSearch from "../components/vault/VaultSearch";
import VaultTags from "../components/vault/VaultTags";
import VaultGrid from "../components/vault/VaultGrid";
import { VaultItem } from "../components/vault/VaultCard";

const VAULT_ITEMS: VaultItem[] = [
  {
    id: 1,
    title: "SEO Blog Generator",
    updated: "2h ago",
    snippet:
      'Act as an SEO expert. Write a 1500-word comprehensive guide on "Future of AI in Marketing". Include H2, H3 headers, meta description, and focus on keywords: [keywords_list]...',
    model: "GPT-4 Turbo",
    modelColor: "green",
    tag: "#Marketing",
    icon: "description",
    iconColor: "cyan",
    hasGradient: true,
  },
  {
    id: 2,
    title: "Python Debugger",
    updated: "1d ago",
    snippet:
      "Analyze the following Python script for memory leaks and efficiency issues. Suggest optimizations using the latest libraries for data processing...",
    model: "Claude 3 Opus",
    modelColor: "purple",
    tag: "#Coding",
    icon: "terminal",
    iconColor: "orange",
    hasGradient: false,
  },
  {
    id: 3,
    title: "Email Polisher",
    updated: "3d ago",
    snippet:
      "Rewrite this email to sound more professional but empathetic. The context is explaining a project delay to a client due to unforeseen technical debt...",
    model: "Llama 3",
    modelColor: "orange",
    tag: "#Business",
    icon: "mail",
    iconColor: "blue",
    hasGradient: false,
  },
  {
    id: 4,
    title: "Midjourney Sci-Fi",
    updated: "1w ago",
    snippet:
      "/imagine prompt: A futuristic cyberpunk city street at night, neon rain, reflections on wet pavement, cinematic lighting, 8k resolution, highly detailed...",
    model: "Midjourney v6",
    modelColor: "cyan",
    tag: "#Creative",
    icon: "palette",
    iconColor: "cyan",
    hasGradient: true,
  },
  {
    id: 5,
    title: "SQL Join Builder",
    updated: "1w ago",
    snippet:
      "Create a complex SQL query that joins 'Users', 'Orders', and 'Products' tables. Calculate LTV per user and filter for users who have purchased in the last 30 days...",
    model: "GPT-4 Turbo",
    modelColor: "green",
    tag: "#Data",
    icon: "database",
    iconColor: "green",
    hasGradient: false,
  },
  {
    id: 6,
    title: "React Hook Gen",
    updated: "2w ago",
    snippet:
      "Create a custom React hook called useLocalStorage that handles setting, getting, and listening for changes in local storage keys with TypeScript support...",
    model: "Claude 3 Opus",
    modelColor: "purple",
    tag: "#Dev",
    icon: "code",
    iconColor: "pink",
    hasGradient: false,
  },
];

export default function VaultPage() {
  return (
    <>
      <VaultBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 w-full max-w-[1200px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
          <VaultHero />
          <VaultFeatured />
          <VaultSearch />
          <VaultTags />
          <VaultGrid items={VAULT_ITEMS} />
        </main>

        <Footer />
      </div>
    </>
  );
}
