import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

type ListNode = { id: string; value: number }

type Action =
  | { kind: "insertHead"; value: number }
  | { kind: "insertTail"; value: number }
  | { kind: "deleteMiddle" }
  | { kind: "reverseBegin" }
  | { kind: "reverseFlip"; index: number }
  | { kind: "reverseFinish" }

const BASE_SCRIPT: Action[] = [
  { kind: "insertHead", value: 7 },
  { kind: "insertTail", value: 3 },
  { kind: "insertTail", value: 9 },
  { kind: "insertHead", value: 1 },
  { kind: "deleteMiddle" },
  { kind: "reverseBegin" },
]

type State = {
  nodes: ListNode[]
  reversed: boolean
  flippedUpTo: number
  step: number
  script: Action[]
  idCounter: number
  lastOp: string
}

const initial = (): State => ({
  nodes: [],
  reversed: false,
  flippedUpTo: 0,
  step: 0,
  script: [...BASE_SCRIPT],
  idCounter: 0,
  lastOp: "—",
})

const NODE_W = 70
const NODE_H = 50
const GAP = 40
const OFFSET_X = 40
const OFFSET_Y = 80

export default function LinkedListsTopic() {
  const [state, setState] = React.useState<State>(initial)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(650)

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.step >= s.script.length) return s
      const action = s.script[s.step]
      const nextStep = s.step + 1
      if (action.kind === "insertHead") {
        const node = { id: `n${s.idCounter}`, value: action.value }
        return {
          ...s,
          nodes: [node, ...s.nodes],
          idCounter: s.idCounter + 1,
          step: nextStep,
          lastOp: `insertHead(${action.value})`,
        }
      }
      if (action.kind === "insertTail") {
        const node = { id: `n${s.idCounter}`, value: action.value }
        return {
          ...s,
          nodes: [...s.nodes, node],
          idCounter: s.idCounter + 1,
          step: nextStep,
          lastOp: `insertTail(${action.value})`,
        }
      }
      if (action.kind === "deleteMiddle") {
        if (s.nodes.length < 3) return { ...s, step: nextStep, lastOp: "delete skipped" }
        const mid = Math.floor(s.nodes.length / 2)
        const removed = s.nodes[mid]
        return {
          ...s,
          nodes: s.nodes.filter((_, i) => i !== mid),
          step: nextStep,
          lastOp: `delete(${removed.value})`,
        }
      }
      if (action.kind === "reverseBegin") {
        const flips: Action[] = s.nodes.slice(0, Math.max(s.nodes.length - 1, 0)).map((_, i) => ({
          kind: "reverseFlip",
          index: i,
        }))
        const newScript = [...s.script.slice(0, nextStep), ...flips, { kind: "reverseFinish" as const }]
        return { ...s, step: nextStep, script: newScript, flippedUpTo: 0, lastOp: "reverse: begin" }
      }
      if (action.kind === "reverseFlip") {
        return { ...s, flippedUpTo: action.index + 1, step: nextStep, lastOp: `flip arrow #${action.index}` }
      }
      if (action.kind === "reverseFinish") {
        return {
          ...s,
          nodes: [...s.nodes].reverse(),
          reversed: !s.reversed,
          flippedUpTo: 0,
          step: nextStep,
          lastOp: "reverse: done",
        }
      }
      return s
    })
  }, [])

  const canStep = state.step < state.script.length
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(initial())
  }

  const nextAction = state.script[state.step]
  const describeNext = (a: Action | undefined) => {
    if (!a) return "Done."
    switch (a.kind) {
      case "insertHead":
        return `insertHead(${a.value}) — new node becomes head, its next = old head.`
      case "insertTail":
        return `insertTail(${a.value}) — walk to tail, rewire tail.next.`
      case "deleteMiddle":
        return `delete(middle) — prev.next skips the removed node.`
      case "reverseBegin":
        return `reverse() — begin flipping next pointers one at a time.`
      case "reverseFlip":
        return `reverse: flip pointer at position ${a.index}.`
      case "reverseFinish":
        return `reverse: swap head and tail references.`
    }
  }

  const svgWidth = Math.max(OFFSET_X * 2 + (state.nodes.length || 1) * (NODE_W + GAP), 520)
  const svgHeight = 180

  return (
    <VizFrame
      topicNumber={4}
      category="Linear"
      title="Linked Lists"
      summary="A singly-linked list stitched together by pointer rewiring. Watch insert-at-head, insert-at-tail, and reverse manipulate only local pointers."
      complexity="insert at known node O(1), search O(n)"
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
              singly-linked list — {state.lastOp}
            </span>
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              <defs>
                <marker
                  id="arrow-gold"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 z" fill={DENISON.gold} />
                </marker>
                <marker
                  id="arrow-red"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0,0 L8,4 L0,8 z" fill={DENISON.redDark} />
                </marker>
              </defs>
              <AnimatePresence>
                {state.nodes.map((node, i) => {
                  const x = OFFSET_X + i * (NODE_W + GAP)
                  const y = OFFSET_Y
                  const isHead = i === 0
                  const isTail = i === state.nodes.length - 1
                  return (
                    <motion.g
                      key={node.id}
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.35 }}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={NODE_W}
                        height={NODE_H}
                        rx={6}
                        fill={DENISON.red}
                        stroke={DENISON.redDark}
                      />
                      <text
                        x={x + NODE_W / 2}
                        y={y + NODE_H / 2 + 6}
                        textAnchor="middle"
                        fontSize={18}
                        fill={DENISON.white}
                        fontFamily="Lora, serif"
                        fontWeight={600}
                      >
                        {node.value}
                      </text>
                      {isHead && (
                        <text
                          x={x + NODE_W / 2}
                          y={y - 16}
                          textAnchor="middle"
                          fontSize={11}
                          fill={DENISON.redDark}
                          fontFamily="Oswald, sans-serif"
                          letterSpacing="0.1em"
                        >
                          HEAD
                        </text>
                      )}
                      {isTail && state.nodes.length > 1 && (
                        <text
                          x={x + NODE_W / 2}
                          y={y + NODE_H + 20}
                          textAnchor="middle"
                          fontSize={11}
                          fill={DENISON.redDark}
                          fontFamily="Oswald, sans-serif"
                          letterSpacing="0.1em"
                        >
                          TAIL
                        </text>
                      )}
                      {isTail && state.nodes.length === 1 && (
                        <text
                          x={x + NODE_W / 2}
                          y={y + NODE_H + 20}
                          textAnchor="middle"
                          fontSize={11}
                          fill={DENISON.redDark}
                          fontFamily="Oswald, sans-serif"
                          letterSpacing="0.1em"
                        >
                          TAIL
                        </text>
                      )}
                    </motion.g>
                  )
                })}
              </AnimatePresence>
              {state.nodes.slice(0, -1).map((node, i) => {
                const x1 = OFFSET_X + i * (NODE_W + GAP) + NODE_W
                const x2 = OFFSET_X + (i + 1) * (NODE_W + GAP)
                const y = OFFSET_Y + NODE_H / 2
                const flipped = i < state.flippedUpTo
                return (
                  <motion.line
                    key={`arrow-${node.id}`}
                    animate={{
                      x1: flipped ? x2 : x1,
                      x2: flipped ? x1 : x2,
                      y1: y,
                      y2: y,
                    }}
                    transition={{ duration: 0.35 }}
                    stroke={flipped ? DENISON.gold : DENISON.redDark}
                    strokeWidth={2}
                    markerEnd={flipped ? "url(#arrow-gold)" : "url(#arrow-red)"}
                  />
                )
              })}
              {state.nodes.length > 0 && (
                <g>
                  <line
                    x1={OFFSET_X + state.nodes.length * (NODE_W + GAP) - GAP + NODE_W - NODE_W}
                    x2={OFFSET_X + (state.nodes.length - 1) * (NODE_W + GAP) + NODE_W + 18}
                    y1={OFFSET_Y + NODE_H / 2}
                    y2={OFFSET_Y + NODE_H / 2}
                    stroke={DENISON.stone}
                    strokeOpacity={0}
                  />
                  <text
                    x={OFFSET_X + (state.nodes.length - 1) * (NODE_W + GAP) + NODE_W + 22}
                    y={OFFSET_Y + NODE_H / 2 + 5}
                    fontSize={14}
                    fill={DENISON.stone}
                    fontFamily="Oswald, sans-serif"
                  >
                    ∅
                  </text>
                </g>
              )}
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="length" value={String(state.nodes.length)} />
            <Stat label="head" value={state.nodes[0] ? String(state.nodes[0].value) : "—"} />
            <Stat label="tail" value={state.nodes.at(-1) ? String(state.nodes.at(-1)!.value) : "—"} />
            <Stat label="last op" value={state.lastOp} />
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
      <span className="font-display text-xl text-[color:var(--color-denison-red-dark)]">{value}</span>
    </div>
  )
}
