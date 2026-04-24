import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

type Op = { kind: "insert"; value: number } | { kind: "search"; value: number }

const SCRIPT: Op[] = [
  { kind: "insert", value: 50 },
  { kind: "insert", value: 30 },
  { kind: "insert", value: 70 },
  { kind: "insert", value: 20 },
  { kind: "insert", value: 40 },
  { kind: "insert", value: 60 },
  { kind: "insert", value: 80 },
  { kind: "insert", value: 25 },
  { kind: "search", value: 40 },
  { kind: "search", value: 45 },
]

type TreeNode = {
  id: string
  value: number
  left: string | null
  right: string | null
  parent: string | null
  depth: number
}

type OpStatus = "walking" | "placed" | "found" | "missed"

type State = {
  nodes: Record<string, TreeNode>
  root: string | null
  step: number
  idSeq: number
  opIndex: number
  opPhaseStep: number
  currentId: string | null
  lastLabel: string
  status: OpStatus | null
  activeOp: Op | null
  path: string[]
  insertCount: number
  searchCount: number
  comparisons: number
}

const INITIAL: State = {
  nodes: {},
  root: null,
  step: 0,
  idSeq: 0,
  opIndex: 0,
  opPhaseStep: 0,
  currentId: null,
  lastLabel: "",
  status: null,
  activeOp: null,
  path: [],
  insertCount: 0,
  searchCount: 0,
  comparisons: 0,
}

