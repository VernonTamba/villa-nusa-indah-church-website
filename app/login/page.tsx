"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconEye, IconEyeOff, IconLock, IconMail, IconSparkles } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email atau password salah. Silakan coba lagi.");
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5" noValidate>
      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="login-email"
          className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/70"
        >
          Email
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40">
            <IconMail size={17} stroke={1.8} />
          </span>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@vni-church.org"
            className="w-full rounded-2xl border border-white/12 bg-white/8 py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none ring-0 transition-all duration-200 focus:border-emerald-500/60 focus:bg-white/12 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="login-password"
          className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/70"
        >
          Password
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40">
            <IconLock size={17} stroke={1.8} />
          </span>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-white/12 bg-white/8 py-3.5 pl-11 pr-12 text-sm text-white placeholder-white/30 outline-none ring-0 transition-all duration-200 focus:border-emerald-500/60 focus:bg-white/12 focus:ring-2 focus:ring-emerald-500/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white/70 transition-colors"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <IconEyeOff size={17} stroke={1.8} />
            ) : (
              <IconEye size={17} stroke={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 py-3.5 text-sm font-bold tracking-wide text-white shadow-[0_8px_24px_rgba(1,75,63,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(1,75,63,0.5)] disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Masuk...
          </span>
        ) : (
          "Masuk ke Admin Panel"
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(1,75,63,0.28),transparent_65%)]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(248,167,36,0.14),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.6)_0%,rgba(2,6,23,0.3)_100%)]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400 backdrop-blur-md">
            <IconSparkles size={14} />
            Admin Portal
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
            GMAHK Villa Nusa Indah
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Masuk untuk mengelola konten website jemaat
          </p>
        </div>

        {/* Form card */}
        <div className="overflow-hidden rounded-[28px] border border-white/12 bg-white/6 backdrop-blur-2xl shadow-[0_32px_80px_rgba(2,6,23,0.5)]">
          <div className="p-8">
            {/* Suspense required because LoginForm uses useSearchParams */}
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-10">
                  <svg
                    className="h-6 w-6 animate-spin text-white/40"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>

          <div className="border-t border-white/8 px-8 py-4">
            <p className="text-center text-[11px] text-white/30">
              Akses terbatas untuk administrator jemaat VNI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
