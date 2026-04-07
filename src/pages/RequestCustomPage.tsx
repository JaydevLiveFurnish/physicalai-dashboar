import { useState } from "react";
import { Callout } from "@/components/system/Callout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function RequestCustomPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-[var(--s-400)]">
      <header>
        <p className="text-[12px] font-medium uppercase tracking-[var(--text-caption-ls)] text-[var(--text-default-body)]">
          Environment library
        </p>
        <h1 className="text-page-title mt-[var(--s-200)]">
          Request custom environment
        </h1>
        <p className="mt-[var(--s-200)] max-w-[720px] text-[14px] text-[var(--text-default-body)]">
          Specify capture constraints, object classes, and downstream simulation targets. This creates an internal intake
          ticket (mock).
        </p>
      </header>

      <Card title="Intake">
        {submitted ? (
          <Callout variant="success" title="Request received">
            <p>
              Your intake details were recorded for this demo session. In production, our team follows up with scoping and
              access next steps.
            </p>
          </Callout>
        ) : (
          <form
            className="space-y-[var(--s-300)]"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className="flex flex-col gap-[var(--s-100)] text-[12px] uppercase text-[var(--text-default-body)]">
              Constraints
              <textarea
                required
                rows={5}
                className="rounded-br100 border border-[var(--border-default-secondary)] px-[var(--s-300)] py-[var(--s-200)] text-[14px]"
                placeholder="Footprint, ceiling height, object inventory, articulation requirements…"
              />
            </label>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
