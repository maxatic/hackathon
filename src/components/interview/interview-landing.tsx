import { SectionLabel } from "@/components/interview/section-label";
import { QuestionGrid } from "@/components/interview/question-grid";

export function InterviewLanding() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 space-y-24">
      <section className="space-y-6">
        <SectionLabel number="01" text="SELECT YOUR CHALLENGE" />
        <h1 className="text-4xl font-bold tracking-tight text-[var(--fg)] md:text-6xl">
          PM Interview
          <br />
          Practice
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
          Choose a question category. An AI interviewer will conduct a live
          voice mock interview with you (ElevenLabs).
        </p>
      </section>

      <section>
        <SectionLabel number="02" text="QUESTION CATEGORIES" />
        <QuestionGrid />
      </section>
    </div>
  );
}
