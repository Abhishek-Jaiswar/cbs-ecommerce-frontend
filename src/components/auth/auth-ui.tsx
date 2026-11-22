"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/services/api/auth/auth-api";
import { useAppSelector } from "@/store/hooks";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared look for /login, /signup and /forgot-password, built from the
 * ZenVoraa redesign: a full-height photo on the left (the header floats over
 * it, like the product page) and the form on the right.
 */
export function AuthShell({
  eyebrow,
  title,
  intro,
  image = "/zenvoraa/home/shop-split-model.webp",
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  image?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="grid flex-1 bg-white lg:min-h-svh lg:grid-cols-2">
      <div className="relative h-[260px] bg-zv-image-well lg:h-auto">
        <img
          src={image}
          alt=""
          className="absolute inset-0 size-full object-cover"
          fetchPriority="high"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/25"
        />
        <p className="absolute bottom-zv-20 left-zv-20 max-w-[22ch] font-zv-display text-2xl italic leading-tight text-white lg:bottom-zv-40 lg:left-zv-40 lg:text-[40px]">
          Jewellery that moves softly as you do.
        </p>
      </div>

      <div className="flex justify-center px-zv-20 py-zv-40 lg:items-center lg:px-zv-40 lg:pt-[140px]">
        <div className="flex w-full max-w-[440px] flex-col gap-zv-30">
          <header className="flex flex-col gap-zv-10">
            <p className="type-body-sm text-zv-bg2">{eyebrow}</p>
            <h1 className="font-zv-display text-[34px] italic leading-[1.1] text-zv-ink-brown lg:type-h1 lg:text-zv-ink">
              {title}
            </h1>
            {intro && (
              <div className="type-body-sm text-zv-ink/80">{intro}</div>
            )}
          </header>
          {children}
          {footer && (
            <div className="border-t border-zv-bg2/40 pt-zv-20 text-center type-body-sm text-zv-ink/80">
              {footer}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export function AuthAlert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
}) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-zv-10 rounded-leaf px-zv-20 py-3 text-sm",
        tone === "error"
          ? "bg-zv-hover/10 text-zv-hover"
          : "bg-zv-bg-soft text-zv-ink-brown",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-zv-xs border border-zv-bg2/50 bg-white px-zv-20 text-sm text-zv-ink outline-none transition-colors placeholder:text-zv-bg2/70 focus:border-zv-primary focus:ring-2 focus:ring-zv-primary/15 disabled:bg-zv-bg-soft disabled:text-zv-bg2";

export function AuthField({
  label,
  id,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  hint?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="type-body-sm text-zv-ink">
        {label}
      </label>
      <input id={id} {...props} className={cn(inputClass, props.className)} />
      {hint && <p className="type-caption text-zv-bg2">{hint}</p>}
    </div>
  );
}

export function PasswordField({
  label,
  id,
  hint,
  labelAside,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  id: string;
  hint?: React.ReactNode;
  labelAside?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-zv-10">
        <label htmlFor={id} className="type-body-sm text-zv-ink">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          {...props}
          className={cn(inputClass, "pr-12")}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute right-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center text-zv-bg2 transition-colors hover:text-zv-primary"
        >
          {show ? (
            <EyeOff className="size-[18px]" />
          ) : (
            <Eye className="size-[18px]" />
          )}
        </button>
      </div>
      {hint && <p className="type-caption text-zv-bg2">{hint}</p>}
    </div>
  );
}

/** 6-digit code input; keeps digits only. */
export function OtpField({
  value,
  onChange,
  id = "otp",
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="type-body-sm text-zv-ink">
        Verification code
      </label>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
        placeholder="000000"
        autoFocus
        className={cn(
          inputClass,
          "h-14 text-center font-mono text-2xl tracking-[0.5em]",
        )}
      />
    </div>
  );
}

export function AuthButton({
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading || props.disabled}
      {...props}
      className={cn(
        "h-12 w-full rounded-leaf bg-zv-primary type-button text-white transition-colors hover:bg-zv-hover disabled:cursor-not-allowed disabled:opacity-60",
        props.className,
      )}
    >
      {children}
    </button>
  );
}

export function TextButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "text-sm text-zv-primary underline-offset-4 transition-colors hover:text-zv-hover hover:underline disabled:cursor-not-allowed disabled:text-zv-bg2 disabled:no-underline",
        props.className,
      )}
    />
  );
}

/** A same-site path from ?redirect=, or null. Rejects "//host" and "/\host". */
export function safeRedirect(raw: string | null): string | null {
  return raw &&
    raw.startsWith("/") &&
    !raw.startsWith("//") &&
    !raw.startsWith("/\\")
    ? raw
    : null;
}

/** Carries ?redirect= over to the sibling auth page link. */
export function withRedirect(href: string, redirect: string | null) {
  return redirect ? `${href}?redirect=${encodeURIComponent(redirect)}` : href;
}

/**
 * Sends someone who is already signed in away from /login and /signup:
 * to ?redirect= if given, else the dashboard (admins) or their account.
 * Waits for the server's `me` check, not the cached user in localStorage,
 * so an expired session never bounces a signed-out visitor off the page.
 * `paused` is set while the form is signing someone in, so its own redirect wins.
 */
export function useRedirectIfSignedIn(
  redirect: string | null,
  paused: boolean,
) {
  const router = useRouter();
  const { data, isError } = useMeQuery();
  // after a logout the last good `me` result can linger in the cache, so the
  // live auth state (cleared on logout) and the latest check must both agree
  const isAuthenticated = useAppSelector((st) => st.auth.isAuthenticated);
  const user = isAuthenticated && !isError && data?.success ? data.data : null;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (paused || !user || checked) return;
    setChecked(true);
    router.replace(
      redirect ?? (user.role === "ADMIN" ? "/dashboard" : "/account"),
    );
  }, [paused, user, checked, redirect, router]);

  return Boolean(user) && !paused;
}
