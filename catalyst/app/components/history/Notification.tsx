"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

export type NotificationType = "success" | "error" | "info";

interface NotificationProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose: () => void;
}

export default function Notification({
  message,
  type = "success",
  duration = 3000,
  onClose,
}: NotificationProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <CheckCircle2 className="size-5 text-emerald-400" />,
    error: <XCircle className="size-5 text-rose-400" />,
    info: <Info className="size-5 text-cyan-400" />,
  };

  const bgColors = {
    success: "bg-emerald-500/10 border-emerald-500/20",
    error: "bg-rose-500/10 border-rose-500/20",
    info: "bg-cyan-500/10 border-cyan-500/20",
  };

  return (
    <div
      className={`fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-auto z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-right-4 ${
        bgColors[type]
      } ${isExiting ? "opacity-0 translate-y-4 md:translate-x-12 scale-95" : "opacity-100"}`}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-bold text-white tracking-tight">{message}</p>
      <button
        onClick={handleClose}
        className="ml-2 p-1 rounded-lg hover:bg-white/5 text-slate-400 transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
