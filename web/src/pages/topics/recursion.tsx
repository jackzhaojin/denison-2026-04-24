import * as React from "react"
import { motion } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"
import { Button } from "@/components/ui/button"

type TreeNode = {
  id: string
  k: number
  depth: number
  parentId: string | null
  x: number
  y: number
}

const ROOT_K = 5
const NODE_R = 20
const LEVEL_H = 80
const WIDTH = 720
const HEIGHT = 460

function buildTree(k: number): TreeNode[] {
  const nodes: TreeNode[] = []
  let counter = 0
  const makeId = () => `n${counter++}`

  type Temp = { id: string; k: number; depth: number; parentId: string | null; left?: Temp; right?: Temp; width: number; x: number }

  const build = (kk: number, depth: number, parentId: string | null): Temp => {
    const id = makeId()
    if (kk < 2) {
      return { id, k: kk, depth, parentId, width: 1, x: 0 }
    }
    const left = build(kk - 1, depth + 1, id)
    const right = build(kk - 2, depth + 1, id)
    return { id, k: kk, depth, parentId, left, right, width: left.width + right.width, x: 0 }
  }

  const root = build(k, 0, null)

  const assignX = (t: Temp, leftEdge: number) => {
    if (!t.left || !t.right) {
      t.x = leftEdge + 0.5
      return
    }
    assignX(t.left, leftEdge)
    assignX(t.right, leftEdge + t.left.width)
    t.x = (t.left.x + t.right.x) / 2
  }
  assignX(root, 0)

  const totalWidth = root.width
  const slotW = (WIDTH - 60) / totalWidth

  const flatten = (t: Temp) => {
    nodes.push({
      id: t.id,
      k: t.k,
      depth: t.depth,
      parentId: t.parentId,
      x: 30 + t.x * slotW,
      y: 40 + t.depth * LEVEL_H,
    })
    if (t.left) flatten(t.left)
    if (t.right) flatten(t.right)
  }
  flatten(root)
  return nodes
}

function dfsOrder(nodes: TreeNode[]): string[] {
  const childrenOf = new Map<string | null, TreeNode[]>()
  for (const n of nodes) {
    const arr = childrenOf.get(n.parentId) ?? []
    arr.push(n)
    childrenOf.set(n.parentId, arr)
  }
  for (const arr of childrenOf.values()) {
    arr.sort((a, b) => a.x - b.x)
  }
  const order: string[] = []
  const visit = (parentId: string | null) => {
    const kids = childrenOf.get(parentId) ?? []
    for (const kid of kids) {
      order.push(kid.id)
      visit(kid.id)
    }
  }
  visit(null)
  return order
}

type Mode = "naive" | "memoized"

