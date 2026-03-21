import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const featured = {
  quote:
    "I moved to Germany from India and had no idea how to format a German CV. Syz handled the photo, the dates, the Zeugnisse section — everything. I landed interviews within two weeks.",
  name: 'Priya S.',
  role: 'Data Analyst, Frankfurt',
  context: 'International talent navigating DACH',
  initials: 'PS',
}

const wide = {
  quote:
    "The cover letter generator actually sounds German. Not like ChatGPT pretending to be German. The tone, the formality, the structure — that's what sold me. 3 interview invites in the first week.",
  name: 'Tobias K.',
  role: 'Software Engineer, Berlin',
  initials: 'TK',
}

const small1 = {
  quote:
    "I connected my Google Sheet and now every application I send is automatically tracked. I hit Refresh on Monday morning and my whole pipeline updates from Gmail.",
  name: 'Sarah W.',
  role: 'UX Designer, Zurich',
  initials: 'SW',
}

const small2 = {
  quote:
    "The LaTeX output is clean. Recruiters actually commented on how professional my resume looked. And it passed every ATS I threw at it.",
  name: 'Jonas F.',
  role: 'Mechanical Engineer, Stuttgart',
  initials: 'JF',
}

export function Testimonials() {
  return (
    <section className="py-24 px-4 border-y border-border bg-muted/10">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-3">
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
            [06] Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground text-balance">
            Don&apos;t take our word for it.
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-md">
            Job seekers across the DACH region are cutting application time and landing more interviews.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
          <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2 rounded-sm border-border">
            <CardHeader className="pb-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/google-white-icon-zbNQ10GndafNp2onY8yq0tRijO6Sp7.webp"
                alt="Google"
                className="h-16 w-auto"
              />
            </CardHeader>
            <CardContent>
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-lg font-mono font-medium leading-relaxed text-foreground">
                  &ldquo;{featured.quote}&rdquo;
                </p>
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-10 rounded-sm">
                    <AvatarFallback className="rounded-sm font-mono text-xs bg-muted text-muted-foreground">
                      {featured.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="not-italic text-sm font-mono font-semibold text-foreground">{featured.name}</cite>
                    <span className="text-muted-foreground block text-xs font-mono">{featured.role}</span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 rounded-sm border-border">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                  &ldquo;{wide.quote}&rdquo;
                </p>
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-10 rounded-sm">
                    <AvatarFallback className="rounded-sm font-mono text-xs bg-muted text-muted-foreground">
                      {wide.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="not-italic text-sm font-mono font-semibold text-foreground">{wide.name}</cite>
                    <span className="text-muted-foreground block text-xs font-mono">{wide.role}</span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>

          <Card className="rounded-sm border-border">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                  &ldquo;{small1.quote}&rdquo;
                </p>
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-10 rounded-sm">
                    <AvatarFallback className="rounded-sm font-mono text-xs bg-muted text-muted-foreground">
                      {small1.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="not-italic text-sm font-mono font-semibold text-foreground">{small1.name}</cite>
                    <span className="text-muted-foreground block text-xs font-mono">{small1.role}</span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>

          <Card className="rounded-sm border-border">
            <CardContent className="h-full pt-6">
              <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                  &ldquo;{small2.quote}&rdquo;
                </p>
                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="size-10 rounded-sm">
                    <AvatarFallback className="rounded-sm font-mono text-xs bg-muted text-muted-foreground">
                      {small2.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <cite className="not-italic text-sm font-mono font-semibold text-foreground">{small2.name}</cite>
                    <span className="text-muted-foreground block text-xs font-mono">{small2.role}</span>
                  </div>
                </div>
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
