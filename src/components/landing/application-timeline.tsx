'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle, Clock, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

const companyLetters: Record<string, string> = {
  Amazon: 'A',
  Zalando: 'Z',
  'BMW Group': 'B',
  Siemens: 'S',
}

interface Application {
  title: string
  company: string
  description: string
  date: string
  status: 'completed' | 'ongoing' | 'upcoming'
}

const applications: Application[] = [
  {
    title: 'Software Engineer Working Student',
    company: 'Amazon',
    description: 'Generated a Node-CV tailored to Amazon\'s JD and a formal Anschreiben in DIN 5008 format. CV scored 91/100 on ATS. You can safely apply to this position.',
    date: '2025-03-01',
    status: 'completed',
  },
  {
    title: 'Product Manager Intern',
    company: 'Zalando',
    description: 'Generated a Node-CV with Gehaltsvorstellung and Eintrittstermin correctly placed. Cover letter addresses the hiring manager by name. You can safely apply to this position.',
    date: '2025-03-08',
    status: 'completed',
  },
  {
    title: 'Data Analyst Werkstudent',
    company: 'BMW Group',
    description: 'Generated a Node-CV and cover letter optimised for BMW\'s structured hiring process. ATS score 88/100. You can safely apply to this position.',
    date: '2025-03-14',
    status: 'ongoing',
  },
  {
    title: 'Backend Engineer Trainee',
    company: 'Siemens',
    description: 'Node-CV and Anschreiben queued for generation. Syz will pull the relevant experience from your Master-CV once the job description is processed.',
    date: '2025-03-21',
    status: 'upcoming',
  },
]

const statusConfig = {
  completed: {
    label: 'Completed',
    icon: CheckCircle,
    bar: 'bg-success',
    badge: 'bg-success/10 text-success border-success/20',
    progress: '100%',
  },
  ongoing: {
    label: 'Ongoing',
    icon: Clock,
    bar: 'bg-blue-500',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    progress: '60%',
  },
  upcoming: {
    label: 'Upcoming',
    icon: Circle,
    bar: 'bg-warning',
    badge: 'bg-warning/10 text-warning border-warning/20',
    progress: '25%',
  },
}

function ApplicationCard({ app, index }: { app: Application; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const config = statusConfig[app.status]
  const Icon = config.icon
  const letter = companyLetters[app.company] ?? app.company[0].toUpperCase()

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-4 sm:gap-6"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative flex-shrink-0 flex flex-col items-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-sm bg-white border border-border shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-center z-10">
          <span className="font-mono text-base font-semibold text-muted-foreground">{letter}</span>
        </div>
      </div>

      <div className={cn(
        'flex-1 mb-10 rounded-sm border bg-card p-6 sm:p-7 transition-all duration-300 hover:border-muted-foreground/30',
        app.status === 'completed' ? 'border-success/30' : app.status === 'ongoing' ? 'border-blue-500/30' : 'border-border'
      )}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="font-mono text-sm font-semibold text-foreground leading-snug">{app.title}</h3>
            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
              {app.company} <span className="mx-1.5 text-muted-foreground/60">•</span> {app.date}
            </p>
          </div>
          <span className={cn(
            'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border font-mono text-[10px] tracking-wide w-fit shrink-0',
            config.badge
          )}>
            <Icon className="w-3 h-3" />
            {config.label}
          </span>
        </div>

        <p className="font-mono text-[12px] text-muted-foreground leading-relaxed mb-4">
          {app.description}
        </p>

        <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
          <motion.div
            className={cn(
              'h-full rounded-full',
              config.bar,
              app.status === 'completed' && 'animate-pulse'
            )}
            initial={{ width: 0 }}
            animate={inView ? { width: config.progress } : { width: 0 }}
            transition={{ duration: 1.4, delay: index * 0.1 + 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export function ApplicationTimeline() {
  return (
    <section className="bg-white border-t border-border py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-[11px] text-muted-foreground tracking-widest uppercase mb-4">
          [03.5] Applications
        </p>
        <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
          Your applications,<br />
          <span className="text-muted-foreground">tracked automatically.</span>
        </h2>
        <p className="font-mono text-sm text-muted-foreground mb-16">
          Every Node-CV and cover letter Syz generates is logged here with its status.
        </p>

        <div className="relative">
          <div className="absolute left-5 sm:left-6 top-0 bottom-8 w-px bg-border" aria-hidden="true" />
          <div>
            {applications.map((app, i) => (
              <ApplicationCard key={i} app={app} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
