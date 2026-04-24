import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { groupedTopics, TOPICS } from "@/data/topics"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

export function HomePage() {
  const groups = groupedTopics()
  return (
    <div className="flex flex-col gap-12 p-6 md:p-12">
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="font-eyebrow text-xs text-gold">Denison University · CS 271</span>
          <div className="h-px flex-1 bg-white/30" />
        </div>
        <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white md:text-7xl">
          A whole semester of
          <br />
          <span className="text-gold">Data Structures</span>,
          <br />
          in one live demo.
        </h1>
        <p className="max-w-2xl font-body text-lg text-cream md:text-xl">
          Twenty animated visualizations — from Big-O and arrays through AVL
          rotations and Dijkstra — written in a single prompt to Claude. Press
          <span className="font-semibold text-gold"> Play</span> on any topic
          to watch the algorithm run.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-gold font-eyebrow text-[color:var(--color-denison-red-dark)] hover:bg-[color:var(--color-tassel-gold-dark)]">
            <Link to="/topic/sorting">
              Start with Sorting
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-gold bg-transparent font-eyebrow text-gold hover:bg-white/10 hover:text-gold">
            <Link to="/how-this-was-built">
              <SparklesIcon data-icon="inline-start" />
              How this was built
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCallout number="20" label="Animated Topics" />
        <StatCallout number="6" label="Course Categories" />
        <StatCallout number="5" label="Prompts to Build It" />
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <span className="font-eyebrow text-xs text-gold">The Curriculum</span>
          <div className="h-px flex-1 bg-white/30" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <Card key={g.category} className="border-none bg-card">
              <CardContent className="flex flex-col gap-3 pt-6">
                <span className="font-eyebrow text-xs text-[color:var(--color-denison-red)]">
                  {g.category}
                </span>
                <ul className="flex flex-col gap-2">
                  {g.topics.map((t) => (
                    <li key={t.slug}>
                      <Link
                        to={`/topic/${t.slug}`}
                        className="group flex items-center justify-between gap-2 rounded-sm px-2 py-1 font-section text-base text-[color:var(--color-denison-red-dark)] hover:bg-[color:var(--color-denison-red)]/10"
                      >
                        <span>
                          <span className="mr-2 font-eyebrow text-[10px] text-[color:var(--color-denison-red)]">
                            {String(t.id).padStart(2, "0")}
                          </span>
                          {t.title}
                        </span>
                        <ArrowRightIcon className="opacity-0 transition-opacity group-hover:opacity-70" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="flex flex-col gap-2 border-t border-white/20 pt-6">
        <p className="font-eyebrow text-[10px] text-gold">The Hill · Big Red</p>
        <p className="font-body text-sm text-cream">
          Built for a live demo at Denison University. {TOPICS.length} topics,
          one-shot generation.
        </p>
      </footer>
    </div>
  )
}

function StatCallout({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1 border-l-2 border-[color:var(--color-tassel-gold)] pl-4">
      <span className="font-display text-6xl font-semibold leading-none text-gold">
        {number}
      </span>
      <span className="font-eyebrow text-xs text-white">{label}</span>
    </div>
  )
}
