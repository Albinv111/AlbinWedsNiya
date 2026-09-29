'use client'

import { useEffect, useState } from 'react'
import { wedding } from '@/lib/wedding-config'
import { Ornament, Reveal } from './reveal'

const target = new Date(wedding.countdownTarget).getTime()

function remaining() {
  const diff = Math.max(0, target - Date.now())
  return {
    Days: Math.floor(diff / 86400000),
    Hours: Math.floor(diff / 3600000) % 24,
    Minutes: Math.floor(diff / 60000) % 60,
    Seconds: Math.floor(diff / 1000) % 60,
  }
}

export function Countdown() {
  const [time, setTime] = useState<ReturnType<typeof remaining> | null>(null)

  useEffect(() => {
    setTime(remaining())
    const id = setInterval(() => setTime(remaining()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative flex flex-col items-center gap-10 px-5 py-20 text-center">
      <Reveal className="flex flex-col items-center gap-4">
        <p className="text-sm uppercase tracking-[0.5em] text-gold-light/80">Until forever begins</p>
        <Ornament />
      </Reveal>
      <Reveal delay={150} className="grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
        {Object.entries(time ?? { Days: 0, Hours: 0, Minutes: 0, Seconds: 0 }).map(([label, value]) => (
          <div key={label} className="gold-frame flex flex-col items-center gap-1 rounded-t-full rounded-b-xl px-2 pb-5 pt-8">
            <span className="gold-text font-serif text-6xl tabular-nums leading-none sm:text-7xl">
              {time ? String(value).padStart(2, '0') : '--'}
            </span>
            <span className="text-sm uppercase tracking-[0.35em] text-foreground/75">{label}</span>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
