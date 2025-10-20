"use client";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen px-6 sm:px-10 py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold">Reset password</h1>
        <p className="opacity-80 mt-2">Enter your email to receive a reset link.</p>

        <form className="glass rounded-2xl p-6 mt-6 space-y-4">
          <label className="text-sm">
            <span className="opacity-80">Email</span>
            <input required type="email" name="email" className="mt-1 w-full rounded-md bg-black/20 border border-white/20 px-3 py-2" />
          </label>
          <button className="btn-primary w-full rounded-md px-4 py-3 font-semibold mt-2">
            Send reset link
          </button>
        </form>
      </div>
    </div>
  );
}


