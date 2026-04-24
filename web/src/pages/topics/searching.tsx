import * as React from "react"
import { motion } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"
import { Button } from "@/components/ui/button"

const VALUES = [2, 5, 7, 11, 14, 18, 21, 26, 33, 38, 42, 47, 53, 60, 68, 75]
const CELLS = VALUES.map((value, i) => ({ id: `c-${i}`, value }))
const TARGETS = [14, 47, 2, 75, 30]

type State = {
  lo: number
  hi: number
  mid: number
  iterations: number
  found: boolean
  notFound: boolean
}

const initialState = (): State => ({
  lo: 0,
  hi: VALUES.length - 1,
  mid: Math.floor((VALUES.length - 1) / 2),
  iterations: 0,
  found: false,
  notFound: false,
})

export default function SearchingTopic() {
  const [targetIdx, setTargetIdx] = React.useState(0)
  const [state, setState] = React.useState<State>(initialState)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(700)

  const target = TARGETS[targetIdx]
  const canStep = !state.found && !state.notFound

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.found || s.notFound) return s
      if (s.lo > s.hi) {
        return { ...s, notFound: true }
      }
      const mid = Math.floor((s.lo + s.hi) / 2)
      const v = VALUES[mid]
      if (v === target) {
        return { ...s, mid, iterations: s.iterations + 1, found: true }
      }
      if (v < target) {
        const newLo = mid + 1
        if (newLo > s.hi) {
          return { ...s, mid, lo: newLo, iterations: s.iterations + 1, notFound: true }
        }
        return { ...s, mid, lo: newLo, iterations: s.iterations + 1 }
      }
      const newHi = mid - 1
      if (s.lo > newHi) {
        return { ...s, mid, hi: newHi, iterations: s.iterations + 1, notFound: true }
      }
      return { ...s, mid, hi: newHi, iterations: s.iterations + 1 }
    })
  }, [target])

  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(initialState())
  }

  const cycleTarget = () => {
    setPlaying(false)
    setTargetIdx((i) => (i + 1) % TARGETS.length)
    setState(initialState())
  }

  const cellW = 56
  const cellH = 56
  const markerH = 40
  const originX = 16
  const originY = markerH + 10
  const svgW = CELLS.length * cellW + 40
  const svgH = originY + cellH + 40

  return (
    <VizFrame
      topicNumber={9}
      category="Sort & Search"
      title="Binary Search"
      summary="Halving the search space on a sorted array. Low, high, and mid markers close in on the target; any wrong off-by-one skips or re-checks the answer."
      complexity="O(log n)"
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
            <Button
              size="sm"
              variant="outline"
              onClick={cycleTarget}
              className="border-[color:var(--color-denison-red)] text-[color:var(--color-denison-red-dark)]"
            >
              Target: {target}
            </Button>
          }
        />

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[480px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Sorted array · searching for {target}
            </span>
            <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
              {CELLS.map((cell, i) => {
                const x = originX + i * cellW
                const inRange = i >= state.lo && i <= state.hi
                const isMid = i === state.mid && !state.notFound && state.iterations > 0
                let fill = DENISON.neutralGold
                let stroke = DENISON.redDark
                let textColor = DENISON.redDark
                let opacity = 1
                if (!inRange && state.iterations > 0) {
                  opacity = 0.35
                }
                if (isMid) {
                  fill = state.found ? DENISON.goldDark : DENISON.gold
                  stroke = DENISON.redDark
                  textColor = DENISON.redDark
                }
                return (
                  <motion.g
                    key={cell.id}
                    initial={false}
                    animate={{ opacity }}
                    transition={{ duration: 0.3 }}
                  >
                    <rect
                      x={x}
                      y={originY}
                      width={cellW - 6}
                      height={cellH}
                      rx={4}
                      fill={fill}
                      stroke={stroke}
                      strokeOpacity={isMid ? 1 : 0.3}
                      strokeWidth={isMid ? 3 : 1}
                    />
                    <text
                      x={x + (cellW - 6) / 2}
                      y={originY + cellH / 2 + 6}
                      textAnchor="middle"
                      fontSize={18}
                      fill={textColor}
                      fontFamily="Lora, serif"
                      fontWeight={600}
                    >
                      {cell.value}
                    </text>
                    <text
                      x={x + (cellW - 6) / 2}
                      y={originY + cellH + 18}
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

              {!state.notFound && (
                <>
                  <Marker
                    label="lo"
                    index={state.lo}
                    color={DENISON.redDark}
                    originX={originX}
                    cellW={cellW}
                    y={markerH}
                  />
                  <Marker
                    label="hi"
                    index={state.hi}
                    color={DENISON.redDark}
                    originX={originX}
                    cellW={cellW}
                    y={markerH - 18}
                  />
                  {state.iterations > 0 && (
                    <Marker
                      label="mid"
                      index={state.mid}
                      color={DENISON.red}
                      originX={originX}
                      cellW={cellW}
                      y={markerH + 4}
                    />
                  )}
                </>
              )}
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="target" value={String(target)} />
            <Stat label="iterations" value={String(state.iterations)} />
            <Stat label="lo" value={String(state.lo)} />
            <Stat label="hi" value={String(state.hi)} />
            <Stat
              label="mid"
              value={state.iterations === 0 ? "—" : String(state.mid)}
              highlight={state.found}
            />
            <Stat
              label="status"
              value={state.found ? "found" : state.notFound ? "not found" : "searching"}
              highlight={state.found || state.notFound}
            />
          </div>
        </div>

        <div
          className={`rounded-md p-4 ${
            state.notFound
              ? "bg-[color:var(--color-denison-red)]"
              : "bg-[color:var(--color-denison-red-dark)]"
          }`}
        >
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {state.found
              ? `Found ${target} at index ${state.mid} in ${state.iterations} iteration(s).`
              : state.notFound
                ? `${target} is not in the array (lo > hi after ${state.iterations} iteration(s)).`
                : state.iterations === 0
                  ? `Compute mid = (${state.lo} + ${state.hi}) / 2 and compare with ${target}.`
                  : VALUES[state.mid] < target
                    ? `${VALUES[state.mid]} < ${target} — discard left half, set lo = ${state.mid + 1}.`
                    : VALUES[state.mid] > target
                      ? `${VALUES[state.mid]} > ${target} — discard right half, set hi = ${state.mid - 1}.`
                      : `${VALUES[state.mid]} = ${target}.`}
          </p>
        </div>
      </div>
    </VizFrame>
  )
}

function Marker({
  label,
  index,
  color,
  originX,
  cellW,
  y,
}: {
  label: string
  index: number
  color: string
  originX: number
  cellW: number
  y: number
}) {
  const x = originX + index * cellW + (cellW - 6) / 2
  return (
    <motion.g
      initial={false}
      animate={{ x }}
      transition={{ type: "spring", stiffness: 240, damping: 26 }}
    >
      <text
        x={0}
        y={y}
        textAnchor="middle"
        fontSize={10}
        fill={color}
        fontFamily="Oswald, sans-serif"
        letterSpacing="0.15em"
      >
        {label.toUpperCase()}
      </text>
      <polygon
        points={`${-5},${y + 4} ${5},${y + 4} ${0},${y + 12}`}
        fill={color}
      />
    </motion.g>
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
