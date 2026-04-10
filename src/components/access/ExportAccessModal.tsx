import { TalkToTeamModal } from "@/components/contact/TalkToTeamModal";

type ExportAccessModalProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Gated export uses the same Talk to Team experience as locked environments
 * (full access / upgrade path — no separate export-only copy).
 */
export function ExportAccessModal({ open, onClose }: ExportAccessModalProps) {
  return <TalkToTeamModal open={open} onClose={onClose} context="general" />;
}
