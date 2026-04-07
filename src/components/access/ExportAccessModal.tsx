import { useNavigate } from "react-router-dom";
import { CenterModal } from "@/components/ui/CenterModal";
import { Button } from "@/components/ui/Button";
import { ACCESS_COPY } from "@/lib/access";

const TEAM_MAIL = "mailto:physical-ai@imagine.io?subject=Export%20access";

type ExportAccessModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ExportAccessModal({ open, onClose }: ExportAccessModalProps) {
  const navigate = useNavigate();

  return (
    <CenterModal open={open} title="Export Access Required" onClose={onClose} size="lg">
      <div className="space-y-[var(--s-400)]">
        <p className="text-[14px] leading-[22px] text-[var(--text-default-body)]">{ACCESS_COPY.exportModalIntro}</p>
        <ul className="list-disc space-y-[var(--s-100)] pl-[var(--s-500)] text-[14px] text-[var(--text-default-heading)]">
          <li>OpenUSD stages and resolved geometry payloads</li>
          <li>PBR texture bundles and material bindings</li>
          <li>Structured manifests with checksums and version pins</li>
          <li>Bulk export jobs and batch artifact delivery</li>
        </ul>
        <p className="text-[13px] text-[var(--text-default-body)]">
          Browse and inspect catalog metadata without export entitlements; downloads are disabled until provisioned.
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
            Request Export Access
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
