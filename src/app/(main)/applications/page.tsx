import Link from "next/link";
import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { mainNav } from "@/lib/nav";

const nav = mainNav.find((n) => n.href === "/applications")!;

export default function ApplicationsPage() {
  return (
    <FeaturePlaceholder title="Applications" nav={nav}>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/applications/new"
          className="inline-flex rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)]"
        >
          New application
        </Link>
        <span className="text-sm text-[var(--muted)]">
          List will load from <code className="text-xs">GET /api/applications</code>
        </span>
      </div>
    </FeaturePlaceholder>
  );
}
