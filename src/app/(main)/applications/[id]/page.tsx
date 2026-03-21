"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseFetchJson } from "@/lib/parse-fetch-json";

type Application = {
  id: string;
  company: string;
  role_title: string;
  status: string;
  locale: string;
  jd_text: string;
  created_at: string;
};

type Document = {
  id: string;
  kind: string;
  created_at: string;
  pdf_storage_path: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-400/20 text-gray-400",
  applied: "bg-blue-400/20 text-blue-400",
  interview: "bg-yellow-400/20 text-yellow-400",
  offer: "bg-green-400/20 text-green-400",
  rejected: "bg-red-400/20 text-red-400",
  withdrawn: "bg-gray-400/20 text-gray-500",
};

const KIND_LABELS: Record<string, string> = {
  cv: "CV",
  cover_letter: "Cover Letter",
  bundle: "Bundle",
};

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [regenerating, setRegenerating] = useState(false);
  const [regenLinks, setRegenLinks] = useState<{ cv: string | null; coverLetter: string | null } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/applications/${id}`, { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          if (d.error) throw new Error(d.error);
          setApp(d.application);
        }),
      fetch(`/api/applications/${id}/documents`, { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          setDocs(d.documents ?? []);
          setSignedUrls(d.signedUrls ?? {});
        }),
    ])
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  async function regenerate() {
    setRegenerating(true);
    setRegenLinks(null);
    try {
      const res = await fetch(`/api/applications/${id}/generate`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await parseFetchJson(res)) as {
        signedUrls?: { cv: string | null; coverLetter: string | null };
        documents?: Document[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Generation failed");

      setRegenLinks(data.signedUrls ?? null);

      const docsRes = await fetch(`/api/applications/${id}/documents`, { credentials: "include" });
      const docsData = await docsRes.json();
      setDocs(docsData.documents ?? []);
      setSignedUrls(docsData.signedUrls ?? {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setRegenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--accent)]" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="py-24 text-center">
        <p className="text-[var(--muted)]">{error ?? "Application not found."}</p>
        <Link href="/applications" className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline">
          Back to applications
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-[var(--fg)]">
          &larr; Dashboard
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-[var(--fg)]">{app.role_title}</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[var(--muted)]">{app.company}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[app.status] ?? STATUS_COLORS.draft}`}>
            {app.status}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Job Description */}
      {app.jd_text && (
        <details className="group rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-[var(--fg)]">
            Job description
          </summary>
          <div className="border-t border-[var(--border)] px-5 py-4">
            <pre className="whitespace-pre-wrap text-sm text-[var(--muted)]">{app.jd_text}</pre>
          </div>
        </details>
      )}

      {/* Generated Documents */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Generated Documents</h2>
          <button
            type="button"
            onClick={regenerate}
            disabled={regenerating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-all hover:opacity-90 disabled:opacity-50"
          >
            {regenerating ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--bg)] border-t-transparent" />
                Generating…
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
                Regenerate
              </>
            )}
          </button>
        </div>

        {regenLinks && (
          <div className="mb-4 flex flex-wrap gap-3">
            {regenLinks.cv && (
              <a href={regenLinks.cv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20">
                Open new CV
              </a>
            )}
            {regenLinks.coverLetter && (
              <a href={regenLinks.coverLetter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 hover:bg-green-500/20">
                Open new Cover Letter
              </a>
            )}
          </div>
        )}

        {docs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-10 text-center">
            <p className="text-sm text-[var(--muted)]">No documents generated yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--fg)]">
                    {KIND_LABELS[doc.kind] ?? doc.kind}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(doc.created_at).toLocaleString()}
                  </p>
                </div>
                {signedUrls[doc.id] ? (
                  <a
                    href={signedUrls[doc.id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Open PDF
                  </a>
                ) : (
                  <span className="text-xs text-[var(--muted)]">No PDF</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
