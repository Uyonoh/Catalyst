import { useState, useEffect } from "react";
import { FieldsState } from "./usePromptBuilder";

export interface Preset {
  id: string;
  name: string;
  fields: FieldsState;
  createdAt: number;
}

const LOCAL_STORAGE_KEY = "catalyst_image_presets";
const MAX_PRESETS = 20;

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setPresets(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load presets from localStorage", e);
    }
  }, []);

  const savePreset = (name: string, fields: FieldsState) => {
    if (!name.trim()) return;

    setPresets((prev) => {
      const newPreset: Preset = {
        id: Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        fields,
        createdAt: Date.now(),
      };

      // Put the new preset at the top
      let updated = [newPreset, ...prev];

      // Enforce Cap: discard oldest when exceeding 20
      if (updated.length > MAX_PRESETS) {
        updated = updated.slice(0, MAX_PRESETS);
      }

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save presets to localStorage", e);
      }

      return updated;
    });
  };

  const deletePreset = (id: string) => {
    setPresets((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save presets to localStorage", e);
      }
      return updated;
    });
  };

  return {
    presets,
    savePreset,
    deletePreset,
  };
}
