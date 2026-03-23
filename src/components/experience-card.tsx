"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ExperienceEntry } from "@/lib/master-cv-fields";

const inputClass =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--fg)]";

type ExperienceCardProps = {
  entry: ExperienceEntry;
  onChange: (updated: ExperienceEntry) => void;
  onRemove: () => void;
  isNew?: boolean;
};

export function ExperienceCard({ entry, onChange, onRemove, isNew }: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(isNew ?? false);

  const label =
    entry.title || entry.organization
      ? `${entry.title || "Untitled role"}${entry.organization ? ` at ${entry.organization}` : ""}`
      : "New experience";

  function set<K extends keyof ExperienceEntry>(key: K, value: ExperienceEntry[K]) {
    onChange({ ...entry, [key]: value });
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Header — always visible */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Drag handle */}
        <div
          className="shrink-0 cursor-grab active:cursor-grabbing text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="6" r="1" fill="currentColor" />
            <circle cx="15" cy="6" r="1" fill="currentColor" />
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
            <circle cx="9" cy="18" r="1" fill="currentColor" />
            <circle cx="15" cy="18" r="1" fill="currentColor" />
          </svg>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--fg)] truncate">{label}</p>
          {entry.dateRange && !expanded ? (
            <p className="text-xs text-[var(--muted)] truncate">{entry.dateRange}</p>
          ) : null}
        </div>

        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-[var(--muted)] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>

        {/* Delete */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="shrink-0 rounded-md p-1 text-[var(--muted)] hover:text-[var(--destructive)] hover:bg-[var(--hover)] transition-colors"
          aria-label="Remove experience"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--border)] px-4 py-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-[var(--fg)]">Position title</span>
                  <input
                    className={inputClass}
                    value={entry.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Senior Product Manager"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-[var(--fg)]">Company</span>
                  <input
                    className={inputClass}
                    value={entry.organization}
                    onChange={(e) => set("organization", e.target.value)}
                    placeholder="e.g. Google"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-[var(--fg)]">Location</span>
                  <input
                    className={inputClass}
                    value={entry.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="e.g. Munich, DE"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-[var(--fg)]">Date range</span>
                  <input
                    className={inputClass}
                    value={entry.dateRange}
                    onChange={(e) => set("dateRange", e.target.value)}
                    placeholder="e.g. 01/2022 -- Present"
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-[var(--fg)]">Description</span>
                <textarea
                  className={`${inputClass} min-h-[80px] resize-y`}
                  value={entry.bullets.join("\n")}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n");
                    set("bullets", lines);
                  }}
                  placeholder={"One bullet point per line\ne.g. Led cross-functional team of 8 engineers\ne.g. Increased revenue by 25% through feature optimization"}
                />
                <span className="mt-1 block text-xs text-[var(--muted)]">One bullet point per line</span>
              </label>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
