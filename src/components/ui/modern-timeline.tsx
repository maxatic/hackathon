"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export interface TimelineItem {
  title: string
  description: string
  number: string
  status?: "completed" | "current" | "upcoming"
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const windowH = window.innerHeight
      const start = windowH * 0.85
      const end = windowH * 0.2
      const total = start - end
      const current = start - rect.top
      const p = Math.min(Math.max(current / total, 0), 1)
      setProgress(p)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [ref])

  return progress
}

function TimelineStep({ item }: { item: TimelineItem }) {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(ref as React.RefObject<HTMLElement>)

  return (
    <div
      ref={ref}
      className="relative flex gap-6 group"
      role="listitem"
    >
      <div className="flex flex-col items-center w-10 flex-shrink-0">
        <div
          className={cn(
            "w-10 h-10 flex items-center justify-center border font-mono text-xs font-bold transition-colors duration-500 flex-shrink-0",
            progress > 0.05
              ? "border-foreground text-foreground bg-background"
              : "border-border text-muted-foreground bg-background"
          )}
          aria-hidden="true"
        >
          {item.number}
        </div>

        <div className="relative flex-1 w-px bg-border mt-1 mb-1 overflow-hidden min-h-[3rem]">
          <div
            className="absolute top-0 left-0 w-full bg-foreground transition-none origin-top"
            style={{ height: `${progress * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        className={cn(
          "flex-1 pb-10 transition-opacity duration-500",
          progress > 0.05 ? "opacity-100" : "opacity-40"
        )}
      >
        <h3
          className={cn(
            "text-base font-mono font-bold mb-2 transition-colors duration-500",
            progress > 0.05 ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {item.title}
        </h3>
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  )
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <section
      className={cn("w-full", className)}
      role="list"
      aria-label="Timeline of steps"
    >
      <div className="relative">
        {items.map((item, index) => (
          <TimelineStep key={index} item={item} />
        ))}
      </div>
    </section>
  )
}
