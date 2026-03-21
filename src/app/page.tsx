import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { LogoTicker } from '@/components/landing/logo-ticker'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { ApplicationTimeline } from '@/components/landing/application-timeline'
import { ProductPreview } from '@/components/landing/product-preview'
import { Pricing } from '@/components/landing/pricing'
import { Testimonials } from '@/components/landing/testimonials'
import { FAQ } from '@/components/landing/faq'
import { FinalCTA } from '@/components/landing/final-cta'
import { SiteFooter } from '@/components/landing/site-footer'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <div className="pt-14">
        <Hero />
        <LogoTicker />
        <Features />
        <HowItWorks />
        <ApplicationTimeline />
        <ProductPreview />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <SiteFooter />
      </div>
    </main>
  )
}
