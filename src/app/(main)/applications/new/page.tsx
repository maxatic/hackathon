import Link from "next/link";
import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { mainNav } from "@/lib/nav";

const nav = mainNav.find((n) => n.href === "/applications")!;

export default function NewApplicationPage() {
  return (
    <FeaturePlaceholder
      title="New application"
      nav={nav}
    >
      <p className="text-sm text-[var(--muted)]">
        Paste job description, company, role — then AI + PDF pipeline (
        <code className="text-xs">POST /api/applications</code> and generate
        endpoint later).
      </p>
      <p className="mt-4">
        <Link
          href="/applications"
          className="text-sm font-medium text-[var(--fg)] underline underline-offset-4"
        >
          ← Back to list
        </Link>
      </p>
    </FeaturePlaceholder>
  );
}
