# CS 271 — Data Structures: Topic Breakdown

_Reference compiled 2026-04-23 for Denison-style CS 271 coursework. Synthesizes
Denison's publicly posted syllabus (Prof. Matt Kretchmar) with patterns from
Oberlin, Ohio Wesleyan, and other peer liberal-arts / mid-size CS programs._

---

## 1. Course structure at a glance

### Prerequisites (Denison)

- **CS 173 — Intermediate Computer Science** (the OOP / ADT course that follows
  one of the intro electives CS 109/111/112/113/114)
- **MATH 135 or MATH 145** (Calculus) **or CS 234 — Mathematical Foundations of
  Computer Science** (proof techniques, discrete math, automata) **or MATH 300**

Peer schools follow the same pattern: one semester of intro programming
(Python or Java), one semester of a CS2-style OOP/ADT course, and discrete math
either as a co-req or prereq.

### Follow-on courses CS 271 unlocks (Denison)

CS 314 Game Design · CS 323 Data Privacy · CS 333 Big Data Algorithms ·
CS 334 Theory of Computation · CS 335 Probability & Graph Theory ·
CS 339 AI · CS 349 Software Engineering · **CS 371 Algorithm Design & Analysis** ·
**CS 372 Operating Systems** · CS 373 Programming Languages ·
CS 374 Compilers · CS 375 Computer Networks · CS 377 Database Systems ·
CS 391 Robotics.

### Language of instruction

Primary language is typically **C++ or Java** (for manual memory / pointer-aware
ADT implementation). At Denison, Kretchmar's syllabus additionally requires
**LISP** for a functional-programming unit and **LaTeX** for written work.
Oberlin and Ohio Wesleyan peers commonly use Java or Python (Goodrich–Tamassia–
Goldwasser). The key invariant is that students implement ADTs from scratch
rather than just use library containers.

### Typical 15-week schedule

| Weeks | Topic                                                                   |
| ----- | ----------------------------------------------------------------------- |
| 1     | Review of ADTs, asymptotic analysis, Big-O/Θ/Ω                          |
| 2     | Recurrence relations, proof by induction, loop invariants               |
| 3     | Arrays, linked lists, iterators                                         |
| 4     | **Stacks and Queues** (array- and linked-based)                         |
| 5     | Recursion, divide-and-conquer; mergesort, quicksort                     |
| 6     | Heaps and priority queues; heapsort — **Midterm 1**                     |
| 7     | Hash tables, hash functions, collision resolution                       |
| 8     | Binary search trees                                                     |
| 9     | Balanced trees: AVL and red-black trees                                 |
| 10    | Graph representations; BFS, DFS                                         |
| 11    | Shortest paths (Dijkstra), MST (Prim / Kruskal) — **Midterm 2**         |
| 12    | Dynamic programming                                                     |
| 13    | Functional programming unit (LISP at Denison)                           |
| 14    | Advanced topic / review (tries, B-trees, or amortized analysis)         |
| 15    | Review and **Final Exam**                                               |

### Typical grading breakdown

Most peer sections use a conventional split roughly like:

- Programming projects / labs: **40–50%**
- Written homework / problem sets: **10–15%**
- Midterm exams (2): **20–25%**
- Final exam: **15–20%**
- Participation / quizzes: **5%**

**Denison note:** Kretchmar's section uses a **competency / portfolio** scheme
with six competencies (Stacks & Queues; Heaps & Hashing; Graphs & Trees;
Programming Schemes; Theory & Analysis; Professionalism), each assessed at
Proficiency / Mastery / Mastery with Distinction rather than a numeric
percentage split. The final exam is still required and can adjust borderline
grades.

### Typical major projects (2–4 per semester)

1. **Expression evaluator / calculator** — infix-to-postfix using stacks and queues (weeks 3–5).
2. **Priority queue application** — event-driven simulator or Huffman encoder using a heap (weeks 6–8).
3. **Hash-table or BST-backed search engine / symbol table** — spell-checker, autocomplete, or indexer (weeks 9–11).
4. **Graph project** — maze solver, GPS shortest-path, or social-network analyzer using BFS/DFS and Dijkstra (weeks 12–14).

