'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { AnnouncementBanner } from '@/components/landing/announcement-banner'

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
    <section className="relative min-h-screen overflow-hidden bg-black">
      {/* UnicornStudio animation — desktop */}
      <div className="absolute inset-0 w-full h-full hidden lg:block">
        <div
          data-us-project="OMzqyUv6M3kSnv0JeAtC"
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
      </div>

      {/* Stars fallback — mobile */}
      <div
        className="absolute inset-0 w-full h-full lg:hidden"
        style={{
          backgroundImage: [
            'radial-gradient(1px 1px at 20% 30%, white, transparent)',
            'radial-gradient(1px 1px at 60% 70%, white, transparent)',
            'radial-gradient(1px 1px at 50% 50%, white, transparent)',
            'radial-gradient(1px 1px at 80% 10%, white, transparent)',
            'radial-gradient(1px 1px at 90% 60%, white, transparent)',
            'radial-gradient(1px 1px at 33% 80%, white, transparent)',
            'radial-gradient(1px 1px at 15% 60%, white, transparent)',
            'radial-gradient(1px 1px at 70% 40%, white, transparent)',
          ].join(','),
          opacity: 0.25,
        }}
        aria-hidden
      />

      {/* Corner frame accents */}
      <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-white/30 z-20 pointer-events-none" aria-hidden />
      <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-white/30 z-20 pointer-events-none" aria-hidden />
      <div className="absolute bottom-[5vh] left-0 w-10 h-10 border-b-2 border-l-2 border-white/30 z-20 pointer-events-none" aria-hidden />
      <div className="absolute bottom-[5vh] right-0 w-10 h-10 border-b-2 border-r-2 border-white/30 z-20 pointer-events-none" aria-hidden />

      {/* Corner metadata — desktop */}
      <div className="absolute top-24 left-6 text-[10px] text-white/40 font-mono hidden md:block z-20 space-y-0.5" aria-hidden>
        <div>DACH.REGION</div>
        <div>ATS.OPTIMIZED</div>
        <div>AI.POWERED</div>
      </div>
      <div className="absolute top-24 right-6 text-[10px] text-white/40 font-mono text-right hidden md:block z-20 space-y-0.5" aria-hidden>
        <div>V1.0.0</div>
        <div>SYSTEM.ACTIVE</div>
        <div>■ ONLINE</div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center lg:justify-end pt-16">
        <div className="w-full lg:w-1/2 px-6 lg:px-16 lg:pr-[8%]">
          <div className="max-w-lg mx-auto lg:ml-auto lg:mr-0">
            <div className="mb-6 flex justify-center">
              <AnnouncementBanner />
            </div>

            <div className="flex items-center gap-2 mb-6 text-[10px] font-mono text-white/70 border border-white/20 w-fit px-3 py-1.5 mx-auto">
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" aria-hidden />
              SYSTEM.ACTIVE | V1.0.0
            </div>

            <div className="flex items-center gap-2 mb-4 opacity-50" aria-hidden>
              <div className="w-8 h-px bg-white" />
              <span className="text-white text-[10px] font-mono">∞</span>
              <div className="flex-1 h-px bg-white" />
            </div>

            <h1 className="text-4xl sm:text-6xl font-mono font-bold text-white leading-none tracking-tight mb-5 text-balance">
              STOP PUSHING
              <br />
              <span className="text-white/50">ALONE.</span>
            </h1>

            <div className="hidden lg:flex gap-1 mb-4 opacity-30" aria-hidden>
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-white rounded-full" />
              ))}
            </div>

            <p className="text-sm text-white/70 font-mono leading-relaxed mb-8 text-pretty">
              Like Sisyphus, you&apos;ve been carrying the weight of every resume, every
              cover letter, every application — alone.{' '}
              <span className="text-white">Syz takes the rock off your shoulders.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#pricing"
                className="relative inline-flex items-center justify-center gap-2 h-11 px-6 bg-white text-black font-mono text-xs font-medium hover:bg-white/90 transition-colors group"
              >
                <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                Start Building Your CV
                <ArrowRight size={13} />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 border border-white/40 text-white font-mono text-xs hover:bg-white/10 transition-colors"
              >
                See How It Works
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-2 mt-6 opacity-30" aria-hidden>
              <span className="text-white text-[9px] font-mono">∞</span>
              <div className="flex-1 h-px bg-white" />
              <span className="text-white text-[9px] font-mono">SISYPHUS.PROTOCOL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom system bar */}
      <div className="absolute left-0 right-0 bottom-[5vh] z-20 border-t border-white/20 bg-black/40 backdrop-blur-sm pointer-events-none" aria-hidden>
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[9px] font-mono text-white/40">
            <span>SYSTEM.ACTIVE</span>
            <div className="hidden lg:flex gap-1 items-end h-3">
              {[8, 12, 5, 14, 9, 6, 11, 7].map((h, i) => (
                <div key={i} className="w-1 bg-white/30" style={{ height: `${h}px` }} />
              ))}
            </div>
            <span>V1.0.0</span>
          </div>
          <div className="flex items-center gap-3 text-[9px] font-mono text-white/40">
            <span className="hidden lg:inline">◐ RENDERING</span>
            <div className="flex gap-1">
              {[0, 0.2, 0.4].map((d, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-white/60 rounded-full animate-pulse"
                  style={{ animationDelay: `${d}s` }}
                />
              ))}
            </div>
            <span className="hidden lg:inline">FRAME: ∞</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 text-[10px] font-mono z-30 lg:hidden" aria-hidden>
        <span>SCROLL</span>
        <ChevronDown size={13} className="animate-bounce" />
      </div>
    </section>
  )
}
