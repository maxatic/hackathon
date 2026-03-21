import Link from "next/link";
import { FeaturePlaceholder } from "@/components/feature-placeholder";
import { GenerateDocumentsButton } from "@/components/generate-documents-button";
import { mainNav } from "@/lib/nav";

const nav = mainNav.find((n) => n.href === "/applications")!;

type Props = { params: Promise<{ id: string }> };

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <FeaturePlaceholder title={`Application`} nav={nav}>
      <p className="font-mono text-sm text-[var(--muted)]">id: {id}</p>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Generates tailored CV + cover letter (LaTeX stored, PDF via Gemini
        plain-text layout). Requires{" "}
        <code className="text-xs">GOOGLE_GENERATIVE_AI_API_KEY</code> in{" "}
        <code className="text-xs">.env.local</code>.
      </p>
      <div className="mt-6">
        <GenerateDocumentsButton applicationId={id} />
      </div>
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
