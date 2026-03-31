import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StudioPageContent from "./StudioPageContent";

export default function StudioPage() {
  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <Header />
      <StudioPageContent />
      <Footer />
    </div>
  );
}
