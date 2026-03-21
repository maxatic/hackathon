"use client";

import { FileText, GitBranch, Mail, Table, RefreshCw, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlowingEffect } from '@/components/ui/glowing-effect'

interface GridItemProps {
  area: string
  icon: React.ReactNode
  title: string
  description: string
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn('min-h-[14rem] list-none', area)}>
      <div className="relative h-full rounded-md border-[0.75px] border-border p-2 md:rounded-lg md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-sm border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-sm border-[0.75px] border-border bg-muted p-2 text-muted-foreground">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-snug font-semibold font-mono tracking-tight text-balance text-foreground">
                {title}
              </h3>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

const features = [
  {
    area: 'md:[grid-area:1/1/2/5]',
    icon: <FileText className="h-4 w-4" />,
    title: 'Master-CV',
    description:
      "Build your complete career profile once. Every role, every skill, every achievement — stored in one place. The foundation for every application you'll ever send.",
  },
  {
    area: 'md:[grid-area:1/5/2/9]',
    icon: <GitBranch className="h-4 w-4" />,
    title: 'Node-CV',
    description:
      'Paste a job description. Get a tailored resume in seconds. Our AI pulls the right experience from your Master-CV and restructures it to match exactly what the recruiter is looking for.',
  },
  {
    area: 'md:[grid-area:1/9/2/13]',
    icon: <Mail className="h-4 w-4" />,
    title: 'Anschreiben on Autopilot',
    description:
      'Formal German. DIN 5008. Addressed to the right person. With your Gehaltsvorstellung and Eintrittstermin in the right place.',
  },
  {
    area: 'md:[grid-area:2/1/3/5]',
    icon: <Table className="h-4 w-4" />,
    title: 'Track Every Application',
    description:
      'Connect your Google Spreadsheet and let automations do the bookkeeping. No more "wait, did I already apply there?"',
  },
  {
    area: 'md:[grid-area:2/5/3/9]',
    icon: <RefreshCw className="h-4 w-4" />,
    title: 'Refresh. Know Where You Stand.',
    description:
      "Hit one button. Syz scans your Gmail inbox, finds recruiter replies, and updates the status of every application. Ghosted? You'll know.",
  },
  {
    area: 'md:[grid-area:2/9/3/13]',
    icon: <Mic className="h-4 w-4" />,
    title: "Practice Like It's Real",
    description:
      'Voice-to-voice with an AI interviewer that sounds human. Choose the company. Choose the question type. Talk through your answers out loud.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="mb-12 max-w-xl">
        <p className="text-xs font-mono text-muted-foreground mb-3 tracking-widest uppercase">
          [02] Features
        </p>
        <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground text-balance">
          Everything you need.
          <br />
          <span className="text-muted-foreground">Nothing you don&apos;t.</span>
        </h2>
        <p className="mt-3 text-sm font-mono text-muted-foreground">One platform. Six problems solved.</p>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
        {features.map((feature) => (
          <GridItem
            key={feature.title}
            area={feature.area}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </ul>
    </section>
  )
}
