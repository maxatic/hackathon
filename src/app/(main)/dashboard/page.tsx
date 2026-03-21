"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type RecentApp = {
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

const quickActions = [
  {
    href: "/applications/new",
    title: "Generate Node-CV",
    description: "Paste a job description and get a tailored resume in seconds.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    accent: true,
  },
  {
    href: "/master-cv",
    title: "Update Master-CV",
    description: "Add your latest experience, skills, or certifications.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
];

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

export default function DashboardPage() {
  const [apps, setApps] = useState<RecentApp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        const all: RecentApp[] = data.applications ?? [];
        // Filter out the hidden master_cv sentinel
        const real = all.filter((a) => a.company !== "__master_cv__");
        setApps(real.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)]">
            Welcome back.
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            What would you like to do today?
          </p>
        </div>
        <Link
          href="/applications/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-all hover:opacity-90 glow-accent"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Application
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
              action.accent
                ? "border-[var(--accent)]/30 bg-[var(--accent-muted)] hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent)]/10"
                : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]/30"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`rounded-lg p-2.5 ${action.accent ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-[var(--hover)] text-[var(--muted)] group-hover:text-[var(--accent)]"}`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${action.accent ? "text-[var(--accent)]" : "text-[var(--fg)]"}`}>
                  {action.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{action.description}</p>
              </div>
              <svg
                className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${action.accent ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Recent Applications</h2>
          <Link
            href="/applications"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-[var(--border)] bg-[var(--card)]" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] px-6 py-10 text-center">
            <p className="text-sm text-[var(--muted)]">
              No applications yet.{" "}
              <Link href="/applications/new" className="font-medium text-[var(--accent)] hover:underline">
                Create your first one
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app) => (
              <Link
                key={app.id}
                href={`/applications/${app.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 transition-colors hover:border-[var(--accent)]/30"
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
      </section>
    </div>
  );
}
