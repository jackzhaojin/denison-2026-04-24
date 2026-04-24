import * as React from "react"
import { motion } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"
import { Button } from "@/components/ui/button"

type Mode = "inorder" | "preorder" | "postorder" | "level"

type Node = { id: string; value: number; x: number; y: number; parent?: string }

const NODES: Node[] = [
  { id: "n50", value: 50, x: 400, y: 60 },
  { id: "n30", value: 30, x: 220, y: 150, parent: "n50" },
  { id: "n70", value: 70, x: 580, y: 150, parent: "n50" },
  { id: "n20", value: 20, x: 120, y: 240, parent: "n30" },
  { id: "n40", value: 40, x: 320, y: 240, parent: "n30" },
  { id: "n60", value: 60, x: 480, y: 240, parent: "n70" },
  { id: "n80", value: 80, x: 680, y: 240, parent: "n70" },
]

const CHILDREN: Record<string, { left?: string; right?: string }> = {
  n50: { left: "n30", right: "n70" },
  n30: { left: "n20", right: "n40" },
  n70: { left: "n60", right: "n80" },
  n20: {},
  n40: {},
  n60: {},
  n80: {},
}

function inorder(id: string, out: string[]): void {
  const c = CHILDREN[id]
  if (c.left) inorder(c.left, out)
  out.push(id)
  if (c.right) inorder(c.right, out)
}
function preorder(id: string, out: string[]): void {
  const c = CHILDREN[id]
  out.push(id)
  if (c.left) preorder(c.left, out)
  if (c.right) preorder(c.right, out)
}
function postorder(id: string, out: string[]): void {
  const c = CHILDREN[id]
  if (c.left) postorder(c.left, out)
  if (c.right) postorder(c.right, out)
  out.push(id)
}
function levelorder(): string[] {
  const out: string[] = []
  const q = ["n50"]
  while (q.length) {
    const id = q.shift() as string
    out.push(id)
    const c = CHILDREN[id]
    if (c.left) q.push(c.left)
    if (c.right) q.push(c.right)
  }
  return out
}

function sequenceFor(mode: Mode): string[] {
  const out: string[] = []
  if (mode === "inorder") inorder("n50", out)
  else if (mode === "preorder") preorder("n50", out)
  else if (mode === "postorder") postorder("n50", out)
  else return levelorder()
  return out
}

const MODE_LABELS: Record<Mode, string> = {
  inorder: "Inorder (L, N, R)",
  preorder: "Preorder (N, L, R)",
  postorder: "Postorder (L, R, N)",
  level: "Level-order (BFS)",
}

export default function BinaryTreesTopic() {
  const [mode, setMode] = React.useState<Mode>("inorder")
  const [step, setStep] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(700)

  const sequence = React.useMemo(() => sequenceFor(mode), [mode])

  const doStep = React.useCallback(() => {
    setStep((s) => (s < sequence.length ? s + 1 : s))
  }, [sequence.length])

  const canStep = step < sequence.length
  useStepRunner(doStep, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setStep(0)
  }

  const changeMode = (m: Mode) => {
    setMode(m)
    setStep(0)
    setPlaying(false)
  }

  const visitedIds = new Set(sequence.slice(0, step))
  const currentId = step > 0 ? sequence[step - 1] : null
  const nextId = step < sequence.length ? sequence[step] : null
  const nodeMap = React.useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), [])

  const emitted = sequence.slice(0, step).map((id) => nodeMap[id].value)

  return (
    <VizFrame
      topicNumber={12}
      category="Trees"
      title="Binary Tree Traversals"
      summary="The same 7-node tree, four different orderings. Switch between inorder, preorder, postorder, and level-order to see what each traversal emits."
      complexity="traversal O(n)"
    >
      <div className="flex flex-col gap-5">
        <VizControls
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onStep={doStep}
          onReset={reset}
          speedMs={speedMs}
          onSpeedChange={setSpeedMs}
          canStep={canStep}
        />

        <div className="flex flex-wrap gap-2">
          {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={mode === m ? "default" : "outline"}
              onClick={() => changeMode(m)}
              className={
                mode === m
                  ? "bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red-dark)]"
                  : "border-[color:var(--color-denison-red)] text-[color:var(--color-denison-red-dark)]"
              }
            >
              {MODE_LABELS[m]}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[340px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              Balanced tree — 7 nodes
            </span>
            <svg width="100%" viewBox="0 0 760 310">
              {NODES.filter((n) => n.parent).map((n) => {
                const p = nodeMap[n.parent as string]
                return (
                  <line
                    key={`edge-${n.id}`}
                    x1={p.x}
                    y1={p.y}
                    x2={n.x}
                    y2={n.y}
                    stroke={DENISON.stone}
                    strokeOpacity={0.4}
                    strokeWidth={2}
                  />
                )
              })}
              {NODES.map((n) => {
                const isCurrent = n.id === currentId
                const isVisited = visitedIds.has(n.id) && !isCurrent
                const fill = isCurrent ? DENISON.gold : isVisited ? DENISON.cream : DENISON.white
                const stroke = isCurrent ? DENISON.goldDark : DENISON.redDark
                return (
                  <motion.g
                    key={n.id}
                    animate={{ scale: isCurrent ? 1.12 : 1 }}
                    transition={{ duration: 0.25 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    <circle cx={n.x} cy={n.y} r={26} fill={fill} stroke={stroke} strokeWidth={2} />
                    <text
                      x={n.x}
                      y={n.y + 6}
                      textAnchor="middle"
                      fontSize={16}
                      fill={DENISON.redDark}
                      fontFamily="Lora, serif"
                      fontWeight={600}
                    >
                      {n.value}
                    </text>
                  </motion.g>
                )
              })}
            </svg>

            <div className="mt-3 rounded-md bg-[color:var(--color-denison-red)]/10 p-3">
              <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">Emitted sequence</span>
              <div className="mt-2 flex flex-wrap gap-2 min-h-10">
                {emitted.map((v, i) => (
                  <motion.span
                    key={`${sequence[i]}-${i}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="inline-flex h-8 min-w-8 items-center justify-center rounded bg-[color:var(--color-denison-red)] px-2 font-display text-sm text-white"
                  >
                    {v}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="mode" value={MODE_LABELS[mode].split(" ")[0]} />
            <Stat label="visited" value={`${step} / ${sequence.length}`} />
            <Stat label="current" value={currentId ? String(nodeMap[currentId].value) : "—"} highlight={!!currentId} />
            <Stat label="next" value={nextId ? String(nodeMap[nextId].value) : "—"} />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {nextId
              ? `Visit node ${nodeMap[nextId].value} — emit it to the output sequence.`
              : "Traversal complete. Switch modes to compare the orderings."}
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
