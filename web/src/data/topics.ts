export type TopicCategory =
  | "Analysis"
  | "Linear"
  | "Sort & Search"
  | "Hashing"
  | "Trees"
  | "Graphs"

export type Topic = {
  id: number
  slug: string
  title: string
  category: TopicCategory
  blurb: string
  complexity: string
}

export const TOPICS: Topic[] = [
  { id: 1, slug: "big-o", title: "Big-O & Asymptotic Analysis", category: "Analysis",
    blurb: "Growth rates, worst/avg/best case, amortized analysis.",
    complexity: "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)" },
  { id: 2, slug: "recursion", title: "Recursion & Divide-and-Conquer", category: "Analysis",
    blurb: "Call stacks, memoization, divide-and-conquer template.",
    complexity: "Fib naive O(2ⁿ) → memo O(n)" },
  { id: 3, slug: "arrays", title: "Dynamic Arrays", category: "Linear",
    blurb: "Capacity doubling, amortized O(1) push.",
    complexity: "push amortized O(1), access O(1)" },
  { id: 4, slug: "linked-lists", title: "Linked Lists", category: "Linear",
    blurb: "Singly, doubly, circular — pointer surgery.",
    complexity: "insert O(1) at known node, search O(n)" },
  { id: 5, slug: "stacks", title: "Stacks (LIFO)", category: "Linear",
    blurb: "Push/pop — balanced parens, expression eval.",
    complexity: "push/pop O(1)" },
  { id: 6, slug: "queues", title: "Queues & Deques", category: "Linear",
    blurb: "Circular buffer FIFO, double-ended deque.",
    complexity: "enqueue/dequeue O(1)" },
  { id: 7, slug: "iterators", title: "Iterators & ADTs", category: "Linear",
    blurb: "Contract vs implementation — traversal protocol.",
    complexity: "next() O(1), full pass O(n)" },
  { id: 8, slug: "sorting", title: "Sorting Algorithms", category: "Sort & Search",
    blurb: "Merge, quick, insertion, bubble — compare live.",
    complexity: "O(n log n) best comparison sort" },
  { id: 9, slug: "searching", title: "Binary Search", category: "Sort & Search",
    blurb: "Halving the search space — off-by-one pitfalls.",
    complexity: "O(log n)" },
  { id: 10, slug: "hash-functions", title: "Hash Functions", category: "Hashing",
    blurb: "Distribute keys uniformly across buckets.",
    complexity: "O(1) expected lookup" },
  { id: 11, slug: "collisions", title: "Collision Resolution", category: "Hashing",
    blurb: "Chaining vs open addressing (linear probing).",
    complexity: "O(1) avg, O(n) worst" },
  { id: 12, slug: "binary-trees", title: "Binary Tree Traversals", category: "Trees",
    blurb: "Inorder, preorder, postorder, level-order.",
    complexity: "O(n) traversal" },
  { id: 13, slug: "bst", title: "Binary Search Trees", category: "Trees",
    blurb: "Insert, search, delete with inorder successor.",
    complexity: "O(log n) avg, O(n) worst" },
  { id: 14, slug: "avl", title: "AVL Tree Rotations", category: "Trees",
    blurb: "Self-balancing: LL, RR, LR, RL rotations.",
    complexity: "O(log n) guaranteed" },
  { id: 15, slug: "heaps", title: "Binary Heap / Priority Queue", category: "Trees",
    blurb: "Sift-up, sift-down, heapify, heapsort.",
    complexity: "insert/extract O(log n), build O(n)" },
  { id: 16, slug: "tries", title: "Tries (Prefix Trees)", category: "Trees",
    blurb: "Character-indexed tree for autocomplete.",
    complexity: "insert/search O(m) in key length" },
  { id: 17, slug: "graphs", title: "Graph Representations", category: "Graphs",
    blurb: "Adjacency matrix vs adjacency list tradeoffs.",
    complexity: "matrix O(V²), list O(V+E)" },
  { id: 18, slug: "bfs-dfs", title: "BFS, DFS & Topological Sort", category: "Graphs",
    blurb: "Breadth-first, depth-first, dependency order.",
    complexity: "O(V + E)" },
  { id: 19, slug: "shortest-path", title: "Dijkstra & MST", category: "Graphs",
    blurb: "Shortest path + minimum spanning tree.",
    complexity: "Dijkstra O((V+E) log V)" },
  { id: 20, slug: "union-find", title: "Union-Find / Connected Components", category: "Graphs",
    blurb: "Disjoint-set union with path compression.",
    complexity: "~O(α(n)) per op" },
]

export const CATEGORIES: { name: TopicCategory; order: number }[] = [
  { name: "Analysis", order: 1 },
  { name: "Linear", order: 2 },
  { name: "Sort & Search", order: 3 },
  { name: "Hashing", order: 4 },
  { name: "Trees", order: 5 },
  { name: "Graphs", order: 6 },
]

export function groupedTopics() {
  return CATEGORIES.map((cat) => ({
    category: cat.name,
    topics: TOPICS.filter((t) => t.category === cat.name),
  }))
}

export function topicBySlug(slug: string) {
  return TOPICS.find((t) => t.slug === slug)
}
