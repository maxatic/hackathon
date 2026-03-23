"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { EducationEntry } from "@/lib/master-cv-fields";

const inputClass =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--fg)]";

type EducationCardProps = {
  entry: EducationEntry;
  onChange: (updated: EducationEntry) => void;
  onRemove: () => void;
  isNew?: boolean;
};

export function EducationCard({ entry, onChange, onRemove, isNew }: EducationCardProps) {
  const [expanded, setExpanded] = useState(isNew ?? false);

  const label =
    entry.institution || entry.degree
      ? `${entry.degree || "Untitled degree"}${entry.institution ? ` — ${entry.institution}` : ""}`
      : "New education";

  function set<K extends keyof EducationEntry>(key: K, value: EducationEntry[K]) {
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
          aria-label="Remove education"
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
                  <span className="font-medium text-[var(--fg)]">Institution</span>
                  <input
                    className={inputClass}
                    value={entry.institution}
                    onChange={(e) => set("institution", e.target.value)}
                    placeholder="e.g. Technical University of Munich"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-[var(--fg)]">Degree / Major</span>
                  <input
                    className={inputClass}
                    value={entry.degree}
                    onChange={(e) => set("degree", e.target.value)}
                    placeholder="e.g. BSc Computer Science, Minor: Mathematics"
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
                    placeholder="e.g. 10/2019 -- 06/2023"
                  />
                </label>
              </div>

              <label className="block text-sm">
                <span className="font-medium text-[var(--fg)]">Additional details</span>
                <textarea
                  className={`${inputClass} min-h-[60px] resize-y`}
                  value={entry.bullets.join("\n")}
                  onChange={(e) => {
                    const lines = e.target.value.split("\n");
                    set("bullets", lines);
                  }}
                  placeholder={"e.g. GPA: 1.3 (German scale)\ne.g. Dean's List 2021, 2022"}
                />
                <span className="mt-1 block text-xs text-[var(--muted)]">One item per line (optional)</span>
              </label>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
