"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GlassPanel from "../components/GlassPanel";
import { Scale, FileCheck, AlertTriangle, HelpCircle } from "lucide-react";

export default function TermsOfUsePage() {
  const lastUpdated = "April 19, 2024";

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-[1000px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
        <div className="flex flex-col gap-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tight">Terms of Use</h1>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
              Last Updated: {lastUpdated}
            </p>
          </div>

          <GlassPanel className="p-8 md:p-10 space-y-12">
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400 mb-2">
                <Scale className="size-6" />
                <h2 className="text-2xl font-bold text-white">1. Agreement to Terms</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                By accessing or using Catalyst Studio, you agree to be bound by these Terms of Use. If you disagree with any part of these terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the service.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400 mb-2">
                <FileCheck className="size-6" />
                <h2 className="text-2xl font-bold text-white">2. Use License</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Permission is granted to temporarily use Catalyst Studio for personal or commercial prompt engineering purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Attempt to decompile or reverse engineer any software contained in Catalyst Studio.</li>
                <li>Remove any copyright or other proprietary notations from the materials.</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
                <li>Use the service for any illegal or unauthorized purpose.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400 mb-2">
                <AlertTriangle className="size-6" />
                <h2 className="text-2xl font-bold text-white">3. Disclaimer</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The materials on Catalyst Studio are provided on an 'as is' basis. Catalyst makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-3 text-cyan-400 mb-2">
                <HelpCircle className="size-6" />
                <h2 className="text-2xl font-bold text-white">4. Limitations</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                In no event shall Catalyst or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Catalyst Studio, even if Catalyst or a Catalyst authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="pt-8 border-t border-white/5">
              <p className="text-slate-500 text-sm italic">
                Questions about the Terms of Use should be sent to us at legal@catalyst-studio.ai
              </p>
            </section>
          </GlassPanel>
        </div>
      </main>
      <Footer />
    </>
  );
}
