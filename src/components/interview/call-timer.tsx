"use client";

import { useState, useEffect } from "react";

interface CallTimerProps {
  startTime: number;
}

export function CallTimer({ startTime }: CallTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const minutes = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");

  return (
    <div className="font-mono text-2xl tracking-widest text-[var(--muted)]">
      {minutes}:{seconds}
    </div>
  );
}
