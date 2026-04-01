"use client";

import { useState } from "react";
import SettingsFormRow from "../SettingsFormRow";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import { User } from "@supabase/supabase-js";
import { User as UserIcon, Upload, Loader2 } from "lucide-react";

export default function ProfileForm({ user, profile }: { user: User; profile: any }) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const { error } = await supabaseBrowser
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      setMessage(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabaseBrowser.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabaseBrowser.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabaseBrowser
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(data.publicUrl);
      setMessage({ type: "success", text: "Avatar updated successfully." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to upload avatar." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-3xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-8 mb-4 text-center sm:text-left pt-2 sm:pt-0">
        <label className="relative flex items-center justify-center size-24 sm:size-28 rounded-full bg-slate-800 border-2 border-white/10 group cursor-pointer overflow-hidden shrink-0 shadow-neon">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="size-10 sm:size-12 text-slate-500" />
          )}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isUploading ? (
              <Loader2 className="size-6 text-white animate-spin" />
            ) : (
              <Upload className="size-6 text-white" />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarUpload}
            disabled={isUploading}
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg sm:text-xl font-bold text-white">Profile Photo</h3>
          <p className="text-sm text-slate-400 max-w-[280px] sm:max-w-md">
            Click the image to upload a new avatar. Recommended size: 256x256px.
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 px-6">
        <SettingsFormRow
          label="Full Name"
          description="Your display name as seen by others."
        >
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </SettingsFormRow>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div>
          {message && (
            <p className={`text-sm ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>
              {message.text}
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
