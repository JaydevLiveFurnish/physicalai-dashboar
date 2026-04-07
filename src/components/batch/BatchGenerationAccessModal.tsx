import { useNavigate } from "react-router-dom";
import { CenterModal } from "@/components/ui/CenterModal";
import { Button } from "@/components/ui/Button";
import { ACCESS_COPY } from "@/lib/access";

const TEAM_MAIL = "mailto:physical-ai@imagine.io?subject=Batch%20generation%20access";

type BatchGenerationAccessModalProps = {
  open: boolean;
  onClose: () => void;
};

export function BatchGenerationAccessModal({ open, onClose }: BatchGenerationAccessModalProps) {
  const navigate = useNavigate();

  return (
    <CenterModal open={open} title="Batch Generation Requires Access" onClose={onClose} size="lg">
      <div className="space-y-[var(--s-400)]">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">{ACCESS_COPY.batchModalIntro}</p>
        <ul className="list-disc space-y-[var(--s-100)] pl-[var(--s-500)] text-[14px] text-[var(--text-default-heading)]">
          <li>Large-scale environment generation</li>
          <li>Structured variation sets</li>
          <li>Training-ready outputs</li>
          <li>Batch export workflows</li>
        </ul>
        <p className="text-[13px] text-[var(--text-default-body)]">
          Your team can enable this for your organization after scoping.
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
            Request Batch Access
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
