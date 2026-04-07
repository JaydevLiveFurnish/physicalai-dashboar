import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Callout } from "@/components/system/Callout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { tx } from "@/components/layout/motion";
import type { AccessTier } from "@/lib/access";

export function AccountPage() {
  const { user, signOut, accessTier, setAccessTier } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in", { replace: true, state: { signedOut: true } });
  };

  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Account
        </p>
        <h1 className="text-page-title mt-[var(--s-200)]">
          Organization access
        </h1>
      </header>

      <Card title="Product access (demo)">
        <Callout variant="info" title="How this works">
          <p className="text-[14px]">
            <strong>Explore</strong> — browse catalog, docs, and previews; no cluster credentials or artifact exports.{" "}
            <strong>Standard</strong> — intermediate demo tier (same gating as Explore for provisioned paths in this build).{" "}
            <strong>Full</strong> — API keys, batch jobs, and export pipelines on this mock device.
          </p>
        </Callout>
        <label className="mt-[var(--s-400)] flex max-w-md flex-col gap-[var(--s-200)] text-[12px] uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Access mode
          <select
            value={accessTier}
            onChange={(e) => setAccessTier(e.target.value as AccessTier)}
            className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px] normal-case text-[var(--text-default-heading)]"
          >
            <option value="explore">Explore — read-first, no credentials</option>
            <option value="standard">Standard — demo tier (intermediate)</option>
            <option value="full">Full — API + batch + exports</option>
          </select>
        </label>
      </Card>

      <div className="grid gap-[var(--s-400)] md:grid-cols-2">
        <Card title="User">
          <dl className="space-y-[var(--s-200)] text-[14px]">
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Name</dt>
              <dd className="font-medium">{user?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Email</dt>
              <dd className="font-mono text-[13px]">{user?.email ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Organization</dt>
              <dd>{user?.orgLabel ?? "—"}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Session">
          <p className="text-[14px] text-[var(--text-default-body)]">
            You’re signed in on this device. Signing out clears your session here.
          </p>
          <Button
            variant="secondary"
            className={`mt-[var(--s-400)] ${tx}`}
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </Card>
      </div>

      <Card title="Credentials">
        <p className="text-[14px] text-[var(--text-default-body)]">
          API keys are managed on the API page.
        </p>
        <Link to="/api" className={`mt-[var(--s-200)] inline-block text-[14px] text-[var(--text-primary-default)] ${tx}`}>
          Open API keys →
        </Link>
      </Card>
    </div>
  );
}
