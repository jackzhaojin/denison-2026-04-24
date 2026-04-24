import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

const SCRIPT: number[] = [30, 20, 10, 40, 50, 45, 35, 32]

type AVLNode = {
  id: string
  value: number
  left: string | null
  right: string | null
}

type Phase = { kind: "insert"; value: number } | { kind: "rotate"; rotationType: string; atValue: number; atId: string }

type State = {
  nodes: Record<string, AVLNode>
  root: string | null
  idSeq: number
  scriptIndex: number
  pending: Phase[]
  lastLabel: string
  highlightIds: string[]
  rotationCount: number
  insertCount: number
  lastRotation: string
  lastInserted: string | null
}

const INITIAL: State = {
  nodes: {},
  root: null,
  idSeq: 0,
  scriptIndex: 0,
  pending: [],
  lastLabel: "Press step to begin",
  highlightIds: [],
  rotationCount: 0,
  insertCount: 0,
  lastRotation: "—",
  lastInserted: null,
}

function heightOf(nodes: Record<string, AVLNode>, id: string | null): number {
  if (!id) return 0
  const n = nodes[id]
  return 1 + Math.max(heightOf(nodes, n.left), heightOf(nodes, n.right))
}

function balanceOf(nodes: Record<string, AVLNode>, id: string): number {
  const n = nodes[id]
  return heightOf(nodes, n.left) - heightOf(nodes, n.right)
}

function depthOf(nodes: Record<string, AVLNode>, root: string | null, id: string, d = 0): number | null {
  if (!root) return null
  if (root === id) return d
  const n = nodes[root]
  const l = depthOf(nodes, n.left, id, d + 1)
  if (l !== null) return l
  return depthOf(nodes, n.right, id, d + 1)
}

function inorderList(nodes: Record<string, AVLNode>, root: string | null): string[] {
  const out: string[] = []
  const walk = (id: string | null) => {
    if (!id) return
    const n = nodes[id]
    walk(n.left)
    out.push(id)
    walk(n.right)
  }
  walk(root)
  return out
}

function parentOf(nodes: Record<string, AVLNode>, root: string | null, id: string): string | null {
  if (!root || root === id) return null
  const walk = (cur: string | null): string | null => {
    if (!cur) return null
    const n = nodes[cur]
    if (n.left === id || n.right === id) return cur
    return walk(n.left) ?? walk(n.right)
  }
  return walk(root)
}

function insertBST(nodes: Record<string, AVLNode>, root: string | null, value: number, newId: string): { nodes: Record<string, AVLNode>; root: string } {
  const next = { ...nodes }
  const newNode: AVLNode = { id: newId, value, left: null, right: null }
  next[newId] = newNode
  if (!root) {
    return { nodes: next, root: newId }
  }
  const walk = (curId: string) => {
    const cur = next[curId]
    if (value < cur.value) {
      if (cur.left) walk(cur.left)
      else next[curId] = { ...cur, left: newId }
    } else {
      if (cur.right) walk(cur.right)
      else next[curId] = { ...cur, right: newId }
    }
  }
  walk(root)
  return { nodes: next, root }
}

type RotatePhase = Extract<Phase, { kind: "rotate" }>

function detectUnbalanced(nodes: Record<string, AVLNode>, root: string | null, insertedValue: number): RotatePhase | null {
  if (!root) return null
  const path: string[] = []
  const walk = (id: string | null) => {
    if (!id) return
    path.push(id)
    const n = nodes[id]
    if (insertedValue < n.value) walk(n.left)
    else if (insertedValue > n.value) walk(n.right)
  }
  walk(root)
  for (let i = path.length - 1; i >= 0; i--) {
    const id = path[i]
    const bf = balanceOf(nodes, id)
    if (Math.abs(bf) > 1) {
      const n = nodes[id]
      if (bf > 1) {
        const left = n.left as string
        if (insertedValue < nodes[left].value) return { kind: "rotate", rotationType: "LL", atValue: n.value, atId: id }
        return { kind: "rotate", rotationType: "LR", atValue: n.value, atId: id }
      }
      const right = n.right as string
      if (insertedValue > nodes[right].value) return { kind: "rotate", rotationType: "RR", atValue: n.value, atId: id }
      return { kind: "rotate", rotationType: "RL", atValue: n.value, atId: id }
    }
  }
  return null
}

