import * as React from "react"
import { motion } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"
import { DENISON } from "@/components/VizFrame"

type Capability = {
  number: string
  capability: string
  title: string
  prompt: string
  artifacts: string[]
  Animation: React.FC
}

const CAPABILITIES: Capability[] = [
  {
    number: "01",
    capability: "Parallel Research Fan-out",
    title: "5 agents, 1 curriculum, concurrent research",
    prompt:
      "Create a new gh repo with this root folder name and make it public … research a course like CS 271 data structures — 10–20 common topics typically offered. Spin up parallel agents to research subcategories of data structures.",
    artifacts: [
      "20-topic reference",
      "Denison-specific syllabus data",
      "5 parallel research agents",
    ],
    Animation: FanOutAnimation,
  },
  {
    number: "02",
    capability: "One-Shot Multi-Agent Build",
    title: "4 build agents writing 19 files in parallel",
    prompt:
      "Let's try into one-shot something fairly complex … 20 solutions, tackled and graphically displayed … use /shadcn skill, follow the big red design system … use agent teams or subagents.",
    artifacts: [
      "20 animated SVG visualizations",
      "VizFrame + VizControls + useStepRunner shared API",
      "Zero new npm packages in topic code",
    ],
    Animation: MultiAgentBuildAnimation,
  },
  {
    number: "03",
    capability: "Self-Verification Loop",
    title: "Browser automation + typecheck + fix",
    prompt:
      "Continue the one-shot build: check if all 20 topic files are present, then run final tests and report.",
    artifacts: [
      "Playwright MCP browser validation",
      "React 19 + motion/react dedupe fix",
      "Button outline variant bg-transparent fix",
      "Final typecheck exit 0",
    ],
    Animation: SelfVerificationAnimation,
  },
  {
    number: "04",
    capability: "Ship to Production",
    title: "From local to public URL",
    prompt:
      "Let's work on getting this deployed to jackzhaojin.github.io … also parallel-task updating 'How it was built'.",
    artifacts: [
      ".github/workflows/deploy-pages.yml",
      "vite.config.ts base path for GH Pages",
      "React Router basename wired up",
    ],
    Animation: ShipToProdAnimation,
  },
  {
    number: "05",
    capability: "Polish & Ship-It",
    title: "Live QA, bug fix, license, repeat the story",
    prompt:
      "Let's update playwright and note that if you click on more than one link it stops working — you have to refresh. Let's also add in the Apache 2.0 license with my GitHub copyright. Update 'How I built this' with a 5th prompt.",
    artifacts: [
      "Lazy-component cache + <Component key={slug} /> — clean remount per route",
      "LICENSE — Apache 2.0, © 2026 jackzhaojin",
      "MetaPage prompt 05 block + updated stat band",
    ],
    Animation: PolishAnimation,
  },
]