A dynamic-programming problem (edit distance, knapsack) is frequently folded
into the final project or a written assignment.

### Common textbooks

- **Cormen, Leiserson, Rivest & Stein, _Introduction to Algorithms_ (3rd/4th ed.)** — used at Denison (Kretchmar) and many peers.
- **Goodrich, Tamassia & Goldwasser, _Data Structures and Algorithms in Python_ (or Java)** — the dominant liberal-arts textbook.
- **Weiss, _Data Structures and Algorithm Analysis in C++ / Java_** — common at schools where CS2 is in C++/Java.
- **Sedgewick & Wayne, _Algorithms_ (4th ed.)** — used at Princeton-adjacent curricula and some peers.
- **Carrano & Henry, _Data Abstraction and Problem Solving_** — ADT-first pedagogy.
- **Drozdek, _Data Structures and Algorithms in C++_** — common at mid-tier programs.

---

## 2. Topic-by-topic breakdown (20 common coursework topics)

Each entry below lists typical subtopics, complexity focus, canonical
assignments, and (where useful) what CS 271 typically defers to CS 371
(Algorithms) or later systems courses.

### Topic 1 — Algorithm analysis (Big-O, Θ, Ω)

- **Subtopics:** formal asymptotic definitions with c and n₀; worst / average /
  best case; amortized analysis (aggregate method via dynamic-array doubling);
  recurrence relations (substitution, recursion trees, intro Master Theorem
  T(n) = aT(n/b) + f(n)); growth hierarchy O(1) < O(log n) < O(n) < O(n log n)
  < O(n²) < O(2ⁿ) < O(n!).
- **Common assignments:** derive Big-O for given pseudocode, solve
  T(n) = 2T(n/2) + n by substitution, empirical timing lab (plot runtime vs. n
  and compare to theoretical curves).
- **Exam focus:** identifying Big-O from code, comparing growth rates, simple
  Master Theorem applications, proving f(n) = O(g(n)) from definitions.

### Topic 2 — Recursion and divide-and-conquer

- **Subtopics:** recursion vs. iteration trade-offs; call-stack mechanics
  (stack frames, stack overflow); tail recursion (brief); divide-and-conquer
  template (split → solve subproblems → combine); memoization / DP intro via
  naive vs. memoized Fibonacci.
- **Complexity:** naive Fibonacci O(2ⁿ) vs. memoized O(n); Tower of Hanoi
  O(2ⁿ); recursive binary search O(log n) with O(log n) stack depth.
- **Assignments:** factorial, Fibonacci (naive + memoized), Tower of Hanoi,
  recursive maze / permutation / subset generation, converting a recursive
  function to iterative with an explicit stack.

### Topic 3 — Arrays (static and dynamic)

- **Subtopics:** fixed-size static arrays; row-major vs. column-major layout;
  dynamic arrays (`ArrayList` / `vector` / `list`); `append`, `insert(i)`,
  `remove(i)`, `get(i)`, `set(i)`; capacity vs. size; geometric resizing
  (doubling); amortized analysis.
- **Complexity exercises:** prove `append` is amortized O(1) via the aggregate
  or accounting method; compare O(1) random access vs. O(n) middle insertion;
  show why growth by a constant (+10) yields O(n) amortized append while
  doubling yields O(1).
- **Assignments:** implement `MyVector` / `ArrayList` from scratch with
  automatic resizing; contact-book CRUD app backed by a dynamic array;
  benchmark resize strategies.

### Topic 4 — Linked lists (singly, doubly, circular)

- **Subtopics:** node classes; head / tail pointers; singly vs. doubly linked;
  circular variants; sentinel / dummy nodes; `insertFront`, `insertBack`,
  `insertAfter`, `deleteNode`, `reverse`, `findMiddle`, Floyd's cycle detection.
- **Complexity:** O(1) head insert vs. O(n) tail insert without a tail pointer;
  O(n) search; O(1) deletion given a node reference in a doubly linked list.
