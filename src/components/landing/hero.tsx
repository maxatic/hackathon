'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

export function Hero() {
  useEffect(() => {
    const embedScript = document.createElement('script')
    embedScript.type = 'text/javascript'
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `
    document.head.appendChild(embedScript)

    const style = document.createElement('style')
    style.id = 'unicorn-hero-styles'
    style.textContent = `
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }
      [data-us-project] canvas {
        clip-path: inset(0 0 10% 0) !important;
        filter: contrast(1.45) brightness(0.78) saturate(0.95) !important;
      }
      [data-us-project] * {
        pointer-events: none !important;
      }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
    `
    document.head.appendChild(style)

    const hideBranding = () => {
      const containers = document.querySelectorAll('[data-us-project]')
      containers.forEach((container) => {
        container.querySelectorAll('*').forEach((el) => {
          const text = (el.textContent || '').toLowerCase()
          const title = (el.getAttribute('title') || '').toLowerCase()
          const href = (el.getAttribute('href') || '').toLowerCase()
          if (
            text.includes('made with') ||
            text.includes('unicorn') ||
            title.includes('made with') ||
            title.includes('unicorn') ||
            href.includes('unicorn.studio')
          ) {
            ;(el as HTMLElement).style.cssText =
              'display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;position:absolute!important;left:-9999px!important;top:-9999px!important;'
            try { el.remove() } catch (_) {}
          }
        })
      })
    }

    hideBranding()
    const interval = setInterval(hideBranding, 50)
    const t1 = setTimeout(hideBranding, 500)
    const t2 = setTimeout(hideBranding, 1000)
    const t3 = setTimeout(hideBranding, 2000)
    const t4 = setTimeout(hideBranding, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      try { document.head.removeChild(embedScript) } catch (_) {}
      const s = document.getElementById('unicorn-hero-styles')
      if (s) document.head.removeChild(s)
    }
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* UnicornStudio animation — desktop (filters on canvas darken the dotted Sisyphus art on white) */}
      <div className="absolute inset-0 w-full h-full hidden lg:block opacity-[0.58]">
        <div
          data-us-project="OMzqyUv6M3kSnv0JeAtC"
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
      </div>
      <div
        className="absolute inset-0 hidden lg:block pointer-events-none bg-gradient-to-r from-transparent via-white/35 to-white z-[1]"
        aria-hidden
      />

      {/* Stars fallback — mobile */}
      <div
        className="absolute inset-0 w-full h-full lg:hidden"
        style={{
          backgroundImage: [
            'radial-gradient(1px 1px at 20% 30%, rgba(0,0,0,0.06), transparent)',
            'radial-gradient(1px 1px at 60% 70%, rgba(0,0,0,0.06), transparent)',
            'radial-gradient(1px 1px at 50% 50%, rgba(0,0,0,0.06), transparent)',
            'radial-gradient(1px 1px at 80% 10%, rgba(0,0,0,0.06), transparent)',
            'radial-gradient(1px 1px at 90% 60%, rgba(0,0,0,0.06), transparent)',
            'radial-gradient(1px 1px at 33% 80%, rgba(0,0,0,0.06), transparent)',
            'radial-gradient(1px 1px at 15% 60%, rgba(0,0,0,0.06), transparent)',
            'radial-gradient(1px 1px at 70% 40%, rgba(0,0,0,0.06), transparent)',
          ].join(','),
          opacity: 0.55,
        }}
        aria-hidden
      />

      {/* Corner frame accents */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-border z-20 pointer-events-none" aria-hidden />
      <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-border z-20 pointer-events-none" aria-hidden />
      <div className="absolute bottom-[5vh] left-0 w-10 h-10 border-b-2 border-l-2 border-border z-20 pointer-events-none" aria-hidden />
      <div className="absolute bottom-[5vh] right-0 w-10 h-10 border-b-2 border-r-2 border-border z-20 pointer-events-none" aria-hidden />

      {/* Corner metadata — desktop */}
      <div className="absolute top-24 left-6 text-[10px] text-muted-foreground/70 font-mono hidden md:block z-20 space-y-0.5" aria-hidden>
        <div>DACH.REGION</div>
        <div>ATS.OPTIMIZED</div>
        <div>AI.POWERED</div>
      </div>
      <div className="absolute top-24 right-6 text-[10px] text-muted-foreground/70 font-mono text-right hidden md:block z-20 space-y-0.5" aria-hidden>
        <div>V1.0.0</div>
        <div>SYSTEM.ACTIVE</div>
        <div>■ ONLINE</div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center lg:justify-end pt-16">
        <div className="w-full lg:w-1/2 px-6 lg:px-16 lg:pr-[8%]">
          <div className="max-w-lg mx-auto lg:ml-auto lg:mr-0">
            <div className="flex items-center gap-2 mb-6 text-[10px] font-mono text-muted-foreground border border-border w-fit px-3 py-1.5 mx-auto">
              <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" aria-hidden />
              SYSTEM.ACTIVE | V1.0.0
            </div>

            <div className="flex items-center gap-2 mb-4 opacity-90" aria-hidden>
              <div className="w-8 h-px bg-neutral-800" />
              <span className="text-neutral-800 text-[10px] font-mono">∞</span>
              <div className="flex-1 h-px bg-neutral-800" />
            </div>

            <h1 className="text-4xl sm:text-6xl font-mono font-bold text-foreground leading-none tracking-tight mb-5 text-balance">
              STOP PUSHING
              <br />
              <span className="text-muted-foreground">ALONE.</span>
            </h1>

            <div className="hidden lg:flex gap-1 mb-4 opacity-80" aria-hidden>
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-neutral-800 rounded-full" />
              ))}
            </div>

            <p className="text-sm text-muted-foreground font-mono leading-relaxed mb-8 text-pretty">
              Like Sisyphus, you&apos;ve been carrying the weight of every resume, every
              cover letter, every application — alone.{' '}
              <span className="text-foreground">Syz takes the rock off your shoulders.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#pricing"
                className="relative inline-flex items-center justify-center gap-2 h-11 px-6 bg-foreground text-background font-mono text-xs font-medium hover:opacity-90 transition-opacity group"
              >
                <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                Start Building Your CV
                <ArrowRight size={13} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 border border-border text-foreground font-mono text-xs hover:bg-muted/80 transition-colors"
              >
                See How It Works
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-2 mt-6 opacity-90" aria-hidden>
              <span className="text-neutral-800 text-[9px] font-mono tracking-wide">∞</span>
              <div className="flex-1 h-px bg-neutral-800" />
              <span className="text-neutral-800 text-[9px] font-mono tracking-wide">SISYPHUS.PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom system bar */}
      <div className="absolute left-0 right-0 bottom-[5vh] z-20 border-t border-border bg-white/85 backdrop-blur-sm pointer-events-none" aria-hidden>
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground">
            <span>SYSTEM.ACTIVE</span>
            <div className="hidden lg:flex gap-1 items-end h-3">
              {[8, 12, 5, 14, 9, 6, 11, 7].map((h, i) => (
                <div key={i} className="w-1 bg-foreground/25" style={{ height: `${h}px` }} />
              ))}
            </div>
            <span>V1.0.0</span>
          </div>
          <div className="flex items-center gap-3 text-[9px] font-mono text-muted-foreground">
            <span className="hidden lg:inline">◐ RENDERING</span>
            <div className="flex gap-1">
              {[0, 0.2, 0.4].map((d, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-foreground/40 rounded-full animate-pulse"
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
            </div>
            <span className="hidden lg:inline">FRAME: ∞</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/60 text-[10px] font-mono z-30 lg:hidden" aria-hidden>
        <span>SCROLL</span>
        <ChevronDown size={13} className="animate-bounce" />
      </div>
    </section>
  )
}
