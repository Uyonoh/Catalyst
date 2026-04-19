"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GlassPanel from "../components/GlassPanel";
import { Mail, MessageSquare, Phone, MapPin, Send, LifeBuoy } from "lucide-react";

export default function ContactSupportPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-[1200px] mx-auto pt-16 pb-12 px-4 md:px-8 relative z-10">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Contact & <span className="text-cyan-400">Support</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Have questions or need assistance? Our team is here to help you get the most out of Catalyst Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <GlassPanel className="p-6 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Get in Touch</h3>
                  <div className="space-y-4">
                    <ContactItem 
                      icon={<Mail className="size-5" />} 
                      title="Email" 
                      value="support@catalyst-studio.ai" 
                    />
                    <ContactItem 
                      icon={<MessageSquare className="size-5" />} 
                      title="Live Chat" 
                      value="Available Mon-Fri, 9am-6pm EST" 
                    />
                    <ContactItem 
                      icon={<Phone className="size-5" />} 
                      title="Phone" 
                      value="+1 (555) 000-0000" 
                    />
                    <ContactItem 
                      icon={<MapPin className="size-5" />} 
                      title="Office" 
                      value="123 AI Boulevard, Tech City, TC 94103" 
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Help Center</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Browse our documentation for quick answers to common questions.
                  </p>
                  <button className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <LifeBuoy className="size-4" />
                    Visit Help Center
                  </button>
                </div>
              </GlassPanel>
            </div>

            {/* Support Form */}
            <div className="lg:col-span-2">
              <GlassPanel className="p-8 md:p-10">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Subject</label>
                    <select className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none">
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Billing Question</option>
                      <option>Feature Request</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Message</label>
                    <textarea 
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button className="w-full py-4 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all">
                    <Send className="size-4" />
                    Send Message
                  </button>
                </form>
              </GlassPanel>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const ContactItem = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
  <div className="flex gap-4">
    <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</span>
      <span className="text-slate-200 text-sm md:text-base font-medium">{value}</span>
    </div>
  </div>
);
