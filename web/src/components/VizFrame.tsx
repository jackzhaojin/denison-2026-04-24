import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Props = {
  topicNumber: number
  title: string
  category: string
  summary: string
  complexity?: string
  children: React.ReactNode
}

export function VizFrame({ topicNumber, title, category, summary, complexity, children }: Props) {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="font-eyebrow text-xs text-gold">
            Topic {String(topicNumber).padStart(2, "0")} · {category}
          </span>
          <div className="h-px flex-1 bg-white/30" />
        </div>
        <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="max-w-2xl font-body text-base text-cream md:text-lg">{summary}</p>
        {complexity && (
          <Badge className="bg-gold font-eyebrow text-xs text-[color:var(--color-denison-red-dark)] hover:bg-gold">
            {complexity}
          </Badge>
        )}
      </header>
      <Separator className="bg-[color:var(--color-tassel-gold)]/60" />
      <Card className="border-none bg-card shadow-xl">
        <CardHeader className="pb-0" />
        <CardContent className="pt-4">{children}</CardContent>
      </Card>
    </div>
  )
}

type ControlsProps = {
  playing: boolean
  onPlay: () => void
  onPause: () => void
  onStep: () => void
  onReset: () => void
  speedMs?: number
  onSpeedChange?: (ms: number) => void
  canStep?: boolean
  extra?: React.ReactNode
}

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { PlayIcon, PauseIcon, SkipForwardIcon, RotateCcwIcon } from "lucide-react"

export function VizControls({
  playing,
  onPlay,
  onPause,
  onStep,
  onReset,
  speedMs = 600,
  onSpeedChange,
  canStep = true,
  extra,
}: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md bg-[color:var(--color-denison-red)]/10 p-3">
      {playing ? (
        <Button size="sm" onClick={onPause} className="bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red-dark)]">
          <PauseIcon data-icon="inline-start" />
          Pause
        </Button>
      ) : (
        <Button size="sm" onClick={onPlay} disabled={!canStep} className="bg-[color:var(--color-denison-red)] text-white hover:bg-[color:var(--color-denison-red-dark)]">
          <PlayIcon data-icon="inline-start" />
          Play
        </Button>
      )}
      <Button size="sm" variant="outline" onClick={onStep} disabled={playing || !canStep} className="border-[color:var(--color-denison-red)] bg-transparent text-[color:var(--color-denison-red-dark)] hover:bg-[color:var(--color-denison-red)]/10 hover:text-[color:var(--color-denison-red-dark)]">
        <SkipForwardIcon data-icon="inline-start" />
        Step
      </Button>
      <Button size="sm" variant="ghost" onClick={onReset} className="bg-transparent text-[color:var(--color-denison-red-dark)] hover:bg-[color:var(--color-denison-red)]/10 hover:text-[color:var(--color-denison-red-dark)]">
        <RotateCcwIcon data-icon="inline-start" />
        Reset
      </Button>
      {onSpeedChange && (
        <div className="ml-auto flex items-center gap-2">
          <span className="font-eyebrow text-[10px] text-[color:var(--color-denison-red-dark)]">Speed</span>
          <Slider
            min={100}
            max={1500}
            step={50}
            value={[1600 - speedMs]}
            onValueChange={(v) => onSpeedChange(1600 - v[0])}
            className="w-32"
          />
        </div>
      )}
      {extra}
    </div>
  )
}

export function useStepRunner(step: () => void, canStep: boolean, speedMs: number, playing: boolean) {
  React.useEffect(() => {
    if (!playing || !canStep) return
    const id = window.setInterval(step, speedMs)
    return () => window.clearInterval(id)
  }, [playing, canStep, step, speedMs])
}

export const DENISON = {
  red: "#C72030",
  redDark: "#9E1A1D",
  gold: "#FFC72C",
  goldDark: "#EAAA00",
  cream: "#DFD6C5",
  neutralGold: "#F5E1A4",
  white: "#FFFFFF",
  ink: "#1a1a1a",
  stone: "#4B4F54",
}
