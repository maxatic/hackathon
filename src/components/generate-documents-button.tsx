"use client";

import { useState } from "react";
import { parseFetchJson } from "@/lib/parse-fetch-json";

type Props = { applicationId: string };

type SignedUrls = { cv: string | null; coverLetter: string | null };

export function GenerateDocumentsButton({ applicationId }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [links, setLinks] = useState<SignedUrls | null>(null);

  async function run() {
    setStatus("loading");
    setMessage(null);
    setLinks(null);

    // Open tabs synchronously on click so the browser allows navigation (popup rules).
    const tabCv =
      typeof window !== "undefined"
        ? window.open("about:blank", "_blank", "noopener,noreferrer")
        : null;
    const tabCover =
      typeof window !== "undefined"
        ? window.open("about:blank", "_blank", "noopener,noreferrer")
        : null;

    try {
      const res = await fetch(`/api/applications/${applicationId}/generate`, {
        method: "POST",
        credentials: "include",
      });
      const data = (await parseFetchJson(res)) as {
        error?: string;
        signedUrls?: SignedUrls;
      };
      if (!res.ok) {
        tabCv?.close();
        tabCover?.close();
        setStatus("error");
        setMessage(data.error ?? res.statusText);
        return;
      }

      const cv = data.signedUrls?.cv ?? null;
      const coverLetter = data.signedUrls?.coverLetter ?? null;
      setLinks({ cv, coverLetter: coverLetter });

      if (cv && tabCv) {
        tabCv.location.href = cv;
      } else {
        tabCv?.close();
      }
      if (coverLetter && tabCover) {
        tabCover.location.href = coverLetter;
      } else {
        tabCover?.close();
      }

      setStatus("done");
      setMessage(
        cv && coverLetter
          ? "Done. If tabs did not show, use the links below (some browsers block popups)."
          : "Done — PDF paths saved; signed URLs missing — use Supabase Storage or links if shown.",
      );
    } catch (e) {
      tabCv?.close();
      tabCover?.close();
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Request failed");
    }
  }

  return (
    <div className="space-y-3">
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
      {links?.cv || links?.coverLetter ? (
        <div className="flex flex-wrap gap-3 text-sm">
          {links.cv ? (
            <a
              href={links.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--fg)] underline underline-offset-4"
            >
              Open CV (PDF)
            </a>
          ) : null}
          {links.coverLetter ? (
            <a
              href={links.coverLetter}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--fg)] underline underline-offset-4"
            >
              Open Anschreiben (PDF)
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
