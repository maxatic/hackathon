"use client";

import Link from "next/link";
import { useState } from "react";
import { parseFetchJson } from "@/lib/parse-fetch-json";

type SignedUrls = { cv: string | null; coverLetter: string | null };

type Step = "form" | "generating" | "done" | "error";

export default function NewApplicationPage() {
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jdText, setJdText] = useState("");
  const [locale, setLocale] = useState<"de" | "en">("de");

  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);
  const [links, setLinks] = useState<SignedUrls | null>(null);
  const [appId, setAppId] = useState<string | null>(null);

  const canSubmit = company.trim() && roleTitle.trim() && jdText.trim();

  async function handleGenerate() {
    setStep("generating");
    setError(null);
    setLinks(null);

    try {
      const createRes = await fetch("/api/applications", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          role_title: roleTitle.trim(),
          jd_text: jdText.trim(),
          locale,
          status: "applied",
        }),
      });
      const createData = (await parseFetchJson(createRes)) as {
        application?: { id: string };
        error?: string;
      };
      if (!createRes.ok || !createData.application) {
        throw new Error(createData.error ?? "Failed to create application");
      }

      const id = createData.application.id;
      setAppId(id);

      const genRes = await fetch(`/api/applications/${id}/generate`, {
        method: "POST",
        credentials: "include",
      });
      const genData = (await parseFetchJson(genRes)) as {
        signedUrls?: SignedUrls;
        error?: string;
      };
      if (!genRes.ok) {
        throw new Error(genData.error ?? "Generation failed");
      }

      setLinks(genData.signedUrls ?? null);
      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("error");
    }
  }

  if (step === "generating") {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--fg)]" />
        <p className="mt-6 text-lg font-medium text-[var(--fg)]">
          Generating your tailored CV & cover letter…
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          This usually takes 15–30 seconds.
        </p>
      </div>
    );
  }

  if (step === "done") {
    return (
      <div className="mx-auto max-w-lg space-y-8 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[var(--fg)]">
          <svg className="h-8 w-8 text-[var(--fg)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg)]">Documents ready</h1>
          <p className="mt-2 text-[var(--muted)]">
            Your tailored CV and cover letter for <span className="font-medium text-[var(--fg)]">{roleTitle}</span> at <span className="font-medium text-[var(--fg)]">{company}</span> have been generated.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {links?.cv && (
            <a
              href={links.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-transparent hover:text-[var(--fg)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Open CV
            </a>
          )}
          {links?.coverLetter && (
            <a
              href={links.coverLetter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--hover)]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Open Cover Letter
            </a>
          )}
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            href={appId ? `/applications/${appId}` : "/applications"}
            className="text-sm font-medium text-[var(--fg)] underline underline-offset-4"
          >
            View application
          </Link>
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setCompany("");
              setRoleTitle("");
              setJdText("");
              setLinks(null);
              setAppId(null);
            }}
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] hover:underline"
          >
            Generate another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--fg)]">
          Generate Node-CV
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Paste the job description and we&apos;ll tailor your CV and cover letter to the role.
        </p>
      </div>

      {step === "error" && error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--fg)]">Company</span>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Siemens"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--fg)] focus:outline-none focus:ring-1 focus:ring-[var(--fg)]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--fg)]">Role title</span>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--fg)] focus:outline-none focus:ring-1 focus:ring-[var(--fg)]"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--fg)]">Job description</span>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={12}
            placeholder="Paste the full job description here…"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:border-[var(--fg)] focus:outline-none focus:ring-1 focus:ring-[var(--fg)]"
          />
        </label>

        <div className="flex items-center gap-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--fg)]">Language</span>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as "de" | "en")}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3.5 py-2.5 text-sm text-[var(--fg)] focus:border-[var(--fg)] focus:outline-none focus:ring-1 focus:ring-[var(--fg)]"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!canSubmit}
          className="inline-flex items-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-6 py-2.5 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-transparent hover:text-[var(--fg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          Generate CV & Cover Letter
        </button>
        <Link
          href="/dashboard"
          className="text-sm text-[var(--muted)] hover:text-[var(--fg)]"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