export default function RecursionTopic() {
  const [mode, setMode] = React.useState<Mode>("naive")
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(550)
  const [stepIdx, setStepIdx] = React.useState(0)

  const nodes = React.useMemo(() => buildTree(ROOT_K), [])
  const order = React.useMemo(() => dfsOrder(nodes), [nodes])
  const byId = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  const visitedIds = new Set<string>()
  const cachedK = new Set<number>()
  const cacheHitIds = new Set<string>()
  const skippedIds = new Set<string>()

  const parentOf = React.useMemo(() => new Map(nodes.map((n) => [n.id, n.parentId])), [nodes])

  const descendantsOf = React.useMemo(() => {
    const map = new Map<string, string[]>()
    for (const n of nodes) map.set(n.id, [])
    for (const n of nodes) {
      let p = n.parentId
      while (p) {
        map.get(p)!.push(n.id)
        p = parentOf.get(p) ?? null
      }
    }
    return map
  }, [nodes, parentOf])

  let visitedCount = 0
  let cacheHitCount = 0

  for (let i = 0; i < stepIdx; i++) {
    const id = order[i]
    if (!id) break
    if (skippedIds.has(id)) continue
    const node = byId.get(id)!
    if (mode === "memoized" && cachedK.has(node.k) && node.k >= 2) {
      cacheHitIds.add(id)
      cacheHitCount++
      for (const d of descendantsOf.get(id) ?? []) skippedIds.add(d)
      continue
    }
    visitedIds.add(id)
    visitedCount++
    if (node.k >= 2) cachedK.add(node.k)
    else cachedK.add(node.k)
  }

  const currentId = stepIdx > 0 ? order[stepIdx - 1] : null
  const maxSteps = order.length

  const step = React.useCallback(() => {
    setStepIdx((s) => Math.min(s + 1, maxSteps))
  }, [maxSteps])

  const canStep = stepIdx < maxSteps
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setStepIdx(0)
  }

  const toggleMode = () => {
    setPlaying(false)
    setStepIdx(0)
    setMode((m) => (m === "naive" ? "memoized" : "naive"))
  }

  const nextId = order[stepIdx]
  const nextNode = nextId ? byId.get(nextId) : null

  return (
    <VizFrame
      topicNumber={2}
      category="Analysis"
      title="Recursion & Divide-and-Conquer"
      summary="Watch a naive Fibonacci recursion explode into repeated subproblems, then flip the switch to memoized and see most of the tree collapse to instant lookups."
      complexity="Fib naive O(2ⁿ) → memoized O(n)"
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
              onClick={toggleMode}
              className="border-[color:var(--color-denison-red)] text-[color:var(--color-denison-red-dark)]"
            >
              Mode: {mode === "naive" ? "Naive" : "Memoized"}
            </Button>
          }
        />

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[420px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              fib({ROOT_K}) call tree — DFS order
            </span>
            <svg width="100%" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
              {nodes.map((n) => {
                if (!n.parentId) return null
                if (skippedIds.has(n.id)) return null
                const parent = byId.get(n.parentId)!
                const isCurrentEdge = n.id === currentId
                return (
                  <line
                    key={`edge-${n.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={n.x}
                    y2={n.y}
                    stroke={isCurrentEdge ? DENISON.gold : DENISON.redDark}
                    strokeOpacity={isCurrentEdge ? 1 : 0.35}
                    strokeWidth={isCurrentEdge ? 3 : 1.5}
                  />
                )
              })}
              {nodes.map((n) => {
                const isCurrent = n.id === currentId
                const isVisited = visitedIds.has(n.id)
                const isCacheHit = cacheHitIds.has(n.id)
                const isSkipped = skippedIds.has(n.id)
                let fill = DENISON.white
                let stroke = DENISON.redDark
                let textColor = DENISON.redDark
                if (isCurrent) {
                  fill = DENISON.gold
                  stroke = DENISON.goldDark
                  textColor = DENISON.redDark
                } else if (isCacheHit) {
                  fill = DENISON.cream
                  stroke = DENISON.goldDark
                  textColor = DENISON.stone
                } else if (isVisited) {
                  fill = DENISON.red
                  stroke = DENISON.redDark
                  textColor = DENISON.white
                }
                return (
                  <motion.g
                    key={n.id}
                    initial={false}
                    animate={{ opacity: isSkipped ? 0.15 : 1, scale: isCurrent ? 1.12 : 1 }}
                    transition={{ duration: 0.25 }}
                    style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                  >
                    <circle cx={n.x} cy={n.y} r={NODE_R} fill={fill} stroke={stroke} strokeWidth={2} />
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fill={textColor}
                      fontFamily="Oswald, sans-serif"
                      letterSpacing="0.05em"
                    >
                      fib({n.k})
                    </text>
                  </motion.g>
                )
              })}
            </svg>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="mode" value={mode} />
            <Stat label="nodes visited" value={String(visitedCount)} />
            <Stat label="cache hits" value={String(cacheHitCount)} highlight={cacheHitCount > 0} />
            <Stat label="total nodes" value={String(nodes.length)} />
            <Stat label="step" value={`${stepIdx} / ${maxSteps}`} />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {nextNode
              ? mode === "memoized" && cachedK.has(nextNode.k) && nextNode.k >= 2
                ? `Enter fib(${nextNode.k}) — cache hit, subtree pruned.`
                : `Enter fib(${nextNode.k}) at depth ${nextNode.depth}.`
              : mode === "naive"
              ? `Recursion complete. ${visitedCount} calls for fib(${ROOT_K}) — exponential blowup.`
              : `Memoized complete. ${cacheHitCount} calls skipped thanks to the cache.`}
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
