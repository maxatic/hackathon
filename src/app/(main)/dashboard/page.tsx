import Link from "next/link";
import { mainNav } from "@/lib/nav";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Team map: each card links to a feature area. Replace with metrics and
          “next steps” when data is wired.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition hover:border-[var(--fg)]"
            >
              <span className="font-medium">{item.label}</span>
              <p className="mt-1 text-sm text-[var(--muted)]">{item.description}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-[var(--muted)]">
                Owner hint: {item.owner}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
