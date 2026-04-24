import * as React from "react"
import { motion } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

type Edge = readonly [number, number]

const EDGES: readonly Edge[] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
] as const

const N = 6

const NODE_POS: { x: number; y: number }[] = [
  { x: 170, y: 50 },
  { x: 70, y: 130 },
  { x: 270, y: 130 },
  { x: 170, y: 210 },
  { x: 300, y: 290 },
  { x: 80, y: 290 },
]

const NODE_R = 22
const GRAPH_W = 360
const GRAPH_H = 360

export default function GraphsTopic() {
  const [step, setStep] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(850)

  const maxSteps = EDGES.length
  const activeEdgeIdx = step > 0 ? step - 1 : -1
  const activeEdge = activeEdgeIdx >= 0 ? EDGES[activeEdgeIdx] : null

  const adjacency: number[][] = React.useMemo(() => {
    const m: number[][] = Array.from({ length: N }, () => Array(N).fill(0))
    for (const [a, b] of EDGES) {
      m[a][b] = 1
      m[b][a] = 1
    }
    return m
  }, [])

  const neighbors: number[][] = React.useMemo(() => {
    const list: number[][] = Array.from({ length: N }, () => [])
    for (const [a, b] of EDGES) {
      list[a].push(b)
      list[b].push(a)
    }
    for (const arr of list) arr.sort((x, y) => x - y)
    return list
  }, [])

  const advance = React.useCallback(() => {
    setStep((s) => Math.min(s + 1, maxSteps))
  }, [maxSteps])

  const canStep = step < maxSteps
  useStepRunner(advance, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setStep(0)
  }

  const matrixCells = N * N
  const listEntries = EDGES.length * 2

  return (
    <VizFrame
      topicNumber={17}
      category="Graphs"
      title="Graph Representations"
      summary="Matrix and list are two windows onto the same graph. Hover any edge and watch both representations light up simultaneously — see why sparse graphs favor lists and dense graphs favor matrices."
      complexity="matrix O(V²), list O(V+E)"
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div>
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Graph — 6 nodes, {EDGES.length} edges
            </span>
            <svg width="100%" viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}>
              {EDGES.map(([a, b], idx) => {
                const isActive = idx === activeEdgeIdx
                const pa = NODE_POS[a]
                const pb = NODE_POS[b]
                return (
                  <motion.line
                    key={`edge-${a}-${b}`}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    stroke={isActive ? DENISON.gold : DENISON.redDark}
                    strokeOpacity={isActive ? 1 : 0.35}
                    strokeWidth={isActive ? 4 : 2}
                    initial={false}
                    animate={{ strokeWidth: isActive ? 4 : 2 }}
                    transition={{ duration: 0.25 }}
                  />
                )
              })}
              {NODE_POS.map((p, i) => {
                const touched =
                  activeEdge !== null && (activeEdge[0] === i || activeEdge[1] === i)
                return (
                  <motion.g
                    key={`node-${i}`}
                    initial={false}
                    animate={{ scale: touched ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  >
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={NODE_R}
                      fill={touched ? DENISON.red : DENISON.white}
                      stroke={touched ? DENISON.goldDark : DENISON.redDark}
                      strokeWidth={2}
                    />
                    <text
                      x={p.x}
                      y={p.y + 5}
                      textAnchor="middle"
                      fontSize={14}
                      fontFamily="Oswald, sans-serif"
                      fill={touched ? DENISON.white : DENISON.redDark}
                    >
                      {i}
                    </text>
                  </motion.g>
                )
              })}
            </svg>
          </div>

          <div>
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Adjacency matrix — {matrixCells} cells
            </span>
            <MatrixView adjacency={adjacency} activeEdge={activeEdge} />
          </div>

          <div>
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Adjacency list — {listEntries} entries
            </span>
            <div className="mt-2 flex flex-col gap-1.5">
              {neighbors.map((nbrs, i) => {
                const iActive =
                  activeEdge !== null && (activeEdge[0] === i || activeEdge[1] === i)
                return (
                  <div
                    key={`row-${i}`}
                    className="flex items-center gap-2 rounded-md bg-[color:var(--color-denison-red)]/5 px-2 py-1"
                  >
                    <span
                      className="font-eyebrow text-xs"
                      style={{ color: iActive ? DENISON.red : DENISON.redDark }}
                    >
                      {i}:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {nbrs.map((n) => {
                        const chipActive =
                          activeEdge !== null &&
                          ((activeEdge[0] === i && activeEdge[1] === n) ||
                            (activeEdge[1] === i && activeEdge[0] === n))
                        return (
                          <motion.span
                            key={`chip-${i}-${n}`}
                            initial={false}
                            animate={{ scale: chipActive ? 1.15 : 1 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full px-2 font-eyebrow text-[11px]"
                            style={{
                              backgroundColor: chipActive ? DENISON.gold : DENISON.cream,
                              color: DENISON.redDark,
                              border: `1px solid ${chipActive ? DENISON.goldDark : DENISON.redDark}`,
                            }}
                          >
                            {n}
                          </motion.span>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="vertices" value={String(N)} />
            <Stat label="edges" value={String(EDGES.length)} />
            <Stat label="matrix cells" value={String(matrixCells)} />
            <Stat label="list entries" value={String(listEntries)} highlight />
            <Stat label="step" value={`${step} / ${maxSteps}`} />
          </div>
          <div className="flex-1 min-w-[280px] rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
            <span className="font-eyebrow text-[10px] text-gold">Next step</span>
            <p className="font-body text-sm text-white">
              {step < maxSteps
                ? `Highlight edge (${EDGES[step][0]}, ${EDGES[step][1]}) — matrix cells (${EDGES[step][0]},${EDGES[step][1]}) and (${EDGES[step][1]},${EDGES[step][0]}) both flip to 1.`
                : `All ${EDGES.length} edges traced. matrix: ${matrixCells} cells · list: ${listEntries} entries — sparse graphs favor lists.`}
            </p>
          </div>
        </div>
      </div>
    </VizFrame>
  )
}

function MatrixView({
  adjacency,
  activeEdge,
}: {
  adjacency: number[][]
  activeEdge: Edge | null
}) {
  const cellSize = 36
  const pad = 26
  const totalW = pad + cellSize * N + 10
  const totalH = pad + cellSize * N + 10

  return (
    <svg width="100%" viewBox={`0 0 ${totalW} ${totalH}`}>
      {Array.from({ length: N }).map((_, i) => (
        <text
          key={`col-${i}`}
          x={pad + i * cellSize + cellSize / 2}
          y={pad - 8}
          textAnchor="middle"
          fontSize={11}
          fontFamily="Oswald, sans-serif"
          fill={DENISON.stone}
          letterSpacing="0.1em"
        >
          {i}
        </text>
      ))}
      {Array.from({ length: N }).map((_, i) => (
        <text
          key={`row-${i}`}
          x={pad - 8}
          y={pad + i * cellSize + cellSize / 2 + 4}
          textAnchor="end"
          fontSize={11}
          fontFamily="Oswald, sans-serif"
          fill={DENISON.stone}
          letterSpacing="0.1em"
        >
          {i}
        </text>
      ))}
      {adjacency.map((row, i) =>
        row.map((v, j) => {
          const isActive =
            activeEdge !== null &&
            ((activeEdge[0] === i && activeEdge[1] === j) ||
              (activeEdge[1] === i && activeEdge[0] === j))
          const fill = isActive
            ? DENISON.gold
            : v === 1
              ? DENISON.red
              : DENISON.neutralGold
          const textColor = isActive
            ? DENISON.redDark
            : v === 1
              ? DENISON.white
              : DENISON.stone
          return (
            <motion.g key={`cell-${i}-${j}`} initial={false} animate={{ opacity: 1 }}>
              <motion.rect
                x={pad + j * cellSize + 1}
                y={pad + i * cellSize + 1}
                width={cellSize - 2}
                height={cellSize - 2}
                rx={3}
                fill={fill}
                stroke={DENISON.redDark}
                strokeOpacity={0.2}
                animate={{ scale: isActive ? 1.08 : 1 }}
                style={{ transformOrigin: `${pad + j * cellSize + cellSize / 2}px ${pad + i * cellSize + cellSize / 2}px` }}
                transition={{ duration: 0.2 }}
              />
              <text
                x={pad + j * cellSize + cellSize / 2}
                y={pad + i * cellSize + cellSize / 2 + 4}
                textAnchor="middle"
                fontSize={12}
                fontFamily="Oswald, sans-serif"
                fill={textColor}
              >
                {v}
              </text>
            </motion.g>
          )
        }),
      )}
    </svg>
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
