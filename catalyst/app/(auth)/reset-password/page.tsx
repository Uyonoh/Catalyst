"use client";

import { Suspense, useState, useEffect } from "react";
import { supabaseBrowser } from "../../lib/supabase-browser";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "../../components/Skeleton";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabaseBrowser.auth.updateUser({ password });
      if (error) throw error;
      
      setMessage("Password successfully updated. Redirecting...");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center gap-3 mb-10 group">
        <div className="size-10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
          <LayoutGrid className="size-8" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Catalyst</h1>
      </Link>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl animate-slideUp">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Set New Password
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl mb-6 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Please wait..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 mb-10">
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton width={120} height={32} />
        </div>
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl flex flex-col gap-6">
          <Skeleton className="h-8 w-48 self-center" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-xl mt-2" />
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
