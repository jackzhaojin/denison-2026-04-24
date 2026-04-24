import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"
import { Button } from "@/components/ui/button"

type Mode = "chaining" | "probing"

type KeyItem = { id: string; key: string; h: number }

const SEQUENCE: KeyItem[] = [
  { id: "ins-0", key: "apple", h: 3 },
  { id: "ins-1", key: "cat", h: 3 },
  { id: "ins-2", key: "dog", h: 5 },
  { id: "ins-3", key: "fig", h: 3 },
  { id: "ins-4", key: "pear", h: 5 },
  { id: "ins-5", key: "kiwi", h: 6 },
]

const M = 8

type ChainBucket = { id: string; key: string }[]

type ProbeSlot = { id: string; key: string } | null

type State = {
  step: number
  chains: ChainBucket[]
  slots: ProbeSlot[]
  collisions: number
  longestChain: number
  longestProbe: number
  lastProbePath: number[]
  lastInsertedId: string | null
}

const emptyState = (): State => ({
  step: 0,
  chains: Array.from({ length: M }, () => []),
  slots: Array<ProbeSlot>(M).fill(null),
  collisions: 0,
  longestChain: 0,
  longestProbe: 0,
  lastProbePath: [],
  lastInsertedId: null,
})

export default function CollisionsTopic() {
  const [mode, setMode] = React.useState<Mode>("chaining")
  const [state, setState] = React.useState<State>(emptyState)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(800)

  const canStep = state.step < SEQUENCE.length

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.step >= SEQUENCE.length) return s
      const item = SEQUENCE[s.step]

      if (mode === "chaining") {
        const chains = s.chains.map((b, i) =>
          i === item.h ? [...b, { id: item.id, key: item.key }] : b,
        )
        const collided = s.chains[item.h].length > 0
        const longest = chains.reduce((m, b) => Math.max(m, b.length), 0)
        return {
          ...s,
          step: s.step + 1,
          chains,
          collisions: s.collisions + (collided ? 1 : 0),
          longestChain: Math.max(s.longestChain, longest),
          lastProbePath: [],
          lastInsertedId: item.id,
        }
      }

      const slots = [...s.slots]
      let i = 0
      const path: number[] = []
      while (i < M) {
        const idx = (item.h + i) % M
        path.push(idx)
        if (slots[idx] === null) {
          slots[idx] = { id: item.id, key: item.key }
          break
        }
        i++
      }
      const collided = path.length > 1
      return {
        ...s,
        step: s.step + 1,
        slots,
        collisions: s.collisions + (collided ? 1 : 0),
        longestProbe: Math.max(s.longestProbe, path.length),
        lastProbePath: path,
        lastInsertedId: item.id,
      }
    })
  }, [mode])

  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(emptyState())
  }

  const changeMode = (m: Mode) => {
    setMode(m)
    setPlaying(false)
    setState(emptyState())
  }

  const bucketW = 72
  const bucketH = 40
  const originX = 40
  const originY = 40
  const gapX = 14
  const nodeH = 30
  const svgW = originX + M * (bucketW + gapX) + 20
  const svgH = mode === "chaining" ? originY + bucketH + 5 * (nodeH + 8) + 40 : originY + bucketH + 80

  const nextItem = state.step < SEQUENCE.length ? SEQUENCE[state.step] : null

  return (
    <VizFrame
      topicNumber={11}
      category="Hashing"
      title="Collision Resolution"
      summary="When two keys land in the same bucket, chaining grows a list and open-addressing probes forward. Toggle the strategy and watch the difference on a colliding sequence."
      complexity="O(1) avg, O(n) worst"
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
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={mode === "chaining" ? "default" : "outline"}
                onClick={() => changeMode("chaining")}
                className={
                  mode === "chaining"
                    ? "bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red-dark)]"
                    : "border-[color:var(--color-denison-red)] text-[color:var(--color-denison-red-dark)]"
                }
              >
                Chaining
              </Button>
              <Button
                size="sm"
                variant={mode === "probing" ? "default" : "outline"}
                onClick={() => changeMode("probing")}
                className={
                  mode === "probing"
                    ? "bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red-dark)]"
                    : "border-[color:var(--color-denison-red)] text-[color:var(--color-denison-red-dark)]"
                }
              >
                Linear Probing
              </Button>
            </div>
          }
        />

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[520px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              {mode === "chaining" ? "Separate chaining" : "Open addressing · linear probe"} · m = {M}
            </span>
            <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
              {Array.from({ length: M }).map((_, i) => {
                const x = originX + i * (bucketW + gapX)
                const onProbePath = mode === "probing" && state.lastProbePath.includes(i)
                return (
                  <g key={`slot-${i}`}>
                    <rect
                      x={x}
                      y={originY}
                      width={bucketW}
                      height={bucketH}
                      rx={4}
                      fill={
                        mode === "probing" && state.slots[i]
                          ? DENISON.red
                          : DENISON.neutralGold
                      }
                      stroke={onProbePath ? DENISON.gold : DENISON.redDark}
                      strokeOpacity={onProbePath ? 1 : 0.3}
                      strokeWidth={onProbePath ? 3 : 1}
                    />
                    <text
                      x={x + bucketW / 2}
                      y={originY - 8}
                      textAnchor="middle"
                      fontSize={10}
                      fill={DENISON.redDark}
                      fontFamily="Oswald, sans-serif"
                      letterSpacing="0.15em"
                    >
                      {i}
                    </text>
                    {mode === "probing" && state.slots[i] && (
                      <text
                        x={x + bucketW / 2}
                        y={originY + bucketH / 2 + 5}
                        textAnchor="middle"
                        fontSize={13}
                        fill={DENISON.white}
                        fontFamily="Lora, serif"
                        fontWeight={600}
                      >
                        {state.slots[i]?.key}
                      </text>
                    )}
                  </g>
                )
              })}

              {mode === "chaining" && (
                <AnimatePresence>
                  {state.chains.flatMap((bucket, i) =>
                    bucket.map((node, k) => {
                      const x = originX + i * (bucketW + gapX)
                      const y = originY + bucketH + 8 + k * (nodeH + 8)
                      return (
                        <motion.g
                          key={node.id}
                          initial={{ opacity: 0, y: y - 14 }}
                          animate={{ opacity: 1, y }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          <rect
                            x={x + 6}
                            y={0}
                            width={bucketW - 12}
                            height={nodeH}
                            rx={3}
                            fill={
                              node.id === state.lastInsertedId ? DENISON.gold : DENISON.red
                            }
                            stroke={DENISON.redDark}
                            strokeOpacity={0.4}
                          />
                          <text
                            x={x + bucketW / 2}
                            y={nodeH / 2 + 5}
                            textAnchor="middle"
                            fontSize={12}
                            fill={
                              node.id === state.lastInsertedId
                                ? DENISON.redDark
                                : DENISON.white
                            }
                            fontFamily="Lora, serif"
                            fontWeight={600}
                          >
                            {node.key}
                          </text>
                        </motion.g>
                      )
                    }),
                  )}
                </AnimatePresence>
              )}

              {mode === "chaining" &&
                state.chains.map((bucket, i) =>
                  bucket.length > 0 ? (
                    <line
                      key={`chain-${i}`}
                      x1={originX + i * (bucketW + gapX) + bucketW / 2}
                      y1={originY + bucketH}
                      x2={originX + i * (bucketW + gapX) + bucketW / 2}
                      y2={originY + bucketH + 8 + bucket.length * (nodeH + 8) - 8}
                      stroke={DENISON.redDark}
                      strokeOpacity={0.35}
                      strokeDasharray="2 3"
                    />
                  ) : null,
                )}

              {mode === "probing" && state.lastProbePath.length > 1 && (
                <g>
                  {state.lastProbePath.slice(0, -1).map((idx, i) => {
                    const nextIdx = state.lastProbePath[i + 1]
                    const x1 = originX + idx * (bucketW + gapX) + bucketW
                    const x2 = originX + nextIdx * (bucketW + gapX)
                    const y = originY + bucketH + 20
                    return (
                      <motion.path
                        key={`probe-${i}`}
                        d={`M ${x1 - 4},${y} L ${x2 + 4},${y}`}
                        stroke={DENISON.gold}
                        strokeWidth={2}
                        fill="none"
                        markerEnd="url(#arrow-gold)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.15 }}
                      />
                    )
                  })}
                </g>
              )}

              <defs>
                <marker
                  id="arrow-gold"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={DENISON.gold} />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="mode" value={mode} />
            <Stat label="inserted" value={`${state.step}/${SEQUENCE.length}`} />
            <Stat label="collisions" value={String(state.collisions)} highlight={state.collisions > 0} />
            {mode === "chaining" ? (
              <Stat label="longest chain" value={String(state.longestChain)} />
            ) : (
              <Stat label="longest probe" value={String(state.longestProbe)} />
            )}
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {nextItem
              ? mode === "chaining"
                ? `Insert "${nextItem.key}" with h=${nextItem.h} — append to bucket ${nextItem.h}'s chain.`
                : `Insert "${nextItem.key}" with h=${nextItem.h} — probe (h+i) mod ${M} until empty.`
              : mode === "chaining"
                ? `Done. Longest chain: ${state.longestChain}. Chains degrade to O(n) in the worst case.`
                : `Done. Longest probe: ${state.longestProbe}. Clustering extends future probes.`}
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
