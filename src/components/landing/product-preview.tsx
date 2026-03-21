'use client'

import React, { useState } from 'react'
import { GripVertical, X, AlertCircle, FileText, Mail, Search, Clock, CheckCircle2, Zap, FileCheck, Send, BarChart3 } from 'lucide-react'

function BeforePanel() {
  return (
    <div className="absolute inset-0 bg-neutral-50 overflow-hidden p-6 sm:p-10 flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">Without Syz — Generic job hunt</span>
      </div>

      <div className="border border-neutral-200 rounded-sm p-4 bg-white">
        <div className="flex items-start gap-3">
          <FileText className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono text-neutral-400">one_cv_for_all.pdf</span>
              <span className="text-[9px] font-mono text-red-500/80 border border-red-500/20 px-1.5 py-0.5">Generic</span>
            </div>
            <div className="space-y-1.5">
              {[92, 68, 54, 62].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-neutral-200" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <AlertCircle className="w-3 h-3 text-red-500/60" />
              <span className="text-[9px] font-mono text-red-500/60">ATS Score: 34/100 — Not tailored</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-sm p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-[10px] font-mono text-neutral-500">Spray-and-pray applications</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { co: 'Amazon', status: 'Ghosted', color: 'text-neutral-600' },
            { co: 'Google', status: 'Rejected', color: 'text-red-500/70' },
            { co: 'SAP', status: 'Ghosted', color: 'text-neutral-600' },
            { co: 'BMW', status: 'No reply', color: 'text-neutral-600' },
            { co: 'Zalando', status: 'Rejected', color: 'text-red-500/70' },
            { co: '...+37', status: 'Unknown', color: 'text-neutral-700' },
          ].map((item, i) => (
            <div key={i} className="border border-neutral-200 rounded-sm p-2 bg-white">
              <div className="text-[9px] font-mono text-neutral-400 mb-1">{item.co}</div>
              <div className={`text-[8px] font-mono ${item.color}`}>{item.status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-neutral-200 rounded-sm p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-[10px] font-mono text-neutral-500">Cover letter process</span>
        </div>
        <div className="space-y-2">
          {[
            'Copy paste from last application',
            'Translate via Google Translate',
            'Forget Gehaltsvorstellung',
            'Wrong company name left in',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <X className="w-3 h-3 text-red-500/50 shrink-0" />
              <span className="text-[9px] font-mono text-neutral-600">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-red-200 rounded-sm p-4 bg-red-50 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-red-500/50" />
            <span className="text-[10px] font-mono text-neutral-500">Time spent per application</span>
          </div>
          <span className="text-[11px] font-mono text-red-500/70 font-bold">~3–4 hours</span>
        </div>
        <div className="h-1 bg-neutral-200 rounded-full mt-3">
          <div className="h-full w-full bg-red-500/30 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function AfterPanel() {
  return (
    <div className="absolute inset-0 bg-neutral-50 overflow-hidden p-6 sm:p-10 flex flex-col gap-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[10px] font-mono text-neutral-500 tracking-widest uppercase">With Syz — Precision job hunt</span>
      </div>

      <div className="border border-neutral-200 rounded-sm p-4 bg-white">
        <div className="flex items-start gap-3">
          <FileCheck className="w-4 h-4 text-emerald-400/70 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono text-neutral-300">Node-CV — Amazon_PM_2025.pdf</span>
              <span className="text-[9px] font-mono text-emerald-400/80 border border-emerald-400/20 px-1.5 py-0.5">Tailored</span>
            </div>
            <div className="space-y-1.5">
              {[95, 72, 80, 65].map((w, i) => (
                <div key={i} className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full bg-emerald-400/20 rounded-full" style={{ width: `${w}%` }} />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <CheckCircle2 className="w-3 h-3 text-emerald-400/80" />
              <span className="text-[9px] font-mono text-emerald-400/80">ATS Score: 94/100 — Matched to JD</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-sm p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-emerald-400/70" />
          <span className="text-[10px] font-mono text-neutral-500">Targeted applications — auto-tracked</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { co: 'Amazon', status: 'Interview', color: 'text-emerald-400' },
            { co: 'Google', status: 'Applied', color: 'text-blue-400/70' },
            { co: 'SAP', status: 'Interview', color: 'text-emerald-400' },
            { co: 'BMW', status: 'Applied', color: 'text-blue-400/70' },
            { co: 'Zalando', status: 'Offer', color: 'text-yellow-400' },
            { co: 'N26', status: 'Applied', color: 'text-blue-400/70' },
          ].map((item, i) => (
            <div key={i} className="border border-neutral-200 rounded-sm p-2 bg-white">
              <div className="text-[9px] font-mono text-neutral-400 mb-1">{item.co}</div>
              <div className={`text-[8px] font-mono ${item.color}`}>{item.status}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-neutral-200 rounded-sm p-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <Send className="w-3.5 h-3.5 text-emerald-400/70" />
          <span className="text-[10px] font-mono text-neutral-500">Cover letter — auto-generated</span>
        </div>
        <div className="space-y-2">
          {[
            'Formal German, DIN 5008 structure',
            'Gehaltsvorstellung included',
            'Correct Eintrittstermin',
            'Addressed to hiring manager',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-emerald-400/60 shrink-0" />
              <span className="text-[9px] font-mono text-neutral-400">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-emerald-200 rounded-sm p-4 bg-emerald-50 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400/50" />
            <span className="text-[10px] font-mono text-neutral-500">Time spent per application</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400/90 font-bold">~4 minutes</span>
        </div>
        <div className="h-1 bg-neutral-200 rounded-full mt-3">
          <div className="h-full bg-emerald-400/50 rounded-full" style={{ width: '8%' }} />
        </div>
      </div>
    </div>
  )
}

export function ProductPreview() {
  const [inset, setInset] = useState<number>(50)
  const [dragging, setDragging] = useState<boolean>(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const getX = (e: MouseEvent | TouchEvent) => {
    if (!containerRef.current) return 0
    const rect = containerRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    return Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
  }

  React.useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return
      setInset(getX(e))
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging])

  return (
    <section className="w-full border-y border-border bg-white py-24">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-center text-xs font-mono text-muted-foreground mb-2 tracking-widest uppercase">
          [04] See Syz In Action
        </p>
        <h2 className="text-center text-2xl sm:text-3xl font-mono font-bold text-foreground mb-2">
          Paste a job description.
        </h2>
        <p className="text-center text-sm font-mono text-muted-foreground mb-12">
          Watch AI do the rest.
        </p>

        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-sm border border-border select-none"
          style={{ minHeight: '560px', cursor: dragging ? 'col-resize' : 'default' }}
        >
          <BeforePanel />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ clipPath: `inset(0 0 0 ${inset}%)` }}
          >
            <AfterPanel />
          </div>

          <div
            className="absolute top-0 bottom-0 w-px bg-neutral-300 z-20 pointer-events-none"
            style={{ left: `${inset}%` }}
          />

          <button
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 w-9 h-11 bg-white border border-neutral-300 rounded-sm flex items-center justify-center cursor-ew-resize hover:bg-neutral-100 transition-colors shadow-lg"
            style={{ left: `${inset}%` }}
            onMouseDown={(e) => { e.preventDefault(); setDragging(true) }}
            onTouchStart={() => { setDragging(true) }}
            aria-label="Drag to compare"
          >
            <GripVertical className="w-4 h-4 text-neutral-500" />
          </button>

          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <span className="text-[10px] font-mono text-red-600 tracking-widest uppercase bg-white/95 border border-neutral-200 px-2 py-1 shadow-sm">Before</span>
          </div>

          <div
            className="absolute top-4 z-10 pointer-events-none"
            style={{ left: `calc(${inset}% + 14px)` }}
          >
            <span className="text-[10px] font-mono text-emerald-700 tracking-widest uppercase bg-white/95 border border-neutral-200 px-2 py-1 shadow-sm">After</span>
          </div>
        </div>

        <p className="text-center text-xs font-mono text-muted-foreground mt-5">
          Same person. Same experience.{' '}
          <span className="text-foreground">Completely different resume.</span>{' '}
          The Node-CV highlights only what matters for this specific role.
        </p>
      </div>
    </section>
  )
}