export function MetaPage() {
  return (
    <div className="flex flex-col gap-14 p-6 md:p-12">
      <HeroSection />

      <Separator className="bg-[color:var(--color-tassel-gold)]/60" />

      <section className="flex flex-col gap-16">
        {CAPABILITIES.map((c, i) => (
          <CapabilityBlock key={c.number} cap={c} isLast={i === CAPABILITIES.length - 1} />
        ))}
      </section>

      <Separator className="bg-[color:var(--color-tassel-gold)]/60" />

      <StatBand />

      <section className="flex flex-col gap-3">
        <span className="font-eyebrow text-xs text-gold">Next</span>
        <h2 className="font-display text-3xl text-white">
          Jump into the <span className="text-gold">live demos</span>.
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="bg-gold font-eyebrow text-[color:var(--color-denison-red-dark)] hover:bg-[color:var(--color-tassel-gold-dark)]"
          >
            <Link to="/topic/sorting">
              Sorting
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gold bg-transparent font-eyebrow text-gold hover:bg-white/10 hover:text-gold"
          >
            <Link to="/topic/avl">AVL rotations</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-gold bg-transparent font-eyebrow text-gold hover:bg-white/10 hover:text-gold"
          >
            <Link to="/topic/shortest-path">Dijkstra</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default MetaPage

function HeroSection() {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="font-eyebrow text-xs text-gold">Meta · Build Log</span>
        <div className="h-px flex-1 bg-white/30" />
        <span className="font-eyebrow text-xs text-white/80">5 prompts · 1 session</span>
      </div>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-display text-5xl font-semibold leading-tight text-white md:text-7xl"
      >
        Five prompts, one app,
        <br />
        <span className="text-gold">twenty</span> living algorithms.
      </motion.h1>
      <p className="max-w-3xl font-body text-lg text-cream md:text-xl">
        Each prompt below is a capability, not a checklist — watch Claude
        Code fan out agents, write files in parallel, verify itself in a
        real browser, ship to production, and then QA the live site.
      </p>
    </section>
  )
}

function CapabilityBlock({ cap, isLast }: { cap: Capability; isLast: boolean }) {
  const { Animation } = cap
  const delay = (parseInt(cap.number, 10) - 1) * 0.12
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-6">
        <span className="font-display text-[110px] font-semibold leading-none text-gold md:text-[160px]">
          {cap.number}
        </span>
        <div className="flex flex-col gap-2 pb-2">
          <span className="font-eyebrow text-[11px] tracking-widest text-white/80">
            Capability · Prompt {cap.number}
          </span>
          <h2 className="font-display text-3xl text-white md:text-4xl">
            {cap.capability}
          </h2>
          <p className="font-section text-lg italic text-[color:var(--color-neutral-tassel-gold)] md:text-xl">
            {cap.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        <Card className="col-span-1 border-none bg-card shadow-xl md:col-span-3">
          <CardContent className="flex h-full flex-col gap-4 pt-6">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Animation — Capability in action
            </span>
            <div className="flex flex-1 items-center justify-center overflow-hidden rounded-md bg-[color:var(--color-neutral-warm-stone)]/60 p-3">
              <Animation />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-none bg-card shadow-xl md:col-span-2">
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex flex-col gap-2">
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
                The Prompt
              </span>
              <blockquote className="border-l-4 border-[color:var(--color-tassel-gold)] bg-[color:var(--color-neutral-gold)]/60 p-3 font-section italic text-[color:var(--color-denison-red-dark)]">
                "{cap.prompt}"
              </blockquote>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
                Artifacts
              </span>
              <div className="flex flex-wrap gap-2">
                {cap.artifacts.map((a) => (
                  <Badge
                    key={a}
                    className="bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red)]"
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isLast && (
        <div className="mx-auto mt-4 h-10 w-px bg-gradient-to-b from-[color:var(--color-tassel-gold)] to-transparent" />
      )}
    </motion.div>
  )
}

function StatBand() {
  const stats = [
    { n: "5", l: "Prompts" },
    { n: "10", l: "Agents" },
    { n: "20", l: "Visualizations" },
    { n: "1", l: "Live deployment" },
    { n: "0", l: "New npm deps" },
  ]
  return (
    <section className="grid grid-cols-2 gap-6 md:grid-cols-5">
      {stats.map((s, i) => (
        <motion.div
          key={s.l}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="flex flex-col gap-1 border-l-2 border-[color:var(--color-tassel-gold)] pl-3"
        >
          <span className="font-display text-5xl font-semibold leading-none text-gold">
            {s.n}
          </span>
          <span className="font-eyebrow text-[10px] text-white">{s.l}</span>
        </motion.div>
      ))}
    </section>
  )
}

function FanOutAnimation() {
  const W = 520
  const H = 280
  const cx = 110
  const cy = H / 2
  const labels = ["Linear", "Trees", "Graphs", "Hashing", "Course"]
  const targets = labels.map((_, i) => ({
    x: 400,
    y: 40 + i * ((H - 80) / (labels.length - 1)),
  }))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      className="max-w-full"
      role="img"
      aria-label="Parallel research fan-out animation"
    >
      <defs>
        <radialGradient id="claude-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={DENISON.gold} />
          <stop offset="100%" stopColor={DENISON.red} />
        </radialGradient>
      </defs>

      {targets.map((t, i) => (
        <line
          key={`line-${i}`}
          x1={cx + 34}
          y1={cy}
          x2={t.x - 34}
          y2={t.y}
          stroke={DENISON.redDark}
          strokeOpacity={0.35}
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
      ))}

      <motion.circle
        cx={cx}
        cy={cy}
        r={34}
        fill="url(#claude-core)"
        animate={{ r: [34, 38, 34] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontSize={13}
        fill={DENISON.white}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.12em"
      >
        CLAUDE
      </text>

      {targets.map((t, i) => (
        <motion.circle
          key={`out-${i}`}
          r={6}
          fill={DENISON.gold}
          initial={{ cx: cx + 34, cy: cy, opacity: 0 }}
          animate={{
            cx: [cx + 34, t.x - 34],
            cy: [cy, t.y],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.6,
            delay: i * 0.15,
            repeat: Infinity,
            repeatDelay: 2.2,
            ease: "easeInOut",
          }}
        />
      ))}

      {targets.map((t, i) => (
        <motion.circle
          key={`back-${i}`}
          r={5}
          fill={DENISON.red}
          initial={{ cx: t.x - 34, cy: t.y, opacity: 0 }}
          animate={{
            cx: [t.x - 34, cx + 34],
            cy: [t.y, cy],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.4,
            delay: 1.9 + i * 0.12,
            repeat: Infinity,
            repeatDelay: 2.4,
            ease: "easeInOut",
          }}
        />
      ))}

      {targets.map((t, i) => (
        <g key={`target-${i}`}>
          <motion.rect
            x={t.x - 32}
            y={t.y - 18}
            width={74}
            height={36}
            rx={6}
            fill={DENISON.red}
            stroke={DENISON.gold}
            strokeWidth={1.2}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{
              duration: 2,
              delay: 0.3 + i * 0.15,
              repeat: Infinity,
            }}
          />
          <text
            x={t.x + 5}
            y={t.y + 4}
            textAnchor="middle"
            fontSize={11}
            fill={DENISON.white}
            fontFamily="Oswald, sans-serif"
            letterSpacing="0.08em"
          >
            {labels[i].toUpperCase()}
          </text>
        </g>
      ))}

      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, -6] }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          repeatDelay: 0.4,
          times: [0, 0.55, 0.7, 0.9, 1],
        }}
      >
        <rect
          x={cx - 26}
          y={cy + 58}
          width={52}
          height={62}
          rx={4}
          fill={DENISON.neutralGold}
          stroke={DENISON.redDark}
          strokeWidth={1}
        />
        <line x1={cx - 18} y1={cy + 72} x2={cx + 18} y2={cy + 72} stroke={DENISON.redDark} strokeWidth={1} />
        <line x1={cx - 18} y1={cy + 82} x2={cx + 14} y2={cy + 82} stroke={DENISON.redDark} strokeWidth={1} />
        <line x1={cx - 18} y1={cy + 92} x2={cx + 18} y2={cy + 92} stroke={DENISON.redDark} strokeWidth={1} />
        <line x1={cx - 18} y1={cy + 102} x2={cx + 6} y2={cy + 102} stroke={DENISON.redDark} strokeWidth={1} />
        <text
          x={cx}
          y={cy + 114}
          textAnchor="middle"
          fontSize={8}
          fill={DENISON.redDark}
          fontFamily="Oswald, sans-serif"
          letterSpacing="0.12em"
        >
          TOPICS.MD
        </text>
      </motion.g>
    </svg>
  )
}

