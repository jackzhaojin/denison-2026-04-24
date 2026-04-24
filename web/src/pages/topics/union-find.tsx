import * as React from "react"
import { motion } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

const N = 10

type Op = { kind: "union"; a: number; b: number } | { kind: "find"; a: number }

const SCRIPT: Op[] = [
  { kind: "union", a: 0, b: 1 },
  { kind: "union", a: 2, b: 3 },
  { kind: "union", a: 4, b: 5 },
  { kind: "union", a: 6, b: 7 },
  { kind: "union", a: 1, b: 2 },
  { kind: "union", a: 5, b: 6 },
  { kind: "find", a: 0 },
  { kind: "union", a: 0, b: 4 },
  { kind: "find", a: 7 },
  { kind: "find", a: 3 },
]

const SET_HUES = [
  DENISON.red,
  DENISON.gold,
  DENISON.goldDark,
  DENISON.neutralGold,
  DENISON.cream,
] as const

const NODE_R = 20
const GRID_COLS = 5
const CELL_W = 110
const CELL_H = 110
const PAD_X = 40
const PAD_Y = 40
const W = PAD_X * 2 + GRID_COLS * CELL_W
const H = PAD_Y * 2 + 2 * CELL_H

function nodePos(i: number) {
  const col = i % GRID_COLS
  const row = Math.floor(i / GRID_COLS)
  return { x: PAD_X + col * CELL_W + CELL_W / 2, y: PAD_Y + row * CELL_H + CELL_H / 2 }
}

type State = {
  parent: number[]
  rank: number[]
  lastOp: string
  lastFindPath: number
}

function freshState(): State {
  return {
    parent: Array.from({ length: N }, (_, i) => i),
    rank: Array(N).fill(0),
    lastOp: "—",
    lastFindPath: 0,
  }
}

function findWithCompression(parent: number[], x: number): { root: number; pathLen: number } {
  const path: number[] = []
  let cur = x
  while (parent[cur] !== cur) {
    path.push(cur)
    cur = parent[cur]
  }
  const root = cur
  for (const p of path) parent[p] = root
  return { root, pathLen: path.length }
}

function applyOp(prev: State, op: Op): State {
  const parent = [...prev.parent]
  const rank = [...prev.rank]
  if (op.kind === "find") {
    const { root, pathLen } = findWithCompression(parent, op.a)
    return {
      parent,
      rank,
      lastOp: `Find(${op.a}) → ${root}`,
      lastFindPath: pathLen,
    }
  }
  const { root: ra } = findWithCompression(parent, op.a)
  const { root: rb } = findWithCompression(parent, op.b)
  if (ra === rb) {
    return {
      parent,
      rank,
      lastOp: `Union(${op.a}, ${op.b}) — already joined`,
      lastFindPath: 0,
    }
  }
  if (rank[ra] < rank[rb]) parent[ra] = rb
  else if (rank[ra] > rank[rb]) parent[rb] = ra
  else {
    parent[rb] = ra
    rank[ra] += 1
  }
  return {
    parent,
    rank,
    lastOp: `Union(${op.a}, ${op.b})`,
    lastFindPath: 0,
  }
}

function rootOf(parent: number[], x: number): number {
  let cur = x
  while (parent[cur] !== cur) cur = parent[cur]
  return cur
}

