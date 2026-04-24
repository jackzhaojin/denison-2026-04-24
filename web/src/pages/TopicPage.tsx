import { useParams } from "react-router-dom"
import * as React from "react"
import { topicBySlug } from "@/data/topics"
import { NotFoundPage } from "@/pages/NotFoundPage"

const topicModules = import.meta.glob("./topics/*.tsx")
const lazyCache = new Map<string, React.LazyExoticComponent<React.ComponentType>>()

function getLazyTopic(slug: string): React.LazyExoticComponent<React.ComponentType> {
  const cached = lazyCache.get(slug)
  if (cached) return cached
  const lazy = React.lazy<React.ComponentType>(async () => {
    const loader = topicModules[`./topics/${slug}.tsx`]
    if (!loader) {
      const Stub: React.ComponentType = () => <StubTopic slug={slug} />
      return { default: Stub }
    }
    const mod = (await loader()) as { default: React.ComponentType }
    return { default: mod.default }
  })
  lazyCache.set(slug, lazy)
  return lazy
}

export function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const topic = slug ? topicBySlug(slug) : undefined

  if (!topic) return <NotFoundPage />

  const Component = getLazyTopic(topic.slug)

  return (
    <React.Suspense key={topic.slug} fallback={<TopicLoading />}>
      <Component key={topic.slug} />
    </React.Suspense>
  )
}

function TopicLoading() {
  return (
    <div className="p-10 font-eyebrow text-sm text-gold">Loading visualization…</div>
  )
}

function StubTopic({ slug }: { slug: string }) {
  return (
    <div className="p-10">
      <h1 className="font-display text-3xl text-white">{slug}</h1>
      <p className="mt-2 font-body text-cream">Visualization coming soon.</p>
    </div>
  )
}
