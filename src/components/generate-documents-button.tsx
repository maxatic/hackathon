"use client";

import { useState } from "react";

type Props = { applicationId: string };

export function GenerateDocumentsButton({ applicationId }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch(`/api/applications/${applicationId}/generate`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await res.json()) as {
        error?: string;
        signedUrls?: { cv: string | null; coverLetter: string | null };
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? res.statusText);
        return;
      }
      setStatus("done");
      const cv = data.signedUrls?.cv;
      const cl = data.signedUrls?.coverLetter;
      setMessage(
        cv && cl
          ? "Done — opening PDFs in new tabs."
          : "Done — check API response for paths.",
      );
      if (cv) window.open(cv, "_blank", "noopener,noreferrer");
      if (cl) window.open(cl, "_blank", "noopener,noreferrer");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Request failed");
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={run}
        disabled={status === "loading"}
        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-60"
      >
        {status === "loading" ? "Generating…" : "Generate CV + Anschreiben (AI)"}
      </button>
      {message ? (
        <p className="text-sm text-[var(--muted)]">{message}</p>
      ) : null}
    </div>
  );
}
