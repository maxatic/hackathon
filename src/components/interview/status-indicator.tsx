"use client";

import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: string;
  isSpeaking: boolean;
}

export function StatusIndicator({ status, isSpeaking }: StatusIndicatorProps) {
  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  let label = "DISCONNECTED";
  if (isConnecting) label = "CONNECTING...";
  else if (isConnected && isSpeaking) label = "AGENT SPEAKING";
  else if (isConnected) label = "LISTENING";

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "h-2 w-2 rounded-full",
          !isConnected && !isConnecting && "bg-[var(--muted)]",
          isConnecting && "animate-pulse bg-amber-500",
          isConnected && !isSpeaking && "animate-pulse bg-[var(--success)]",
          isConnected && isSpeaking && "animate-pulse bg-[var(--accent)]",
        )}
      />
      <span className="text-xs tracking-widest text-[var(--muted)] uppercase">
        {label}
      </span>
    </div>
  );
}
