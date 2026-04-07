import { useNavigate } from "react-router-dom";
import { CenterModal } from "@/components/ui/CenterModal";
import { Button } from "@/components/ui/Button";
import { ACCESS_COPY } from "@/lib/access";

const TEAM_MAIL = "mailto:physical-ai@imagine.io?subject=API%20access";

type ApiAccessModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ApiAccessModal({ open, onClose }: ApiAccessModalProps) {
  const navigate = useNavigate();

  return (
    <CenterModal open={open} title="API Access Required" onClose={onClose} size="lg">
      <div className="space-y-[var(--s-400)]">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">{ACCESS_COPY.apiModalIntro}</p>
        <ul className="list-disc space-y-[var(--s-100)] pl-[var(--s-500)] text-[14px] text-[var(--text-default-heading)]">
          <li>Secrets for <span className="font-mono text-[13px]">Authorization: Bearer</span> on the cluster HTTP surface</li>
          <li>Key rotation and revocation through the control plane</li>
          <li>Tenant-scoped credentials bound to your workspace identity</li>
          <li>Audit metadata on write paths (configs, jobs, exports)</li>
        </ul>
        <p className="text-[13px] text-[var(--text-default-body)]">
          Documentation and example payloads below remain readable without issuing keys.
        </p>
        <div className="flex flex-col gap-[var(--s-300)] sm:flex-row sm:flex-wrap">
          <Button
            variant="primary"
            className="w-full sm:flex-1"
            type="button"
            onClick={() => {
              onClose();
              navigate("/environments/request-custom");
            }}
          >
            Request API Access
          </Button>
          <Button
            variant="secondary"
            className="w-full border-[var(--border-primary-default)] text-[var(--text-primary-default)] sm:flex-1"
            type="button"
            onClick={() => {
              window.location.href = TEAM_MAIL;
              onClose();
            }}
          >
            Talk to Team
          </Button>
        </div>
      </div>
    </CenterModal>
  );
}
