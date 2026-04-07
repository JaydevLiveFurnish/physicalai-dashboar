import { useState } from "react";
import { Link } from "react-router-dom";
import { Callout } from "@/components/system/Callout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function SimReadyPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          SimReady
        </p>
        <h1 className="text-page-title mt-[var(--s-200)]">
          Coming soon
        </h1>
        <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
          Upload meshes → topology repair → material validation → USD export with physics manifests.
        </p>
      </header>

      <Callout variant="info" title="Roadmap capability">
        <p>
          SimReady batch processing isn’t wired in this dashboard yet. Join the waitlist below, or{" "}
          <Link to="/environments/request-custom" className="font-medium text-[var(--text-primary-default)] underline underline-offset-2">
            talk to us about custom pipelines
          </Link>{" "}
          for your org.
        </p>
      </Callout>

      <Card title="Pipeline">
        <ol className="list-decimal space-y-[var(--s-200)] pl-[var(--s-500)] text-[14px] text-[var(--text-default-body)]">
          <li>Upload asset package (mesh + textures + manifest)</li>
          <li>Process: scale checks, watertight repair, collision proxy build</li>
          <li>Validate against SimReady tier rules</li>
          <li>Export OpenUSD + sidecar metadata</li>
        </ol>
      </Card>

      <Card title="Waitlist">
        {sent ? (
          <p className="text-[14px] text-[var(--text-success-default)]">Recorded. Mock — no email sent.</p>
        ) : (
          <form
            className="flex flex-col gap-[var(--s-300)] sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label className="flex flex-1 flex-col gap-[var(--s-100)] text-[12px] uppercase text-[var(--text-default-body)]">
              Work email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
              />
            </label>
            <Button variant="primary" type="submit">
              Notify me
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
