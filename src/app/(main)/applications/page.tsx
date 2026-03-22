"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AppRow = {
  id: string;
  company: string;
  role_title: string;
  status: string;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-400/20 text-gray-400",
  applied: "bg-blue-400/20 text-blue-400",
  interview: "bg-yellow-400/20 text-yellow-400",
  offer: "bg-green-400/20 text-green-400",
  rejected: "bg-red-400/20 text-red-400",
  withdrawn: "bg-gray-400/20 text-gray-500",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const all: AppRow[] = data.applications ?? [];
        setApps(all.filter((a) => a.company !== "__master_cv__"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--fg)]">Applications</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {apps.length} application{apps.length !== 1 && "s"}
          </p>
        </div>
        <Link
          href="/applications/new"
          className="inline-flex items-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-4 py-2 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-transparent hover:text-[var(--fg)]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)]" />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-16 text-center">
          <p className="text-[var(--muted)]">
            No applications yet.{" "}
            <Link href="/applications/new" className="font-medium text-[var(--fg)] underline underline-offset-4">
              Create your first one
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="flex items-center justify-between border border-[var(--border)] px-5 py-4 transition-colors hover:bg-[var(--hover)]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--fg)]">{app.role_title}</p>
                <p className="mt-0.5 truncate text-sm text-[var(--muted)]">{app.company}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[app.status] ?? STATUS_COLORS.draft}`}>
                  {app.status}
                </span>
                <span className="text-xs text-[var(--muted)]">{timeAgo(app.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
