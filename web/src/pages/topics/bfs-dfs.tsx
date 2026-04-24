import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"
import { Button } from "@/components/ui/button"

type Mode = "BFS" | "DFS"

const N = 8

const NODE_POS: { x: number; y: number }[] = [
  { x: 320, y: 50 },
  { x: 180, y: 140 },
  { x: 460, y: 140 },
  { x: 90, y: 230 },
  { x: 260, y: 230 },
  { x: 400, y: 230 },
  { x: 540, y: 230 },
  { x: 320, y: 320 },
]

const EDGES: readonly (readonly [number, number])[] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [4, 7],
  [5, 7],
  [3, 4],
  [5, 6],
] as const

const ADJ: number[][] = (() => {
  const a: number[][] = Array.from({ length: N }, () => [])
  for (const [u, v] of EDGES) {
    a[u].push(v)
    a[v].push(u)
  }
  for (const row of a) row.sort((x, y) => x - y)
  return a
})()

type Snapshot = {
  frontier: number[]
  visited: boolean[]
  discovered: boolean[]
  order: number[]
  currentEdge: readonly [number, number] | null
  justVisited: number | null
  note: string
}

function buildSteps(mode: Mode): Snapshot[] {
  const visited = Array(N).fill(false) as boolean[]
  const discovered = Array(N).fill(false) as boolean[]
  const order: number[] = []
  let frontier: number[] = [0]
  discovered[0] = true
  const steps: Snapshot[] = []
  steps.push({
    frontier: [...frontier],
    visited: [...visited],
    discovered: [...discovered],
    order: [...order],
    currentEdge: null,
    justVisited: null,
    note: `Seed ${mode === "BFS" ? "queue" : "stack"} with node 0.`,
  })

  while (frontier.length > 0) {
    let u: number
    if (mode === "BFS") {
      u = frontier[0]
      frontier = frontier.slice(1)
    } else {
      u = frontier[frontier.length - 1]
      frontier = frontier.slice(0, -1)
    }
    if (visited[u]) {
      steps.push({
        frontier: [...frontier],
        visited: [...visited],
        discovered: [...discovered],
        order: [...order],
        currentEdge: null,
        justVisited: null,
        note: `Node ${u} already visited — skip.`,
      })
      continue
    }
    visited[u] = true
    order.push(u)
    const newlyDiscovered: number[] = []
    for (const v of ADJ[u]) {
      if (!discovered[v]) {
        discovered[v] = true
        newlyDiscovered.push(v)
        frontier.push(v)
      }
    }
    steps.push({
      frontier: [...frontier],
      visited: [...visited],
      discovered: [...discovered],
      order: [...order],
      currentEdge: null,
      justVisited: u,
      note:
        newlyDiscovered.length > 0
          ? `Visit ${u}; discover ${newlyDiscovered.join(", ")}.`
          : `Visit ${u}; no new neighbors.`,
    })
  }
  steps.push({
    frontier: [],
    visited: [...visited],
    discovered: [...discovered],
    order: [...order],
    currentEdge: null,
    justVisited: null,
    note: `Traversal complete. Visit order: ${order.join(" → ")}.`,
  })
  return steps
}

const NODE_R = 22
const W = 620
const H = 370

