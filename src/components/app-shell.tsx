import Link from "next/link";
import { ClerkUserButton } from "@/components/clerk-user-button";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top navbar */}
      <header className="border-b border-[var(--border)] bg-[var(--bg)] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/dashboard"
            className="text-base font-bold uppercase tracking-widest text-[var(--fg)]"
          >
            Syz
          </Link>
          <ClerkUserButton />
        </div>
      </header>

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
