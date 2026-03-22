"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

type RecentApp = {
  id: string;
  company: string;
  role_title: string;
  status: string;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-neutral-100 text-neutral-500",
  applied: "bg-neutral-100 text-neutral-700",
  interview: "bg-neutral-200 text-neutral-800",
  offer: "bg-neutral-900 text-white",
  rejected: "bg-neutral-100 text-neutral-400 line-through",
  withdrawn: "bg-neutral-100 text-neutral-400",
};

const quickActions: {
  href: string;
  title: string;
  description: string;
  step?: string;
  icon: ReactNode;
}[] = [
  {
    href: "/master-cv",
    step: "Step 1",
    title: "Create your CV",
    description:
      "Add your experience, skills, and education—this profile is the starting point for every application.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    href: "/applications/new",
    step: "Step 2",
    title: "Apply to jobs",
    description:
      "Paste a job posting and we'll generate a CV and cover letter tailored to that role.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    href: "/interview",
    title: "Practice interviews",
    description: "Run a voice mock interview and get ready for the real thing.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    href: "/applications",
    title: "Your applications",
    description: "See every role you've tracked here—status and documents in one place.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
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
        const real = all.filter((a) => a.company !== "__master_cv__");
        setApps(real.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-[var(--fg)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Build your profile first, then tailor documents for each role you apply to.
        </p>
      </div>

      {/* Quick actions — 2×2 grid (order: profile → apply → interview → list) */}
      <div className="grid gap-px bg-[var(--border)] sm:grid-cols-2">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-start gap-4 bg-[var(--bg)] p-6 transition-colors hover:bg-[var(--hover)]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--border)] text-[var(--muted)] transition-colors group-hover:border-[var(--fg)] group-hover:text-[var(--fg)]">
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              {action.step ? (
                <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--muted)]">
                  {action.step}
                </p>
              ) : null}
              <h3 className={`text-sm font-medium text-[var(--fg)] ${action.step ? "mt-1" : ""}`}>
                {action.title}
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
                {action.description}
              </p>
            </div>
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-[var(--border)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--fg)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-widest text-[var(--muted)]">
            Recent Applications
          </h2>
          <Link
            href="/applications"
            className="text-xs font-medium text-[var(--muted)] underline-offset-4 hover:text-[var(--fg)] hover:underline"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-[var(--border)] border border-[var(--border)]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse bg-[var(--hover)]" />
            ))}
          </div>
        ) : apps.length === 0 ? (
          <div className="border border-dashed border-[var(--border)] px-6 py-12 text-center">
            <p className="text-sm text-[var(--muted)]">
              No applications yet.{" "}
              <Link href="/applications/new" className="font-medium text-[var(--fg)] underline underline-offset-4">
                Create your first one
              </Link>
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)] border border-[var(--border)]">
            {apps.map((app) => (
              <Link
                key={app.id}
                href={`/applications/${app.id}`}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[var(--hover)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--fg)]">{app.role_title}</p>
                  <p className="mt-0.5 truncate text-xs text-[var(--muted)]">{app.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_STYLES[app.status] ?? STATUS_STYLES.draft}`}>
                    {app.status}
                  </span>
                  <span className="text-[10px] text-[var(--muted)] tabular-nums">{timeAgo(app.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
