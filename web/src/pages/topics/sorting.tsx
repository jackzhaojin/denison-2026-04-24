import * as React from "react"
import { motion } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"
import { Button } from "@/components/ui/button"

type Mode = "insertion" | "bubble" | "merge" | "quick"

type TraceStep = {
  a?: number
  b?: number
  swap?: boolean
  sortedUpTo?: number
  range?: [number, number]
  pivot?: number
  order: string[]
  comparison: boolean
  swapped: boolean
  note: string
}

type Item = { id: string; value: number }

function mulberry32(seed: number) {
  let t = seed
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const N = 14
function seededValues(): Item[] {
  const rng = mulberry32(42)
  const out: Item[] = []
  for (let i = 0; i < N; i++) {
    out.push({ id: `v-${i}`, value: 1 + Math.floor(rng() * 20) })
  }
  return out
}

const INITIAL_ITEMS = seededValues()

function buildInsertionTrace(items: Item[]): TraceStep[] {
  const order = items.map((i) => i.id)
  const vals = items.map((i) => i.value)
  const steps: TraceStep[] = []
  for (let i = 1; i < vals.length; i++) {
    let j = i
    while (j > 0) {
      const comparison = true
      const willSwap = vals[j] < vals[j - 1]
      steps.push({
        a: j - 1,
        b: j,
        swap: willSwap,
        sortedUpTo: i,
        order: [...order],
        comparison,
        swapped: willSwap,
        note: willSwap
          ? `swap positions ${j - 1} and ${j}`
          : `${vals[j - 1]} ≤ ${vals[j]} — stop`,
      })
      if (!willSwap) break
      ;[vals[j - 1], vals[j]] = [vals[j], vals[j - 1]]
      ;[order[j - 1], order[j]] = [order[j], order[j - 1]]
      j--
    }
  }
  steps.push({
    order: [...order],
    comparison: false,
    swapped: false,
    sortedUpTo: vals.length,
    note: "sorted",
  })
  return steps
}

function buildBubbleTrace(items: Item[]): TraceStep[] {
  const order = items.map((i) => i.id)
  const vals = items.map((i) => i.value)
  const steps: TraceStep[] = []
  const n = vals.length
  for (let pass = 0; pass < n - 1; pass++) {
    for (let j = 0; j < n - 1 - pass; j++) {
      const willSwap = vals[j] > vals[j + 1]
      steps.push({
        a: j,
        b: j + 1,
        swap: willSwap,
        sortedUpTo: n - pass,
        order: [...order],
        comparison: true,
        swapped: willSwap,
        note: willSwap
          ? `swap ${vals[j]} and ${vals[j + 1]}`
          : `${vals[j]} ≤ ${vals[j + 1]} — keep`,
      })
      if (willSwap) {
        ;[vals[j], vals[j + 1]] = [vals[j + 1], vals[j]]
        ;[order[j], order[j + 1]] = [order[j + 1], order[j]]
      }
    }
  }
  steps.push({
    order: [...order],
    comparison: false,
    swapped: false,
    sortedUpTo: n,
    note: "sorted",
  })
  return steps
}

function buildMergeTrace(items: Item[]): TraceStep[] {
  const order = items.map((i) => i.id)
  const vals = items.map((i) => i.value)
  const steps: TraceStep[] = []

  function mergeSort(lo: number, hi: number) {
    if (hi - lo <= 1) return
    const mid = Math.floor((lo + hi) / 2)
    steps.push({
      range: [lo, hi - 1],
      order: [...order],
      comparison: false,
      swapped: false,
      note: `divide [${lo}..${hi - 1}]`,
    })
    mergeSort(lo, mid)
    mergeSort(mid, hi)

    const left = vals.slice(lo, mid)
    const leftOrder = order.slice(lo, mid)
    const right = vals.slice(mid, hi)
    const rightOrder = order.slice(mid, hi)
    let i = 0
    let j = 0
    let k = lo
    while (i < left.length && j < right.length) {
      const take = left[i] <= right[j]
      steps.push({
        a: lo + i,
        b: mid + j,
        range: [lo, hi - 1],
        order: [...order],
        comparison: true,
        swapped: !take,
        note: take ? `place ${left[i]}` : `place ${right[j]}`,
      })
      if (take) {
        vals[k] = left[i]
        order[k] = leftOrder[i]
        i++
      } else {
        vals[k] = right[j]
        order[k] = rightOrder[j]
        j++
      }
      k++
    }
    while (i < left.length) {
      vals[k] = left[i]
      order[k] = leftOrder[i]
      i++
      k++
    }
    while (j < right.length) {
      vals[k] = right[j]
      order[k] = rightOrder[j]
      j++
      k++
    }
    steps.push({
      range: [lo, hi - 1],
      order: [...order],
      comparison: false,
      swapped: false,
      note: `merged [${lo}..${hi - 1}]`,
    })
  }

  mergeSort(0, vals.length)
  steps.push({
    order: [...order],
    comparison: false,
    swapped: false,
    sortedUpTo: vals.length,
    note: "sorted",
  })
  return steps
}

function buildQuickTrace(items: Item[]): TraceStep[] {
  const order = items.map((i) => i.id)
  const vals = items.map((i) => i.value)
  const steps: TraceStep[] = []

  function quicksort(lo: number, hi: number) {
    if (lo >= hi) return
    const pivotIdx = hi
    const pivotVal = vals[pivotIdx]
    let i = lo
    steps.push({
      range: [lo, hi],
      pivot: pivotIdx,
      order: [...order],
      comparison: false,
      swapped: false,
      note: `pivot = ${pivotVal} at ${pivotIdx}`,
    })
    for (let j = lo; j < hi; j++) {
      const willSwap = vals[j] < pivotVal
      steps.push({
        a: j,
        b: pivotIdx,
        range: [lo, hi],
        pivot: pivotIdx,
        order: [...order],
        comparison: true,
        swapped: willSwap,
        note: willSwap
          ? `${vals[j]} < ${pivotVal} — advance partition`
          : `${vals[j]} ≥ ${pivotVal} — skip`,
      })
      if (willSwap) {
        if (i !== j) {
          ;[vals[i], vals[j]] = [vals[j], vals[i]]
          ;[order[i], order[j]] = [order[j], order[i]]
        }
        i++
      }
    }
    ;[vals[i], vals[pivotIdx]] = [vals[pivotIdx], vals[i]]
    ;[order[i], order[pivotIdx]] = [order[pivotIdx], order[i]]
    steps.push({
      range: [lo, hi],
      pivot: i,
      order: [...order],
      comparison: false,
      swapped: true,
      note: `place pivot at ${i}`,
    })
    quicksort(lo, i - 1)
    quicksort(i + 1, hi)
  }

  quicksort(0, vals.length - 1)
  steps.push({
    order: [...order],
    comparison: false,
    swapped: false,
    sortedUpTo: vals.length,
    note: "sorted",
  })
  return steps
}

function buildTrace(mode: Mode, items: Item[]): TraceStep[] {
  switch (mode) {
    case "insertion":
      return buildInsertionTrace(items)
    case "bubble":
      return buildBubbleTrace(items)
    case "merge":
      return buildMergeTrace(items)
    case "quick":
      return buildQuickTrace(items)
  }
}

export default function SortingTopic() {
  const [mode, setMode] = React.useState<Mode>("insertion")
  const trace = React.useMemo(() => buildTrace(mode, INITIAL_ITEMS), [mode])
  const [stepIdx, setStepIdx] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(500)

  const current: TraceStep = React.useMemo(() => {
    if (stepIdx === 0) {
      return {
        order: INITIAL_ITEMS.map((i) => i.id),
        comparison: false,
        swapped: false,
        note: `${mode} — press Step`,
      }
    }
    return trace[stepIdx - 1]
  }, [stepIdx, trace, mode])

  const comparisons = React.useMemo(() => {
    let c = 0
    for (let i = 0; i < stepIdx; i++) if (trace[i]?.comparison) c++
    return c
  }, [stepIdx, trace])
  const swaps = React.useMemo(() => {
    let s = 0
    for (let i = 0; i < stepIdx; i++) if (trace[i]?.swapped) s++
    return s
  }, [stepIdx, trace])

  const canStep = stepIdx < trace.length
  const step = React.useCallback(() => {
    setStepIdx((s) => (s < trace.length ? s + 1 : s))
  }, [trace.length])

  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setStepIdx(0)
  }

  const changeMode = (m: Mode) => {
    setPlaying(false)
    setMode(m)
    setStepIdx(0)
  }

  const barW = 36
  const gap = 8
  const maxVal = 20
  const chartW = INITIAL_ITEMS.length * (barW + gap) + 20
  const chartH = 220
  const baseline = chartH - 20

  const idToValue = React.useMemo(() => {
    const m = new Map<string, number>()
    INITIAL_ITEMS.forEach((it) => m.set(it.id, it.value))
    return m
  }, [])

  const positions = React.useMemo(() => {
    const map = new Map<string, number>()
    current.order.forEach((id, i) => map.set(id, i))
    return map
  }, [current.order])

  const compareA = current.a
  const compareB = current.b
  const range = current.range
  const pivot = current.pivot
  const sortedUpTo = current.sortedUpTo ?? 0

  const modes: { key: Mode; label: string }[] = [
    { key: "insertion", label: "Insertion" },
    { key: "bubble", label: "Bubble" },
    { key: "merge", label: "Merge" },
    { key: "quick", label: "Quick" },
  ]

  return (
    <VizFrame
      topicNumber={8}
      category="Sort & Search"
      title="Sorting Algorithms — Live"
      summary="Four comparison sorts running on the same input. Watch insertion crawl, merge divide-and-conquer its way through, and quicksort gamble on pivots."
      complexity="best O(n log n) for comparison sorts"
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
          extra={
            <div className="flex flex-wrap gap-1">
              {modes.map((m) => (
                <Button
                  key={m.key}
                  size="sm"
                  variant={mode === m.key ? "default" : "outline"}
                  onClick={() => changeMode(m.key)}
                  className={
                    mode === m.key
                      ? "bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red-dark)]"
                      : "border-[color:var(--color-denison-red)] text-[color:var(--color-denison-red-dark)]"
                  }
                >
                  {m.label}
                </Button>
              ))}
            </div>
          }
        />

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[480px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              {mode} sort · step {stepIdx}/{trace.length}
            </span>
            <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`}>
              {range && (
                <rect
                  x={10 + range[0] * (barW + gap) - gap / 2}
                  y={4}
                  width={(range[1] - range[0] + 1) * (barW + gap)}
                  height={chartH - 8}
                  fill={DENISON.gold}
                  opacity={0.18}
                  rx={4}
                />
              )}
              <line
                x1={0}
                y1={baseline}
                x2={chartW}
                y2={baseline}
                stroke={DENISON.stone}
                strokeOpacity={0.3}
              />
              {INITIAL_ITEMS.map((item) => {
                const pos = positions.get(item.id) ?? 0
                const value = idToValue.get(item.id) ?? 0
                const h = (value / maxVal) * (baseline - 10)
                const isA = pos === compareA
                const isB = pos === compareB
                const isPivot = pos === pivot
                const isSorted = pos < sortedUpTo
                let fill = DENISON.red
                if (isSorted) fill = DENISON.cream
                if (isA || isB) fill = DENISON.gold
                if (isPivot) fill = DENISON.redDark
                const textColor =
                  isSorted || isA || isB ? DENISON.redDark : DENISON.white
                return (
                  <motion.g
                    key={item.id}
                    initial={false}
                    animate={{ x: 10 + pos * (barW + gap) }}
                    transition={{ type: "spring", stiffness: 220, damping: 24 }}
                  >
                    <rect
                      x={0}
                      y={baseline - h}
                      width={barW}
                      height={h}
                      fill={fill}
                      stroke={DENISON.redDark}
                      strokeOpacity={0.2}
                      rx={3}
                    />
                    <text
                      x={barW / 2}
                      y={baseline - h - 6}
                      textAnchor="middle"
                      fontSize={11}
                      fill={DENISON.redDark}
                      fontFamily="Oswald, sans-serif"
                    >
                      {value}
                    </text>
                    <text
                      x={barW / 2}
                      y={baseline + 14}
                      textAnchor="middle"
                      fontSize={9}
                      fill={textColor === DENISON.white ? DENISON.stone : textColor}
                      fontFamily="Oswald, sans-serif"
                      letterSpacing="0.1em"
                    >
                      {pos}
                    </text>
                  </motion.g>
                )
              })}
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="mode" value={mode} />
            <Stat label="step" value={`${stepIdx}/${trace.length}`} />
            <Stat label="comparisons" value={String(comparisons)} />
            <Stat label="swaps" value={String(swaps)} highlight={current.swapped} />
            {pivot !== undefined && (
              <Stat label="pivot idx" value={String(pivot)} />
            )}
            {range && (
              <Stat label="range" value={`[${range[0]}..${range[1]}]`} />
            )}
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {canStep
              ? trace[stepIdx]?.note ?? "—"
              : `${mode} complete in ${trace.length} atomic steps, ${comparisons} comparisons.`}
          </p>
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
