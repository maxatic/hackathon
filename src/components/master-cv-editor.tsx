"use client";

import { useCallback, useEffect, useState } from "react";

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

function profileToFields(p: Record<string, unknown>): ProfileFields {
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

export function MasterCvEditor() {
  const [fields, setFields] = useState<ProfileFields>(empty);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/master-profile", { credentials: "include" });
      const data = (await res.json()) as {
        profile?: Record<string, unknown>;
        updated_at?: string | null;
      };
      if (!res.ok) {
        setNotice({ type: "err", text: (data as { error?: string }).error ?? "Load failed" });
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
    try {
      const profile = fieldsToProfile(fields);
      const res = await fetch("/api/master-profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          type: "err",
          text: (data as { error?: string }).error ?? "Save failed",
        });
        return;
      }
      setUpdatedAt((data as { updated_at?: string }).updated_at ?? new Date().toISOString());
      setNotice({ type: "ok", text: "Saved. This profile is used when you generate applications." });
    } catch (e) {
      setNotice({
        type: "err",
        text: e instanceof Error ? e.message : "Save failed",
      });
    } finally {
      setSaving(false);
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
    "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";

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
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
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
          className={`text-sm ${notice.type === "ok" ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          role="status"
        >
          {notice.text}
        </p>
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
