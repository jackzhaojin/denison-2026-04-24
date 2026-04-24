import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

const KEYS = ["apple", "orange", "banana", "grape", "kiwi", "pear", "plum", "peach"]
const M = 7

type Placement = { id: string; key: string; bucket: number }

type State = {
  placed: Placement[]
  step: number
  counts: number[]
}

const INITIAL: State = {
  placed: [],
  step: 0,
  counts: Array(M).fill(0),
}

function sumCharCodes(s: string): number {
  let total = 0
  for (let i = 0; i < s.length; i++) total += s.charCodeAt(i)
  return total
}

function hashDetails(s: string): { sum: number; bucket: number; parts: number[] } {
  const parts: number[] = []
  let sum = 0
  for (let i = 0; i < s.length; i++) {
    parts.push(s.charCodeAt(i))
    sum += s.charCodeAt(i)
  }
  return { sum, bucket: sum % M, parts }
}

export default function HashFunctionsTopic() {
  const [state, setState] = React.useState<State>(INITIAL)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(800)

  const canStep = state.step < KEYS.length

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.step >= KEYS.length) return s
      const key = KEYS[s.step]
      const bucket = sumCharCodes(key) % M
      const nextCounts = [...s.counts]
      nextCounts[bucket]++
      return {
        placed: [...s.placed, { id: `p-${s.step}`, key, bucket }],
        counts: nextCounts,
        step: s.step + 1,
      }
    })
  }, [])

  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(INITIAL)
  }

  const bucketsUsed = state.counts.filter((c) => c >= 1).length
  const maxBucket = state.counts.reduce((m, c) => Math.max(m, c), 0)

  const keyRowH = 44
  const bucketRowH = 52
  const keyX = 40
  const keyW = 120
  const bucketX = 380
  const bucketW = 90
  const originY = 60
  const svgW = 560
  const svgH = originY + Math.max(KEYS.length * keyRowH, M * bucketRowH) + 40

  const current = state.step < KEYS.length ? KEYS[state.step] : null
  const currentDetails = current ? hashDetails(current) : null

  const lastPlaced = state.placed[state.placed.length - 1]

  return (
    <VizFrame
      topicNumber={10}
      category="Hashing"
      title="Hash Functions"
      summary="A good hash scatters keys uniformly. Here the classic sum-of-char-codes mod m is applied to real strings, with animated arrows showing where each lands."
      complexity="O(1) expected"
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

        <div className="rounded-md bg-[color:var(--color-denison-neutral-gold)]/40 p-3 font-mono text-sm text-[color:var(--color-denison-red-dark)]">
          {currentDetails ? (
            <>
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
                next
              </span>{" "}
              hash(&#39;{current}&#39;) = ({currentDetails.parts.join("+")}) mod {M} ={" "}
              {currentDetails.sum} mod {M} ={" "}
              <span className="font-bold">{currentDetails.bucket}</span>
            </>
          ) : lastPlaced ? (
            <>
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
                done
              </span>{" "}
              last: hash(&#39;{lastPlaced.key}&#39;) → bucket {lastPlaced.bucket}
            </>
          ) : (
            <span className="text-[color:var(--color-denison-stone)]">
              Press Step to hash each key.
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[520px]">
            <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
              <text
                x={keyX + keyW / 2}
                y={originY - 20}
                textAnchor="middle"
                fontSize={10}
                fill={DENISON.redDark}
                fontFamily="Oswald, sans-serif"
                letterSpacing="0.15em"
              >
                KEYS
              </text>
              <text
                x={bucketX + bucketW / 2}
                y={originY - 20}
                textAnchor="middle"
                fontSize={10}
                fill={DENISON.redDark}
                fontFamily="Oswald, sans-serif"
                letterSpacing="0.15em"
              >
                BUCKETS (m={M})
              </text>

              {KEYS.map((key, i) => {
                const y = originY + i * keyRowH
                const placed = state.placed.find((p) => p.key === key)
                const isCurrent = current === key
                return (
                  <g key={`k-${key}`}>
                    <rect
                      x={keyX}
                      y={y}
                      width={keyW}
                      height={keyRowH - 10}
                      rx={4}
                      fill={placed ? DENISON.red : isCurrent ? DENISON.gold : DENISON.cream}
                      stroke={DENISON.redDark}
                      strokeOpacity={isCurrent ? 1 : 0.3}
                      strokeWidth={isCurrent ? 2 : 1}
                    />
                    <text
                      x={keyX + keyW / 2}
                      y={y + (keyRowH - 10) / 2 + 5}
                      textAnchor="middle"
                      fontSize={14}
                      fill={placed ? DENISON.white : DENISON.redDark}
                      fontFamily="Lora, serif"
                      fontWeight={600}
                    >
                      {key}
                    </text>
                  </g>
                )
              })}

              {Array.from({ length: M }).map((_, i) => {
                const y = originY + i * bucketRowH
                return (
                  <g key={`b-${i}`}>
                    <rect
                      x={bucketX}
                      y={y}
                      width={bucketW}
                      height={bucketRowH - 10}
                      rx={4}
                      fill={DENISON.neutralGold}
                      stroke={DENISON.redDark}
                      strokeOpacity={0.35}
                    />
                    <text
                      x={bucketX - 10}
                      y={y + (bucketRowH - 10) / 2 + 5}
                      textAnchor="end"
                      fontSize={12}
                      fill={DENISON.redDark}
                      fontFamily="Oswald, sans-serif"
                      letterSpacing="0.1em"
                    >
                      {i}
                    </text>
                    <text
                      x={bucketX + bucketW + 10}
                      y={y + (bucketRowH - 10) / 2 + 5}
                      textAnchor="start"
                      fontSize={12}
                      fill={DENISON.redDark}
                      fontFamily="Oswald, sans-serif"
                    >
                      × {state.counts[i]}
                    </text>
                  </g>
                )
              })}

              <AnimatePresence>
                {state.placed.map((p) => {
                  const keyIdx = KEYS.indexOf(p.key)
                  const y1 = originY + keyIdx * keyRowH + (keyRowH - 10) / 2
                  const x1 = keyX + keyW
                  const y2 = originY + p.bucket * bucketRowH + (bucketRowH - 10) / 2
                  const x2 = bucketX
                  const midX = (x1 + x2) / 2
                  const d = `M ${x1},${y1} C ${midX},${y1} ${midX},${y2} ${x2},${y2}`
                  return (
                    <motion.path
                      key={p.id}
                      d={d}
                      fill="none"
                      stroke={DENISON.redDark}
                      strokeWidth={2}
                      strokeOpacity={0.6}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.7 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )
                })}
              </AnimatePresence>
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="keys hashed" value={`${state.placed.length}/${KEYS.length}`} />
            <Stat label="buckets used" value={`${bucketsUsed}/${M}`} />
            <Stat label="max bucket" value={String(maxBucket)} highlight={maxBucket > 1} />
            <Stat label="m" value={String(M)} />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {currentDetails
              ? `Hash "${current}" — sum = ${currentDetails.sum}, bucket = ${currentDetails.bucket}.`
              : `All ${KEYS.length} keys placed. Max bucket size ${maxBucket} — collisions happen even with a clean hash.`}
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