function MultiAgentBuildAnimation() {
  const W = 560
  const H = 320
  const agentSplits: { letter: string; y: number; count: number }[] = [
    { letter: "A", y: 40, count: 5 },
    { letter: "B", y: 120, count: 5 },
    { letter: "C", y: 200, count: 5 },
    { letter: "D", y: 280, count: 4 },
  ]
  const slugs = [
    "arrays", "linked", "stack", "queue", "heap",
    "hash", "avl", "rb-tree", "bst", "trie",
    "bfs-dfs", "dijkstra", "mst", "topo", "union",
    "sorting", "binary-s", "dp", "greedy",
  ]

  const gridCols = 5
  const gridStartX = 340
  const gridStartY = 40
  const gridCellW = 42
  const gridCellH = 28

  const tiles = slugs.map((slug, i) => {
    const row = Math.floor(i / gridCols)
    const col = i % gridCols
    return {
      slug,
      i,
      agentIdx: row,
      x: gridStartX + col * (gridCellW + 4),
      y: gridStartY + row * (gridCellH + 8),
    }
  })

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      className="max-w-full"
      role="img"
      aria-label="Multi-agent build animation"
    >
      <rect
        x={20}
        y={H / 2 - 34}
        width={78}
        height={68}
        rx={6}
        fill={DENISON.redDark}
        stroke={DENISON.gold}
        strokeWidth={1.2}
      />
      <text
        x={59}
        y={H / 2 - 8}
        textAnchor="middle"
        fontSize={10}
        fill={DENISON.gold}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.12em"
      >
        PROMPT
      </text>
      <text
        x={59}
        y={H / 2 + 12}
        textAnchor="middle"
        fontSize={20}
        fill={DENISON.white}
        fontFamily="Lora, serif"
        fontWeight={600}
      >
        02
      </text>

      {agentSplits.map((a) => (
        <line
          key={`branch-${a.letter}`}
          x1={98}
          y1={H / 2}
          x2={180}
          y2={a.y + 14}
          stroke={DENISON.gold}
          strokeOpacity={0.6}
          strokeWidth={1.2}
        />
      ))}

      {agentSplits.map((a) => (
        <g key={`agent-${a.letter}`}>
          <motion.circle
            cx={200}
            cy={a.y + 14}
            r={18}
            fill={DENISON.red}
            stroke={DENISON.gold}
            strokeWidth={1.5}
            animate={{
              r: [18, 20, 18],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: 0.15 * agentSplits.indexOf(a),
            }}
          />
          <text
            x={200}
            y={a.y + 19}
            textAnchor="middle"
            fontSize={14}
            fill={DENISON.white}
            fontFamily="Lora, serif"
            fontWeight={600}
          >
            {a.letter}
          </text>
        </g>
      ))}

      {tiles.map((t) => (
        <g key={t.slug}>
          <motion.rect
            x={t.x}
            y={t.y}
            width={gridCellW}
            height={gridCellH}
            rx={3}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 1, 1, 1],
              fill: [DENISON.red, DENISON.red, DENISON.red, DENISON.red, DENISON.gold],
              x: [218, 218, t.x, t.x, t.x],
              y: [agentSplits[t.agentIdx].y + 14 - gridCellH / 2, agentSplits[t.agentIdx].y + 14 - gridCellH / 2, t.y, t.y, t.y],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              times: [0, 0.15 + t.i * 0.02, 0.35 + t.i * 0.02, 0.85, 1],
              ease: "easeInOut",
            }}
          />
          <motion.text
            x={t.x + gridCellW / 2}
            y={t.y + gridCellH / 2 + 3}
            textAnchor="middle"
            fontSize={7}
            fontFamily="Oswald, sans-serif"
            letterSpacing="0.06em"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 1, 1, 1],
              fill: [DENISON.white, DENISON.white, DENISON.white, DENISON.white, DENISON.redDark],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              times: [0, 0.15 + t.i * 0.02, 0.4 + t.i * 0.02, 0.85, 1],
            }}
          >
            {t.slug.toUpperCase()}
          </motion.text>
        </g>
      ))}

      <text
        x={gridStartX + (gridCols * (gridCellW + 4)) / 2 - 2}
        y={H - 18}
        textAnchor="middle"
        fontSize={9}
        fill={DENISON.redDark}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.16em"
      >
        19 TOPIC FILES · SHARED VIZFRAME API
      </text>
    </svg>
  )
}

