import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, BookOpenIcon, PaletteIcon, SparklesIcon } from "lucide-react"

type Phase = {
  number: string
  title: string
  summary: string
  prompt: string
  artifacts: string[]
  icon: React.ReactNode
}

const PHASES: Phase[] = [
  {
    number: "01",
    title: "Map the curriculum",
    summary:
      "Spin up 5 parallel research agents to break a sophomore Data Structures course into 20 coursework topics. One agent pulled the actual Denison syllabus; the others covered linear structures, trees, graphs, hashing, and sort/search in parallel.",
    prompt:
      'Research a course like CS 271 data structures… ~10–20 common topics typically offered. Spin up parallel agents to research subcategories of data structures. Output to ai-docs/cs-271-topic-breakdown.md.',
    artifacts: [
      "ai-docs/cs-271-topic-breakdown.md — 20-topic reference",
      "Denison-specific prereqs, follow-ons, and portfolio grading scheme",
      "Source list including Prof. Kretchmar's posted syllabus",
    ],
    icon: <BookOpenIcon />,
  },
  {
    number: "02",
    title: "Pick the stack, style it Big Red",
    summary:
      "Chose Vite + React + TypeScript + Tailwind v4 + shadcn/ui. Loaded the local /shadcn skill, initialized with the nova preset, and rewrote the theme CSS so Denison Red #C72030 is the background, Tassel Gold #FFC72C is the accent, and Warm Stone #DFD6C5 is the content card color.",
    prompt:
      "Let's use /shadcn skill and build something worth demoing. Graphics and style system should follow the big red design system — focus on red, white, and gold yellow texts.",
    artifacts: [
      "npx shadcn init --template vite --preset nova",
      "src/index.css — Denison palette overrides for every shadcn token",
      "Lora + Oswald + Crimson Pro + Open Sans via Google Fonts",
    ],
    icon: <PaletteIcon />,
  },
  {
    number: "03",
    title: "One-shot the visualizations",
    summary:
      "Spawned 4 parallel build agents, each assigned 5 topics. Every topic plugs into a shared VizFrame + VizControls + useStepRunner hook so play/pause/step/reset behave consistently. Algorithms are animated in SVG with framer-motion.",
    prompt:
      "Each solution should be tackled, solved, and graphically displayed. Not only the algorithm working, but visually make it realistic. Use agent teams or subagents.",
    artifacts: [
      "src/components/VizFrame.tsx — shared chrome + controls + step runner",
      "src/pages/topics/*.tsx — 20 animated topic pages",
      "React Router routes generated from src/data/topics.ts",
    ],
    icon: <SparklesIcon />,
  },
]

export function MetaPage() {
  return (
    <div className="flex flex-col gap-10 p-6 md:p-12">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="font-eyebrow text-xs text-gold">Meta · Build Log</span>
          <div className="h-px flex-1 bg-white/30" />
        </div>
        <h1 className="font-display text-5xl font-semibold leading-tight text-white md:text-6xl">
          How a whole semester
          <br />
          shipped in <span className="text-gold">three phases</span>.
        </h1>
        <p className="max-w-2xl font-body text-lg text-cream">
          This app was built in one session with Claude Code. Below are the
          prompts that drove each phase and the artifacts they produced. The
          goal: prove that a live, pretty, correct explanation of an entire
          undergraduate course is now a single-prompt problem.
        </p>
      </section>

      <Separator className="bg-[color:var(--color-tassel-gold)]/60" />

      <section className="flex flex-col gap-8">
        {PHASES.map((p, i) => (
          <PhaseCard key={p.number} phase={p} isLast={i === PHASES.length - 1} />
        ))}
      </section>

      <Separator className="bg-[color:var(--color-tassel-gold)]/60" />

      <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <MetaStat n="5" l="Research agents" />
        <MetaStat n="4" l="Build agents" />
        <MetaStat n="20" l="Visualizations" />
        <MetaStat n="1" l="Prompt chain" />
      </section>

      <section className="flex flex-col gap-3">
        <span className="font-eyebrow text-xs text-gold">Next</span>
        <h2 className="font-display text-3xl text-white">
          Jump into the <span className="text-gold">live demos</span>.
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-gold font-eyebrow text-[color:var(--color-denison-red-dark)] hover:bg-[color:var(--color-tassel-gold-dark)]">
            <Link to="/topic/sorting">
              Sorting
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-gold bg-transparent font-eyebrow text-gold hover:bg-white/10 hover:text-gold">
            <Link to="/topic/avl">AVL rotations</Link>
          </Button>
          <Button asChild variant="outline" className="border-gold bg-transparent font-eyebrow text-gold hover:bg-white/10 hover:text-gold">
            <Link to="/topic/shortest-path">Dijkstra</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function PhaseCard({ phase, isLast }: { phase: Phase; isLast: boolean }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-8">
      <div className="flex w-full flex-col items-start md:w-40">
        <span className="font-display text-6xl font-semibold leading-none text-gold">
          {phase.number}
        </span>
        <span className="font-eyebrow mt-2 text-[10px] text-white">
          Phase {phase.number}
        </span>
        {!isLast && (
          <div className="mt-4 hidden h-24 w-px bg-gold/50 md:block" />
        )}
      </div>
      <Card className="flex-1 border-none bg-card">
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex items-center gap-3">
            <div className="rounded-sm bg-[color:var(--color-denison-red)] p-2 text-white">
              {phase.icon}
            </div>
            <h3 className="font-display text-2xl text-[color:var(--color-denison-red-dark)]">
              {phase.title}
            </h3>
          </div>
          <p className="font-body text-base text-[color:var(--color-denison-red-dark)]/90">
            {phase.summary}
          </p>
          <div className="flex flex-col gap-2">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Prompt
            </span>
            <blockquote className="border-l-4 border-[color:var(--color-tassel-gold)] bg-[color:var(--color-neutral-gold)]/60 p-3 font-section italic text-[color:var(--color-denison-red-dark)]">
              "{phase.prompt}"
            </blockquote>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Artifacts
            </span>
            <ul className="flex flex-col gap-1">
              {phase.artifacts.map((a) => (
                <li key={a} className="flex items-start gap-2 font-body text-sm text-[color:var(--color-denison-red-dark)]/90">
                  <Badge className="mt-1 bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red)]">
                    ✓
                  </Badge>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetaStat({ n, l }: { n: string; l: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-[color:var(--color-tassel-gold)] pl-3">
      <span className="font-display text-4xl font-semibold leading-none text-gold">
        {n}
      </span>
      <span className="font-eyebrow text-[10px] text-white">{l}</span>
    </div>
  )
}
