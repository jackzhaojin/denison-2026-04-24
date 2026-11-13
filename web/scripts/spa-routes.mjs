// Writes a copy of dist/index.html at every route the app has, so GitHub Pages answers a
// deep link with 200. Without it only the root has a file: /topic/queues falls through to
// 404.html, which shows the app but with status 404, and search engines file the page as
// "Not found". GitHub Pages serves /topic/queues from topic/queues.html, with no redirect.
// Runs after `vite build` (package.json "build"). The routes are the ones in src/App.tsx:
// /how-this-was-built and /topic/<slug> for every slug in src/data/topics.ts.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const web = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(web, "dist")
const index = path.join(dist, "index.html")
if (!fs.existsSync(index)) {
  console.error("spa-routes: dist/index.html is missing; run vite build first")
  process.exit(1)
}

const topics = fs.readFileSync(path.join(web, "src/data/topics.ts"), "utf8")
const slugs = [...topics.matchAll(/\bslug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1])
if (!slugs.length) {
  console.error("spa-routes: no topic slugs found in src/data/topics.ts")
  process.exit(1)
}

const routes = ["how-this-was-built", ...slugs.map((slug) => `topic/${slug}`)]
for (const route of routes) {
  const file = path.join(dist, `${route}.html`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.copyFileSync(index, file)
}
console.log(`spa-routes: ${routes.length} route files written to dist/`)
