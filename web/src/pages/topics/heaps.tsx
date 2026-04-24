import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

type Op = { kind: "insert"; value: number } | { kind: "extract-min" }

const SCRIPT: Op[] = [
  { kind: "insert", value: 7 },
  { kind: "insert", value: 3 },
  { kind: "insert", value: 9 },
  { kind: "insert", value: 1 },
  { kind: "insert", value: 4 },
  { kind: "extract-min" },
  { kind: "extract-min" },
  { kind: "insert", value: 2 },
  { kind: "extract-min" },
]

type Cell = { id: string; value: number }

type Phase =
  | { kind: "sift-up"; index: number }
  | { kind: "sift-down"; index: number }
  | null

type State = {
  heap: Cell[]
  idSeq: number
  scriptIndex: number
  phase: Phase
  highlight: [number, number] | null
  lastLabel: string
  lastOp: string
  swapsThisOp: number
  totalSwaps: number
}

const INITIAL: State = {
  heap: [],
  idSeq: 0,
  scriptIndex: 0,
  phase: null,
  highlight: null,
  lastLabel: "Press step to begin",
  lastOp: "—",
  swapsThisOp: 0,
  totalSwaps: 0,
}

export default function HeapsTopic() {
  const [state, setState] = React.useState<State>(INITIAL)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(750)

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.phase) {
        if (s.phase.kind === "sift-up") {
          const i = s.phase.index
          if (i === 0) {
            return { ...s, phase: null, highlight: null, lastLabel: "reached root — heap property restored" }
          }
          const parent = Math.floor((i - 1) / 2)
          if (s.heap[i].value < s.heap[parent].value) {
            const next = [...s.heap]
            ;[next[i], next[parent]] = [next[parent], next[i]]
            return {
              ...s,
              heap: next,
              phase: { kind: "sift-up", index: parent },
              highlight: [parent, i],
              lastLabel: `swap ${next[parent].value} ↑ with parent at index ${parent}`,
              swapsThisOp: s.swapsThisOp + 1,
              totalSwaps: s.totalSwaps + 1,
            }
          }
          return { ...s, phase: null, highlight: null, lastLabel: "parent ≤ child — heap property holds" }
        }
        const i = s.phase.index
        const left = 2 * i + 1
        const right = 2 * i + 2
        let smallest = i
        if (left < s.heap.length && s.heap[left].value < s.heap[smallest].value) smallest = left
        if (right < s.heap.length && s.heap[right].value < s.heap[smallest].value) smallest = right
        if (smallest !== i) {
          const next = [...s.heap]
          ;[next[i], next[smallest]] = [next[smallest], next[i]]
          return {
            ...s,
            heap: next,
            phase: { kind: "sift-down", index: smallest },
            highlight: [i, smallest],
            lastLabel: `swap ${next[i].value} ↓ with child at index ${smallest}`,
            swapsThisOp: s.swapsThisOp + 1,
            totalSwaps: s.totalSwaps + 1,
          }
        }
        return { ...s, phase: null, highlight: null, lastLabel: "children ≥ parent — heap property holds" }
      }

      if (s.scriptIndex >= SCRIPT.length) return s
      const op = SCRIPT[s.scriptIndex]
      if (op.kind === "insert") {
        const id = `c${s.idSeq}`
        const next = [...s.heap, { id, value: op.value }]
        return {
          ...s,
          heap: next,
          idSeq: s.idSeq + 1,
          scriptIndex: s.scriptIndex + 1,
          phase: { kind: "sift-up", index: next.length - 1 },
          highlight: [next.length - 1, next.length - 1],
          lastLabel: `insert ${op.value} at index ${next.length - 1}, begin siftUp`,
          lastOp: `insert ${op.value}`,
          swapsThisOp: 0,
        }
      }
      if (s.heap.length === 0) {
        return {
          ...s,
          scriptIndex: s.scriptIndex + 1,
          lastLabel: "extract-min on empty heap",
          lastOp: "extract-min (empty)",
          swapsThisOp: 0,
        }
      }
      if (s.heap.length === 1) {
        return {
          ...s,
          heap: [],
          scriptIndex: s.scriptIndex + 1,
          phase: null,
          highlight: null,
          lastLabel: `extracted ${s.heap[0].value} (heap now empty)`,
          lastOp: `extract-min ${s.heap[0].value}`,
          swapsThisOp: 0,
        }
      }
      const min = s.heap[0]
      const last = s.heap[s.heap.length - 1]
      const next = [last, ...s.heap.slice(1, -1)]
      return {
        ...s,
        heap: next,
        scriptIndex: s.scriptIndex + 1,
        phase: { kind: "sift-down", index: 0 },
        highlight: [0, 0],
        lastLabel: `extracted ${min.value}; move last (${last.value}) to root, begin siftDown`,
        lastOp: `extract-min ${min.value}`,
        swapsThisOp: 0,
      }
    })
  }, [])

  const canStep = state.scriptIndex < SCRIPT.length || state.phase !== null
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(INITIAL)
  }

  const treeLayout = React.useMemo(() => {
    const levels: number[][] = []
    state.heap.forEach((_, i) => {
      const lvl = Math.floor(Math.log2(i + 1))
      if (!levels[lvl]) levels[lvl] = []
      levels[lvl].push(i)
    })
    const pos: Record<number, { x: number; y: number }> = {}
    const width = 440
    levels.forEach((indices, lvl) => {
      const slots = Math.pow(2, lvl)
      const spacing = width / (slots + 1)
      indices.forEach((idx) => {
        const offsetInLevel = idx - (Math.pow(2, lvl) - 1)
        pos[idx] = { x: spacing * (offsetInLevel + 1), y: 50 + lvl * 75 }
      })
    })
    return pos
  }, [state.heap])

  const nextOp = SCRIPT[state.scriptIndex]
  const nextText = state.phase
    ? state.phase.kind === "sift-up"
      ? `Compare index ${state.phase.index} with parent.`
      : `Compare index ${state.phase.index} with children.`
    : nextOp
      ? nextOp.kind === "insert"
        ? `Insert ${nextOp.value} at next free slot, then siftUp.`
        : "Extract min from root, move last to root, then siftDown."
      : "Script complete. Reset to replay."

  return (
    <VizFrame
      topicNumber={15}
      category="Trees"
      title="Binary Heap / Priority Queue"
      summary="A heap is really just an array pretending to be a tree. Insert does siftUp from the last slot; extract-min does siftDown from the root. Both in O(log n)."
      complexity="insert/extract O(log n), build O(n)"
    >
      <div className="flex flex-col gap-5">
        <VizControls
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onStep={step}
          onReset={reset}
          speedMs={speedMs}
          onSpeedChange={setSpeedMs}
          canStep={canStep}
        />

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[300px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Tree view — parent ≤ children
            </span>
            <svg width="100%" viewBox="0 0 440 320">
              {state.heap.map((_, i) => {
                const parent = Math.floor((i - 1) / 2)
                if (i === 0) return null
                const p = treeLayout[parent]
                const c = treeLayout[i]
                if (!p || !c) return null
                return (
                  <line
                    key={`edge-${state.heap[i].id}`}
                    x1={p.x}
                    y1={p.y}
                    x2={c.x}
                    y2={c.y}
                    stroke={DENISON.stone}
                    strokeOpacity={0.4}
                    strokeWidth={2}
                  />
                )
              })}
              <AnimatePresence>
                {state.heap.map((cell, i) => {
                  const p = treeLayout[i]
                  if (!p) return null
                  const isHL = state.highlight && (state.highlight[0] === i || state.highlight[1] === i)
                  const fill = isHL ? DENISON.gold : DENISON.white
                  const stroke = isHL ? DENISON.goldDark : DENISON.redDark
                  return (
                    <motion.g
                      key={cell.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: isHL ? 1.1 : 1, x: p.x, y: p.y }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <circle cx={0} cy={0} r={22} fill={fill} stroke={stroke} strokeWidth={2} />
                      <text
                        x={0}
                        y={5}
                        textAnchor="middle"
                        fontSize={14}
                        fill={DENISON.redDark}
                        fontFamily="Lora, serif"
                        fontWeight={600}
                      >
                        {cell.value}
                      </text>
                    </motion.g>
                  )
                })}
              </AnimatePresence>
            </svg>
          </div>

          <div className="flex-1 min-w-[260px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">Array view</span>
            <svg width="100%" viewBox={`0 0 ${Math.max(state.heap.length, 4) * 56 + 20} 82`}>
              <AnimatePresence>
                {state.heap.map((cell, i) => {
                  const isHL = state.highlight && (state.highlight[0] === i || state.highlight[1] === i)
                  return (
                    <motion.g
                      key={cell.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0, x: 10 + i * 56 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <rect
                        x={0}
                        y={10}
                        width={50}
                        height={48}
                        rx={4}
                        fill={isHL ? DENISON.gold : DENISON.neutralGold}
                        stroke={isHL ? DENISON.goldDark : DENISON.redDark}
                        strokeWidth={isHL ? 2 : 1}
                        strokeOpacity={isHL ? 1 : 0.3}
                      />
                      <text
                        x={25}
                        y={40}
                        textAnchor="middle"
                        fontSize={18}
                        fill={DENISON.redDark}
                        fontFamily="Lora, serif"
                        fontWeight={600}
                      >
                        {cell.value}
                      </text>
                      <text
                        x={25}
                        y={74}
                        textAnchor="middle"
                        fontSize={10}
                        fill={DENISON.stone}
                        fontFamily="Oswald, sans-serif"
                        letterSpacing="0.1em"
                      >
                        {i}
                      </text>
                    </motion.g>
                  )
                })}
              </AnimatePresence>
            </svg>
            <p className="mt-3 font-body text-xs text-[color:var(--color-denison-red-dark)]">
              parent = ⌊(i-1)/2⌋, children = 2i+1, 2i+2
            </p>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="size" value={String(state.heap.length)} />
            <Stat label="last op" value={state.lastOp} />
            <Stat label="swaps this op" value={String(state.swapsThisOp)} highlight={state.swapsThisOp > 0} />
            <Stat label="total swaps" value={String(state.totalSwaps)} />
            <Stat label="min" value={state.heap.length > 0 ? String(state.heap[0].value) : "—"} />
          </div>
        </div>

        <div className="min-h-6 font-body text-sm text-[color:var(--color-denison-red-dark)]">
          {state.lastLabel}
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">{nextText}</p>
        </div>
      </div>
    </VizFrame>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">{label}</span>
      <span
        className={`font-display text-xl ${highlight ? "text-[color:var(--color-denison-red)]" : "text-[color:var(--color-denison-red-dark)]"}`}
      >
        {value}
      </span>
    </div>
  )
}
