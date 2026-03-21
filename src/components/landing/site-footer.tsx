import Link from 'next/link'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Mock Interviews', href: '#features' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'DACH Application Guide', href: '#' },
      { label: 'ATS Resume Checker', href: '#' },
      { label: 'German Cover Letter Examples', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Impressum', href: '#' },
      { label: 'GDPR Info', href: '#' },
      { label: 'Cookie Settings', href: '#' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'LinkedIn', href: '#' },
      { label: 'Twitter/X', href: '#' },
      { label: 'GitHub', href: '#' },
      { label: 'hello@syz.app', href: 'mailto:hello@syz.app' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="text-foreground font-mono font-bold text-lg tracking-tight">
            SYZ
          </Link>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            The AI-powered Bewerbungsplattform for DACH.
          </p>
          <div className="mt-4 text-[10px] font-mono text-muted-foreground/40 space-y-0.5">
            <div>&#9632; SYSTEM.ONLINE</div>
            <div>V1.0.0 | EU-HOSTED</div>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-[10px] font-mono font-semibold text-muted-foreground tracking-widest uppercase mb-3">
              {col.title}
            </p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-[10px] font-mono text-muted-foreground/50">
            &copy; 2026 Syz. Made with persistence in the DACH region.
          </p>
          <p className="text-[10px] font-mono text-muted-foreground/30 hidden sm:block">
            GDPR.COMPLIANT | EU.HOSTED
          </p>
        </div>
      </div>
    </footer>
  )
}
