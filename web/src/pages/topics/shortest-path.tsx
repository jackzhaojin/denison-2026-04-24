import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

const N = 6

const NODE_POS: { x: number; y: number }[] = [
  { x: 80, y: 180 },
  { x: 230, y: 80 },
  { x: 230, y: 280 },
  { x: 390, y: 80 },
  { x: 390, y: 280 },
  { x: 540, y: 180 },
]

type WEdge = { from: number; to: number; w: number }

const EDGES: readonly WEdge[] = [
  { from: 0, to: 1, w: 4 },
  { from: 0, to: 2, w: 2 },
  { from: 1, to: 2, w: 1 },
  { from: 1, to: 3, w: 5 },
  { from: 2, to: 3, w: 8 },
  { from: 2, to: 4, w: 10 },
  { from: 3, to: 4, w: 2 },
  { from: 3, to: 5, w: 6 },
  { from: 4, to: 5, w: 3 },
] as const

type Step =
  | { kind: "pop"; node: number; dist: number }
  | { kind: "relax"; from: number; to: number; w: number; improved: boolean; oldDist: number; newDist: number }
  | { kind: "done" }

type Frame = {
  step: number
  dist: number[]
  visited: boolean[]
  pq: { node: number; d: number }[]
  action: Step
  relaxedCount: number
  parent: (number | null)[]
  tookEdge: { from: number; to: number } | null
}

function buildFrames(): Frame[] {
  const dist = Array(N).fill(Infinity) as number[]
  const visited = Array(N).fill(false) as boolean[]
  const parent: (number | null)[] = Array(N).fill(null)
  dist[0] = 0
  let pq: { node: number; d: number }[] = [{ node: 0, d: 0 }]
  const frames: Frame[] = []
  let stepCount = 0
  let relaxedCount = 0

  const edgesFrom = (u: number) =>
    EDGES.filter((e) => e.from === u || e.to === u).map((e) =>
      e.from === u ? { to: e.to, w: e.w } : { to: e.from, w: e.w },
    )

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d)
    const top = pq.shift()!
    if (visited[top.node]) continue
    visited[top.node] = true
    frames.push({
      step: stepCount++,
      dist: [...dist],
      visited: [...visited],
      pq: pq.map((p) => ({ ...p })),
      action: { kind: "pop", node: top.node, dist: top.d },
      relaxedCount,
      parent: [...parent],
      tookEdge: null,
    })
    const outs = edgesFrom(top.node)
    for (const { to, w } of outs) {
      if (visited[to]) continue
      const oldDist = dist[to]
      const newDist = dist[top.node] + w
      const improved = newDist < oldDist
      if (improved) {
        dist[to] = newDist
        parent[to] = top.node
        pq.push({ node: to, d: newDist })
      }
      relaxedCount++
      frames.push({
        step: stepCount++,
        dist: [...dist],
        visited: [...visited],
        pq: pq.map((p) => ({ ...p })),
        action: { kind: "relax", from: top.node, to, w, improved, oldDist, newDist },
        relaxedCount,
        parent: [...parent],
        tookEdge: { from: top.node, to },
      })
    }
  }
  frames.push({
    step: stepCount++,
    dist: [...dist],
    visited: [...visited],
    pq: [],
    action: { kind: "done" },
    relaxedCount,
    parent: [...parent],
    tookEdge: null,
  })
  return frames
}

const NODE_R = 22
const W = 620
const H = 370

