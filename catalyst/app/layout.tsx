import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { ClickFeedbackProvider } from "./components/ClickFeedbackProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Catalyst Studio | Professional Prompt Optimization",
  description:
    "Transform your raw ideas into high-performance AI prompts with our Studio's live analysis and professional library.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col overflow-x-hidden selection:bg-cyan-500/30`}
      >
        <AuthProvider>
          <ClickFeedbackProvider>{children}</ClickFeedbackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
