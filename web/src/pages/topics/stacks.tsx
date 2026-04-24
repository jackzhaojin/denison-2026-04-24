import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

const INPUT = "{[()]()}"
const OPEN = "[({"
const CLOSE = "])}"
const MATCH: Record<string, string> = { "]": "[", ")": "(", "}": "{" }

type StackItem = { id: string; char: string }

type FlashKind = "match" | "mismatch" | null

type State = {
  cursor: number
  stack: StackItem[]
  idCounter: number
  flash: FlashKind
  mismatchAt: number | null
  finished: boolean
  lastOp: string
}

const initial: State = {
  cursor: 0,
  stack: [],
  idCounter: 0,
  flash: null,
  mismatchAt: null,
  finished: false,
  lastOp: "—",
}

const CHAR_W = 38
const CHAR_H = 44
const INPUT_OFFSET_X = 24
const INPUT_OFFSET_Y = 40

const STACK_X = 60
const STACK_BOTTOM_Y = 320
const STACK_BOX_W = 70
const STACK_BOX_H = 40

export default function StacksTopic() {
  const [state, setState] = React.useState<State>(initial)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(650)

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.finished) return s
      if (s.cursor >= INPUT.length) {
        const balanced = s.stack.length === 0 && s.mismatchAt === null
        return {
          ...s,
          finished: true,
          flash: balanced ? "match" : "mismatch",
          lastOp: balanced ? "done: balanced" : "done: unbalanced",
        }
      }
      const ch = INPUT[s.cursor]
      if (OPEN.includes(ch)) {
        const item = { id: `s${s.idCounter}`, char: ch }
        return {
          ...s,
          stack: [...s.stack, item],
          cursor: s.cursor + 1,
          idCounter: s.idCounter + 1,
          flash: null,
          lastOp: `push '${ch}'`,
        }
      }
      if (CLOSE.includes(ch)) {
        const top = s.stack[s.stack.length - 1]
        if (top && top.char === MATCH[ch]) {
          return {
            ...s,
            stack: s.stack.slice(0, -1),
            cursor: s.cursor + 1,
            flash: "match",
            lastOp: `pop '${top.char}' matches '${ch}'`,
          }
        }
        return {
          ...s,
          cursor: s.cursor + 1,
          flash: "mismatch",
          mismatchAt: s.mismatchAt ?? s.cursor,
          lastOp: `mismatch at i=${s.cursor}`,
        }
      }
      return { ...s, cursor: s.cursor + 1, lastOp: `skip '${ch}'` }
    })
  }, [])

  const canStep = !state.finished
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(initial)
  }

  const svgWidthInput = INPUT_OFFSET_X * 2 + INPUT.length * CHAR_W
  const svgHeightInput = 100

  const statusText = state.finished
    ? state.mismatchAt !== null
      ? `mismatch at i=${state.mismatchAt}`
      : state.stack.length > 0
      ? "unclosed — stack non-empty"
      : "balanced ✓"
    : state.mismatchAt !== null
    ? `mismatch at i=${state.mismatchAt}`
    : "in progress"

  const statusGood = state.finished && state.mismatchAt === null && state.stack.length === 0

  const nextDescription = () => {
    if (state.finished) return `Expression processed. Status: ${statusText}.`
    if (state.cursor >= INPUT.length) return "Finalize: check if stack is empty."
    const ch = INPUT[state.cursor]
    if (OPEN.includes(ch)) return `Read '${ch}' — opener, push onto stack.`
    if (CLOSE.includes(ch)) {
      const top = state.stack[state.stack.length - 1]
      if (top && top.char === MATCH[ch]) return `Read '${ch}' — closer matches top '${top.char}', pop.`
      return `Read '${ch}' — closer, check stack top for match.`
    }
    return `Read '${ch}' — ignore (not a bracket).`
  }

  return (
    <VizFrame
      topicNumber={5}
      category="Linear"
      title="Stacks (LIFO)"
      summary="A stack of brackets checking a real expression — push on every open bracket, pop on every close and verify it matches. Any mismatch or non-empty stack at end = invalid."
      complexity="push/pop O(1)"
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
              input expression
            </span>
            <svg width="100%" viewBox={`0 0 ${svgWidthInput} ${svgHeightInput}`}>
              {INPUT.split("").map((ch, i) => {
                const x = INPUT_OFFSET_X + i * CHAR_W
                const isCurrent = i === state.cursor
                const isPast = i < state.cursor
                const isMismatch = state.mismatchAt === i
                let fill = DENISON.white
                let textColor = DENISON.redDark
                if (isMismatch) {
                  fill = DENISON.red
                  textColor = DENISON.white
                } else if (isPast) {
                  fill = DENISON.cream
                  textColor = DENISON.stone
                }
                return (
                  <g key={`ch-${i}`}>
                    <rect
                      x={x}
                      y={INPUT_OFFSET_Y}
                      width={CHAR_W - 4}
                      height={CHAR_H}
                      rx={4}
                      fill={fill}
                      stroke={DENISON.redDark}
                      strokeOpacity={0.4}
                    />
                    <text
                      x={x + (CHAR_W - 4) / 2}
                      y={INPUT_OFFSET_Y + CHAR_H / 2 + 6}
                      textAnchor="middle"
                      fontSize={20}
                      fill={textColor}
                      fontFamily="Lora, serif"
                      fontWeight={600}
                    >
                      {ch}
                    </text>
                    <text
                      x={x + (CHAR_W - 4) / 2}
                      y={INPUT_OFFSET_Y + CHAR_H + 14}
                      textAnchor="middle"
                      fontSize={9}
                      fill={DENISON.stone}
                      fontFamily="Oswald, sans-serif"
                    >
                      {i}
                    </text>
                    {isCurrent && (
                      <motion.polygon
                        points={`${x + (CHAR_W - 4) / 2 - 6},${INPUT_OFFSET_Y - 6} ${x + (CHAR_W - 4) / 2 + 6},${INPUT_OFFSET_Y - 6} ${x + (CHAR_W - 4) / 2},${INPUT_OFFSET_Y - 14}`}
                        fill={DENISON.gold}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="min-w-[180px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              stack (top)
            </span>
            <svg width={200} height={STACK_BOTTOM_Y + 30} viewBox={`0 0 200 ${STACK_BOTTOM_Y + 30}`}>
              <line
                x1={STACK_X - 6}
                x2={STACK_X - 6}
                y1={STACK_BOTTOM_Y + STACK_BOX_H}
                y2={40}
                stroke={DENISON.redDark}
                strokeOpacity={0.3}
                strokeDasharray="4 4"
              />
              <line
                x1={STACK_X + STACK_BOX_W + 6}
                x2={STACK_X + STACK_BOX_W + 6}
                y1={STACK_BOTTOM_Y + STACK_BOX_H}
                y2={40}
                stroke={DENISON.redDark}
                strokeOpacity={0.3}
                strokeDasharray="4 4"
              />
              <line
                x1={STACK_X - 6}
                x2={STACK_X + STACK_BOX_W + 6}
                y1={STACK_BOTTOM_Y + STACK_BOX_H}
                y2={STACK_BOTTOM_Y + STACK_BOX_H}
                stroke={DENISON.redDark}
                strokeOpacity={0.5}
              />
              <AnimatePresence>
                {state.stack.map((item, i) => {
                  const y = STACK_BOTTOM_Y - i * STACK_BOX_H
                  const isTop = i === state.stack.length - 1
                  const flashColor =
                    isTop && state.flash === "mismatch"
                      ? DENISON.redDark
                      : isTop && state.flash === "match"
                      ? DENISON.goldDark
                      : DENISON.red
                  return (
                    <motion.g
                      key={item.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ duration: 0.3 }}
                    >
                      <rect
                        x={STACK_X}
                        y={y}
                        width={STACK_BOX_W}
                        height={STACK_BOX_H}
                        rx={4}
                        fill={flashColor}
                        stroke={DENISON.redDark}
                      />
                      <text
                        x={STACK_X + STACK_BOX_W / 2}
                        y={y + STACK_BOX_H / 2 + 6}
                        textAnchor="middle"
                        fontSize={18}
                        fill={DENISON.white}
                        fontFamily="Lora, serif"
                        fontWeight={600}
                      >
                        {item.char}
                      </text>
                    </motion.g>
                  )
                })}
              </AnimatePresence>
              <text
                x={STACK_X + STACK_BOX_W / 2}
                y={STACK_BOTTOM_Y + STACK_BOX_H + 18}
                textAnchor="middle"
                fontSize={10}
                fill={DENISON.stone}
                fontFamily="Oswald, sans-serif"
                letterSpacing="0.1em"
              >
                BOTTOM
              </text>
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="cursor" value={String(state.cursor)} />
            <Stat label="stack size" value={String(state.stack.length)} />
            <Stat label="last op" value={state.lastOp} />
            <Stat
              label="status"
              value={statusText}
              highlight={!statusGood && state.finished}
            />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">{nextDescription()}</p>
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
        className={`font-display text-base ${highlight ? "text-[color:var(--color-denison-red)]" : "text-[color:var(--color-denison-red-dark)]"}`}
      >
        {value}
      </span>
    </div>
  )
}