function SelfVerificationAnimation() {
  const W = 560
  const H = 300

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      className="max-w-full"
      role="img"
      aria-label="Self-verification animation"
    >
      <rect
        x={20}
        y={20}
        width={340}
        height={220}
        rx={8}
        fill={DENISON.neutralGold}
        stroke={DENISON.redDark}
        strokeWidth={1}
      />
      <rect x={20} y={20} width={340} height={26} rx={8} fill={DENISON.red} />
      <circle cx={38} cy={33} r={4} fill={DENISON.gold} />
      <circle cx={52} cy={33} r={4} fill={DENISON.white} />
      <circle cx={66} cy={33} r={4} fill={DENISON.cream} />
      <text
        x={190}
        y={37}
        textAnchor="middle"
        fontSize={10}
        fill={DENISON.white}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.16em"
      >
        LOCALHOST / TOPIC / SORTING
      </text>

      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.rect
          key={`bar-${i}`}
          x={48 + i * 46}
          width={34}
          rx={2}
          fill={DENISON.red}
          animate={{
            height: [20 + ((i * 29) % 90), 60 + ((i * 17) % 80), 30 + ((i * 23) % 95), 80 + ((i * 11) % 60), 20 + ((i * 29) % 90)],
            y: [210 - (20 + ((i * 29) % 90)), 210 - (60 + ((i * 17) % 80)), 210 - (30 + ((i * 23) % 95)), 210 - (80 + ((i * 11) % 60)), 210 - (20 + ((i * 29) % 90))],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}

      <rect
        x={20}
        y={252}
        width={340}
        height={28}
        rx={4}
        fill={DENISON.redDark}
      />
      <text
        x={30}
        y={269}
        fontSize={10}
        fill={DENISON.gold}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.14em"
      >
        CONSOLE
      </text>
      <motion.text
        x={95}
        y={269}
        fontSize={10}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.12em"
        animate={{
          opacity: [1, 1, 0, 0],
          fill: [DENISON.gold, DENISON.gold, DENISON.gold, DENISON.gold],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          times: [0, 0.45, 0.5, 1],
        }}
      >
        motion/react duplicate · bg-transparent missing
      </motion.text>
      <motion.text
        x={95}
        y={269}
        fontSize={11}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.16em"
        animate={{
          opacity: [0, 0, 1, 1],
          fill: [DENISON.gold, DENISON.gold, DENISON.gold, DENISON.gold],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          times: [0, 0.5, 0.55, 1],
        }}
      >
        ✓ OK  ·  0 ERRORS
      </motion.text>

      <motion.g
        animate={{ rotate: [0, 20, -10, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ originX: "400px", originY: "120px" }}
      >
        <circle cx={400} cy={120} r={22} fill={DENISON.gold} />
        <text
          x={400}
          y={127}
          textAnchor="middle"
          fontSize={22}
        >
          🔧
        </text>
      </motion.g>
      <text
        x={400}
        y={160}
        textAnchor="middle"
        fontSize={9}
        fill={DENISON.redDark}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.18em"
      >
        AUTO-FIX
      </text>

      <rect
        x={440}
        y={40}
        width={100}
        height={80}
        rx={8}
        fill={DENISON.redDark}
        stroke={DENISON.gold}
        strokeWidth={1.2}
      />
      <text
        x={490}
        y={60}
        textAnchor="middle"
        fontSize={10}
        fill={DENISON.gold}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.18em"
      >
        TSC
      </text>
      <motion.circle
        cx={490}
        cy={90}
        r={18}
        animate={{
          fill: [DENISON.red, DENISON.red, DENISON.gold, DENISON.gold],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          times: [0, 0.45, 0.55, 1],
        }}
      />
      <motion.text
        x={490}
        y={96}
        textAnchor="middle"
        fontSize={16}
        fontFamily="Lora, serif"
        fontWeight={600}
        animate={{
          opacity: [1, 1, 0, 0, 0, 1, 1],
        }}
        transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.44, 0.46, 0.5, 0.54, 0.56, 1] }}
        fill={DENISON.white}
      >
        ✕
      </motion.text>
      <motion.text
        x={490}
        y={96}
        textAnchor="middle"
        fontSize={18}
        fontFamily="Lora, serif"
        fontWeight={700}
        animate={{
          opacity: [0, 0, 1, 1],
        }}
        transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.55, 0.6, 1] }}
        fill={DENISON.redDark}
      >
        ✓
      </motion.text>
      <text
        x={490}
        y={137}
        textAnchor="middle"
        fontSize={8}
        fill={DENISON.white}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.16em"
      >
        EXIT 0
      </text>

      <motion.g
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <rect
          x={440}
          y={180}
          width={100}
          height={60}
          rx={8}
          fill={DENISON.red}
          stroke={DENISON.gold}
          strokeWidth={1.2}
        />
        <text
          x={490}
          y={200}
          textAnchor="middle"
          fontSize={9}
          fill={DENISON.gold}
          fontFamily="Oswald, sans-serif"
          letterSpacing="0.18em"
        >
          PLAYWRIGHT
        </text>
        <text
          x={490}
          y={220}
          textAnchor="middle"
          fontSize={10}
          fill={DENISON.white}
          fontFamily="Oswald, sans-serif"
          letterSpacing="0.12em"
        >
          20 / 20 OK
        </text>
      </motion.g>
    </svg>
  )
}

