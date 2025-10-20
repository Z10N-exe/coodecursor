"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthService } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const authService = AuthService.getInstance();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      identifier: String(formData.get("identifier") || ""),
      password: String(formData.get("password") || ""),
    };
    setSubmitting(true);
    try {
      await authService.login(payload.identifier, payload.password);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-6 sm:px-10 py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="opacity-80 mt-2">Login to your dashboard</p>

        <form className="glass rounded-2xl p-6 mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="text-sm">
            <span className="opacity-80">Email or Phone</span>
            <input required name="identifier" className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2" />
          </label>
          <label className="text-sm">
            <span className="opacity-80">Password</span>
            <input required name="password" type="password" className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2" />
          </label>


          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>
            <a href="/reset-password" className="underline">Forgot password?</a>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button className="btn-primary w-full rounded-md px-4 py-3 font-semibold mt-2" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-sm opacity-80 mt-4">Don’t have an account? <a href="/signup" className="underline">Create Account</a></p>
      </div>
    </div>
  );
}


