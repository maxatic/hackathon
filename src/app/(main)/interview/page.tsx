import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { mainNav } from "@/lib/nav";

const nav = mainNav.find((n) => n.href === "/interview")!;

export default function InterviewPage() {
  return (
    <FeaturePlaceholder title="Interview coach" nav={nav}>
      <p className="text-sm text-[var(--muted)]">
        ElevenLabs conversational agent UI goes here — no backend route yet.
      </p>
    </FeaturePlaceholder>
  );
}
