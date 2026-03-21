import type { ReactNode } from "react";
import type { NavItem } from "@/lib/nav";

type Props = {
  title: string;
  nav?: NavItem;
  children?: ReactNode;
};

export function FeaturePlaceholder({ title, nav, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
          {title}
        </h1>
        {nav ? (
          <p className="text-sm text-[var(--muted)]">{nav.description}</p>
        ) : null}
      </header>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <p className="text-sm font-medium text-[var(--fg)]">Skeleton</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          Replace this block with real UI. API routes live under{" "}
          <code className="rounded bg-[var(--code-bg)] px-1.5 py-0.5 text-xs">
            /api
          </code>{" "}
          — wire fetches here when ready.
        </p>
        {nav ? (
          <p className="mt-4 text-xs text-[var(--muted)]">
            Suggested owner:{" "}
            <span className="font-medium text-[var(--fg)]">{nav.owner}</span>
          </p>
        ) : null}
        {children ? <div className="mt-6 border-t border-[var(--border)] pt-6">{children}</div> : null}
      </div>
    </div>
  );
}
