'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@clerk/nextjs'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = ['Features', 'How It Works', 'Pricing', 'FAQ']

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-[100000000] transition-all duration-300 border-b',
        scrolled
          ? 'border-border/60 bg-background/90 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-foreground font-mono font-bold text-lg tracking-tight">
          SYZ
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <li key={l}>
              <Link
                href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center h-8 px-4 text-sm bg-white text-black font-mono font-medium hover:bg-white/90 transition-opacity"
            >
              Open App
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex items-center h-8 px-4 text-sm border border-border text-foreground font-mono font-medium hover:border-muted-foreground/40 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center h-8 px-4 text-sm bg-white text-black font-mono font-medium hover:bg-white/90 transition-opacity"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              {l}
            </Link>
          ))}
          <div className="flex gap-2 mt-2">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="flex-1 inline-flex items-center justify-center h-9 px-4 text-sm bg-white text-black font-mono font-medium"
                onClick={() => setOpen(false)}
              >
                Open App
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="flex-1 inline-flex items-center justify-center h-9 px-4 text-sm border border-border text-foreground font-mono font-medium"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="flex-1 inline-flex items-center justify-center h-9 px-4 text-sm bg-white text-black font-mono font-medium"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