function rotateRight(nodes: Record<string, AVLNode>, root: string, y: string): { nodes: Record<string, AVLNode>; root: string } {
  const next = { ...nodes }
  const yn = next[y]
  const x = yn.left as string
  const xn = next[x]
  const T2 = xn.right
  next[x] = { ...xn, right: y }
  next[y] = { ...yn, left: T2 }
  const parent = parentOf(nodes, root, y)
  let newRoot = root
  if (parent) {
    const pn = next[parent]
    if (pn.left === y) next[parent] = { ...pn, left: x }
    else next[parent] = { ...pn, right: x }
  } else {
    newRoot = x
  }
  return { nodes: next, root: newRoot }
}

function rotateLeft(nodes: Record<string, AVLNode>, root: string, x: string): { nodes: Record<string, AVLNode>; root: string } {
  const next = { ...nodes }
  const xn = next[x]
  const y = xn.right as string
  const yn = next[y]
  const T2 = yn.left
  next[y] = { ...yn, left: x }
  next[x] = { ...xn, right: T2 }
  const parent = parentOf(nodes, root, x)
  let newRoot = root
  if (parent) {
    const pn = next[parent]
    if (pn.left === x) next[parent] = { ...pn, left: y }
    else next[parent] = { ...pn, right: y }
  } else {
    newRoot = y
  }
  return { nodes: next, root: newRoot }
}

function applyRotation(nodes: Record<string, AVLNode>, root: string, phase: Phase & { kind: "rotate" }): { nodes: Record<string, AVLNode>; root: string } {
  const z = phase.atId
  if (phase.rotationType === "LL") return rotateRight(nodes, root, z)
  if (phase.rotationType === "RR") return rotateLeft(nodes, root, z)
  if (phase.rotationType === "LR") {
    const zn = nodes[z]
    const y = zn.left as string
    const afterLeft = rotateLeft(nodes, root, y)
    return rotateRight(afterLeft.nodes, afterLeft.root, z)
  }
  const zn = nodes[z]
  const y = zn.right as string
  const afterRight = rotateRight(nodes, root, y)
  return rotateLeft(afterRight.nodes, afterRight.root, z)
}

function computeLayout(
  nodes: Record<string, AVLNode>,
  root: string | null,
  width: number,
): Record<string, { x: number; y: number; depth: number }> {
  const order = inorderList(nodes, root)
  const pos: Record<string, { x: number; y: number; depth: number }> = {}
  const step = order.length > 1 ? (width - 80) / (order.length - 1) : 0
  order.forEach((id, i) => {
    const d = depthOf(nodes, root, id) ?? 0
    pos[id] = { x: 40 + i * step, y: 60 + d * 80, depth: d }
  })
  return pos
}