export default function UnionFindTopic() {
  const [state, setState] = React.useState<State>(() => freshState())
  const [stepIdx, setStepIdx] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(900)

  const maxSteps = SCRIPT.length

  const advance = React.useCallback(() => {
    setStepIdx((s) => {
      if (s >= maxSteps) return s
      const op = SCRIPT[s]
      setState((prev) => applyOp(prev, op))
      return s + 1
    })
  }, [maxSteps])

  const canStep = stepIdx < maxSteps
  useStepRunner(advance, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setStepIdx(0)
    setState(freshState())
  }

  const roots = React.useMemo(() => {
    const r: number[] = []
    for (let i = 0; i < N; i++) r.push(rootOf(state.parent, i))
    return r
  }, [state.parent])

  const uniqueRoots = Array.from(new Set(roots))
  const rootToHue = new Map<number, string>()
  uniqueRoots.sort((a, b) => a - b)
  uniqueRoots.forEach((r, i) => {
    rootToHue.set(r, SET_HUES[i % SET_HUES.length])
  })

  const components = uniqueRoots.length
  const nextOp = SCRIPT[stepIdx]

  return (
    <VizFrame
      topicNumber={20}
      category="Graphs"
      title="Union-Find / Disjoint Set Union"
      summary="Each node starts in its own set. Union merges two sets under one root. Find with path compression flattens the tree so later Finds are nearly O(1)."
      complexity="~O(α(n)) per op"
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
          <div className="flex-1 min-w-[540px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Forest view — arrows point to parent
            </span>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
              <defs>
                <marker
                  id="uf-arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={DENISON.redDark} />
                </marker>
              </defs>
              {Array.from({ length: N }).map((_, i) => {
                if (state.parent[i] === i) return null
                const from = nodePos(i)
                const to = nodePos(state.parent[i])
                const dx = to.x - from.x
                const dy = to.y - from.y
                const len = Math.sqrt(dx * dx + dy * dy) || 1
                const ux = dx / len
                const uy = dy / len
                const x1 = from.x + ux * NODE_R
                const y1 = from.y + uy * NODE_R
                const x2 = to.x - ux * NODE_R
                const y2 = to.y - uy * NODE_R
                return (
                  <motion.line
                    key={`arr-${i}`}
                    initial={false}
                    animate={{ x1, y1, x2, y2 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={DENISON.redDark}
                    strokeWidth={2}
                    strokeOpacity={0.75}
                    markerEnd="url(#uf-arrow)"
                  />
                )
              })}
              {Array.from({ length: N }).map((_, i) => {
                const p = nodePos(i)
                const root = roots[i]
                const hue = rootToHue.get(root) ?? DENISON.cream
                const isRoot = root === i
                return (
                  <g key={`n-${i}`}>
                    <motion.circle
                      cx={p.x}
                      cy={p.y}
                      r={NODE_R}
                      fill={hue}
                      stroke={isRoot ? DENISON.redDark : DENISON.stone}
                      strokeWidth={isRoot ? 3 : 1.5}
                      initial={false}
                      animate={{ fill: hue }}
                      transition={{ duration: 0.3 }}
                    />
                    <text
                      x={p.x}
                      y={p.y + 5}
                      textAnchor="middle"
                      fontSize={14}
                      fontFamily="Oswald, sans-serif"
                      fill={DENISON.redDark}
                    >
                      {i}
                    </text>
                    {isRoot && (
                      <text
                        x={p.x}
                        y={p.y + NODE_R + 14}
                        textAnchor="middle"
                        fontSize={10}
                        fontFamily="Oswald, sans-serif"
                        fill={DENISON.redDark}
                        letterSpacing="0.1em"
                      >
                        rank {state.rank[i]}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="flex min-w-[240px] flex-col gap-3 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="components" value={String(components)} highlight />
            <Stat label="last op" value={state.lastOp} />
            <Stat label="last find path" value={String(state.lastFindPath)} />
            <Stat label="step" value={`${stepIdx} / ${maxSteps}`} />
            <div className="mt-2">
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">
                parent[]
              </span>
              <div className="mt-1 grid grid-cols-5 gap-1">
                {state.parent.map((p, i) => (
                  <div
                    key={`par-${i}`}
                    className="flex h-8 flex-col items-center justify-center rounded-sm text-[10px]"
                    style={{
                      backgroundColor: DENISON.cream,
                      color: DENISON.redDark,
                      fontFamily: "Oswald, sans-serif",
                    }}
                  >
                    <span>{i}</span>
                    <span style={{ color: DENISON.red }}>→{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {nextOp
              ? nextOp.kind === "union"
                ? `Union(${nextOp.a}, ${nextOp.b}) — merge by rank.`
                : `Find(${nextOp.a}) — walk to root, then path-compress.`
              : `All ${SCRIPT.length} ops complete. ${components} component${components === 1 ? "" : "s"} remaining.`}
          </p>
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