export default function BfsDfsTopic() {
  const [mode, setMode] = React.useState<Mode>("BFS")
  const [stepIdx, setStepIdx] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(800)

  const steps = React.useMemo(() => buildSteps(mode), [mode])
  const maxSteps = steps.length - 1
  const snap = steps[Math.min(stepIdx, maxSteps)]

  const advance = React.useCallback(() => {
    setStepIdx((s) => Math.min(s + 1, maxSteps))
  }, [maxSteps])

  const canStep = stepIdx < maxSteps
  useStepRunner(advance, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setStepIdx(0)
  }

  const toggleMode = () => {
    setPlaying(false)
    setStepIdx(0)
    setMode((m) => (m === "BFS" ? "DFS" : "BFS"))
  }

  const frontierLabel = mode === "BFS" ? "Queue" : "Stack"

  return (
    <VizFrame
      topicNumber={18}
      category="Graphs"
      title="BFS, DFS & Topological Sort"
      summary="Same graph, two traversals. BFS fans out layer by layer using a queue. DFS goes deep first using a stack. Toggle and watch the frontier data structure drive the order."
      complexity="O(V + E)"
    >
      <div className="flex flex-col gap-5">
        <VizControls
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onStep={advance}
          onReset={reset}
          speedMs={speedMs}
          onSpeedChange={setSpeedMs}
          canStep={canStep}
          extra={
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={mode === "BFS" ? "default" : "outline"}
                onClick={() => {
                  if (mode !== "BFS") toggleMode()
                }}
                className={
                  mode === "BFS"
                    ? "bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red-dark)]"
                    : "border-[color:var(--color-denison-red)] text-[color:var(--color-denison-red-dark)]"
                }
              >
                BFS
              </Button>
              <Button
                size="sm"
                variant={mode === "DFS" ? "default" : "outline"}
                onClick={() => {
                  if (mode !== "DFS") toggleMode()
                }}
                className={
                  mode === "DFS"
                    ? "bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red-dark)]"
                    : "border-[color:var(--color-denison-red)] text-[color:var(--color-denison-red-dark)]"
                }
              >
                DFS
              </Button>
            </div>
          }
        />

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[420px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Traversal from node 0 — {mode}
            </span>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
              {EDGES.map(([u, v]) => {
                const pu = NODE_POS[u]
                const pv = NODE_POS[v]
                const bothTouched =
                  (snap.visited[u] || snap.discovered[u]) &&
                  (snap.visited[v] || snap.discovered[v])
                return (
                  <line
                    key={`edge-${u}-${v}`}
                    x1={pu.x}
                    y1={pu.y}
                    x2={pv.x}
                    y2={pv.y}
                    stroke={bothTouched ? DENISON.goldDark : DENISON.redDark}
                    strokeOpacity={bothTouched ? 0.9 : 0.3}
                    strokeWidth={bothTouched ? 2.5 : 1.5}
                  />
                )
              })}
              {NODE_POS.map((p, i) => {
                const isVisited = snap.visited[i]
                const isDiscovered = snap.discovered[i] && !isVisited
                const isJust = snap.justVisited === i
                let fill = DENISON.white
                let stroke = DENISON.redDark
                let textColor = DENISON.redDark
                if (isVisited) {
                  fill = DENISON.red
                  stroke = DENISON.redDark
                  textColor = DENISON.white
                } else if (isDiscovered) {
                  fill = DENISON.gold
                  stroke = DENISON.goldDark
                  textColor = DENISON.redDark
                }
                return (
                  <motion.g
                    key={`node-${i}`}
                    initial={false}
                    animate={{ scale: isJust ? 1.15 : 1 }}
                    transition={{ duration: 0.25 }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  >
                    <circle cx={p.x} cy={p.y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth={2} />
                    <text
                      x={p.x}
                      y={p.y + 5}
                      textAnchor="middle"
                      fontSize={14}
                      fontFamily="Oswald, sans-serif"
                      fill={textColor}
                    >
                      {i}
                    </text>
                  </motion.g>
                )
              })}
            </svg>

            <div className="mt-3">
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
                Visit order
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <AnimatePresence>
                  {snap.order.map((n, i) => (
                    <motion.span
                      key={`ord-${mode}-${i}-${n}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md px-2 font-eyebrow text-xs"
                      style={{ backgroundColor: DENISON.red, color: DENISON.white }}
                    >
                      {n}
                    </motion.span>
                  ))}
                </AnimatePresence>
                {snap.order.length === 0 && (
                  <span className="font-body text-sm italic text-[color:var(--color-denison-stone)]">
                    (empty)
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex min-w-[220px] flex-col gap-3 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <div>
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">
                {frontierLabel} {mode === "BFS" ? "(FIFO)" : "(LIFO)"}
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                <AnimatePresence>
                  {snap.frontier.map((n, i) => (
                    <motion.span
                      key={`front-${mode}-${i}-${n}`}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md px-2 font-eyebrow text-xs"
                      style={{
                        backgroundColor: DENISON.gold,
                        color: DENISON.redDark,
                        border: `1px solid ${DENISON.goldDark}`,
                      }}
                    >
                      {n}
                    </motion.span>
                  ))}
                </AnimatePresence>
                {snap.frontier.length === 0 && (
                  <span className="font-body text-xs italic text-[color:var(--color-denison-stone)]">
                    (empty)
                  </span>
                )}
              </div>
            </div>
            <Stat label="visited" value={`${snap.order.length} / ${N}`} />
            <Stat label="frontier size" value={String(snap.frontier.length)} />
            <Stat label="step" value={`${stepIdx} / ${maxSteps}`} />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Step detail</span>
          <p className="font-body text-sm text-white">{snap.note}</p>
        </div>
      </div>
    </VizFrame>
  )
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">
        {label}
      </span>
      <span
        className={`font-display text-xl ${highlight ? "text-[color:var(--color-denison-red)]" : "text-[color:var(--color-denison-red-dark)]"}`}
      >
        {value}
      </span>
    </div>
  )
}