- **Assignments:** implement a generic doubly linked list; reverse a singly
  linked list iteratively and recursively; merge two sorted lists; LRU cache
  skeleton (often previewed here).

### Topic 5 — Stacks

- **Subtopics:** LIFO semantics; `push`, `pop`, `peek/top`, `isEmpty`;
  array-backed and linked-list-backed implementations.
- **Complexity:** all core ops O(1); amortized O(1) push for a resizing array
  stack.
- **Assignments:** balanced-parentheses / bracket checker; infix-to-postfix
  conversion (shunting-yard); postfix expression evaluator; undo-stack for a
  text editor; maze solver using an explicit stack.

### Topic 6 — Queues and deques (incl. intro priority queues)

- **Subtopics:** FIFO semantics; `enqueue`, `dequeue`, `front`; circular-array
  (ring buffer) with wrap-around modular arithmetic; linked-list queue with
  head + tail; deques (`pushFront` / `pushBack` / `popFront` / `popBack`);
  intro priority queues (unsorted array first — heap-based deferred to the
  trees unit).
- **Complexity:** prove O(1) enqueue/dequeue for circular-array and linked
  implementations; contrast with naive array queue that shifts (O(n)); O(n)
  insert for unsorted-array PQ vs. O(log n) teaser for heap PQ.
- **Assignments:** ring-buffer queue; printer / call-center queue simulator;
  sliding-window maximum using a deque; round-robin CPU scheduling simulation.

### Topic 7 — Iterators and the ADT vs. implementation distinction

- **Subtopics:** ADT (interface / contract) vs. concrete data structure; Java
  `Iterator` / `Iterable`, C++ iterator categories (input, forward,
  bidirectional, random-access), Python `__iter__` / `__next__`; fail-fast
  iterators and concurrent-modification; generic programming via templates or
  generics.
- **Complexity:** per-element `next()` is O(1); full traversal is O(n);
  iterator invalidation after insert / remove.
- **Assignments:** add a working iterator to a custom linked list or dynamic
  array; implement an `Iterable` generic `List<T>` with two concrete backing
  stores; write a filtering / mapping lazy iterator.

### Topic 8 — Sorting

- **O(n²) sorts:** bubble, selection, insertion (insertion is adaptive — O(n)
  on nearly sorted).
- **O(n log n) sorts:** merge sort (stable, O(n) extra space); quicksort
  (in-place, pivot strategies first / last / random / median-of-three;
  partitioning schemes Lomuto and Hoare).
- **Heap sort:** build-heap O(n), repeated extract-max, O(n log n) worst case,
  in-place, not stable.
- **Non-comparison sorts (brief):** counting sort O(n+k), radix sort
  O(d(n+k)); Ω(n log n) lower bound for comparison sorts.
- **Properties:** stability, in-place, adaptive.

| Sort      | Best      | Avg       | Worst     | Space    | Stable |
| --------- | --------- | --------- | --------- | -------- | ------ |
| Bubble    | n         | n²        | n²        | 1        | yes    |
| Selection | n²        | n²        | n²        | 1        | no     |
| Insertion | n         | n²        | n²        | 1        | yes    |
| Merge     | n log n   | n log n   | n log n   | n        | yes    |
| Quick     | n log n   | n log n   | n²        | log n    | no     |
| Heap      | n log n   | n log n   | n log n   | 1        | no     |

- **Assignments:** implement merge sort and benchmark against quicksort with
  different pivot strategies; fill in a comparison table; measure insertion
  sort on sorted / reverse / random input.

### Topic 9 — Searching

- **Subtopics:** linear search O(n); binary search O(log n) (iterative and
  recursive, lo/hi/mid boundary bugs); binary search on answer space (intro);
  BST search (briefly, O(log n) average / O(n) worst) — full coverage in the
  trees unit.
- **Assignments:** iterative and recursive binary search with not-found
  handling; find first / last occurrence of a duplicate key via modified binary
  search; compare linear vs. binary search empirically.

