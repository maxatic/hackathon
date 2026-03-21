import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { mainNav } from "@/lib/nav";

const nav = mainNav.find((n) => n.href === "/settings")!;

export default function SettingsPage() {
  return (
    <FeaturePlaceholder title="Settings" nav={nav}>
      <ul className="list-inside list-disc text-sm text-[var(--muted)]">
        <li>Clerk / Supabase auth (team decision)</li>
        <li>DE ↔ EN default</li>
        <li>Gmail + Sheets / n8n connection status</li>
      </ul>
    </FeaturePlaceholder>
  );
}
