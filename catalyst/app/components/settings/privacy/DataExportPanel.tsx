"use client";

import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { Download, Loader2, Database } from "lucide-react";

export default function DataExportPanel() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Stub for real data export API
      // await fetch("/api/settings/export-data");
      
      const mockData = {
        exportedAt: new Date().toISOString(),
        note: "This is a stub for the full data export feature.",
        prompts: [],
        workspaces: []
      };

      const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `catalyst-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mt-12 bg-white/5 rounded-2xl border border-white/10 px-6 py-2 overflow-hidden">
      <SettingsFormRow
        label="Export Data"
        description="Download all your Catalyst prompts, workspaces, and preferences in a standard JSON format for local archival."
      >
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2 w-fit md:min-w-[160px]"
        >
          {isExporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Download .json
        </button>
      </SettingsFormRow>
    </div>
  );
}
