import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/sign-in", { replace: true, state: { signedOut: true } });
  };

  return (
    <div className="space-y-[var(--s-500)]">
      <PageHeader title="Account" description="Manage your profile and subscription." />

      <div className="grid gap-[var(--s-400)] md:grid-cols-2">
        <Card title="Profile">
          <dl className="space-y-[var(--s-300)] text-[14px]">
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Name</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">{user?.name ?? "-"}</dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Email</dt>
              <dd className="text-[var(--text-default-heading)]">{user?.email ?? "-"}</dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Company</dt>
              <dd className="text-[var(--text-default-heading)]">{user?.orgLabel ?? "-"}</dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Role</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">{user?.role ?? "-"}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Plan">
          <dl className="space-y-[var(--s-300)] text-[14px]">
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Current Plan</dt>
              <dd>
                <span className="inline-flex items-center rounded-full bg-[var(--papaya-500)] px-[10px] py-[3px] text-[11px] font-semibold text-white">
                  Enterprise
                </span>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">API Requests</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">Unlimited</dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Environments</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">All</dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Batch Limit</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">10,000 / job</dd>
            </div>
          </dl>
        </Card>

        <Card title="Usage This Month">
          <dl className="space-y-[var(--s-300)] text-[14px]">
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">API Requests</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">1,336</dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Scenes Generated</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">847</dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Downloads</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">312</dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Storage</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">4.2 GB / 50 GB</dd>
            </div>
          </dl>
          <div className="mt-[var(--s-300)] h-2 rounded-full bg-[var(--surface-page-secondary)]">
            <div className="h-2 w-[8.4%] rounded-full bg-[var(--papaya-500)]" />
          </div>
        </Card>

        <Card title="Team">
          <dl className="space-y-[var(--s-300)] text-[14px]">
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Members</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">5</dd>
            </div>
            <div className="flex items-center justify-between gap-[var(--s-300)]">
              <dt className="text-[var(--text-default-body)]">Pending Invites</dt>
              <dd className="font-medium text-[var(--text-default-heading)]">2</dd>
            </div>
          </dl>
          <Button variant="secondary" className="mt-[var(--s-400)] border-[var(--papaya-500)] text-[var(--text-primary-default)]">
            Manage Team
          </Button>
        </Card>
      </div>

      <div>
        <Button variant="secondary" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
