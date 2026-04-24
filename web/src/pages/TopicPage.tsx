import { useParams } from "react-router-dom"
import * as React from "react"
import { topicBySlug } from "@/data/topics"
import { NotFoundPage } from "@/pages/NotFoundPage"

const topicModules = import.meta.glob("./topics/*.tsx")

export function TopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const topic = slug ? topicBySlug(slug) : undefined

  const Component = React.useMemo(() => {
    if (!topic) return null
    return React.lazy<React.ComponentType>(async () => {
      const key = `./topics/${topic.slug}.tsx`
      const loader = topicModules[key]
      if (!loader) {
        const Stub: React.ComponentType = () => <StubTopic slug={topic.slug} />
        return { default: Stub }
      }
      const mod = (await loader()) as { default: React.ComponentType }
      return { default: mod.default }
    })
  }, [topic])

  if (!topic || !Component) return <NotFoundPage />

  return (
    <React.Suspense fallback={<TopicLoading />}>
      <Component />
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
