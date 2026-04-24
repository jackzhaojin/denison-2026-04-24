import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

type Action = { kind: "push"; value: number } | { kind: "resize"; capacity: number }

const SCRIPT: Action[] = [
  { kind: "resize", capacity: 1 },
  { kind: "push", value: 3 },
  { kind: "resize", capacity: 2 },
  { kind: "push", value: 1 },
  { kind: "resize", capacity: 4 },
  { kind: "push", value: 4 },
  { kind: "push", value: 1 },
  { kind: "resize", capacity: 8 },
  { kind: "push", value: 5 },
  { kind: "push", value: 9 },
  { kind: "push", value: 2 },
  { kind: "push", value: 6 },
  { kind: "resize", capacity: 16 },
  { kind: "push", value: 5 },
  { kind: "push", value: 3 },
  { kind: "push", value: 5 },
]

type State = { capacity: number; items: { id: number; value: number }[]; step: number; cost: number; totalCost: number }
const INITIAL: State = { capacity: 0, items: [], step: 0, cost: 0, totalCost: 0 }

export default function ArraysTopic() {
  const [state, setState] = React.useState<State>(INITIAL)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(700)

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.step >= SCRIPT.length) return s
      const action = SCRIPT[s.step]
      if (action.kind === "resize") {
        const cost = action.capacity === 1 ? 1 : action.capacity / 2
        return { ...s, capacity: action.capacity, step: s.step + 1, cost, totalCost: s.totalCost + cost }
      }
      return {
        ...s,
        items: [...s.items, { id: s.step, value: action.value }],
        step: s.step + 1,
        cost: 1,
        totalCost: s.totalCost + 1,
      }
    })
  }, [])

  const canStep = state.step < SCRIPT.length
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(INITIAL)
  }

  const nextAction = SCRIPT[state.step]
  const amortized = state.items.length > 0 ? (state.totalCost / state.items.length).toFixed(2) : "—"
  const cellW = 48
  const cellH = 48

  return (
    <VizFrame
      topicNumber={3}
      category="Linear"
      title="Dynamic Arrays"
      summary="A dynamic array (ArrayList / vector) doubles its capacity when full. Individual appends are sometimes O(n), but the amortized cost per append stays O(1)."
      complexity="push amortized O(1), access O(1)"
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
          <div className="flex-1 min-w-[320px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Backing array — capacity {state.capacity}
            </span>
            <svg width="100%" height={cellH + 30} viewBox={`0 0 ${Math.max(state.capacity, 4) * cellW + 20} ${cellH + 30}`}>
              {Array.from({ length: state.capacity }).map((_, i) => (
                <g key={`slot-${i}`}>
                  <rect
                    x={10 + i * cellW}
                    y={10}
                    width={cellW - 4}
                    height={cellH}
                    rx={4}
                    fill={DENISON.neutralGold}
                    stroke={DENISON.redDark}
                    strokeOpacity={0.25}
                  />
                  <text
                    x={10 + i * cellW + (cellW - 4) / 2}
                    y={cellH + 25}
                    textAnchor="middle"
                    fontSize={10}
                    fill={DENISON.stone}
                    fontFamily="Oswald, sans-serif"
                    letterSpacing="0.1em"
                  >
                    {i}
                  </text>
                </g>
              ))}
              <AnimatePresence>
                {state.items.map((item, i) => (
                  <motion.g
                    key={item.id}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <rect
                      x={10 + i * cellW}
                      y={10}
                      width={cellW - 4}
                      height={cellH}
                      rx={4}
                      fill={DENISON.red}
                    />
                    <text
                      x={10 + i * cellW + (cellW - 4) / 2}
                      y={10 + cellH / 2 + 6}
                      textAnchor="middle"
                      fontSize={18}
                      fill={DENISON.white}
                      fontFamily="Lora, serif"
                      fontWeight={600}
                    >
                      {item.value}
                    </text>
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="size" value={String(state.items.length)} />
            <Stat label="capacity" value={String(state.capacity)} />
            <Stat label="last op cost" value={state.cost > 0 ? String(state.cost) : "—"} highlight={state.cost > 1} />
            <Stat label="total cost" value={String(state.totalCost)} />
            <Stat label="amortized / push" value={amortized} />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {nextAction
              ? nextAction.kind === "resize"
                ? `Resize to capacity ${nextAction.capacity} — copy ${state.items.length} elements.`
                : `Push ${nextAction.value} into slot ${state.items.length}.`
              : "Done. The amortized cost per push converges toward a small constant."}
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