function ShipToProdAnimation() {
  const W = 580
  const H = 260
  const stages = ["Install", "Build", "Deploy"]
  const stageX = 200
  const stageGap = 60
  const stageW = 120

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      className="max-w-full"
      role="img"
      aria-label="Ship to production animation"
    >
      <rect
        x={20}
        y={H / 2 - 30}
        width={130}
        height={60}
        rx={6}
        fill={DENISON.redDark}
        stroke={DENISON.gold}
        strokeWidth={1.2}
      />
      <text
        x={85}
        y={H / 2 - 8}
        textAnchor="middle"
        fontSize={9}
        fill={DENISON.gold}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.18em"
      >
        LOCAL
      </text>
      <text
        x={85}
        y={H / 2 + 12}
        textAnchor="middle"
        fontSize={12}
        fill={DENISON.white}
        fontFamily="Lora, serif"
      >
        localhost:5173
      </text>

      <motion.circle
        r={5}
        fill={DENISON.gold}
        animate={{
          cx: [150, stageX + 30],
          cy: [H / 2, H / 2],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 5.5, ease: "easeInOut" }}
      />

      {stages.map((s, i) => (
        <g key={s}>
          <rect
            x={stageX + i * (stageW + stageGap) - 120}
            y={H / 2 - 22}
            width={stageW}
            height={44}
            rx={22}
            fill={DENISON.red}
            stroke={DENISON.gold}
            strokeWidth={1.5}
          />
          <motion.rect
            x={stageX + i * (stageW + stageGap) - 120}
            y={H / 2 - 22}
            height={44}
            rx={22}
            fill={DENISON.gold}
            initial={{ width: 0 }}
            animate={{
              width: [0, 0, stageW, stageW, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              times: [
                0,
                0.08 + i * 0.18,
                0.22 + i * 0.18,
                0.88,
                0.95,
              ],
              ease: "easeInOut",
            }}
          />
          <motion.text
            x={stageX + i * (stageW + stageGap) - 60}
            y={H / 2 + 4}
            textAnchor="middle"
            fontSize={12}
            fontFamily="Oswald, sans-serif"
            letterSpacing="0.14em"
            animate={{
              fill: [DENISON.white, DENISON.white, DENISON.redDark, DENISON.redDark, DENISON.white],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              times: [0, 0.08 + i * 0.18, 0.24 + i * 0.18, 0.88, 0.95],
            }}
          >
            {s.toUpperCase()}
          </motion.text>
        </g>
      ))}

      <text
        x={stageX + (stages.length - 1) * (stageW + stageGap) / 2 - 60}
        y={H / 2 - 45}
        textAnchor="middle"
        fontSize={10}
        fill={DENISON.gold}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.2em"
      >
        GITHUB ACTIONS
      </text>
      <text
        x={stageX + (stages.length - 1) * (stageW + stageGap) / 2 - 60}
        y={H / 2 + 58}
        textAnchor="middle"
        fontSize={9}
        fill={DENISON.redDark}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.16em"
      >
        deploy-pages.yml
      </text>

      <motion.circle
        r={5}
        fill={DENISON.red}
        animate={{
          cx: [stageX + (stages.length - 1) * (stageW + stageGap) - 60, W - 100],
          cy: [H / 2, H / 2],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 1, repeat: Infinity, repeatDelay: 5.5, delay: 4.8, ease: "easeInOut" }}
      />

      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          scale: [0.8, 0.8, 1, 1, 0.8],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          times: [0, 0.8, 0.88, 0.96, 1],
          ease: "easeInOut",
        }}
        style={{ originX: `${W - 80}px`, originY: `${H / 2}px` }}
      >
        <rect
          x={W - 150}
          y={H / 2 - 30}
          width={130}
          height={60}
          rx={6}
          fill={DENISON.gold}
          stroke={DENISON.redDark}
          strokeWidth={1.2}
        />
        <text
          x={W - 85}
          y={H / 2 - 8}
          textAnchor="middle"
          fontSize={9}
          fill={DENISON.redDark}
          fontFamily="Oswald, sans-serif"
          letterSpacing="0.18em"
        >
          LIVE
        </text>
        <text
          x={W - 85}
          y={H / 2 + 10}
          textAnchor="middle"
          fontSize={10}
          fill={DENISON.redDark}
          fontFamily="Lora, serif"
          fontWeight={600}
        >
          jackzhaojin.github.io
        </text>
        <text
          x={W - 85}
          y={H / 2 + 22}
          textAnchor="middle"
          fontSize={12}
          fill={DENISON.redDark}
          fontFamily="Lora, serif"
          fontWeight={700}
        >
          ✓
        </text>
      </motion.g>

      <text
        x={W / 2}
        y={H - 14}
        textAnchor="middle"
        fontSize={8}
        fill={DENISON.redDark}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.2em"
        opacity={0.7}
      >
        PUSH → ACTIONS → PAGES · LOOPS ON EACH COMMIT
      </text>
    </svg>
  )
}

