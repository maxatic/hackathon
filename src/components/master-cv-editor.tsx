"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseFetchJson } from "@/lib/parse-fetch-json";

type ProfileFields = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  languages: string;
};

const empty: ProfileFields = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: "",
  experience: "",
  education: "",
  languages: "",
};

/** Map a raw profile blob (either flat legacy or structured from parse) into form fields. */
function profileToFields(p: Record<string, unknown>): ProfileFields {
  if ("header" in p && typeof p.header === "object" && p.header !== null) {
    return structuredToFields(p);
  }
  return {
    fullName: String(p.fullName ?? ""),
    email: String(p.email ?? ""),
    phone: String(p.phone ?? ""),
    location: String(p.location ?? ""),
    summary: String(p.summary ?? ""),
    skills: Array.isArray(p.skills) ? (p.skills as string[]).join(", ") : String(p.skills ?? ""),
    experience: String(p.experience ?? ""),
    education: String(p.education ?? ""),
    languages: String(p.languages ?? ""),
  };
}

/** Convert `CvStructuredContent`-shaped profile into flat form fields. */
function structuredToFields(p: Record<string, unknown>): ProfileFields {
  const h = (p.header ?? {}) as Record<string, unknown>;
  const addressLines = Array.isArray(h.addressLines) ? (h.addressLines as string[]) : [];

  const expArr = Array.isArray(p.experience) ? (p.experience as Record<string, unknown>[]) : [];
  const experience = expArr
    .map((e) => {
      const bullets = Array.isArray(e.bullets) ? (e.bullets as string[]) : [];
      const bulletStr = bullets.map((b) => `  - ${b}`).join("\n");
      return `${e.title ?? ""} | ${e.dateRange ?? ""}\n${e.organization ?? ""} | ${e.location ?? ""}${bulletStr ? "\n" + bulletStr : ""}`;
    })
    .join("\n\n");

  const eduArr = Array.isArray(p.education) ? (p.education as Record<string, unknown>[]) : [];
  const education = eduArr
    .map((e) => {
      const bullets = Array.isArray(e.bullets) ? (e.bullets as string[]) : [];
      const bulletStr = bullets.map((b) => `  - ${b}`).join("\n");
      return `${e.institution ?? ""} | ${e.dateRange ?? ""}\n${e.degree ?? ""} | ${e.location ?? ""}${bulletStr ? "\n" + bulletStr : ""}`;
    })
    .join("\n\n");

  const sk = (p.skills ?? {}) as Record<string, unknown>;
  const skillParts: string[] = [];
  if (sk.technical) skillParts.push(String(sk.technical));
  if (sk.design) skillParts.push(String(sk.design));
  if (sk.projectManagement) skillParts.push(String(sk.projectManagement));
  if (sk.artificialIntelligence) skillParts.push(String(sk.artificialIntelligence));

  return {
    fullName: String(h.name ?? ""),
    email: String(h.email ?? ""),
    phone: String(h.phone ?? ""),
    location: addressLines.join(", "),
    summary: String(p.summary ?? ""),
    skills: skillParts.join(", "),
    experience,
    education,
    languages: String(sk.languages ?? ""),
  };
}

function fieldsToProfile(f: ProfileFields): Record<string, unknown> {
  const skills = f.skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    fullName: f.fullName.trim(),
    email: f.email.trim(),
    phone: f.phone.trim(),
    location: f.location.trim(),
    summary: f.summary.trim(),
    skills,
    experience: f.experience.trim(),
    education: f.education.trim(),
    languages: f.languages.trim(),
  };
}

type SaveResponse = {
  updated_at?: string | null;
  error?: string;
  generate?: {
    ok: boolean;
    error?: string;
    signedUrls?: {
      cv: string | null;
      coverLetter: string | null;
      expiresIn?: number;
    };
  };
};

