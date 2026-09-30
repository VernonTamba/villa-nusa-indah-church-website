"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLock,
  IconMail,
} from "@tabler/icons-react";

import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import AdventistLogo from "@/public/icons/advent.svg";
import { createClient } from "@/utils/supabase/client";

function LoginForm() {
  const { messages: t } = useLanguage();
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
      setError(t.login.error);
      setLoading(false);

      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form
      noValidate
      aria-busy={loading}
      aria-describedby="login-description login-restricted"
      className="space-y-6"
      onSubmit={handleLogin}
    >
      {/* Email */}
      <div className="space-y-2">
        <label className="ns-label" htmlFor="login-email">
          {t.login.email}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">
            <IconMail aria-hidden="true" size={20} stroke={1.8} />
          </span>
          <input
            required
            aria-describedby={error ? "login-error" : undefined}
            autoComplete="email"
            className="ns-field pl-11 pr-4"
            id="login-email"
            placeholder="admin@vni-church.org"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="ns-label" htmlFor="login-password">
          {t.login.password}
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">
            <IconLock aria-hidden="true" size={20} stroke={1.8} />
          </span>
          <input
            required
            aria-describedby={error ? "login-error" : undefined}
            autoComplete="current-password"
            className="ns-field pl-11 pr-14"
            id="login-password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            aria-controls="login-password"
            aria-label={showPassword ? t.login.hide : t.login.show}
            aria-pressed={showPassword}
            className="absolute inset-y-1 right-1 text-muted-foreground hover:text-foreground"
            size="public-icon"
            type="button"
            variant="ghost"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? (
              <IconEyeOff aria-hidden="true" size={20} stroke={1.8} />
            ) : (
              <IconEye aria-hidden="true" size={20} stroke={1.8} />
            )}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="ns-alert"
          data-tone="danger"
          id="login-error"
          role="alert"
        >
          <IconAlertCircle aria-hidden="true" size={20} stroke={1.8} />
          <p>{error}</p>
        </div>
      )}

      {/* Submit */}
      <Button
        className="w-full"
        disabled={loading}
        id="login-submit"
        size="public"
        type="submit"
        variant="public-primary"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <IconLoader2
              aria-hidden="true"
              className="animate-spin motion-reduce:animate-none"
              size={20}
            />
            {t.login.loading}
          </span>
        ) : (
          t.login.submit
        )}
      </Button>
      <span aria-live="polite" className="sr-only" role="status">
        {loading ? t.login.loading : ""}
      </span>
    </form>
  );
}

export default function LoginPage() {
  const { messages: t } = useLanguage();

  return (
    <main className="newskin flex min-h-svh items-center justify-center px-5 py-12 md:px-8">
      <div className="w-full max-w-md space-y-8">
        <header className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <span className="flex shrink-0 items-center justify-center rounded-xl bg-white p-2">
              <Image
                alt="Adventist Logo"
                height={32}
                src={AdventistLogo}
                width={32}
              />
            </span>
            <LanguageToggle />
          </div>
          <div className="space-y-4">
            <h1 className="ns-title">GMAHK Villa Nusa Indah</h1>
            <p className="ns-copy" id="login-description">
              {t.login.description}
            </p>
          </div>
        </header>

        {/* Form card */}
        <div className="ns-surface space-y-6">
          {/* Suspense required because LoginForm uses useSearchParams */}
          <Suspense
            fallback={
              <div
                className="flex items-center justify-center gap-3 py-12"
                role="status"
              >
                <IconLoader2
                  aria-hidden="true"
                  className="animate-spin text-muted-foreground motion-reduce:animate-none"
                  size={24}
                />
                <span className="ns-caption">{t.common.loading}</span>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
          <div className="border-t border-border pt-6">
            <p className="ns-caption" id="login-restricted">
              {t.login.restricted}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
