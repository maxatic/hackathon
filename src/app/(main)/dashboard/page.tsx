import Link from "next/link";

const stats = [
  { label: "Master-CV Progress", value: "75%", description: "3 sections remaining" },
  { label: "Applications", value: "12", description: "4 in progress" },
  { label: "Interviews", value: "3", description: "Next: Mar 25" },
  { label: "Success Rate", value: "67%", description: "8 of 12 positive" },
];

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
  {
    href: "/interview",
    title: "Practice Interview",
    description: "Voice-to-voice mock interview with AI feedback.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    href: "/applications",
    title: "View Applications",
    description: "Track all your applications and their status.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
];

const recentApplications = [
  { company: "Amazon", role: "Software Engineer Working Student", status: "Interview", date: "2025-03-01", initial: "A" },
  { company: "Zalando", role: "Product Manager Intern", status: "Applied", date: "2025-03-08", initial: "Z" },
  { company: "BMW Group", role: "Data Analyst Werkstudent", status: "In Review", date: "2025-03-14", initial: "B" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">[01] Overview</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--fg)]">
            Welcome back.
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Your job search command center. Track progress, generate documents, and prepare for interviews.
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

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 transition-all hover:border-[var(--accent)]/30"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-[var(--accent)]">{stat.value}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">[02] Quick Actions</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
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
      </div>

      {/* Recent Applications */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">[03] Recent Applications</span>
            <div className="h-px w-12 bg-[var(--border)]" />
          </div>
          <Link 
            href="/applications" 
            className="text-sm font-medium text-[var(--accent)] transition-colors hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recentApplications.map((app) => (
            <div
              key={app.company + app.role}
              className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--accent)]/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent-muted)] font-semibold text-[var(--accent)]">
                {app.initial}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-[var(--fg)] truncate">{app.role}</h4>
                <p className="text-sm text-[var(--muted)]">{app.company} • {app.date}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                app.status === "Interview" 
                  ? "bg-[var(--success)]/10 text-[var(--success)]" 
                  : app.status === "Applied"
                  ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "bg-[var(--warning)]/10 text-[var(--warning)]"
              }`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
        <h2 className="text-xl font-bold text-[var(--fg)]">
          The rock doesn&apos;t have to be yours to carry.
        </h2>
        <p className="mt-2 text-[var(--muted)]">
          Let Syz handle the heavy lifting of your job applications.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/applications/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[var(--bg)] transition-all hover:opacity-90"
          >
            Start Building Your CV
          </Link>
          <Link
            href="/master-cv"
            className="text-sm font-medium text-[var(--muted)] underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
          >
            Complete Your Master-CV
          </Link>
        </div>
      </div>
    </div>
  );
}
