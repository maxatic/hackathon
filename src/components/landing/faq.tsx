'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

const faqs = [
  {
    q: 'How is Syz different from using ChatGPT to write my resume?',
    a: "ChatGPT gives you a wall of text. Syz gives you a ready-to-send PDF. We understand German CV formatting (tabellarischer Lebenslauf, Bewerbungsfoto, DIN 5008), we generate ATS-optimized LaTeX, and we connect to your tracker and Gmail. It's not just AI writing — it's a complete workflow.",
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. All data is hosted in the EU (Germany). We are fully GDPR-compliant. We never sell your data. When you use the Gmail feature, we scan for application-related emails only and store metadata — never full email content. You can delete all your data at any time.',
  },
  {
    q: 'Does the cover letter really sound natural in German?',
    a: 'We specifically optimized our AI for professional German business writing. Not translated English — actual formal German with proper Sie-form, DIN 5008 structure, and DACH-specific elements like Gehaltsvorstellung and Eintrittstermin. Native speakers reviewed and tested every prompt.',
  },
  {
    q: 'What is a Master-CV and a Node-CV?',
    a: "Your Master-CV is your complete career profile — every job, skill, and achievement you've ever had. A Node-CV is a tailored version generated for a specific job posting. Think of it like this: Master-CV is the tree trunk. Node-CVs are the branches — each one shaped for a different opportunity.",
  },
  {
    q: 'Which interview types do you support for mock practice?',
    a: "Currently, we support Product Manager interviews — behavioral, product sense, estimation, and strategy questions for companies like Google, Meta, Amazon, and SAP. We're expanding to Engineering, Consulting, and Finance roles soon.",
  },
  {
    q: 'Can I use Syz in English?',
    a: 'Absolutely. Every feature works in both German and English. You can toggle between languages at any time — for your resume, cover letter, and mock interviews.',
  },
  {
    q: 'Do I need to connect my Google account?',
    a: 'No. The Google Sheets tracker and Gmail refresh are optional power features. You can use Syz fully without connecting any accounts — just use the built-in manual tracker.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. Syz Starter is free forever. You get 3 tailored resumes per month, 1 cover letter, and a 5-minute mock interview session. No credit card required.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="mb-12 max-w-xl">
        <p className="text-xs font-mono text-muted-foreground mb-3 tracking-widest uppercase">
          [07] FAQ
        </p>
        <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground text-balance">
          Questions?
          <br />
          <span className="text-muted-foreground">{"We've got answers."}</span>
        </h2>
      </div>

      <div className="border border-border divide-y divide-border">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-muted/20 transition-colors"
              aria-expanded={open === i}
            >
              <span className="text-xs font-mono font-medium text-foreground leading-relaxed pr-4">
                {faq.q}
              </span>
              <motion.span
                className="shrink-0 mt-0.5 text-muted-foreground"
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                aria-hidden
              >
                <Plus size={14} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div
                    initial={{ y: -6 }}
                    animate={{ y: 0 }}
                    exit={{ y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="px-6 pb-5"
                  >
                    <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
