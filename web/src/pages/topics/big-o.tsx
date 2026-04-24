import * as React from "react"
import { motion } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

type FnDef = {
  id: string
  label: string
  color: string
  f: (n: number) => number
}

const FUNCTIONS: FnDef[] = [
  { id: "const", label: "O(1)", color: DENISON.cream, f: () => 1 },
  { id: "log", label: "O(log n)", color: DENISON.neutralGold, f: (n) => Math.log2(Math.max(n, 1)) },
  { id: "linear", label: "O(n)", color: DENISON.gold, f: (n) => n },
  { id: "nlogn", label: "O(n log n)", color: DENISON.goldDark, f: (n) => n * Math.log2(Math.max(n, 1)) },
  { id: "quad", label: "O(n²)", color: DENISON.red, f: (n) => n * n },
  { id: "exp", label: "O(2ⁿ)", color: DENISON.redDark, f: (n) => Math.pow(2, n) },
]

const N_MIN = 5
const N_MAX_LIMIT = 40
const Y_CAP = 200
const INITIAL_N = 20

const CHART_W = 520
const CHART_H = 320
const PAD_L = 44
const PAD_R = 12
const PAD_T = 20
const PAD_B = 36

export default function BigOTopic() {
  const [nMax, setNMax] = React.useState(INITIAL_N)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(500)

  const step = React.useCallback(() => {
    setNMax((n) => (n < N_MAX_LIMIT ? n + 1 : n))
  }, [])

  const canStep = nMax < N_MAX_LIMIT
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setNMax(N_MIN)
  }

  const innerW = CHART_W - PAD_L - PAD_R
  const innerH = CHART_H - PAD_T - PAD_B

  const xFor = (n: number) => PAD_L + ((n - 1) / Math.max(nMax - 1, 1)) * innerW
  const yFor = (v: number) => {
    const capped = Math.min(v, Y_CAP)
    return PAD_T + innerH - (capped / Y_CAP) * innerH
  }

  const pathFor = (fn: FnDef) => {
    const pts: string[] = []
    const samples = Math.max(nMax, 2)
    for (let i = 0; i < samples; i++) {
      const n = 1 + (i / (samples - 1)) * (nMax - 1)
      const y = fn.f(n)
      pts.push(`${i === 0 ? "M" : "L"} ${xFor(n).toFixed(2)} ${yFor(y).toFixed(2)}`)
    }
    return pts.join(" ")
  }

  const yTicks = [0, 50, 100, 150, 200]

  return (
    <VizFrame
      topicNumber={1}
      category="Analysis"
      title="Big-O & Asymptotic Analysis"
      summary="Compare how different complexity classes grow. Drag the slider for n and watch the gap between O(log n) and O(n²) open up."
      complexity="O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)"
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
              growth curves — n ∈ [1, {nMax}], y capped at {Y_CAP}
            </span>
            <svg width="100%" viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
              <rect
                x={PAD_L}
                y={PAD_T}
                width={innerW}
                height={innerH}
                fill={DENISON.white}
                stroke={DENISON.redDark}
                strokeOpacity={0.2}
              />
              {yTicks.map((t) => (
                <g key={`yt-${t}`}>
                  <line
                    x1={PAD_L}
                    x2={PAD_L + innerW}
                    y1={yFor(t)}
                    y2={yFor(t)}
                    stroke={DENISON.stone}
                    strokeOpacity={0.1}
                  />
                  <text
                    x={PAD_L - 6}
                    y={yFor(t) + 4}
                    textAnchor="end"
                    fontSize={10}
                    fill={DENISON.stone}
                    fontFamily="Oswald, sans-serif"
                  >
                    {t}
                  </text>
                </g>
              ))}
              {[1, Math.round(nMax / 2), nMax].map((n) => (
                <g key={`xt-${n}`}>
                  <line
                    x1={xFor(n)}
                    x2={xFor(n)}
                    y1={PAD_T}
                    y2={PAD_T + innerH}
                    stroke={DENISON.stone}
                    strokeOpacity={0.08}
                  />
                  <text
                    x={xFor(n)}
                    y={PAD_T + innerH + 16}
                    textAnchor="middle"
                    fontSize={10}
                    fill={DENISON.stone}
                    fontFamily="Oswald, sans-serif"
                  >
                    n={n}
                  </text>
                </g>
              ))}
              <text
                x={PAD_L + innerW / 2}
                y={CHART_H - 4}
                textAnchor="middle"
                fontSize={11}
                fill={DENISON.redDark}
                fontFamily="Oswald, sans-serif"
                letterSpacing="0.1em"
              >
                INPUT SIZE n
              </text>
              <defs>
                <clipPath id="chartClip">
                  <rect x={PAD_L} y={PAD_T} width={innerW} height={innerH} />
                </clipPath>
              </defs>
              <g clipPath="url(#chartClip)">
                {FUNCTIONS.map((fn) => (
                  <motion.path
                    key={fn.id}
                    d={pathFor(fn)}
                    fill="none"
                    stroke={fn.color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                ))}
                {FUNCTIONS.map((fn) => {
                  const v = fn.f(nMax)
                  const y = yFor(v)
                  return (
                    <motion.circle
                      key={`dot-${fn.id}`}
                      cx={xFor(nMax)}
                      cy={y}
                      r={4}
                      fill={fn.color}
                      stroke={DENISON.ink}
                      strokeOpacity={0.2}
                      animate={{ cx: xFor(nMax), cy: y }}
                      transition={{ duration: 0.4 }}
                    />
                  )
                })}
              </g>
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">
              f(n={nMax})
            </span>
            {FUNCTIONS.map((fn) => {
              const v = fn.f(nMax)
              const display = v >= 1e6 ? v.toExponential(1) : v < 10 ? v.toFixed(2) : Math.round(v).toString()
              return (
                <div key={fn.id} className="flex items-baseline justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-4 rounded"
                      style={{ background: fn.color }}
                    />
                    <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">
                      {fn.label}
                    </span>
                  </span>
                  <span className="font-display text-base text-[color:var(--color-denison-red-dark)]">
                    {display}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {canStep
              ? `Advance n from ${nMax} to ${nMax + 1} — redraw each curve across the new range.`
              : `n has reached the cap (${N_MAX_LIMIT}). Exponential O(2ⁿ) has long since escaped the chart while O(log n) barely moved.`}
          </p>
        </div>
      </div>
    </VizFrame>
  )
}
