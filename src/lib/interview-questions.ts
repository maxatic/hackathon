export interface PMQuestion {
  id: string;
  category: string;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTime: string;
  promptContext: string;
}

export const interviewQuestions: PMQuestion[] = [
  {
    id: "product-improvement",
    category: "PRODUCT IMPROVEMENT",
    title: "How would you improve Instagram Stories?",
    description:
      "Demonstrate your ability to analyze an existing product, identify user pain points, and propose data-driven improvements. The interviewer will push back on your assumptions.",
    difficulty: "INTERMEDIATE",
    estimatedTime: "15-20 min",
    promptContext: "Product improvement question about Instagram Stories",
  },
  {
    id: "product-design",
    category: "PRODUCT DESIGN",
    title: "Design a product for remote team collaboration",
    description:
      "Show your product thinking from zero to one. Define the target user, identify key problems, propose a solution, and prioritize an MVP feature set.",
    difficulty: "ADVANCED",
    estimatedTime: "20-25 min",
    promptContext: "Product design question about remote collaboration tools",
  },
  {
    id: "metrics-analytics",
    category: "METRICS & ANALYTICS",
    title: "What metrics would you track for Uber Eats?",
    description:
      "Prove your analytical rigor. Define a metrics framework, distinguish between leading and lagging indicators, and explain how you would use data to make product decisions.",
    difficulty: "INTERMEDIATE",
    estimatedTime: "15-20 min",
    promptContext: "Metrics and analytics question about Uber Eats",
  },
];

export function getInterviewQuestionById(
  id: string,
): PMQuestion | undefined {
  return interviewQuestions.find((q) => q.id === id);
}
