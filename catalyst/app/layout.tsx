import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { ClickFeedbackProvider } from "./components/ClickFeedbackProvider";

import { getCategories } from "./lib/categories";
import { getModels } from "./lib/models";
import { CatalogProvider } from "./context/CatalogContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Catalyst | Professional Prompt Optimization",
    template: "%s | Catalyst",
  },
  description:
    "Transform your raw ideas into high-performance AI prompts with our Studio and professional library.",
  keywords: [
    "Ai Propmt generator",
    "Free prompts",
    "Best ChatGPT propmts",
    "Best Claude propmts",
  ],
  verification: {
    // google: 'BW3giniw1EydeTftID8VS2n2elApCe7pjKByxwfwPiU' // Onomah
    google: "cjK7AMrx63AvyjmZa2NMJ5OrBqexsGy0ToNSbO3vbJM",
  },
  alternates: {
    canonical: "https://prompts.uyonoh.com",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, models] = await Promise.all([
    getCategories(),
    getModels(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Catalyst",
    alternateName: ["Catalyst Studio", "Catalyst AI Studio"],
    url: "https://prompts.uyonoh.com",
    operatingSystem: "All",
    applicationCategory: "WebApplication",
    description:
      "Transform your raw ideas into high-performance AI prompts with our Studio and professional library.",
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col overflow-x-hidden selection:bg-cyan-500/30`}
      >
        <CatalogProvider categories={categories} models={models}>
          <AuthProvider>
            <ClickFeedbackProvider>{children}</ClickFeedbackProvider>
          </AuthProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