export default function AVLTopic() {
  const [state, setState] = React.useState<State>(INITIAL)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(800)

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.pending.length > 0) {
        const phase = s.pending[0]
        const rest = s.pending.slice(1)
        if (phase.kind === "rotate") {
          const { nodes: next, root: newRoot } = applyRotation(s.nodes, s.root as string, phase)
          const check = s.lastInserted ? detectUnbalanced(next, newRoot, s.nodes[s.lastInserted].value) : null
          const newPending = check ? [check, ...rest] : rest
          return {
            ...s,
            nodes: next,
            root: newRoot,
            pending: newPending,
            lastLabel: `${phase.rotationType} rotation at ${phase.atValue}`,
            highlightIds: [],
            rotationCount: s.rotationCount + 1,
            lastRotation: phase.rotationType,
          }
        }
        return s
      }
      if (s.scriptIndex >= SCRIPT.length) return s
      const value = SCRIPT[s.scriptIndex]
      const newId = `n${s.idSeq}`
      const { nodes: next, root: newRoot } = insertBST(s.nodes, s.root, value, newId)
      const needsRotation = detectUnbalanced(next, newRoot, value)
      const pending: Phase[] = needsRotation ? [needsRotation] : []
      return {
        ...s,
        nodes: next,
        root: newRoot,
        idSeq: s.idSeq + 1,
        scriptIndex: s.scriptIndex + 1,
        pending,
        lastLabel: `insert ${value}${needsRotation ? ` (|bf| > 1 at ${needsRotation.atValue}, queue ${needsRotation.rotationType})` : ""}`,
        highlightIds: needsRotation ? [needsRotation.atId] : [newId],
        insertCount: s.insertCount + 1,
        lastInserted: newId,
      }
    })
  }, [])

  const canStep = state.scriptIndex < SCRIPT.length || state.pending.length > 0
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(INITIAL)
  }

  const width = 760
  const layout = computeLayout(state.nodes, state.root, width)
  const ids = Object.keys(state.nodes)
  const height = heightOf(state.nodes, state.root)
  const svgHeight = Math.max(height, 1) * 80 + 80

  const nextDescription = (() => {
    if (state.pending.length > 0) {
      const p = state.pending[0]
      if (p.kind === "rotate") return `Apply ${p.rotationType} rotation at node ${p.atValue}.`
    }
    if (state.scriptIndex < SCRIPT.length) return `Insert ${SCRIPT[state.scriptIndex]} then check balance factors.`
    return "All insertions balanced. Reset to replay."
  })()

  return (
    <VizFrame
      topicNumber={14}
      category="Trees"
      title="AVL Tree Rotations"
      summary="Watch the balance factor drift, then snap back. When any node's |bf| > 1, AVL picks one of four rotations (LL, RR, LR, RL) to restore the height invariant."
      complexity="O(log n) guaranteed"
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
          <div className="flex-1 min-w-[340px]">
            <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
              AVL tree — each node shows value / bf
            </span>
            <svg width="100%" viewBox={`0 0 ${width} ${svgHeight}`}>
              {ids.map((id) => {
                const n = state.nodes[id]
                const pos = layout[id]
                if (!pos) return null
                if (n.left && layout[n.left]) {
                  const p = layout[n.left]
                  return (
                    <motion.line
                      key={`edge-l-${id}`}
                      initial={false}
                      animate={{ x1: pos.x, y1: pos.y, x2: p.x, y2: p.y }}
                      transition={{ duration: 0.5 }}
                      stroke={DENISON.stone}
                      strokeOpacity={0.4}
                      strokeWidth={2}
                    />
                  )
                }
                return null
              })}
              {ids.map((id) => {
                const n = state.nodes[id]
                const pos = layout[id]
                if (!pos) return null
                if (n.right && layout[n.right]) {
                  const p = layout[n.right]
                  return (
                    <motion.line
                      key={`edge-r-${id}`}
                      initial={false}
                      animate={{ x1: pos.x, y1: pos.y, x2: p.x, y2: p.y }}
                      transition={{ duration: 0.5 }}
                      stroke={DENISON.stone}
                      strokeOpacity={0.4}
                      strokeWidth={2}
                    />
                  )
                }
                return null
              })}
              <AnimatePresence>
                {ids.map((id) => {
                  const n = state.nodes[id]
                  const pos = layout[id]
                  if (!pos) return null
                  const bf = balanceOf(state.nodes, id)
                  const isUnbalanced = Math.abs(bf) > 1
                  const isHighlight = state.highlightIds.includes(id)
                  const fill = isHighlight ? DENISON.gold : isUnbalanced ? DENISON.red : DENISON.white
                  const stroke = isHighlight ? DENISON.goldDark : isUnbalanced ? DENISON.redDark : DENISON.redDark
                  const textColor = isUnbalanced && !isHighlight ? DENISON.white : DENISON.redDark
                  return (
                    <motion.g
                      key={id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: isHighlight ? 1.1 : 1, x: pos.x, y: pos.y }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <circle cx={0} cy={0} r={26} fill={fill} stroke={stroke} strokeWidth={2} />
                      <text
                        x={0}
                        y={-2}
                        textAnchor="middle"
                        fontSize={13}
                        fill={textColor}
                        fontFamily="Lora, serif"
                        fontWeight={600}
                      >
                        {n.value}
                      </text>
                      <text
                        x={0}
                        y={13}
                        textAnchor="middle"
                        fontSize={9}
                        fill={textColor}
                        fontFamily="Oswald, sans-serif"
                        letterSpacing="0.08em"
                      >
                        bf={bf}
                      </text>
                    </motion.g>
                  )
                })}
              </AnimatePresence>
            </svg>

            <div className="mt-2 min-h-6 font-body text-sm text-[color:var(--color-denison-red-dark)]">
              {state.lastLabel}
            </div>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="inserts" value={String(state.insertCount)} />
            <Stat label="rotations" value={String(state.rotationCount)} highlight={state.rotationCount > 0} />
            <Stat label="last rotation" value={state.lastRotation} />
            <Stat label="height" value={String(height)} />
            <Stat label="nodes" value={String(ids.length)} />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">{nextDescription}</p>
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
