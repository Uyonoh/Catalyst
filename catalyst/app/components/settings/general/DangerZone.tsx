"use client";

import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { Loader2, AlertTriangle, X } from "lucide-react";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function DangerZone() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch("/api/settings/delete-account", { method: "POST" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete account");
      }
      // On success, the API route will have deleted the user.
      // Sign out on the client to clear session and redirect.
      await supabaseBrowser.auth.signOut();
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-3xl mt-12">
        <h3 className="text-xl font-bold text-red-400 flex items-center gap-2 border-b border-red-500/20 pb-4">
          <AlertTriangle className="size-5" /> Danger Zone
        </h3>
        
        <div className="bg-red-500/5 rounded-2xl border border-red-500/20 px-6">
          <SettingsFormRow
            label="Delete Account"
            description="Permanently delete your account, prompts, workspaces, and all associated data. This action cannot be undone."
          >
            <button
              onClick={() => setIsOpen(true)}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium px-4 py-2.5 rounded-xl border border-red-500/20 transition-colors w-full md:w-auto"
            >
              Delete Account
            </button>
          </SettingsFormRow>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-background-dark border border-red-500/30 rounded-3xl p-6 md:p-8 w-full max-w-md relative animate-slideDown shadow-neon-strong">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
              disabled={isDeleting}
            >
              <X className="size-5" />
            </button>

            <div className="flex flex-col gap-4">
              <div className="size-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center border border-red-500/20 mb-2">
                <AlertTriangle className="size-6" />
              </div>
              
              <h2 className="text-2xl font-bold text-white">Delete Account</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                This will permanently delete your account and all your data. 
                Are you absolutely sure you want to do this?
              </p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Please type <span className="text-red-400 font-mono font-bold select-all">DELETE</span> to confirm.
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors font-mono"
                  disabled={isDeleting}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={confirmText !== "DELETE" || isDeleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting && <Loader2 className="size-4 animate-spin" />}
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
