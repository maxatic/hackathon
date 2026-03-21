import Link from "next/link";
import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { mainNav } from "@/lib/nav";

const nav = mainNav.find((n) => n.href === "/applications")!;

type Props = { params: Promise<{ id: string }> };

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <FeaturePlaceholder title={`Application`} nav={nav}>
      <p className="font-mono text-sm text-[var(--muted)]">id: {id}</p>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Detail view: status, generated CV/Anschreiben, PDF download. Use{" "}
        <code className="text-xs">GET /api/applications/[id]</code> and{" "}
        <code className="text-xs">.../documents</code>.
      </p>
      <p className="mt-4">
        <Link
          href="/applications"
          className="text-sm font-medium text-[var(--fg)] underline underline-offset-4"
        >
          ← Applications
        </Link>
      </p>
    </FeaturePlaceholder>
  );
}
