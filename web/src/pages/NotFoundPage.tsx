import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center gap-4 p-10 text-center">
      <span className="font-eyebrow text-xs text-gold">404</span>
      <h1 className="font-display text-5xl text-white">Off the map.</h1>
      <p className="max-w-md font-body text-cream">
        That topic isn't on the syllabus. Head back to Home or pick a topic
        from the sidebar.
      </p>
      <Button asChild className="bg-gold font-eyebrow text-[color:var(--color-denison-red-dark)] hover:bg-[color:var(--color-tassel-gold-dark)]">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  )
}