function PolishAnimation() {
  const W = 520
  const H = 280
  const steps = [
    { label: "Route remount fix", icon: "bug" },
    { label: "Apache 2.0 LICENSE", icon: "doc" },
    { label: "Meta page · prompt 05", icon: "edit" },
  ]
  const pillW = 150
  const pillH = 48
  const gap = 18
  const totalW = steps.length * pillW + (steps.length - 1) * gap
  const startX = (W - totalW) / 2
  const rowY = 60
  const cycle = steps.length + 1.5

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      className="max-w-full"
      role="img"
      aria-label="Polish and ship-it animation"
    >
      <text
        x={W / 2}
        y={28}
        textAnchor="middle"
        fontSize={10}
        fill={DENISON.redDark}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.22em"
        opacity={0.75}
      >
        PROMPT 05 · POLISH CHECKLIST
      </text>

      {steps.map((s, i) => {
        const x = startX + i * (pillW + gap)
        return (
          <g key={s.label}>
            <rect
              x={x}
              y={rowY}
              width={pillW}
              height={pillH}
              rx={pillH / 2}
              fill={DENISON.redDark}
              opacity={0.85}
            />
            <motion.rect
              x={x}
              y={rowY}
              height={pillH}
              rx={pillH / 2}
              fill={DENISON.gold}
              initial={{ width: 0 }}
              animate={{ width: [0, 0, pillW, pillW, 0] }}
              transition={{
                duration: cycle,
                times: [0, i / cycle, (i + 0.9) / cycle, (steps.length + 0.8) / cycle, 1],
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <PolishIcon
              name={s.icon}
              cx={x + 20}
              cy={rowY + pillH / 2}
            />
            <text
              x={x + 40}
              y={rowY + pillH / 2 + 4}
              fontSize={11}
              fill={DENISON.white}
              fontFamily="Oswald, sans-serif"
              letterSpacing="0.08em"
            >
              {s.label}
            </text>
          </g>
        )
      })}

      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: [0, 0, 0, 1, 1, 0],
          scale: [0.6, 0.6, 0.6, 1, 1, 0.6],
        }}
        transition={{
          duration: cycle,
          times: [
            0,
            (steps.length - 0.2) / cycle,
            (steps.length + 0.1) / cycle,
            (steps.length + 0.4) / cycle,
            (steps.length + 1.1) / cycle,
            1,
          ],
          repeat: Infinity,
        }}
      >
        <rect
          x={W / 2 - 80}
          y={rowY + pillH + 34}
          width={160}
          height={52}
          rx={8}
          fill={DENISON.cream}
          stroke={DENISON.gold}
          strokeWidth={2}
        />
        <text
          x={W / 2}
          y={rowY + pillH + 58}
          textAnchor="middle"
          fontSize={22}
          fill={DENISON.redDark}
          fontFamily="Lora, serif"
          fontWeight={600}
        >
          5 / 5 ✓
        </text>
        <text
          x={W / 2}
          y={rowY + pillH + 76}
          textAnchor="middle"
          fontSize={9}
          fill={DENISON.redDark}
          fontFamily="Oswald, sans-serif"
          letterSpacing="0.2em"
          opacity={0.7}
        >
          READY FOR DEMO
        </text>
      </motion.g>

      <text
        x={W / 2}
        y={H - 14}
        textAnchor="middle"
        fontSize={8}
        fill={DENISON.redDark}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.2em"
        opacity={0.7}
      >
        FIX · LICENSE · DOCS · LOOP
      </text>
    </svg>
  )
}

