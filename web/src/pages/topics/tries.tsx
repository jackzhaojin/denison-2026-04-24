import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { VizFrame, VizControls, useStepRunner, DENISON } from "@/components/VizFrame"

const WORDS = ["car", "cart", "card", "dog", "do"]
const SEARCH_WORD = "cart"

type TrieNode = {
  id: string
  char: string
  parent: string | null
  children: Record<string, string>
  end: boolean
  depth: number
}

type Step =
  | { kind: "insert-char"; word: string; charIdx: number }
  | { kind: "insert-end"; word: string }
  | { kind: "search-char"; charIdx: number }
  | { kind: "search-done"; found: boolean }

type State = {
  nodes: Record<string, TrieNode>
  rootId: string
  idSeq: number
  stepIndex: number
  currentId: string | null
  lastLabel: string
  wordsInserted: number
  endMarkers: number
  searchHighlight: string[]
  searchStatus: "none" | "walking" | "found" | "missed"
}

const buildScript = (): Step[] => {
  const steps: Step[] = []
  WORDS.forEach((word) => {
    for (let i = 0; i < word.length; i++) {
      steps.push({ kind: "insert-char", word, charIdx: i })
    }
    steps.push({ kind: "insert-end", word })
  })
  for (let i = 0; i < SEARCH_WORD.length; i++) {
    steps.push({ kind: "search-char", charIdx: i })
  }
  steps.push({ kind: "search-done", found: true })
  return steps
}

const SCRIPT = buildScript()

function makeRoot(): TrieNode {
  return { id: "root", char: "·", parent: null, children: {}, end: false, depth: 0 }
}

const INITIAL: State = {
  nodes: { root: makeRoot() },
  rootId: "root",
  idSeq: 0,
  stepIndex: 0,
  currentId: "root",
  lastLabel: "Start at root. Words queued: " + WORDS.join(", "),
  wordsInserted: 0,
  endMarkers: 0,
  searchHighlight: [],
  searchStatus: "none",
}

function computeLayout(
  nodes: Record<string, TrieNode>,
  rootId: string,
  width: number,
): Record<string, { x: number; y: number }> {
  const leafCount = (id: string): number => {
    const n = nodes[id]
    const kids = Object.values(n.children)
    if (kids.length === 0) return 1
    return kids.reduce((acc, k) => acc + leafCount(k), 0)
  }
  const pos: Record<string, { x: number; y: number }> = {}
  const totalLeaves = Math.max(leafCount(rootId), 1)
  const slotWidth = (width - 80) / totalLeaves
  let cursor = 40

  const walk = (id: string, depth: number): number => {
    const n = nodes[id]
    const kids = Object.values(n.children)
    if (kids.length === 0) {
      const x = cursor + slotWidth / 2
      cursor += slotWidth
      pos[id] = { x, y: 40 + depth * 70 }
      return x
    }
    const xs = kids.map((k) => walk(k, depth + 1))
    const avg = xs.reduce((a, b) => a + b, 0) / xs.length
    pos[id] = { x: avg, y: 40 + depth * 70 }
    return avg
  }
  walk(rootId, 0)
  return pos
}

