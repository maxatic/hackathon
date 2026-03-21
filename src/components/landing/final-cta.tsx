import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BackgroundPaths } from '@/components/ui/background-paths'

export function FinalCTA() {
  return (
    <section className="relative py-32 px-4 border-y border-border overflow-hidden">
      <BackgroundPaths />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--fg) 1px, transparent 1px), linear-gradient(to bottom, var(--fg) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />

      <div className="absolute top-4 left-4 text-[10px] font-mono text-muted-foreground/30 hidden md:block" aria-hidden>
        END_OF_SCROLL
      </div>
      <div className="absolute top-4 right-4 text-[10px] font-mono text-muted-foreground/30 hidden md:block" aria-hidden>
        CTA.FINAL
      </div>

      <div className="max-w-2xl mx-auto text-center relative">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-foreground text-balance leading-tight mb-6">
          The rock doesn&apos;t have to be
          <br />
          <span className="text-muted-foreground">yours to carry.</span>
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-lg mx-auto text-pretty">
          Join thousands of job seekers in Germany, Austria, and Switzerland who stopped struggling with applications and started landing interviews.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 h-11 px-8 bg-foreground text-background font-mono text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Get Started — It&apos;s Free
            <ArrowRight size={14} />
          </Link>
          <Link
            href="#pricing"
            className="inline-flex items-center justify-center gap-2 h-11 px-8 border border-border text-foreground font-mono text-sm hover:bg-foreground/5 transition-colors"
          >
            See Pricing
          </Link>
        </div>

        <p className="mt-6 text-[11px] font-mono text-muted-foreground/50">
          No credit card required. Free plan available.
        </p>
      </div>
    </section>
  )
}
