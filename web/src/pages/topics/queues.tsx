import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

const CAPACITY = 8

type Action = { kind: "enqueue"; value: number } | { kind: "dequeue" }

const SCRIPT: Action[] = [
  { kind: "enqueue", value: 7 },
  { kind: "enqueue", value: 3 },
  { kind: "enqueue", value: 9 },
  { kind: "dequeue" },
  { kind: "enqueue", value: 2 },
  { kind: "dequeue" },
  { kind: "dequeue" },
  { kind: "enqueue", value: 5 },
  { kind: "enqueue", value: 1 },
  { kind: "enqueue", value: 4 },
  { kind: "dequeue" },
]

type Slot = { id: string; value: number } | null

type State = {
  slots: Slot[]
  head: number
  tail: number
  size: number
  step: number
  idCounter: number
  lastOp: string
}

const initial = (): State => ({
  slots: Array.from({ length: CAPACITY }, () => null),
  head: 0,
  tail: 0,
  size: 0,
  step: 0,
  idCounter: 0,
  lastOp: "—",
})

const SLOT_W = 64
const SLOT_H = 52
const OFFSET_X = 30
const OFFSET_Y = 80

export default function QueuesTopic() {
  const [state, setState] = React.useState<State>(initial)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(700)

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.step >= SCRIPT.length) return s
      const action = SCRIPT[s.step]
      const nextStep = s.step + 1
      if (action.kind === "enqueue") {
        if (s.size >= CAPACITY) {
          return { ...s, step: nextStep, lastOp: "enqueue: FULL" }
        }
        const slots = s.slots.slice()
        slots[s.tail] = { id: `q${s.idCounter}`, value: action.value }
        const newTail = (s.tail + 1) % CAPACITY
        return {
          ...s,
          slots,
          tail: newTail,
          size: s.size + 1,
          step: nextStep,
          idCounter: s.idCounter + 1,
          lastOp: `enqueue(${action.value}) → slot ${s.tail}`,
        }
      }
      if (s.size === 0) {
        return { ...s, step: nextStep, lastOp: "dequeue: EMPTY" }
      }
      const slots = s.slots.slice()
      const removed = slots[s.head]
      slots[s.head] = null
      const newHead = (s.head + 1) % CAPACITY
      return {
        ...s,
        slots,
        head: newHead,
        size: s.size - 1,
        step: nextStep,
        lastOp: `dequeue ${removed?.value ?? "?"} ← slot ${s.head}`,
      }
    })
  }, [])

  const canStep = state.step < SCRIPT.length
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(initial())
  }

  const svgWidth = OFFSET_X * 2 + CAPACITY * SLOT_W
  const svgHeight = 200

  const nextAction = SCRIPT[state.step]
  const describeNext = (a: Action | undefined) => {
    if (!a) return "Done. Tail wrapped around the buffer — head and tail can pass the physical ends freely."
    if (a.kind === "enqueue")
      return `enqueue(${a.value}) — slots[${state.tail}] = ${a.value}; tail = (${state.tail} + 1) mod ${CAPACITY} = ${(state.tail + 1) % CAPACITY}.`
    return `dequeue — read slots[${state.head}]; head = (${state.head} + 1) mod ${CAPACITY} = ${(state.head + 1) % CAPACITY}.`
  }

  return (
    <VizFrame
      topicNumber={6}
      category="Linear"
      title="Queues & Deques (Ring Buffer)"
      summary="A ring buffer queue with head and tail pointers that wrap around. Enqueue advances tail; dequeue advances head; both run in O(1)."
      complexity="enqueue/dequeue O(1)"
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
          <div className="flex-1 min-w-[360px] overflow-x-auto">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              ring buffer (capacity {CAPACITY}) — {state.lastOp}
            </span>
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {Array.from({ length: CAPACITY }).map((_, i) => {
                const x = OFFSET_X + i * SLOT_W
                const slot = state.slots[i]
                const filled = slot !== null
                return (
                  <g key={`slot-${i}`}>
                    <rect
                      x={x + 4}
                      y={OFFSET_Y}
                      width={SLOT_W - 8}
                      height={SLOT_H}
                      rx={6}
                      fill={filled ? DENISON.red : DENISON.neutralGold}
                      stroke={DENISON.redDark}
                      strokeOpacity={0.3}
                    />
                    <text
                      x={x + SLOT_W / 2}
                      y={OFFSET_Y + SLOT_H + 16}
                      textAnchor="middle"
                      fontSize={10}
                      fill={DENISON.stone}
                      fontFamily="Oswald, sans-serif"
                      letterSpacing="0.1em"
                    >
                      {i}
                    </text>
                  </g>
                )
              })}
              <AnimatePresence>
                {state.slots.map((slot, i) => {
                  if (!slot) return null
                  const x = OFFSET_X + i * SLOT_W
                  return (
                    <motion.text
                      key={slot.id}
                      initial={{ opacity: 0, y: OFFSET_Y + SLOT_H / 2 - 10 }}
                      animate={{ opacity: 1, y: OFFSET_Y + SLOT_H / 2 + 6 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      x={x + SLOT_W / 2}
                      textAnchor="middle"
                      fontSize={20}
                      fill={DENISON.white}
                      fontFamily="Lora, serif"
                      fontWeight={600}
                    >
                      {slot.value}
                    </motion.text>
                  )
                })}
              </AnimatePresence>
              <motion.g
                animate={{ x: OFFSET_X + state.head * SLOT_W }}
                transition={{ duration: 0.35 }}
              >
                <polygon
                  points={`${SLOT_W / 2 - 6},${OFFSET_Y - 12} ${SLOT_W / 2 + 6},${OFFSET_Y - 12} ${SLOT_W / 2},${OFFSET_Y - 2}`}
                  fill={DENISON.gold}
                  stroke={DENISON.goldDark}
                />
                <text
                  x={SLOT_W / 2}
                  y={OFFSET_Y - 18}
                  textAnchor="middle"
                  fontSize={11}
                  fill={DENISON.goldDark}
                  fontFamily="Oswald, sans-serif"
                  letterSpacing="0.1em"
                >
                  HEAD
                </text>
              </motion.g>
              <motion.g
                animate={{ x: OFFSET_X + state.tail * SLOT_W }}
                transition={{ duration: 0.35 }}
              >
                <polygon
                  points={`${SLOT_W / 2 - 6},${OFFSET_Y + SLOT_H + 24} ${SLOT_W / 2 + 6},${OFFSET_Y + SLOT_H + 24} ${SLOT_W / 2},${OFFSET_Y + SLOT_H + 34}`}
                  fill={DENISON.red}
                  stroke={DENISON.redDark}
                />
                <text
                  x={SLOT_W / 2}
                  y={OFFSET_Y + SLOT_H + 48}
                  textAnchor="middle"
                  fontSize={11}
                  fill={DENISON.redDark}
                  fontFamily="Oswald, sans-serif"
                  letterSpacing="0.1em"
                >
                  TAIL
                </text>
              </motion.g>
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="size" value={`${state.size} / ${CAPACITY}`} />
            <Stat label="head" value={String(state.head)} />
            <Stat label="tail" value={String(state.tail)} />
            <Stat label="last op" value={state.lastOp} />
            <div className="mt-2 rounded bg-[color:var(--color-denison-red-dark)]/10 p-2">
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">
                invariant
              </span>
              <p className="font-body text-xs text-[color:var(--color-denison-red-dark)]">
                tail = (tail + 1) mod {CAPACITY}
                <br />
                head = (head + 1) mod {CAPACITY}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">{describeNext(nextAction)}</p>
        </div>
      </div>
    </VizFrame>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">{label}</span>
      <span className="font-display text-base text-[color:var(--color-denison-red-dark)]">{value}</span>
    </div>
  )
}
