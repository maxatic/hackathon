"use client";

import { useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useConversation } from "@elevenlabs/react";
import { getInterviewQuestionById } from "@/lib/interview-questions";
import { formatInterviewStartError } from "@/lib/interview-errors";
import { SectionLabel } from "@/components/interview/section-label";
import { InterviewPanel } from "@/components/interview/interview-panel";
import { InterviewLanding } from "@/components/interview/interview-landing";

export function InterviewContent() {
  const searchParams = useSearchParams();
  const questionId = searchParams.get("q") ?? "";

  if (!questionId) {
    return <InterviewLanding />;
  }

  return <InterviewSession questionId={questionId} />;
}

function InterviewSession({ questionId }: { questionId: string }) {
  const question = getInterviewQuestionById(questionId);

  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      setSessionError(null);
      setCallStartTime(Date.now());
      setIsStarting(false);
    },
    onDisconnect: () => {
      setCallStartTime(null);
      setIsStarting(false);
    },
    onError: (error: unknown) => {
      console.error("Conversation error:", error);
      setSessionError(formatInterviewStartError(error));
      setIsStarting(false);
    },
  });

  const startConversation = useCallback(async () => {
    setSessionError(null);
    setIsStarting(true);
    try {
      const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
      if (!agentId) {
        setSessionError(
          "Missing NEXT_PUBLIC_ELEVENLABS_AGENT_ID. Add it to .env.local and restart the dev server.",
        );
        setIsStarting(false);
        return;
      }
      await conversation.startSession({ agentId, connectionType: "webrtc" });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      setSessionError(formatInterviewStartError(error));
      setIsStarting(false);
    }
  }, [conversation]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  if (!question) {
    return (
      <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-12">
        <p className="text-sm text-[var(--muted)]">Question not found.</p>
        <Link
          href="/interview"
          className="mt-4 text-xs tracking-widest text-[var(--fg)] hover:underline"
        >
          &larr; BACK TO QUESTIONS
        </Link>
      </div>
    );
  }

  if (question.locked) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
          Coming soon
        </p>
        <h1 className="mt-3 max-w-md text-xl font-semibold tracking-tight text-[var(--fg)]">
          {question.title}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--muted)]">
          This topic isn&apos;t available yet. We&apos;re going to add the rest
          of the topics soon—pick an unlocked challenge from the list.
        </p>
        <Link
          href="/interview"
          className="mt-8 text-xs tracking-widest text-[var(--fg)] underline underline-offset-4 hover:text-[var(--muted)]"
        >
          &larr; BACK TO QUESTIONS
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 md:py-12">
      <Link
        href="/interview"
        className="mb-8 text-xs tracking-widest text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
      >
        &larr; BACK TO QUESTIONS
      </Link>

      <section className="mb-12">
        <SectionLabel number="01" text={question.category} />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--fg)] md:text-4xl">
          {question.title}
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
          {question.description}
        </p>
      </section>

      <InterviewPanel
        status={conversation.status}
        isSpeaking={conversation.isSpeaking}
        callStartTime={callStartTime}
        isStarting={isStarting}
        sessionError={sessionError}
        onDismissSessionError={() => setSessionError(null)}
        onStart={startConversation}
        onEnd={endConversation}
        getInputFrequency={conversation.getInputByteFrequencyData}
        getOutputFrequency={conversation.getOutputByteFrequencyData}
      />
    </div>
  );
}
