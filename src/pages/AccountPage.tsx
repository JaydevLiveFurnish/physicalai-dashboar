import { Card } from "@/components/ui/Card";
import { Link } from "react-router-dom";

export function AccountPage() {
  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Account
        </p>
        <h1 className="mt-[var(--s-200)] text-[28px] font-semibold text-[var(--text-default-heading)]">
          Organization access
        </h1>
      </header>

      <div className="grid gap-[var(--s-400)] md:grid-cols-2">
        <Card title="User">
          <dl className="space-y-[var(--s-200)] text-[14px]">
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Name</dt>
              <dd className="font-medium">Rachit Chandra</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Role</dt>
              <dd>Simulation engineer</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Email</dt>
              <dd className="font-mono text-[13px]">rachit@imaginelabs.ai</dd>
            </div>
          </dl>
        </Card>
        <Card title="Organization">
          <dl className="space-y-[var(--s-200)] text-[14px]">
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Team</dt>
              <dd>Imagine Labs Robotics</dd>
            </div>
            <div>
              <dt className="text-[12px] uppercase text-[var(--text-default-body)]">Plan</dt>
              <dd>Enterprise · 26 / 40 seats</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card title="Credentials">
        <p className="text-[14px] text-[var(--text-default-body)]">
          API keys are managed on the API page.
        </p>
        <Link to="/api" className="mt-[var(--s-200)] inline-block text-[14px] text-[var(--text-primary-default)]">
          Open API keys →
        </Link>
      </Card>
    </div>
  );
}
