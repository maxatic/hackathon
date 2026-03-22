'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { AuroraBackground } from '@/components/ui/aurora-background'

export function Hero() {
  return (
    <section className="relative">
      <AuroraBackground className="min-h-screen overflow-hidden">
        {/* Readability veil — centered so copy isn’t tied to one side */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_85%_60%_at_50%_38%,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.4)_48%,transparent_72%)]"
          aria-hidden
        />

        {/* Corner frame accents */}
        <div
          className="pointer-events-none absolute top-0 left-0 z-20 h-10 w-10 border-t-2 border-l-2 border-border"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-0 right-0 z-20 h-10 w-10 border-t-2 border-r-2 border-border"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[5vh] left-0 z-20 h-10 w-10 border-b-2 border-l-2 border-border"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 bottom-[5vh] z-20 h-10 w-10 border-b-2 border-r-2 border-border"
          aria-hidden
        />

        {/* Corner metadata — desktop */}
        <div
          className="absolute top-24 left-6 z-20 hidden space-y-0.5 font-mono text-[10px] text-muted-foreground/70 md:block"
          aria-hidden
        >
          <div>DACH.REGION</div>
          <div>ATS.OPTIMIZED</div>
          <div>AI.POWERED</div>
        </div>
        <div
          className="absolute top-24 right-6 z-20 hidden space-y-0.5 text-right font-mono text-[10px] text-muted-foreground/70 md:block"
          aria-hidden
        >
          <div>V1.0.0</div>
          <div>SYSTEM.ACTIVE</div>
          <div>■ ONLINE</div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-16 pb-32 sm:pb-28">
          <div className="w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="w-full text-center"
            >
              <div className="mx-auto mb-6 flex w-fit items-center gap-2 border border-border px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
                <span
                  className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"
                  aria-hidden
                />
                SYSTEM.ACTIVE | V1.0.0
              </div>

              <div className="mb-4 flex items-center justify-center gap-2 opacity-90" aria-hidden>
                <div className="h-px w-10 bg-neutral-800 sm:w-14" />
                <span className="font-mono text-[10px] text-neutral-800">∞</span>
                <div className="h-px w-10 bg-neutral-800 sm:w-14" />
              </div>

              <h1 className="mb-5 font-mono text-4xl leading-none font-bold tracking-tight text-balance text-foreground sm:text-6xl">
                STOP PUSHING
                <br />
                <span className="text-muted-foreground">ALONE.</span>
              </h1>

              <div className="mb-4 hidden justify-center gap-1 opacity-80 lg:flex" aria-hidden>
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="h-0.5 w-0.5 rounded-full bg-neutral-800" />
                ))}
              </div>

              <p className="mx-auto mb-8 max-w-xl font-mono text-sm leading-relaxed text-pretty text-muted-foreground">
                Like Sisyphus, you&apos;ve been carrying the weight of every resume, every cover
                letter, every application — alone.
                <br />
                <span className="text-foreground">Syz takes the rock off your shoulders.</span>
              </p>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="#pricing"
                  className="group relative inline-flex h-11 items-center justify-center gap-2 bg-foreground px-6 font-mono text-xs font-medium text-background transition-opacity hover:opacity-90"
                >
                  <span
                    className="absolute -top-1 -left-1 hidden h-2 w-2 border-t border-l border-foreground opacity-0 transition-opacity group-hover:opacity-100 lg:block"
                    aria-hidden
                  />
                  <span
                    className="absolute -right-1 -bottom-1 hidden h-2 w-2 border-r border-b border-foreground opacity-0 transition-opacity group-hover:opacity-100 lg:block"
                    aria-hidden
                  />
                  Start Building Your CV
                  <ArrowRight size={13} />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex h-11 items-center justify-center gap-2 border border-border px-6 font-mono text-xs text-foreground transition-colors hover:bg-muted/80"
                >
                  See How It Works
                </Link>
              </div>

              <div className="mt-6 hidden items-center justify-center gap-2 opacity-90 lg:flex" aria-hidden>
                <span className="font-mono text-[9px] tracking-wide text-neutral-800">∞</span>
                <div className="h-px w-16 bg-neutral-800 sm:w-24" />
                <span className="font-mono text-[9px] tracking-wide text-neutral-800">
                  SISYPHUS.PROTOCOL
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom system bar */}
        <div
          className="pointer-events-none absolute right-0 bottom-[5vh] left-0 z-20 border-t border-border bg-background/85 backdrop-blur-sm"
          aria-hidden
        >
          <div className="container mx-auto flex items-center justify-between px-6 py-2">
            <div className="flex items-center gap-4 font-mono text-[9px] text-muted-foreground">
              <span>SYSTEM.ACTIVE</span>
              <div className="hidden h-3 items-end gap-1 lg:flex">
                {[8, 12, 5, 14, 9, 6, 11, 7].map((h, i) => (
                  <div key={i} className="w-1 bg-foreground/25" style={{ height: `${h}px` }} />
                ))}
              </div>
              <span>V1.0.0</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground">
              <span className="hidden lg:inline">◐ RENDERING</span>
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((d, i) => (
                  <div
                    key={i}
                    className="h-1 w-1 animate-pulse rounded-full bg-foreground/40"
                    style={{ animationDelay: `${d}s` }}
                  />
                ))}
              </div>
              <span className="hidden lg:inline">FRAME: ∞</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-[8vh] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 font-mono text-[10px] text-muted-foreground/60 lg:hidden"
          aria-hidden
        >
          <span>SCROLL</span>
          <ChevronDown size={13} className="animate-bounce" />
        </div>
      </AuroraBackground>
    </section>
  )
}
