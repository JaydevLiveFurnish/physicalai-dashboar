import { CenterModal } from "@/components/ui/CenterModal";
import {
  TalkToTeamOverlayGrid,
  TalkToTeamOverlaySplit,
  TalkToTeamOverlayStepper,
} from "@/components/contact/talkToTeam/TalkToTeamOverlayBodies";
import { useTalkToTeamFlow } from "@/components/contact/talkToTeam/useTalkToTeamFlow";
import type { TalkToTeamContext, TalkToTeamLayoutId } from "@/components/contact/talkToTeam/topics";

export type { TalkToTeamContext, TalkToTeamLayoutId } from "@/components/contact/talkToTeam/topics";

type TalkToTeamModalProps = {
  open: boolean;
  onClose: () => void;
  /** Preselect topic when opened from a gated flow */
  context?: TalkToTeamContext;
  /** Visual layout. Default: split editorial (two columns). */
  layout?: TalkToTeamLayoutId;
};

export function TalkToTeamModal({ open, onClose, context = "general", layout = "split" }: TalkToTeamModalProps) {
  const flow = useTalkToTeamFlow(open, context);

  const title = flow.step === 3 ? "You’re all set" : "Book a demo";

  const body =
    layout === "grid" ? (
      <TalkToTeamOverlayGrid flow={flow} onClose={onClose} />
    ) : layout === "stepper" ? (
      <TalkToTeamOverlayStepper flow={flow} onClose={onClose} />
    ) : (
      <TalkToTeamOverlaySplit flow={flow} onClose={onClose} />
    );

  return (
    <CenterModal
      open={open}
      title={title}
      onClose={onClose}
      size={layout === "split" ? "xl" : "lg"}
      contentAlign="start"
      hideHeader={layout === "split" && flow.step < 3}
    >
      {layout === "split" && flow.step < 3 ? (
        <div className="-mx-[var(--s-500)] -mb-[var(--s-500)] -mt-[var(--s-500)]">{body}</div>
      ) : (
        body
      )}
    </CenterModal>
  );
}