export default function ShortestPathTopic() {
  const [idx, setIdx] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(900)

  const frames = React.useMemo(() => buildFrames(), [])
  const maxIdx = frames.length - 1
  const frame = frames[Math.min(idx, maxIdx)]

  const advance = React.useCallback(() => {
    setIdx((s) => Math.min(s + 1, maxIdx))
  }, [maxIdx])

  const canStep = idx < maxIdx
  useStepRunner(advance, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setIdx(0)
  }

  const activeRelaxKey =
    frame.action.kind === "relax"
      ? edgeKey(frame.action.from, frame.action.to)
      : null

  const treeEdgeKeys = new Set<string>()
  for (let v = 0; v < N; v++) {
    const p = frame.parent[v]
    if (p !== null) treeEdgeKeys.add(edgeKey(p, v))
  }

  const visitedCount = frame.visited.filter(Boolean).length

  let narration = ""
  if (frame.action.kind === "pop") {
    narration = `Pop node ${frame.action.node} with tentative distance ${frame.action.dist}. Finalize it.`
  } else if (frame.action.kind === "relax") {
    narration = frame.action.improved
      ? `Relax edge ${frame.action.from}→${frame.action.to} (w=${frame.action.w}): ${frame.action.oldDist === Infinity ? "∞" : frame.action.oldDist} → ${frame.action.newDist}. Improved.`
      : `Relax edge ${frame.action.from}→${frame.action.to} (w=${frame.action.w}): no improvement.`
  } else {
    narration = `Done. All reachable nodes finalized; ${frame.relaxedCount} edges relaxed.`
  }

  return (
    <VizFrame
      topicNumber={19}
      category="Graphs"
      title="Dijkstra's Shortest Path"
      summary="Relax edges in order of tentative distance, and the shortest-path tree grows one finalized node at a time. Negative edges break this — here all weights are positive."
      complexity="Dijkstra O((V + E) log V)"
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
        />

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[420px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Weighted graph — source node 0
            </span>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
              {EDGES.map((e) => {
                const pu = NODE_POS[e.from]
                const pv = NODE_POS[e.to]
                const key = edgeKey(e.from, e.to)
                const isActive = activeRelaxKey === key
                const isTree = treeEdgeKeys.has(key)
                const stroke = isActive ? DENISON.gold : isTree ? DENISON.red : DENISON.redDark
                const opacity = isActive ? 1 : isTree ? 0.9 : 0.3
                const width = isActive ? 4 : isTree ? 3 : 1.5
                const mx = (pu.x + pv.x) / 2
                const my = (pu.y + pv.y) / 2
                return (
                  <g key={`edge-${key}`}>
                    <motion.line
                      x1={pu.x}
                      y1={pu.y}
                      x2={pv.x}
                      y2={pv.y}
                      stroke={stroke}
                      strokeOpacity={opacity}
                      strokeWidth={width}
                      initial={false}
                      animate={{ strokeWidth: width }}
                      transition={{ duration: 0.25 }}
                    />
                    <circle cx={mx} cy={my} r={11} fill={DENISON.cream} stroke={DENISON.redDark} strokeOpacity={0.4} />
                    <text
                      x={mx}
                      y={my + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fontFamily="Oswald, sans-serif"
                      fill={DENISON.redDark}
                    >
                      {e.w}
                    </text>
                  </g>
                )
              })}
              {NODE_POS.map((p, i) => {
                const isFinal = frame.visited[i]
                const isSource = i === 0
                const fill = isFinal ? DENISON.redDark : isSource ? DENISON.red : DENISON.white
                const stroke = isFinal ? DENISON.redDark : DENISON.redDark
                const textColor = isFinal || isSource ? DENISON.white : DENISON.redDark
                const distLabel = frame.dist[i] === Infinity ? "∞" : String(frame.dist[i])
                return (
                  <g key={`node-${i}`}>
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={NODE_R}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={2}
                      initial={false}
                      animate={{ scale: 1 }}
                    />
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
                    <rect
                      x={p.x - 18}
                      y={p.y - NODE_R - 22}
                      width={36}
                      height={18}
                      rx={3}
                      fill={DENISON.gold}
                      stroke={DENISON.goldDark}
                    />
                    <text
                      x={p.x}
                      y={p.y - NODE_R - 9}
                      textAnchor="middle"
                      fontSize={11}
                      fontFamily="Oswald, sans-serif"
                      fill={DENISON.redDark}
                    >
                      d={distLabel}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="flex min-w-[240px] flex-col gap-3 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <div>
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">
                Priority queue (min by d)
              </span>
              <div className="mt-1 flex flex-col gap-1">
                <AnimatePresence>
                  {[...frame.pq]
                    .sort((a, b) => a.d - b.d)
                    .map((p) => (
                      <motion.div
                        key={`pq-${p.node}-${p.d}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between gap-2 rounded-md px-2 py-1"
                        style={{
                          backgroundColor: DENISON.gold,
                          color: DENISON.redDark,
                          border: `1px solid ${DENISON.goldDark}`,
                        }}
                      >
                        <span className="font-eyebrow text-xs">node {p.node}</span>
                        <span className="font-display text-sm">d={p.d}</span>
                      </motion.div>
                    ))}
                </AnimatePresence>
                {frame.pq.length === 0 && (
                  <span className="font-body text-xs italic text-[color:var(--color-denison-stone)]">
                    (empty)
                  </span>
                )}
              </div>
            </div>
            <Stat label="visited" value={`${visitedCount} / ${N}`} />
            <Stat label="edges relaxed" value={String(frame.relaxedCount)} highlight />
            <Stat label="step" value={`${idx} / ${maxIdx}`} />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Step detail</span>
          <p className="font-body text-sm text-white">{narration}</p>
        </div>
      </div>
    </VizFrame>
  )
}

function edgeKey(a: number, b: number) {
  return a < b ? `${a}-${b}` : `${b}-${a}`
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