### Topic 10 — Hash functions

- **Subtopics:** properties (deterministic, uniform, fast, avalanche);
  division method `h(k) = k mod m` (with prime m); multiplication method
  `h(k) = floor(m * (k*A mod 1))`; intro to universal hashing; polynomial
  rolling hash for strings.
- **Assignments:** implement and empirically compare distributions of several
  hash functions on real-world keys.
- **Deferred to CS 371 / systems:** cryptographic hashes, tabulation hashing,
  rigorous analysis of universal family guarantees.

### Topic 11 — Collision resolution and rehashing

- **Separate chaining:** each bucket holds a linked list (or dynamic array);
  average O(1 + α) per op (α = n/m); worst O(n).
- **Open addressing:** linear probing, quadratic probing, double hashing;
  deletion via tombstones; primary vs. secondary clustering; average
  O(1/(1−α)) probes for successful search with linear probing.
- **Rehashing:** load-factor thresholds (~0.7 open addressing, ~1.0+ chaining);
  doubling and rehashing; single rehash O(n) but amortized O(1) per insert.
- **Assignments:** hash table with open-addressing + tombstones; chaining
  equivalent; auto-resize when α exceeds a threshold; LRU cache via hash map
  + doubly linked list; word-frequency counter.
- **Deferred:** cuckoo, hopscotch, Robin Hood hashing, consistent hashing,
  bloom filters.

### Topic 12 — Binary trees (traversals and recursion on trees)

- **Subtopics:** terminology (root, leaf, height, depth; full / complete /
  perfect); inorder, preorder, postorder (recursive + iterative with a stack);
  level-order (BFS with a queue); recursive problems like height, node count,
  mirror / invert, path sum.
- **Complexity:** traversal O(n); height O(n).
- **Assignments:** all four traversals recursively and iteratively; compute
  height and check balance; serialize / deserialize a binary tree.

### Topic 13 — Binary search trees (BSTs)

- **Subtopics:** insert, search, delete (three-case delete: leaf, one child,
  two children via inorder successor); predecessor / successor; min / max;
  inorder traversal yields sorted order.
- **Complexity:** search / insert / delete best and average O(log n), worst
  O(n) on degenerate / skewed trees.
- **Assignments:** BST with full insert / search / delete; validate whether an
  arbitrary tree is a BST; build a simple ordered set or map ADT on top of a
  BST.

### Topic 14 — Balanced trees (AVL, brief red-black)

- **Subtopics:** balance factor, height invariant (|bf| ≤ 1); four rotation
  cases LL / RR / LR / RL; insertion with rebalancing; deletion rebalancing
  (sometimes optional); brief red-black mention (backs `std::map`, Java
  `TreeMap`) and 2-3 trees.
- **Complexity:** search / insert / delete O(log n) guaranteed; rotation O(1).
- **Assignments:** implement an AVL tree with insert and rotations; trace
  rotations on paper for a given insertion sequence.

### Topic 15 — Heaps and priority queues

- **Subtopics:** binary heap as a complete tree stored in an array (parent /
  child index arithmetic); min-heap vs. max-heap; `siftUp` after insert,
  `siftDown` after extract-min/max; `heapify` (bottom-up build); heapsort.
- **Complexity:** insert / extract-min O(log n); peek O(1); build-heap O(n);
  heapsort O(n log n) worst case, in-place.
- **Assignments:** min-heap PQ supporting insert / peek / extractMin; heapsort;
  top-k elements of a stream via a heap.

### Topic 16 — Tries (prefix trees) and tree-based filesystem models

- **Tries:** character-indexed children; `insert`, `search`, `startsWith`;
  insert / search / prefix lookup O(m) where m = key length; space
  O(alphabet × total chars). Common assignment: autocomplete on a dictionary;
  word-break or spell-check mini-project.
- **Filesystem trees:** n-ary tree where directories are internal nodes and
  files are leaves; recursive traversal for `ls -R`, `du`, path resolution;
  brief mention of B-trees / B+ trees in real filesystems and databases.
  Common assignment: mini in-memory filesystem with `mkdir`, `cd`, `ls`,
  `find`; compute total size of a directory subtree recursively.

