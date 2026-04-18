"use client";

import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

export default function AccountSecurityForm({ user }: { user: User }) {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSaving, setIsEmailSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isEmailAuth = user.app_metadata.provider === "email";

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsEmailSaving(true);
    setEmailMessage(null);
    try {
      const { error } = await supabaseBrowser.auth.updateUser({ email });
      if (error) throw error;
      setEmailMessage({ type: "success", text: "Confirmation links sent to both old and new email addresses." });
      setEmail("");
    } catch (err: any) {
      setEmailMessage({ type: "error", text: err.message || "Failed to update email." });
    } finally {
      setIsEmailSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !currentPassword) return;

    setIsPasswordSaving(true);
    setPasswordMessage(null);
    try {
      // First verify the current password
      if (user.email) {
        const { error: verifyError } = await supabaseBrowser.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

        if (verifyError) {
          throw new Error("Current password is incorrect.");
        }
      }

      // If verified, proceed to update
      const { error } = await supabaseBrowser.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setPasswordMessage({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPasswordMessage({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      <div className="bg-white/5 rounded-2xl border border-white/10 px-6 py-2">
        <form onSubmit={handleEmailChange}>
          <SettingsFormRow
            label="Email Address"
            description={`Current: ${user.email}`}
          >
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="New email address"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                disabled={isEmailSaving}
              />
              <div className="flex justify-between items-center gap-4">
                {emailMessage && (
                  <p className={`text-xs ${emailMessage.type === "error" ? "text-red-400" : "text-green-400"}`}>
                    {emailMessage.text}
                  </p>
                )}
                {!emailMessage && <div />}
                <button
                  type="submit"
                  disabled={isEmailSaving || !email}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isEmailSaving && <Loader2 className="size-3 animate-spin" />}
                  Update Email
                </button>
              </div>
            </div>
          </SettingsFormRow>
        </form>

        {isEmailAuth && (
          <form onSubmit={handlePasswordChange}>
            <SettingsFormRow
              label="Password"
              description="Change your account password."
            >
              <div className="flex flex-col gap-3">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  disabled={isPasswordSaving}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  disabled={isPasswordSaving}
                  minLength={6}
                />
                <div className="flex justify-between items-center gap-4">
                  {passwordMessage && (
                    <p className={`text-xs ${passwordMessage.type === "error" ? "text-red-400" : "text-green-400"}`}>
                      {passwordMessage.text}
                    </p>
                  )}
                  {!passwordMessage && <div />}
                  <button
                    type="submit"
                    disabled={isPasswordSaving || !newPassword}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isPasswordSaving && <Loader2 className="size-3 animate-spin" />}
                    Update Password
                  </button>
                </div>
              </div>
            </SettingsFormRow>
          </form>
        )}
      </div>
    </div>
  );
}
