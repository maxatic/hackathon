"use client";

import { useCallback, useRef, useState } from "react";
import {
  type ProfileFields,
  fieldsToProfile,
} from "@/lib/master-cv-fields";
import { parseFetchJson } from "@/lib/parse-fetch-json";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  profilePatch?: Record<string, unknown>;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--fg)]";

type MasterCvChatProps = {
  fields: ProfileFields;
  onApplyPatch: (patch: Record<string, unknown>) => void;
  disabled?: boolean;
};

export function MasterCvChat({
  fields,
  onApplyPatch,
  disabled = false,
}: MasterCvChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = listRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading || disabled) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const nextThread = [...messages, userMsg];
    setMessages(nextThread);
    setInput("");
    setLoading(true);
    setError(null);
    scrollToBottom();

    try {
      const apiMessages = nextThread.map(({ role, content }) => ({
        role,
        content,
      }));
      const profile = fieldsToProfile(fields);
      const res = await fetch("/api/master-profile/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, profile }),
      });
      const data = (await parseFetchJson(res)) as {
        reply?: string;
        profilePatch?: Record<string, unknown>;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Chat request failed");
        return;
      }
      const reply = typeof data.reply === "string" ? data.reply : "";
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: reply,
        ...(data.profilePatch && Object.keys(data.profilePatch).length > 0
          ? { profilePatch: data.profilePatch }
          : {}),
      };
      setMessages((m) => [...m, assistantMsg]);
      scrollToBottom();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chat request failed");
    } finally {
      setLoading(false);
    }
  }, [disabled, fields, input, loading, messages, scrollToBottom]);

  return (
    <div className="flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--fg)]">CV assistant</h2>
        <p className="mt-0.5 text-xs text-[var(--muted)]">
          Claude Haiku — ask for edits; apply patches to the form when offered.
        </p>
      </div>

      <div
        ref={listRef}
        className="max-h-[min(50vh,420px)] min-h-[160px] space-y-3 overflow-y-auto px-3 py-3"
      >
        {messages.length === 0 ? (
          <p className="text-xs text-[var(--muted)]">
            Example: “Shorten my summary for a senior PM role” or “Fix bullet
            grammar in experience.”
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "ml-4 bg-[var(--border)]/40 text-[var(--fg)]"
                  : "mr-4 bg-[var(--bg)] text-[var(--fg)] ring-1 ring-[var(--border)]"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
              {m.role === "assistant" && m.profilePatch ? (
                <button
                  type="button"
                  disabled={disabled || loading}
                  onClick={() => onApplyPatch(m.profilePatch!)}
                  className="mt-2 rounded-md border border-[var(--fg)] bg-transparent px-2 py-1 text-xs font-medium text-[var(--fg)] hover:bg-[var(--hover)] disabled:opacity-50"
                >
                  Apply suggested changes
                </button>
              ) : null}
            </div>
          ))
        )}
        {loading ? (
          <p className="text-xs text-[var(--muted)]">Thinking…</p>
        ) : null}
      </div>

      {error ? (
        <p className="px-3 text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      <div className="border-t border-[var(--border)] p-3">
        <textarea
          className={`${inputClass} min-h-[72px] resize-y`}
          placeholder="Ask about your master CV…"
          value={input}
          disabled={disabled || loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <button
          type="button"
          disabled={disabled || loading || !input.trim()}
          onClick={() => void send()}
          className="mt-2 w-full rounded-lg border border-[var(--fg)] bg-[var(--fg)] px-3 py-2 text-sm font-medium text-[var(--bg)] transition-colors hover:bg-transparent hover:text-[var(--fg)] disabled:opacity-50"
        >
          {loading ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