### Topic 17 — Graph representations

- **Subtopics:** adjacency matrix, adjacency list, edge list; directed vs.
  undirected; weighted vs. unweighted.
- **Tradeoffs:** adjacency matrix — O(V²) space, O(1) edge lookup, O(V) to
  enumerate neighbors (good for dense); adjacency list — O(V + E) space,
  O(deg(v)) edge lookup and neighbor enumeration (good for sparse).
- **Assignments:** Graph ADT supporting both representations; measure
  space / time on sparse vs. dense inputs.

### Topic 18 — BFS, DFS, and topological sort

- **BFS / DFS:** iterative BFS with a queue; recursive and stack-based DFS;
  discovery / finish times; BFS tree vs. DFS tree; tracking `visited`,
  `parent`, `dist`. Complexity O(V + E) on adjacency lists (O(V²) on
  matrices).
- **Topological sort:** Kahn's algorithm (BFS on in-degrees); DFS-based via
  finish-time stack; cycle detection falls out. Complexity O(V + E).
- **Assignments:** BFS for shortest unweighted path; DFS for cycle detection
  or edge classification (tree / back / forward / cross) in directed graphs;
  course-prerequisite ordering or build-system dependency resolution.

### Topic 19 — Shortest paths and MST (Dijkstra, Prim, Kruskal)

- **Dijkstra:** single-source shortest path on non-negative weighted graphs;
  relaxation; PQ-based. Binary heap + adjacency list is O((V + E) log V);
  array-based is O(V²).
- **Prim (with binary heap):** O(E log V). **Kruskal:** O(E log E), dominated
  by edge sorting, typically paired with an intro union-find implementation
  (path compression, union by rank).
- **Assignments:** Dijkstra with a binary heap on a road-network or routing
  problem; MST for a network-design problem.
- **Deferred to CS 371:** Bellman-Ford (negative edges), Floyd-Warshall
  (all-pairs), A*, Johnson's algorithm, Fibonacci-heap analysis, Borůvka,
  randomized linear-time MST.

### Topic 20 — Connected components and union-find

- **Subtopics:** undirected connectivity via BFS / DFS flood-fill; component
  labeling; union-find (disjoint-set union) for dynamic connectivity with path
  compression and union by rank — near-O(α(n)) per op.
- **Assignments:** count components in a grid or social-network graph;
  dynamic-connectivity data structure as a small project.
- **Deferred to CS 371:** strongly connected components (Kosaraju, Tarjan),
  biconnected components, articulation points / bridges.

---

## 3. What typically gets deferred to CS 371 (Algorithm Design & Analysis)

Useful to know the seam between 271 and 371 so you don't spend time on
topics that belong to the next course:

- Formal proofs of edge-classification theorems, DFS time-stamp theorems.
- Bellman-Ford, Floyd-Warshall, A*, Johnson's, Fibonacci-heap analysis.
- Borůvka's MST, randomized linear-time MST, rigorous cut / cycle proofs.
- Tarjan / Kosaraju strongly-connected components, biconnected components,
  articulation points and bridges.
- Advanced hashing (cuckoo, hopscotch, Robin Hood, consistent hashing, bloom
  filters, count-min sketch).
- Rigorous amortized-analysis accounting / potential methods.
- Greedy correctness proofs (exchange argument), full dynamic-programming
  theory, NP-completeness.

---

## Sources

- Denison CS 271 Syllabus (Prof. Matt Kretchmar):
  http://personal.denison.edu/~kretchmar/PKAL/CS271_Syllabus_Portfolio.pdf
- Denison CS course catalog:
  https://denison.edu/academics/computer-science/courses
- Denison CS 271 course page (Studocu index):
  https://www.studocu.com/en-us/course/denison-university/data-structures/466290
- Textbook references: Weiss; Goodrich–Tamassia–Goldwasser; Sedgewick & Wayne;
  Carrano & Henry; Drozdek; CLRS.