export function MasterCvEditor() {
  const [fields, setFields] = useState<ProfileFields>(empty);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [pdfLinks, setPdfLinks] = useState<{
    cv: string | null;
    coverLetter: string | null;
  } | null>(null);
  const [notice, setNotice] = useState<{ type: "ok" | "err" | "warn"; text: string } | null>(
    null,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = saving || generating || parsing;

  const load = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/master-profile", { credentials: "include" });
      const data = (await parseFetchJson(res)) as {
        profile?: Record<string, unknown>;
        updated_at?: string | null;
        error?: string;
      };
      if (!res.ok) {
        setNotice({ type: "err", text: data.error ?? "Load failed" });
        return;
      }
      const raw = data.profile && typeof data.profile === "object" && !Array.isArray(data.profile)
        ? (data.profile as Record<string, unknown>)
        : {};
      setFields(profileToFields(raw));
      setUpdatedAt(data.updated_at ?? null);
    } catch (e) {
      setNotice({
        type: "err",
        text: e instanceof Error ? e.message : "Load failed",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save() {
    setSaving(true);
    setNotice(null);
    setPdfLinks(null);
    try {
      const profile = fieldsToProfile(fields);
      const res = await fetch("/api/master-profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, generate: false }),
      });
      const data = (await parseFetchJson(res)) as SaveResponse;
      if (!res.ok) {
        setNotice({ type: "err", text: data.error ?? "Save failed" });
        return;
      }
      setUpdatedAt(data.updated_at ?? new Date().toISOString());
      setNotice({ type: "ok", text: "Profile saved." });
    } catch (e) {
      setNotice({ type: "err", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  async function generate() {
    setGenerating(true);
    setNotice(null);
    setPdfLinks(null);
    try {
      const profile = fieldsToProfile(fields);
      const res = await fetch("/api/master-profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, generate: true }),
      });
      const data = (await parseFetchJson(res)) as SaveResponse;
      if (!res.ok) {
        setNotice({ type: "err", text: data.error ?? "Save failed" });
        return;
      }
      setUpdatedAt(data.updated_at ?? new Date().toISOString());

      const gen = data.generate;
      if (gen?.ok && gen.signedUrls) {
        setPdfLinks({
          cv: gen.signedUrls.cv ?? null,
          coverLetter: gen.signedUrls.coverLetter ?? null,
        });
        setNotice({ type: "ok", text: "Profile saved and PDFs generated." });
      } else if (gen && !gen.ok && gen.error) {
        setNotice({ type: "warn", text: `Profile saved, but generation failed: ${gen.error}` });
      } else {
        setNotice({ type: "ok", text: "Profile saved." });
      }
    } catch (e) {
      setNotice({ type: "err", text: e instanceof Error ? e.message : "Generation failed" });
    } finally {
      setGenerating(false);
    }
  }

  async function handleUpload(file: File) {
    setParsing(true);
    setNotice(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/master-profile/parse", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = (await parseFetchJson(res)) as {
        profile?: Record<string, unknown>;
        error?: string;
      };
      if (!res.ok) {
        setNotice({ type: "err", text: data.error ?? "Parse failed" });
        return;
      }
      if (data.profile && typeof data.profile === "object") {
        setFields(structuredToFields(data.profile));
        setUpdatedAt(new Date().toISOString());
        setNotice({
          type: "ok",
          text: "CV parsed and saved. Review the fields below, then click Save if you make edits.",
        });
      }
    } catch (e) {
      setNotice({
        type: "err",
        text: e instanceof Error ? e.message : "Upload failed",
      });
    } finally {
      setParsing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function set<K extends keyof ProfileFields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <p className="text-sm text-[var(--muted)]">Loading your profile…</p>
    );
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--fg)]";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Master CV
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            One profile for all applications — we tailor it per job when you generate
            documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--hover)] disabled:opacity-50"
          >
            {parsing ? "Parsing CV…" : "Upload PDF"}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium text-[var(--fg)] transition-colors hover:bg-[var(--hover)] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="inline-flex items-center gap-1.5 border border-[var(--fg)] bg-[var(--fg)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-transparent hover:text-[var(--fg)] disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[var(--bg)] border-t-transparent" />
                Generating…
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                Generate CV
              </>
            )}
          </button>
        </div>
      </div>

      {updatedAt ? (
        <p className="text-xs text-[var(--muted)]">
          Last saved: {new Date(updatedAt).toLocaleString()}
        </p>
      ) : (
        <p className="text-xs text-[var(--muted)]">Not saved yet — fill in and click Save.</p>
      )}

      {notice ? (
        <p
          className={`text-sm ${
            notice.type === "ok"
              ? "text-green-700 dark:text-green-400"
              : notice.type === "warn"
                ? "text-amber-800 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
          }`}
          role="status"
        >
          {notice.text}
        </p>
      ) : null}

      {pdfLinks ? (
        <div className="flex flex-wrap gap-3">
          {pdfLinks.cv ? (
            <a
              href={pdfLinks.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--fg)] underline underline-offset-4"
            >
              Open CV (PDF)
            </a>
          ) : null}
          {pdfLinks.coverLetter ? (
            <a
              href={pdfLinks.coverLetter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[var(--fg)] underline underline-offset-4"
            >
              Open cover letter (PDF)
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-[var(--fg)]">Full name</span>
          <input
            className={inputClass}
            value={fields.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder="Maria Musterfrau"
            autoComplete="name"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-[var(--fg)]">Email</span>
          <input
            type="email"
            className={inputClass}
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-[var(--fg)]">Phone</span>
          <input
            className={inputClass}
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+49 …"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-[var(--fg)]">Location</span>
          <input
            className={inputClass}
            value={fields.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Berlin, DE"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-[var(--fg)]">Professional summary</span>
        <textarea
          className={`${inputClass} min-h-[100px] resize-y`}
          value={fields.summary}
          onChange={(e) => set("summary", e.target.value)}
          placeholder="2–4 sentences: role, years of experience, focus areas."
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-[var(--fg)]">Skills</span>
        <input
          className={inputClass}
          value={fields.skills}
          onChange={(e) => set("skills", e.target.value)}
          placeholder="TypeScript, React, German (C1), …"
        />
        <span className="mt-1 block text-xs text-[var(--muted)]">Comma-separated</span>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-[var(--fg)]">Experience</span>
        <textarea
          className={`${inputClass} min-h-[120px] resize-y`}
          value={fields.experience}
          onChange={(e) => set("experience", e.target.value)}
          placeholder="Company, role, dates, bullets — plain text is fine."
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-[var(--fg)]">Education</span>
        <textarea
          className={`${inputClass} min-h-[80px] resize-y`}
          value={fields.education}
          onChange={(e) => set("education", e.target.value)}
          placeholder="Degree, institution, year"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-[var(--fg)]">Languages</span>
        <input
          className={inputClass}
          value={fields.languages}
          onChange={(e) => set("languages", e.target.value)}
          placeholder="German (native), English (C1), …"
        />
      </label>
    </div>
  );
}
