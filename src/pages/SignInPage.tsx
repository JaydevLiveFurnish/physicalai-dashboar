import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { tx } from "@/components/layout/motion";

type LocationState = { returnTo?: string; signedOut?: boolean };

const txField =
  "transition-[color,background-color,border-color,box-shadow] duration-250 ease-out";

export function SignInPage() {
  const { signIn, restoreSession, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const returnTo = state.returnTo && state.returnTo !== "/sign-in" ? state.returnTo : "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, navigate, returnTo]);

  const handleQuickEnter = () => {
    restoreSession();
    navigate(returnTo, { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="animate-page-in flex min-h-[100dvh] flex-col bg-[var(--dark)] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-[var(--s-400)] py-[var(--s-600)]">
        <div className="mb-[var(--s-600)] text-center">
          <img src="/logos/Horizontal Light.svg" alt="imagine.io" className="mx-auto h-9 w-auto" />
          <p className="mt-[var(--s-400)] text-[14px] leading-[20px] text-[var(--grey-300)]">
            Sign in to Physical AI
          </p>
        </div>

        {state.signedOut ? (
          <div
            className={`mb-[var(--s-400)] rounded-br200 border border-[var(--grey-700)] bg-[var(--grey-900)] px-[var(--s-400)] py-[var(--s-300)] text-[14px] text-[var(--grey-100)] ${tx}`}
            role="status"
          >
            You’ve been signed out. Use the button below to return to the dashboard.
          </div>
        ) : null}

        <div
          className={`rounded-br200 border border-[var(--grey-700)] bg-[var(--grey-900)] p-[var(--s-500)] shadow-sm ${tx}`}
        >
          <h1 className="text-[18px] font-semibold text-white">Sign in</h1>
          <p className="mt-[var(--s-200)] text-[13px] leading-[18px] text-[var(--grey-400)]">
            Use your work email. Demo: any valid email and a password of 6+ characters.
          </p>

          <div className="mt-[var(--s-500)]">
            <Button type="button" variant="primary" className="w-full" onClick={handleQuickEnter}>
              Continue to dashboard
            </Button>
            <p className="mt-[var(--s-300)] text-center text-[12px] text-[var(--grey-500)]">
              Showcase: restores your session instantly after sign-out.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-[var(--s-500)] space-y-[var(--s-400)] border-t border-[var(--grey-700)] pt-[var(--s-500)]">
            <p className="text-[11px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--grey-500)]">
              Or sign in with email
            </p>
            <label className="flex flex-col gap-[var(--s-100)] text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--grey-400)]">
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`rounded-br100 border border-[var(--grey-700)] bg-[var(--dark)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] normal-case text-white placeholder:text-[var(--grey-500)] focus:border-[var(--border-primary-default)] focus:outline-none focus:ring-2 focus:ring-[var(--papaya-600)]/40 ${txField}`}
                placeholder="you@company.com"
              />
            </label>
            <label className="flex flex-col gap-[var(--s-100)] text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--grey-400)]">
              Password
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={`rounded-br100 border border-[var(--grey-700)] bg-[var(--dark)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] normal-case text-white placeholder:text-[var(--grey-500)] focus:border-[var(--border-primary-default)] focus:outline-none focus:ring-2 focus:ring-[var(--papaya-600)]/40 ${txField}`}
                placeholder="••••••••"
              />
            </label>

            {error ? (
              <p className="text-[13px] text-[var(--text-error-default)]" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" variant="secondary" className="w-full border-[var(--grey-600)] text-white hover:bg-[#262626]" disabled={pending}>
              {pending ? "Signing in…" : "Sign in with email"}
            </Button>
          </form>
        </div>

        <p className="mt-[var(--s-500)] text-center text-[13px] text-[var(--grey-400)]">
          Need access?{" "}
          <Link
            to="/environments/request-custom"
            className="font-medium text-[var(--text-primary-default)] underline-offset-2 hover:underline"
          >
            Request custom environment
          </Link>
        </p>
      </div>
    </div>
  );
}