export default function TriesTopic() {
  const [state, setState] = React.useState<State>(INITIAL)
  const [playing, setPlaying] = React.useState(false)
  const [speedMs, setSpeedMs] = React.useState(700)

  const step = React.useCallback(() => {
    setState((s) => {
      if (s.stepIndex >= SCRIPT.length) return s
      const action = SCRIPT[s.stepIndex]

      if (action.kind === "insert-char") {
        const prevId = action.charIdx === 0 ? s.rootId : s.currentId ?? s.rootId
        const baseId = action.charIdx === 0 ? s.rootId : prevId
        const prev = s.nodes[baseId]
        const ch = action.word[action.charIdx]
        const existing = prev.children[ch]
        if (existing) {
          return {
            ...s,
            stepIndex: s.stepIndex + 1,
            currentId: existing,
            lastLabel: `insert "${action.word}" — follow existing edge '${ch}'`,
          }
        }
        const newId = `t${s.idSeq}`
        const newNode: TrieNode = {
          id: newId,
          char: ch,
          parent: baseId,
          children: {},
          end: false,
          depth: prev.depth + 1,
        }
        const updatedParent: TrieNode = {
          ...prev,
          children: { ...prev.children, [ch]: newId },
        }
        return {
          ...s,
          nodes: { ...s.nodes, [newId]: newNode, [baseId]: updatedParent },
          idSeq: s.idSeq + 1,
          stepIndex: s.stepIndex + 1,
          currentId: newId,
          lastLabel: `insert "${action.word}" — create new edge '${ch}'`,
        }
      }

      if (action.kind === "insert-end") {
        const curId = s.currentId ?? s.rootId
        const cur = s.nodes[curId]
        const updated: TrieNode = { ...cur, end: true }
        return {
          ...s,
          nodes: { ...s.nodes, [curId]: updated },
          stepIndex: s.stepIndex + 1,
          currentId: s.rootId,
          lastLabel: `mark "${action.word}" as a complete word`,
          wordsInserted: s.wordsInserted + 1,
          endMarkers: cur.end ? s.endMarkers : s.endMarkers + 1,
        }
      }

      if (action.kind === "search-char") {
        const prevId = action.charIdx === 0 ? s.rootId : s.currentId ?? s.rootId
        const prev = s.nodes[prevId]
        const ch = SEARCH_WORD[action.charIdx]
        const nextId = prev.children[ch]
        if (nextId) {
          return {
            ...s,
            stepIndex: s.stepIndex + 1,
            currentId: nextId,
            searchHighlight: action.charIdx === 0 ? [s.rootId, nextId] : [...s.searchHighlight, nextId],
            searchStatus: "walking",
            lastLabel: `search "${SEARCH_WORD}" — match '${ch}' at depth ${prev.depth + 1}`,
          }
        }
        return {
          ...s,
          stepIndex: SCRIPT.length,
          searchStatus: "missed",
          lastLabel: `search "${SEARCH_WORD}" — '${ch}' missing, abort`,
        }
      }

      const curId = s.currentId ?? s.rootId
      const cur = s.nodes[curId]
      return {
        ...s,
        stepIndex: s.stepIndex + 1,
        searchStatus: cur.end ? "found" : "missed",
        lastLabel: cur.end ? `"${SEARCH_WORD}" found (end-of-word)` : `"${SEARCH_WORD}" is only a prefix, not a word`,
      }
    })
  }, [])

  const canStep = state.stepIndex < SCRIPT.length
  useStepRunner(step, canStep, speedMs, playing)

  const reset = () => {
    setPlaying(false)
    setState(INITIAL)
  }

  const width = 760
  const layout = computeLayout(state.nodes, state.rootId, width)
  const ids = Object.keys(state.nodes)
  const maxDepth = ids.reduce((acc, id) => Math.max(acc, state.nodes[id].depth), 0)
  const svgHeight = 80 + maxDepth * 70

  const nextAction = SCRIPT[state.stepIndex]
  const nextText = (() => {
    if (!nextAction) return "Script complete. Reset to replay."
    if (nextAction.kind === "insert-char") return `Insert '${nextAction.word[nextAction.charIdx]}' for word "${nextAction.word}".`
    if (nextAction.kind === "insert-end") return `Mark "${nextAction.word}" as a complete word.`
    if (nextAction.kind === "search-char") return `Search — follow '${SEARCH_WORD[nextAction.charIdx]}'.`
    return `Search — report result.`
  })()

  return (
    <VizFrame
      topicNumber={16}
      category="Trees"
      title="Tries (Prefix Trees)"
      summary="A trie indexes words by character. Insertion grows a path; search walks the path; prefix queries answer with a subtree."
      complexity="insert/search O(m) where m = key length"
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
              Trie — edges labeled with characters, gold dot = end-of-word
            </span>
            <svg width="100%" viewBox={`0 0 ${width} ${Math.max(svgHeight, 200)}`}>
              {ids.map((id) => {
                const n = state.nodes[id]
                if (!n.parent) return null
                const p = layout[n.parent]
                const c = layout[id]
                if (!p || !c) return null
                const onSearchPath =
                  state.searchHighlight.includes(id) && state.searchHighlight.includes(n.parent)
                return (
                  <g key={`edge-${id}`}>
                    <line
                      x1={p.x}
                      y1={p.y}
                      x2={c.x}
                      y2={c.y}
                      stroke={onSearchPath ? DENISON.goldDark : DENISON.stone}
                      strokeOpacity={onSearchPath ? 1 : 0.4}
                      strokeWidth={onSearchPath ? 3 : 2}
                    />
                    <text
                      x={(p.x + c.x) / 2 + 8}
                      y={(p.y + c.y) / 2}
                      fontSize={13}
                      fill={DENISON.redDark}
                      fontFamily="Lora, serif"
                      fontWeight={600}
                    >
                      {n.char}
                    </text>
                  </g>
                )
              })}
              <AnimatePresence>
                {ids.map((id) => {
                  const n = state.nodes[id]
                  const pos = layout[id]
                  if (!pos) return null
                  const isCurrent = state.currentId === id && state.stepIndex < SCRIPT.length
                  const isOnSearch = state.searchHighlight.includes(id)
                  const isSearchEnd =
                    state.searchStatus !== "none" &&
                    state.searchHighlight.length > 0 &&
                    state.searchHighlight[state.searchHighlight.length - 1] === id
                  let fill = DENISON.white
                  let stroke = DENISON.redDark
                  if (isSearchEnd && state.searchStatus === "found") {
                    fill = DENISON.gold
                    stroke = DENISON.goldDark
                  } else if (isSearchEnd && state.searchStatus === "missed") {
                    fill = DENISON.red
                    stroke = DENISON.redDark
                  } else if (isCurrent || isOnSearch) {
                    fill = DENISON.gold
                    stroke = DENISON.goldDark
                  }
                  return (
                    <motion.g
                      key={id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: isCurrent ? 1.1 : 1, x: pos.x, y: pos.y }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <circle cx={0} cy={0} r={18} fill={fill} stroke={stroke} strokeWidth={2} />
                      {n.end && (
                        <circle cx={0} cy={0} r={7} fill={DENISON.gold} stroke={DENISON.goldDark} strokeWidth={1} />
                      )}
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
            <Stat label="nodes" value={String(ids.length)} />
            <Stat label="words inserted" value={`${state.wordsInserted} / ${WORDS.length}`} />
            <Stat label="end markers" value={String(state.endMarkers)} />
            <Stat
              label="search"
              value={state.searchStatus}
              highlight={state.searchStatus === "found" || state.searchStatus === "missed"}
            />
          </div>
        </div>

        <div className="rounded-md bg-[color:var(--color-denison-red-dark)] p-4">
          <span className="font-eyebrow text-[10px] text-gold">Next step</span>
          <p className="font-body text-sm text-white">{nextText}</p>
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
