import { Suspense } from "react";
import { InterviewContent } from "./interview-content";

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-4xl flex-1 items-center justify-center px-4 py-12">
          <p className="text-sm tracking-widest text-[var(--muted)]">
            LOADING...
          </p>
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
