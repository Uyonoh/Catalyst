import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StudioPageContent from "./StudioPageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Generator Studio - Craft & Refine AI Prompts",
  description: "Refine your ideas into high-quality, purpose-driven prompts.",
};

export default function StudioPage() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Header />
      <StudioPageContent />
      <Footer />
    </div>
  );
}
