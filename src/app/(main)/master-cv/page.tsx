import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { mainNav } from "@/lib/nav";

const nav = mainNav.find((n) => n.href === "/master-cv")!;

export default function MasterCvPage() {
  return (
    <FeaturePlaceholder title="Master CV" nav={nav}>
      <ul className="list-inside list-disc text-sm text-[var(--muted)]">
        <li>Form fields for experience, skills, education</li>
        <li>
          Save via <code className="text-xs">PUT /api/master-profile</code>
        </li>
      </ul>
    </FeaturePlaceholder>
  );
}
