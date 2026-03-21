import Link from "next/link";
import { AppNav } from "@/components/app-nav";
import { ClerkUserButton } from "@/components/clerk-user-button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-[var(--border)] bg-[var(--sidebar)] px-4 py-6 md:w-56 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-start justify-between gap-2">
          <div>
            <Link
              href="/dashboard"
              className="text-lg font-semibold tracking-tight text-[var(--fg)]"
            >
              Syz
            </Link>
            <p className="mt-1 text-xs text-[var(--muted)]">DACH job toolkit</p>
          </div>
          <ClerkUserButton />
        </div>
        <AppNav />
      </aside>
      <div className="flex min-h-0 flex-1 flex-col">
        <main className="flex-1 px-4 py-8 md:px-10">{children}</main>
        <footer className="border-t border-[var(--border)] px-4 py-4 text-center text-xs text-[var(--muted)] md:px-10">
          Skeleton — swap sections for real features
        </footer>
      </div>
    </div>
  );
}
