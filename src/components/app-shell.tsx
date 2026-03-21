import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { ClerkUserButton } from "@/components/clerk-user-button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="border-b border-[var(--border)] bg-[var(--sidebar)] px-5 py-6 md:w-64 md:border-b-0 md:border-r">
        <div className="mb-8 flex items-start justify-between gap-2">
          <div>
            <Link
              href="/dashboard"
              className="text-xl font-bold tracking-tight text-[var(--fg)]"
            >
              Syz
            </Link>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded border border-[var(--accent)] bg-[var(--accent-muted)] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                System.Active
              </span>
            </div>
          </div>
          <ClerkUserButton />
        </div>
        <AppNav />
      </aside>

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col grid-pattern">
        <main className="flex-1 px-6 py-10 md:px-12">{children}</main>
        <footer className="border-t border-[var(--border)] px-6 py-4 text-center md:px-12">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
            Syz v1.0.0 | AI-Powered Bewerbungsplattform
          </span>
        </footer>
      </div>
    </div>
  );
}
