"use client";

import { Suspense, useState } from "react";
import { supabaseBrowser } from "../../lib/supabase-browser";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "../../components/Skeleton";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "forgot_password">("login");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "forgot_password") {
        const { error } = await supabaseBrowser.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          console.error("Eror generating password reset: ", error);
          throw new Error(`We encountered an error when processing your password reset.\nPlease try again later or contact support`);
        }
        setMessage("Check your email for the password reset link.");
        setMode("login");
        return;
      }

      if (mode === "login") {
        const { error } = await supabaseBrowser.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.error("Login error: ", error);
          throw error;
        }
        router.push(nextParam || "/studio");
        router.refresh();
      } else { // Mode == register
        const { error } = await supabaseBrowser.auth.signUp({
          email,
          password,
          options: {
            // we will require manual updates for the profile at signup later
          },
        });
        if (error) throw error;
        // Depending on email confirm setting, they might need to confirm email.
        // Assuming auto-confirm for now or we just show a message.
        setMessage("Check your email for the confirmation link.");
        setMode("login");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      const { error } = await supabaseBrowser.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${nextParam ? decodeURIComponent(nextParam) : "/studio"}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "An error occurred");
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
          {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
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

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              required
              placeholder="you@example.com"
            />
          </div>

          {mode !== "forgot_password" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-400">
                  Password
                </label>
                {mode === "login" && (
                  <button type="button" onClick={() => setMode("forgot_password")} className="text-xs text-cyan-400 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
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
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link"}
          </button>
        </form>

        {mode !== "forgot_password" && (
          <>
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-sm border-white/10 text-slate-500">or</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <p className="mt-6 text-center text-sm text-slate-400">
          {mode === "login" ? "Don't have an account?" : mode === "signup" ? "Already have an account?" : "Remembered your password?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-cyan-400 hover:underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-12 w-full rounded-xl mt-2" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
