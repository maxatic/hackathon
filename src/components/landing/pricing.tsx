'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import NumberFlow from '@number-flow/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type BillPlan = 'monthly' | 'annually'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Get a feel for the platform. No credit card required.',
    monthlyPrice: 0,
    annuallyPrice: 0,
    badge: null,
    cta: 'Start Free',
    features: [
      '3 tailored Node-CVs per month',
      '1 cover letter per month',
      'Manual application tracker',
      '1 mock interview session (5 min)',
      'ATS score check',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For active job seekers who mean business in the DACH market.',
    monthlyPrice: 19.9,
    annuallyPrice: 155,
    badge: 'Most Popular',
    cta: 'Go Pro',
    features: [
      'Unlimited tailored Node-CVs',
      'Unlimited cover letters',
      'Google Sheets auto-tracker',
      'Gmail status refresh',
      '60 min/month mock interviews',
      'LaTeX + PDF export',
      'German / English toggle',
      'ATS optimization',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Full power. Zero limits. For the relentless applicant.',
    monthlyPrice: 39.9,
    annuallyPrice: 311,
    badge: null,
    cta: 'Go Premium',
    features: [
      'Everything in Pro',
      'Unlimited mock interviews',
      'Priority AI (faster generation)',
      'Salary negotiation coach',
      'Analytics dashboard',
      'Priority support',
    ],
  },
]

function PlanCard({ plan, billPlan }: { plan: typeof plans[0]; billPlan: BillPlan }) {
  const isFree = plan.monthlyPrice === 0
  const price = billPlan === 'monthly' ? plan.monthlyPrice : plan.annuallyPrice

  return (
    <div className="flex flex-col relative border overflow-hidden transition-all bg-white text-foreground border-border">
      {plan.badge && (
        <div className="absolute top-4 right-4 text-[10px] font-mono px-2 py-0.5 bg-background text-foreground border border-border">
          {plan.badge}
        </div>
      )}

      <div className="p-6 pb-4">
        <p className="text-[10px] font-mono tracking-widest uppercase mb-4 text-muted-foreground">
          {plan.name}
        </p>
        <div className="flex items-baseline gap-1">
          {isFree ? (
            <span className="text-4xl font-mono font-bold">Free</span>
          ) : (
            <>
              <span className="text-2xl font-mono font-bold">€</span>
              <NumberFlow
                value={price}
                className="text-4xl font-mono font-bold"
                format={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
              />
              <span className="text-xs font-mono ml-1 text-muted-foreground">
                {billPlan === 'monthly' ? '/mo' : '/yr'}
              </span>
            </>
          )}
        </div>
        {!isFree && billPlan === 'monthly' && (
          <p className="text-[10px] font-mono mt-1 text-muted-foreground/60">
            or €{plan.annuallyPrice}/yr billed annually
          </p>
        )}
        {!isFree && billPlan === 'annually' && (
          <p className="text-[10px] font-mono mt-1 text-muted-foreground/60">
            saves €{Math.round(plan.monthlyPrice * 12 - plan.annuallyPrice)} vs monthly
          </p>
        )}
        <p className="text-xs mt-3 leading-relaxed text-muted-foreground">
          {plan.description}
        </p>
      </div>

      <div className="px-6 pb-4">
        <a
          href="#"
          className="flex items-center justify-center h-9 w-full text-sm font-mono font-medium transition-opacity hover:opacity-80 border border-border text-foreground hover:bg-foreground/5"
        >
          {plan.cta}
        </a>
        <div className="h-7 overflow-hidden w-full mt-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={billPlan}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="text-[10px] font-mono text-center text-muted-foreground/60"
            >
              {isFree ? 'No credit card required' : billPlan === 'monthly' ? 'Billed monthly' : 'Billed in one annual payment'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="h-px mx-6 bg-border" />

      <ul className="flex flex-col gap-2.5 p-6">
        <li className="text-[10px] font-mono tracking-widest uppercase mb-1 text-muted-foreground/60">
          Includes
        </li>
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-xs">
            <Check
              size={12}
              className="mt-0.5 shrink-0 text-muted-foreground"
            />
            <span className="text-muted-foreground">
              {f}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Pricing() {
  const [billPlan, setBillPlan] = useState<BillPlan>('monthly')

  return (
    <section id="pricing" className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 py-24">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div className="max-w-xl">
          <p className="text-xs font-mono text-muted-foreground mb-3 tracking-widest uppercase">
            [05] Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground text-balance">
            Simple pricing.
            <br />
            <span className="text-muted-foreground">No surprises.</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground font-mono">
            Start free. Upgrade when the interviews start rolling in.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 shrink-0 min-h-[54px]">
          <div className="flex items-center gap-3">
            <span className={cn('text-sm font-mono', billPlan === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>
              Monthly
            </span>
            <button
              onClick={() => setBillPlan(p => p === 'monthly' ? 'annually' : 'monthly')}
              className="relative w-11 h-6 rounded-full bg-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              aria-label="Toggle billing period"
            >
              <span
                className={cn(
                  'absolute top-1 left-1 w-4 h-4 rounded-full bg-foreground transition-transform duration-300 ease-in-out',
                  billPlan === 'annually' ? 'translate-x-5' : 'translate-x-0'
                )}
              />
            </button>
            <span className={cn('text-sm font-mono', billPlan === 'annually' ? 'text-foreground' : 'text-muted-foreground')}>
              Annually
            </span>
          </div>
          {billPlan === 'annually' && (
            <motion.span
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] text-success border border-success/30 px-2 py-0.5"
            >
              Save ~35%
            </motion.span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-px border border-border bg-border">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} billPlan={billPlan} />
        ))}
      </div>

      <p className="text-center text-xs font-mono text-muted-foreground mt-6">
        Student? Get Pro for{' '}
        <span className="text-foreground">€9.90/mo</span> with your university email.
      </p>
      </div>
    </section>
  )
}
