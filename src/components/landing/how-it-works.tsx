"use client"

import { Timeline, TimelineItem } from "@/components/ui/modern-timeline"

const steps: TimelineItem[] = [
  {
    number: "01",
    title: "Build Your Master-CV",
    description:
      "Add your full career history — every role, education, skill, and certification. This is your complete professional profile. You only do this once.",
    status: "completed",
  },
  {
    number: "02",
    title: "Paste a Job Description",
    description:
      "Found a job you like? Copy the job posting and paste it into Syz. Our AI analyzes what the company is looking for and matches it against your Master-CV.",
    status: "completed",
  },
  {
    number: "03",
    title: "Get Your Node-CV + Cover Letter",
    description:
      "In seconds, Syz generates a tailored resume and a formal cover letter — in German or English. ATS-optimized. LaTeX-rendered. Ready to send.",
    status: "current",
  },
  {
    number: "04",
    title: "Track, Refresh, Prepare",
    description:
      "Your application is automatically logged in your tracker. Hit Refresh to scan your inbox. When you get the interview invite, practice with our AI voice interviewer.",
    status: "upcoming",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 max-w-6xl mx-auto">
      <div className="mb-14 max-w-xl">
        <p className="text-xs font-mono text-muted-foreground mb-3 tracking-widest uppercase">
          [03] How It Works
        </p>
        <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground text-balance">
          From zero to interview-ready
          <br />
          <span className="text-muted-foreground">in 4 steps.</span>
        </h2>
        <p className="mt-3 text-sm font-mono text-muted-foreground">
          The climb is easier with the right tools.
        </p>
      </div>

      <Timeline items={steps} />
    </section>
  )
}
