import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[var(--border)] px-6 py-4">
        <span className="text-lg font-semibold">Syz</span>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight md:text-4xl">
          AI-powered job applications for Germany, Austria &amp; Switzerland
        </h1>
        <p className="mt-4 max-w-lg text-[var(--muted)]">
          App skeleton is live — team picks a screen and ships features on top.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--bg)]"
          >
            Open app
          </Link>
          <a
            href="/api/health"
            className="text-sm font-medium text-[var(--fg)] underline underline-offset-4"
            target="_blank"
            rel="noopener noreferrer"
          >
            API health
          </a>
        </div>
      </main>
    </div>
  );
}
