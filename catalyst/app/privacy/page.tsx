"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GlassPanel from "../components/GlassPanel";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 19, 2024";

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-[1000px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
        <div className="flex flex-col gap-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
              Last Updated: {lastUpdated}
            </p>
          </div>

          <GlassPanel className="p-8 md:p-10 space-y-12">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400 mb-2">
                <ShieldCheck className="size-6" />
                <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                At Catalyst Studio ("Catalyst", "we", "us", or "our"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400 mb-2">
                <FileText className="size-6" />
                <h2 className="text-2xl font-bold text-white">2. Data We Collect</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li><span className="text-white font-medium">Identity Data:</span> includes first name, last name, username or similar identifier.</li>
                <li><span className="text-white font-medium">Contact Data:</span> includes email address and telephone numbers.</li>
                <li><span className="text-white font-medium">Technical Data:</span> includes internet protocol (IP) address, your login data, browser type and version.</li>
                <li><span className="text-white font-medium">Usage Data:</span> includes information about how you use our website, products and services.</li>
                <li><span className="text-white font-medium">Prompt Data:</span> includes the content of the prompts you create, analyze, and store in our studio.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400 mb-2">
                <Lock className="size-6" />
                <h2 className="text-2xl font-bold text-white">3. How We Use Your Data</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>To provide and maintain our service, including the Catalyst Studio.</li>
                <li>To manage your account and provide customer support.</li>
                <li>To improve our website, products/services, marketing, and customer relationships.</li>
                <li>To comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400 mb-2">
                <Eye className="size-6" />
                <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>

            <section className="pt-8 border-t border-white/5">
              <p className="text-slate-500 text-sm italic">
                If you have any questions about this privacy policy, please contact us at privacy@catalyst-studio.ai
              </p>
            </section>
          </GlassPanel>
        </div>
      </main>
      <Footer />
    </>
  );
}
