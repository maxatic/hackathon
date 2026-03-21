"use client";

import { StatusIndicator } from "@/components/interview/status-indicator";
import { AudioVisualizer } from "@/components/interview/audio-visualizer";
import { CallTimer } from "@/components/interview/call-timer";
import { cn } from "@/lib/utils";

interface InterviewPanelProps {
  status: string;
  isSpeaking: boolean;
  callStartTime: number | null;
  isStarting: boolean;
  sessionError?: string | null;
  onDismissSessionError?: () => void;
  onStart: () => void;
  onEnd: () => void;
  getInputFrequency?: () => Uint8Array | undefined;
  getOutputFrequency?: () => Uint8Array | undefined;
}

export function InterviewPanel({
  status,
  isSpeaking,
  callStartTime,
  isStarting,
  sessionError,
  onDismissSessionError,
  onStart,
  onEnd,
  getInputFrequency,
  getOutputFrequency,
}: InterviewPanelProps) {
  const isConnected = status === "connected";
  const isDisconnected = status === "disconnected";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <StatusIndicator status={status} isSpeaking={isSpeaking} />

      <AudioVisualizer
        isActive={isConnected}
        isSpeaking={isSpeaking}
        getInputFrequency={getInputFrequency}
        getOutputFrequency={getOutputFrequency}
      />

      {callStartTime ? <CallTimer startTime={callStartTime} /> : null}

      <div className="flex gap-4">
        {isDisconnected ? (
          <button
            type="button"
            onClick={onStart}
            disabled={isStarting}
            className={cn(
              "h-11 cursor-pointer px-8 font-mono text-sm transition-opacity",
              "rounded-lg bg-[var(--fg)] text-[var(--bg)] hover:opacity-90",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {isStarting ? "CONNECTING..." : "START INTERVIEW"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onEnd}
            className={cn(
              "h-11 cursor-pointer border border-[var(--destructive)] px-8 font-mono text-sm",
              "rounded-lg bg-transparent text-[var(--destructive)] transition-colors",
              "hover:bg-[var(--destructive)] hover:text-[var(--bg)]",
            )}
          >
            END INTERVIEW
          </button>
        )}
      </div>

      <p className="max-w-sm text-center text-xs text-[var(--muted)]">
        {isDisconnected
          ? "Click to start. Your microphone will be requested."
          : isSpeaking
            ? "The interviewer is speaking. Listen carefully."
            : "The interviewer is listening. Share your answer."}
      </p>

      {sessionError ? (
        <div
          role="alert"
          className="max-w-md rounded-lg border border-[var(--destructive)]/40 bg-[var(--destructive)]/[0.06] px-4 py-3 text-left text-sm text-[var(--fg)]"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="leading-relaxed">{sessionError}</p>
            {onDismissSessionError ? (
              <button
                type="button"
                onClick={onDismissSessionError}
                className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-[var(--muted)] underline-offset-2 hover:text-[var(--fg)] hover:underline"
              >
                Dismiss
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
