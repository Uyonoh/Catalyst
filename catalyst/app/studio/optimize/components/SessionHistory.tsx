"use client";

import React from "react";
import { History, Trash } from "lucide-react";
import { useSessionHistory } from "../hooks/useSessionHistory";
import { FieldsState } from "../hooks/usePromptBuilder";
import GlassPanel from "../../../components/GlassPanel";

interface SessionHistoryProps {
  onRestoreSession: (fields: FieldsState) => void;
  onNotify: (msg: string, type: "success" | "info" | "error") => void;
  // External hook sync
  historyHook: ReturnType<typeof useSessionHistory>;
}

export default function SessionHistory({
  onRestoreSession,
  onNotify,
  historyHook,
}: SessionHistoryProps) {
  const { sessions, clearHistory } = historyHook;

  const formatRelativeTime = (timestamp: number) => {
    const elapsed = Date.now() - timestamp;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <GlassPanel className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <History className="size-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Generation History
          </h3>
        </div>
        {sessions.length > 0 && (
          <button
            onClick={() => {
              clearHistory();
              onNotify("Session history cleared", "info");
            }}
            className="text-[10px] text-slate-500 hover:text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash className="size-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto dropdown-scroll">
        {sessions.length === 0 ? (
          <span className="text-[11px] text-slate-500 italic py-2">
            No past generations in this session.
          </span>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => {
                onRestoreSession(session.fields);
                onNotify(`Restored session generation`, "success");
              }}
              className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-left transition-all cursor-pointer group w-full"
            >
              <span className="text-[11px] font-bold text-slate-300 group-hover:text-white truncate flex-1 pr-2">
                {session.label}
              </span>
              <span className="text-[9px] text-slate-500 shrink-0 font-medium font-mono">
                {formatRelativeTime(session.timestamp)}
              </span>
            </button>
          ))
        )}
      </div>
    </GlassPanel>
  );
}
