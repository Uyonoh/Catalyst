import { useState, useEffect } from "react";
import { FieldsState } from "./usePromptBuilder";

export interface SessionHistoryItem {
  id: string;
  label: string;
  fields: FieldsState;
  timestamp: number;
}

const LOCAL_STORAGE_KEY = "catalyst_image_sessions";
const MAX_SESSIONS = 12;

export function useSessionHistory() {
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load sessions from localStorage", e);
    }
  }, []);

  const addSession = (subjectText: string, fields: FieldsState) => {
    const label = subjectText.trim() ? subjectText.trim() : "Untitled Generation";
    
    setSessions((prev) => {
      const newSession: SessionHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        label,
        fields: JSON.parse(JSON.stringify(fields)), // Deep clone fields state
        timestamp: Date.now(),
      };

      // Add to beginning of history list
      let updated = [newSession, ...prev];

      // Enforce Cap: discard oldest when exceeding 12
      if (updated.length > MAX_SESSIONS) {
        updated = updated.slice(0, MAX_SESSIONS);
      }

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save sessions to localStorage", e);
      }

      return updated;
    });
  };

  const clearHistory = () => {
    setSessions([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to remove sessions from localStorage", e);
    }
  };

  return {
    sessions,
    addSession,
    clearHistory,
  };
}