function inorderList(nodes: Record<string, TreeNode>, root: string | null): string[] {
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

function computeLayout(
  nodes: Record<string, TreeNode>,
  root: string | null,
  width: number,
): Record<string, { x: number; y: number }> {
  const order = inorderList(nodes, root)
  const pos: Record<string, { x: number; y: number }> = {}
  const step = order.length > 1 ? (width - 80) / (order.length - 1) : 0
  order.forEach((id, i) => {
    const d = nodes[id].depth
    pos[id] = { x: 40 + i * step, y: 50 + d * 75 }
  })
  return pos
}

export default function BSTTopic() {
  const [state, setState] = React.useState<State>(INITIAL)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(750)

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.opIndex >= SCRIPT.length) return s
      const op = SCRIPT[s.opIndex]

      if (op.kind === "insert") {
        if (s.root === null) {
          const id = `n${s.idSeq}`
          const node: TreeNode = { id, value: op.value, left: null, right: null, parent: null, depth: 0 }
          return {
            ...s,
            nodes: { [id]: node },
            root: id,
            idSeq: s.idSeq + 1,
            step: s.step + 1,
            opIndex: s.opIndex + 1,
            opPhaseStep: 0,
            currentId: id,
            lastLabel: `insert ${op.value} at root`,
            status: "placed",
            activeOp: op,
            path: [id],
            insertCount: s.insertCount + 1,
          }
        }

        const walkFrom = s.currentId && s.activeOp && s.activeOp.kind === "insert" && s.activeOp.value === op.value
          ? s.currentId
          : s.root
        const current = s.nodes[walkFrom]
        if (op.value < current.value) {
          if (current.left) {
            return {
              ...s,
              step: s.step + 1,
              opPhaseStep: s.opPhaseStep + 1,
              currentId: current.left,
              lastLabel: `${op.value} < ${current.value} → go left`,
              status: "walking",
              activeOp: op,
              path: [...s.path, current.left],
              comparisons: s.comparisons + 1,
            }
          }
          const id = `n${s.idSeq}`
          const node: TreeNode = { id, value: op.value, left: null, right: null, parent: current.id, depth: current.depth + 1 }
          const updatedParent = { ...current, left: id }
          return {
            ...s,
            nodes: { ...s.nodes, [id]: node, [current.id]: updatedParent },
            idSeq: s.idSeq + 1,
            step: s.step + 1,
            opIndex: s.opIndex + 1,
            opPhaseStep: 0,
            currentId: id,
            lastLabel: `${op.value} < ${current.value} → place left`,
            status: "placed",
            activeOp: op,
            path: [...s.path, id],
            insertCount: s.insertCount + 1,
            comparisons: s.comparisons + 1,
          }
        }
        if (current.right) {
          return {
            ...s,
            step: s.step + 1,
            opPhaseStep: s.opPhaseStep + 1,
            currentId: current.right,
            lastLabel: `${op.value} > ${current.value} → go right`,
            status: "walking",
            activeOp: op,
            path: [...s.path, current.right],
            comparisons: s.comparisons + 1,
          }
        }
        const id = `n${s.idSeq}`
        const node: TreeNode = { id, value: op.value, left: null, right: null, parent: current.id, depth: current.depth + 1 }
        const updatedParent = { ...current, right: id }
        return {
          ...s,
          nodes: { ...s.nodes, [id]: node, [current.id]: updatedParent },
          idSeq: s.idSeq + 1,
          step: s.step + 1,
          opIndex: s.opIndex + 1,
          opPhaseStep: 0,
          currentId: id,
          lastLabel: `${op.value} > ${current.value} → place right`,
          status: "placed",
          activeOp: op,
          path: [...s.path, id],
          insertCount: s.insertCount + 1,
          comparisons: s.comparisons + 1,
        }
      }

      const walkFrom = s.currentId && s.activeOp && s.activeOp.kind === "search" && s.activeOp.value === op.value
        ? s.currentId
        : s.root
      if (!walkFrom) {
        return {
          ...s,
          step: s.step + 1,
          opIndex: s.opIndex + 1,
          opPhaseStep: 0,
          currentId: null,
          lastLabel: `search ${op.value}: empty tree`,
          status: "missed",
          activeOp: op,
          path: [],
          searchCount: s.searchCount + 1,
        }
      }
      const cur = s.nodes[walkFrom]
      const nextId = s.activeOp && s.activeOp.kind === "search" && s.activeOp.value === op.value ? walkFrom : s.root as string
      const startNode = s.nodes[nextId]
      const useNode = s.activeOp && s.activeOp.kind === "search" && s.activeOp.value === op.value ? cur : startNode

      if (op.value === useNode.value) {
        return {
          ...s,
          step: s.step + 1,
          opIndex: s.opIndex + 1,
          opPhaseStep: 0,
          currentId: useNode.id,
          lastLabel: `found ${op.value}`,
          status: "found",
          activeOp: op,
          path: s.activeOp && s.activeOp.kind === "search" && s.activeOp.value === op.value ? s.path : [useNode.id],
          searchCount: s.searchCount + 1,
          comparisons: s.comparisons + 1,
        }
      }
      if (op.value < useNode.value) {
        if (useNode.left) {
          return {
            ...s,
            step: s.step + 1,
            opPhaseStep: s.opPhaseStep + 1,
            currentId: useNode.left,
            lastLabel: `${op.value} < ${useNode.value} → go left`,
            status: "walking",
            activeOp: op,
            path: s.activeOp && s.activeOp.kind === "search" && s.activeOp.value === op.value
              ? [...s.path, useNode.left]
              : [useNode.id, useNode.left],
            comparisons: s.comparisons + 1,
          }
        }
        return {
          ...s,
          step: s.step + 1,
          opIndex: s.opIndex + 1,
          opPhaseStep: 0,
          currentId: useNode.id,
          lastLabel: `${op.value} not found (left is empty)`,
          status: "missed",
          activeOp: op,
          path: s.activeOp && s.activeOp.kind === "search" && s.activeOp.value === op.value ? s.path : [useNode.id],
          searchCount: s.searchCount + 1,
          comparisons: s.comparisons + 1,
        }
      }
      if (useNode.right) {
        return {
          ...s,
          step: s.step + 1,
          opPhaseStep: s.opPhaseStep + 1,
          currentId: useNode.right,
          lastLabel: `${op.value} > ${useNode.value} → go right`,
          status: "walking",
          activeOp: op,
          path: s.activeOp && s.activeOp.kind === "search" && s.activeOp.value === op.value
            ? [...s.path, useNode.right]
            : [useNode.id, useNode.right],
          comparisons: s.comparisons + 1,
        }
      }
      return {
        ...s,
        step: s.step + 1,
        opIndex: s.opIndex + 1,
        opPhaseStep: 0,
        currentId: useNode.id,
        lastLabel: `${op.value} not found (right is empty)`,
        status: "missed",
        activeOp: op,
        path: s.activeOp && s.activeOp.kind === "search" && s.activeOp.value === op.value ? s.path : [useNode.id],
        searchCount: s.searchCount + 1,
        comparisons: s.comparisons + 1,
      }
    })
  }, [])

  const canStep = state.opIndex < SCRIPT.length
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(INITIAL)
  }

  const width = 760
  const layout = computeLayout(state.nodes, state.root, width)
  const ids = Object.keys(state.nodes)
  const height = 60 + (ids.length > 0 ? Math.max(...ids.map((id) => state.nodes[id].depth)) + 1 : 1) * 75

  const nextOp = SCRIPT[state.opIndex]

  return (
    <VizFrame
      topicNumber={13}
      category="Trees"
      title="Binary Search Trees"
      summary="Each insert walks down — less goes left, greater goes right — and comes to rest at an empty slot. Then a search retraces the same style of walk to find (or miss) a key."
      complexity="avg O(log n), worst O(n)"
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
              BST — walk left for less, right for greater
            </span>
            <svg width="100%" viewBox={`0 0 ${width} ${Math.max(height, 180)}`}>
              {ids.map((id) => {
                const n = state.nodes[id]
                const pos = layout[id]
                if (!n.parent || !layout[n.parent]) return null
                const p = layout[n.parent]
                return (
                  <line
                    key={`edge-${id}`}
                    x1={p.x}
                    y1={p.y}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={DENISON.stone}
                    strokeOpacity={0.4}
                    strokeWidth={2}
                  />
                )
              })}
              <AnimatePresence>
                {ids.map((id) => {
                  const n = state.nodes[id]
                  const pos = layout[id]
                  const isCurrent = state.currentId === id
                  const onPath = state.path.includes(id) && !isCurrent
                  let fill = DENISON.white
                  let stroke = DENISON.redDark
                  if (isCurrent) {
                    if (state.status === "found") {
                      fill = DENISON.gold
                      stroke = DENISON.goldDark
                    } else if (state.status === "missed") {
                      fill = DENISON.red
                      stroke = DENISON.redDark
                    } else {
                      fill = DENISON.gold
                      stroke = DENISON.goldDark
                    }
                  } else if (onPath) {
                    fill = DENISON.cream
                  }
                  return (
                    <motion.g
                      key={id}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: isCurrent ? 1.1 : 1, x: pos.x, y: pos.y }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <circle cx={0} cy={0} r={24} fill={fill} stroke={stroke} strokeWidth={2} />
                      <text
                        x={0}
                        y={5}
                        textAnchor="middle"
                        fontSize={14}
                        fill={isCurrent && state.status === "missed" ? DENISON.white : DENISON.redDark}
                        fontFamily="Lora, serif"
                        fontWeight={600}
                      >
                        {n.value}
                      </text>
                    </motion.g>
                  )
                })}
              </AnimatePresence>
            </svg>

            <div className="mt-2 min-h-6 font-body text-sm text-[color:var(--color-denison-red-dark)]">
              {state.lastLabel || "—"}
            </div>
          </div>

          <div className="flex min-w-[220px] flex-col gap-2 rounded-md bg-[color:var(--color-denison-red)]/10 p-4">
            <Stat label="inserts" value={String(state.insertCount)} />
            <Stat label="searches" value={String(state.searchCount)} />
            <Stat label="comparisons" value={String(state.comparisons)} />
            <Stat label="nodes" value={String(ids.length)} />
            <Stat
              label="status"
              value={state.status ?? "—"}
              highlight={state.status === "found" || state.status === "missed"}
            />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">
            {nextOp
              ? `${nextOp.kind === "insert" ? "Insert" : "Search"} ${nextOp.value} — walk from the current node.`
              : "Script complete. Reset to replay the build-and-query sequence."}
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
