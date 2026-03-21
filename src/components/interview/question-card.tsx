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

export function QuestionCard({ question }: { question: PMQuestion }) {
  return (
    <Link href={`/interview?q=${question.id}`}>
      <Card className="group h-full cursor-pointer border-[var(--border)] transition-colors hover:border-[var(--fg)]/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <Badge>{question.category}</Badge>
            <span className="text-xs text-[var(--muted)]">
              {question.estimatedTime}
            </span>
          </div>
          <CardTitle className="mt-4 text-lg transition-colors group-hover:text-[var(--fg)]">
            {question.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {question.description}
          </p>
          <div className="mt-6 flex items-center justify-between">
            <Badge>{question.difficulty}</Badge>
            <span className="text-xs text-[var(--muted)] transition-colors group-hover:text-[var(--fg)]">
              START &rarr;
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
