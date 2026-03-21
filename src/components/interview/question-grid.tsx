import { interviewQuestions } from "@/lib/interview-questions";
import { QuestionCard } from "@/components/interview/question-card";

export function QuestionGrid() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {interviewQuestions.map((q) => (
        <QuestionCard key={q.id} question={q} />
      ))}
    </div>
  );
}
