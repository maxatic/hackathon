# Syz

**Stop pushing alone.** Syz is an AI-powered job application platform built for the DACH region (Germany, Austria, Switzerland). It takes the Sisyphean grind out of job hunting — one Master CV powers tailored documents, smart tracking, and voice interview practice.

## Features

### Master CV
Upload or manually build a single comprehensive profile. Syz parses PDF resumes with Claude (Anthropic) and stores a structured JSON profile that feeds every tailored document you generate.

### Tailored CV & Cover Letter Generation
Paste a job description, pick a locale (German or English), and Syz generates an ATS-optimized CV and cover letter using your Master CV as the source of truth. Documents are compiled to PDF via LaTeX (DIN 5008 formatting) and stored in Supabase Storage for instant download.

### Application Tracker
Track every application through its lifecycle — **Draft → Applied → Interview → Offer / Rejected / Withdrawn** — with full CRUD and the ability to regenerate documents at any stage.

### AI Interview Coach
Practice mock interviews with ElevenLabs voice-to-voice AI. Pick a topic (product improvement, system design, etc.) and get real-time conversational practice with audio visualization and call timing.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | Supabase (Postgres + Storage) |
| Auth | Clerk |
| AI | Anthropic Claude (default: Haiku) |
| Voice | ElevenLabs Conversational AI |
| PDF | LaTeX (tectonic / pdflatex), pdf-lib |
| UI | Radix, Framer Motion, Lucide Icons |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Clerk](https://clerk.com) account
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key
- (Optional) An [ElevenLabs](https://elevenlabs.io) agent for voice interviews
- (Optional) `tectonic` or `pdflatex` for LaTeX PDF compilation

### 1. Clone and install

```bash
git clone https://github.com/maxatic/syz.git
cd syz
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in the required keys:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key (Claude — CV/cover generation & PDF parsing) |
| `ANTHROPIC_MODEL` | No | Override model (default: `claude-haiku-4-5`; legacy `claude-3-5-haiku-20241022` is remapped) |
| `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` | No | ElevenLabs agent ID for voice interviews |
| `DISABLE_LATEX_PDF` | No | Set `1` to skip LaTeX compilation |
| `LATEX_PDF_ENGINE` | No | `tectonic` or `pdflatex` |

### 3. Set up the database

Run the SQL migrations in your Supabase SQL Editor:

```sql
-- Option A: run migrations individually
-- 1. supabase/migrations/20250321000000_init.sql
-- 2. supabase/migrations/20250321000001_storage.sql
-- 3. supabase/migrations/20250321000002_from_supabase_auth_to_clerk.sql

-- Option B: run the combined setup
-- supabase/setup_all.sql
```

This creates the tables (`master_profiles`, `applications`, `generated_documents`) and the `generated-pdfs` storage bucket.

### 4. (Optional) Install a LaTeX engine

For high-quality PDF output matching the LaTeX template:

```bash
# macOS
brew install tectonic

# Or install MacTeX / TeX Live for pdflatex
```

Without a LaTeX engine, PDFs fall back to plain-text formatting.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (main)/              # Protected app routes
│   │   ├── dashboard/       # Overview & quick actions
│   │   ├── master-cv/       # Master CV editor
│   │   ├── applications/    # CRUD + detail + new
│   │   ├── interview/       # Voice interview coach
│   │   └── settings/        # User settings
│   ├── api/                 # API routes
│   ├── sign-in/             # Clerk sign-in
│   └── sign-up/             # Clerk sign-up
├── components/
│   ├── landing/             # Marketing page sections
│   ├── interview/           # Voice interview UI
│   └── ui/                  # Shared UI primitives
├── lib/
│   ├── ai/                  # Claude integration & CV schema
│   ├── generation/          # Document generation pipeline
│   ├── pdf/                 # LaTeX & text PDF compilation
│   ├── supabase/            # Supabase client
│   └── auth/                # Clerk auth helpers
├── types/                   # TypeScript types
supabase/
├── migrations/              # SQL migration files
templates/
└── cv-main.tex              # LaTeX CV template
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## License

All rights reserved.