function PolishIcon({ name, cx, cy }: { name: string; cx: number; cy: number }) {
  if (name === "bug") {
    return (
      <g transform={`translate(${cx - 7}, ${cy - 7})`}>
        <circle cx={7} cy={7} r={5} fill={DENISON.white} />
        <line x1={7} y1={1} x2={7} y2={3} stroke={DENISON.white} strokeWidth={1.5} />
        <line x1={1} y1={7} x2={3} y2={7} stroke={DENISON.white} strokeWidth={1.5} />
        <line x1={11} y1={7} x2={13} y2={7} stroke={DENISON.white} strokeWidth={1.5} />
      </g>
    )
  }
  if (name === "doc") {
    return (
      <g transform={`translate(${cx - 6}, ${cy - 8})`}>
        <rect x={0} y={0} width={12} height={16} rx={2} fill={DENISON.white} />
        <line x1={2} y1={5} x2={10} y2={5} stroke={DENISON.redDark} strokeWidth={1} />
        <line x1={2} y1={8} x2={10} y2={8} stroke={DENISON.redDark} strokeWidth={1} />
        <line x1={2} y1={11} x2={8} y2={11} stroke={DENISON.redDark} strokeWidth={1} />
      </g>
    )
  }
  return (
    <g transform={`translate(${cx - 7}, ${cy - 7})`}>
      <path
        d="M1 13 L10 4 L12 6 L3 15 Z"
        fill={DENISON.white}
      />
      <path d="M10 4 L12 2 L14 4 L12 6 Z" fill={DENISON.white} />
    </g>
  )
}
