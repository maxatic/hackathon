import type { ReactNode } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { PMQuestion } from "@/lib/interview-questions";

function Badge({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-[var(--border)] px-2 py-0.5 text-xs font-medium tracking-wider text-[var(--fg)]/80 ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

export function QuestionCard({ question }: { question: PMQuestion }) {
  const locked = Boolean(question.locked);

  const cardInner = (
    <>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={
                locked ? "border-[var(--border)] text-[var(--muted)]" : ""
              }
            >
              {question.category}
            </Badge>
            {locked ? (
              <span
                className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--muted)]/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--muted)]"
                title="Coming soon"
              >
                <LockIcon className="h-3 w-3 shrink-0" />
                Soon
              </span>
            ) : null}
          </div>
          <span
            className={`shrink-0 text-xs ${locked ? "text-[var(--muted)]/60" : "text-[var(--muted)]"}`}
          >
            {question.estimatedTime}
          </span>
        </div>
        <CardTitle
          className={`mt-4 text-lg ${locked ? "text-[var(--muted)]" : "transition-colors group-hover:text-[var(--fg)]"}`}
        >
          {question.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`text-sm leading-relaxed ${locked ? "text-[var(--muted)]/70" : "text-[var(--muted)]"}`}
        >
          {question.description}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <Badge
            className={locked ? "border-[var(--border)] text-[var(--muted)]" : ""}
          >
            {question.difficulty}
          </Badge>
          {locked ? (
            <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
              <LockIcon className="h-3.5 w-3.5" />
              Locked
            </span>
          ) : (
            <span className="text-xs text-[var(--muted)] transition-colors group-hover:text-[var(--fg)]">
              START &rarr;
            </span>
          )}
        </div>
      </CardContent>
    </>
  );

  if (locked) {
    return (
      <div
        className="pointer-events-none select-none"
        aria-disabled="true"
        role="group"
        aria-label={`${question.title} (coming soon)`}
      >
        <Card className="h-full cursor-not-allowed border-[var(--border)] bg-[var(--hover)] opacity-90 grayscale">
          {cardInner}
        </Card>
      </div>
    );
  }

  return (
    <Link href={`/interview?q=${question.id}`} className="group block h-full">
      <Card className="h-full cursor-pointer border-[var(--border)] transition-colors hover:border-[var(--fg)]/20">
        {cardInner}
      </Card>
    </Link>
  );
}
