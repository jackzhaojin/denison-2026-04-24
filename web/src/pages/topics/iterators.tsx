import * as React from "react"
import { motion } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

type Node = { id: string; value: number }

const NODES: Node[] = [3, 8, 1, 4, 7, 2, 9, 5].map((value, i) => ({
  id: `n-${i}`,
  value,
}))

type State = {
  forwardIdx: number
  evenIdx: number
  forwardEmitted: { id: string; value: number }[]
  evenEmitted: { id: string; value: number }[]
  step: number
}

const INITIAL: State = {
  forwardIdx: 0,
  evenIdx: 0,
  forwardEmitted: [],
  evenEmitted: [],
  step: 0,
}

function nextEvenIndex(from: number): number {
  for (let i = from; i < NODES.length; i++) {
    if (NODES[i].value % 2 === 0) return i
  }
  return NODES.length
}

export default function IteratorsTopic() {
  const [state, setState] = React.useState<State>(INITIAL)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(700)

  const forwardDone = state.forwardIdx >= NODES.length
  const evenStart = nextEvenIndex(state.evenIdx)
  const evenDone = evenStart >= NODES.length
  const canStep = !forwardDone || !evenDone

  const step = React.useCallback(() => {
    setState((s) => {
      const fDone = s.forwardIdx >= NODES.length
      const eStart = nextEvenIndex(s.evenIdx)
      const eDone = eStart >= NODES.length
      if (fDone && eDone) return s

      const nextForwardEmitted = fDone
        ? s.forwardEmitted
        : [...s.forwardEmitted, { id: NODES[s.forwardIdx].id, value: NODES[s.forwardIdx].value }]
      const nextForwardIdx = fDone ? s.forwardIdx : s.forwardIdx + 1

      const nextEvenEmitted = eDone
        ? s.evenEmitted
        : [...s.evenEmitted, { id: NODES[eStart].id, value: NODES[eStart].value }]
      const nextEvenIdx = eDone ? s.evenIdx : eStart + 1

      return {
        forwardIdx: nextForwardIdx,
        evenIdx: nextEvenIdx,
        forwardEmitted: nextForwardEmitted,
        evenEmitted: nextEvenEmitted,
        step: s.step + 1,
      }
    })
  }, [])

  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(INITIAL)
  }

  const cellW = 72
  const cellH = 56
  const originX = 20
  const originY = 24
  const svgWidth = NODES.length * cellW + 40
  const svgHeight = cellH + 140

  const forwardCursorIdx = state.forwardIdx < NODES.length ? state.forwardIdx : -1
  const evenCursorIdx = evenStart < NODES.length ? evenStart : -1

  const forwardDesc = forwardDone
    ? "forward iterator: done"
    : `forward.next() → ${NODES[state.forwardIdx].value}`
  const evenDesc = evenDone
    ? "even iterator: done"
    : `even.next() → ${NODES[evenStart].value}`

  return (
    <VizFrame
      topicNumber={7}
      category="Linear"
      title="Iterators & ADTs"
      summary="An iterator is a traversal cursor — a contract separate from the data structure. Here one linked list exposes two different iterators (forward and filtering) and both advance independently."
      complexity="next() O(1), full pass O(n)"
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
          <div className="flex-1 min-w-[360px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Linked list — two independent cursors
            </span>
            <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {NODES.map((node, i) => {
                const cx = originX + i * cellW + cellH / 2
                const cy = originY + cellH / 2
                const isForward = i === forwardCursorIdx
                const isEven = i === evenCursorIdx
                const highlighted = isForward || isEven
                return (
                  <g key={node.id}>
                    {i < NODES.length - 1 && (
                      <line
                        x1={cx + cellH / 2}
                        y1={cy}
                        x2={originX + (i + 1) * cellW + cellH / 2 - cellH / 2}
                        y2={cy}
                        stroke={DENISON.redDark}
                        strokeOpacity={0.4}
                        strokeWidth={2}
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={cellH / 2}
                      fill={highlighted ? DENISON.gold : DENISON.red}
                      stroke={DENISON.redDark}
                      strokeWidth={highlighted ? 3 : 1}
                    />
                    <text
                      x={cx}
                      y={cy + 6}
                      textAnchor="middle"
                      fontSize={18}
                      fill={highlighted ? DENISON.redDark : DENISON.white}
                      fontFamily="Lora, serif"
                      fontWeight={600}
                    >
                      {node.value}
                    </text>
                  </g>
                )
              })}

              {forwardCursorIdx >= 0 && (
                <motion.g
                  key={`fwd-${forwardCursorIdx}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <polygon
                    points={`${originX + forwardCursorIdx * cellW + cellH / 2 - 6},${originY + cellH + 10} ${originX + forwardCursorIdx * cellW + cellH / 2 + 6},${originY + cellH + 10} ${originX + forwardCursorIdx * cellW + cellH / 2},${originY + cellH + 2}`}
                    fill={DENISON.redDark}
                  />
                  <text
                    x={originX + forwardCursorIdx * cellW + cellH / 2}
                    y={originY + cellH + 26}
                    textAnchor="middle"
                    fontSize={10}
                    fill={DENISON.redDark}
                    fontFamily="Oswald, sans-serif"
                    letterSpacing="0.1em"
                  >
                    FORWARD
                  </text>
                </motion.g>
              )}

              {evenCursorIdx >= 0 && (
                <motion.g
                  key={`evn-${evenCursorIdx}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <polygon
                    points={`${originX + evenCursorIdx * cellW + cellH / 2 - 6},${originY + cellH + 44} ${originX + evenCursorIdx * cellW + cellH / 2 + 6},${originY + cellH + 44} ${originX + evenCursorIdx * cellW + cellH / 2},${originY + cellH + 52}`}
                    fill={DENISON.goldDark}
                  />
                  <text
                    x={originX + evenCursorIdx * cellW + cellH / 2}
                    y={originY + cellH + 68}
                    textAnchor="middle"
                    fontSize={10}
                    fill={DENISON.goldDark}
                    fontFamily="Oswald, sans-serif"
                    letterSpacing="0.1em"
                  >
                    EVEN ONLY
                  </text>
                </motion.g>
              )}
            </svg>

            <div className="mt-4 flex flex-col gap-3">
              <EmittedRow label="forward emitted" items={state.forwardEmitted} done={forwardDone} />
              <EmittedRow label="even emitted" items={state.evenEmitted} done={evenDone} />
            </div>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="steps" value={String(state.step)} />
            <Stat label="forward pos" value={forwardDone ? "done" : String(state.forwardIdx)} />
            <Stat label="even pos" value={evenDone ? "done" : String(evenStart)} />
            <Stat label="forward count" value={String(state.forwardEmitted.length)} />
            <Stat label="even count" value={String(state.evenEmitted.length)} />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {canStep
              ? `Advance both cursors — ${forwardDesc}; ${evenDesc}.`
              : "Both iterators exhausted. Each is a separate cursor over the same list."}
          </p>
        </div>
      </div>
    </VizFrame>
  )
}

function EmittedRow({
  label,
  items,
  done,
}: {
  label: string
  items: { id: string; value: number }[]
  done: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">
        {label} {done && items.length > 0 ? "· done" : ""}
      </span>
      <div className="flex flex-wrap gap-1">
        {items.length === 0 ? (
          <span className="font-body text-xs text-[color:var(--color-denison-stone)]">—</span>
        ) : (
          items.map((it) => (
            <span
              key={it.id}
              className="rounded bg-[color:var(--color-denison-red)] px-2 py-0.5 font-display text-sm text-white"
            >
              {it.value}
            </span>
          ))
        )}
      </div>
    </div>
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
