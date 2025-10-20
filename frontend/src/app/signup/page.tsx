"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:3001/api";

export default function SignupPage() {
  const router = useRouter();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isAdult, setIsAdult] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const password = String(formData.get("password") || "");
    const confirm = String(formData.get("confirm") || "");
    const country = String(formData.get("country") || "").toUpperCase();
    const phone = String(formData.get("phone") || "");

    const policyOk = password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
    if (!policyOk) return setError("Password must be 12+ chars incl. uppercase, digit, special.");
    if (password !== confirm) return setError("Passwords do not match.");
    if (!/^\+[1-9]\d{6,14}$/.test(phone)) return setError("Phone must be E.164 format (e.g., +15551234567).");
    if (!/^[A-Z]{2}$/.test(country)) return setError("Country must be ISO alpha-2 (e.g., US).");

    const payload = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: String(formData.get("email") || "") || undefined,
      phone,
      country,
      password,
      isAdult,
      acceptTerms,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Failed to register");
      }
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen px-6 sm:px-10 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="opacity-80 mt-2">It only takes 60 seconds.</p>

        <form className="glass rounded-2xl p-6 mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm">
              <span className="opacity-80">First name</span>
              <input required name="firstName" className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="opacity-80">Surname</span>
              <input required name="lastName" className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2" />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm">
              <span className="opacity-80">Email</span>
              <input type="email" name="email" className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="opacity-80">Phone (E.164)</span>
              <input required name="phone" placeholder="+15551234567" className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2" />
            </label>
          </div>

          <label className="text-sm">
            <span className="opacity-80">Country</span>
            <input required name="country" placeholder="US" maxLength={2} className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2 uppercase" />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm">
              <span className="opacity-80">Password</span>
              <input required name="password" type="password" className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2" />
              <div className="text-xs opacity-70 mt-1">Min 12 chars, 1 uppercase, 1 digit, 1 special.</div>
            </label>
            <label className="text-sm">
              <span className="opacity-80">Confirm password</span>
              <input required name="confirm" type="password" className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2" />
            </label>
          </div>

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} required />
            <span>I confirm that I am 18 years of age or older.</span>
          </label>

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} required />
            <span>I agree to <a className="underline" href="#terms">Terms</a> & <a className="underline" href="#privacy">Privacy</a>.</span>
          </label>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button className="btn-primary w-full rounded-md px-4 py-3 font-semibold mt-2" disabled={!acceptTerms || !isAdult || submitting}>
            {submitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm opacity-80 mt-4">Already have an account? <a href="/login" className="underline">Login</a></p>
      </div>
    </div>
  );
}


