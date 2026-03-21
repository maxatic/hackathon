'use client'

const LOGOS = [
  'Google', 'SAP', 'Siemens', 'BMW', 'Allianz', 'Deutsche Bank',
  'Zalando', 'N26', 'Delivery Hero', 'Bosch', 'Swiss Re', 'Red Bull',
]

export function LogoTicker() {
  return (
    <section className="border-y border-border py-6 overflow-hidden bg-background">
      <p className="text-center text-xs font-mono text-muted-foreground mb-5 px-4">
        Syz users are landing interviews at
      </p>
      <div className="relative flex">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" aria-hidden />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" aria-hidden />

        <div className="flex animate-ticker gap-12 whitespace-nowrap">
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <span
              key={i}
              className="text-sm font-mono font-medium text-muted-foreground/60 hover:text-muted-foreground transition-colors shrink-0 tracking-widest uppercase"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
