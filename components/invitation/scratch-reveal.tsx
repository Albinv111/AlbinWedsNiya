'use client'

import { useEffect, useRef, useState } from 'react'
import { particles } from '@/lib/particles'
import { wedding } from '@/lib/wedding-config'
import { Ornament, Reveal } from './reveal'

function paintFoil(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, '#7a5a16')
  grad.addColorStop(0.2, '#d4af37')
  grad.addColorStop(0.38, '#fff3c4')
  grad.addColorStop(0.55, '#c9a24a')
  grad.addColorStop(0.75, '#f7e7a6')
  grad.addColorStop(1, '#8a6a1f')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)
  for (let i = 0; i < (width * height) / 60; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,250,225,0.55)' : 'rgba(90,62,10,0.35)'
    const s = Math.random() * 1.8
    ctx.fillRect(Math.random() * width, Math.random() * height, s, s)
  }
  ctx.fillStyle = 'rgba(58,38,6,0.85)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${Math.min(34, width / 11)}px Italiana, serif`
  ctx.fillText('Scratch gently', width / 2, height / 2 - 14)
  ctx.font = `italic ${Math.min(20, width / 18)}px "Cormorant Garamond", serif`
  ctx.fillText('to unveil the day we say “I do”', width / 2, height / 2 + 22)
  return ctx
}

export function ScratchReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)
  const revealedRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let ctx: CanvasRenderingContext2D | null = null
    const setup = () => {
      if (revealedRef.current) return
      ctx = paintFoil(canvas)
    }
    document.fonts?.ready.then(setup)
    setup()

    let drawing = false
    let last: { x: number; y: number } | null = null
    let moves = 0

    const point = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const scratch = (p: { x: number; y: number }) => {
      if (!ctx) return
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.lineWidth = 44
      ctx.beginPath()
      ctx.moveTo(last?.x ?? p.x, last?.y ?? p.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      last = p
      if (++moves % 8 === 0) {
        const r = canvas.getBoundingClientRect()
        particles.sparkle(r.left + p.x, r.top + p.y, 6)
        checkCleared()
      }
    }

    const checkCleared = () => {
      if (!ctx || revealedRef.current) return
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let clear = 0
      let total = 0
      for (let i = 3; i < data.length; i += 4 * 24) {
        total++
        if (data[i] < 40) clear++
      }
      if (clear / total > 0.45) celebrate()
    }

    const celebrate = () => {
      revealedRef.current = true
      setRevealed(true)
      const r = cardRef.current!.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      particles.glitterBomb(cx, cy, 1.2)
      const vw = window.innerWidth
      const vh = window.innerHeight
      const bursts = [300, 800, 1300, 1800, 2400]
      bursts.forEach((t) =>
        setTimeout(() => particles.firework(vw * (0.15 + Math.random() * 0.7), vh * (0.12 + Math.random() * 0.45)), t),
      )
      setTimeout(() => particles.glitterBomb(cx, cy, 0.6), 1500)
      setTimeout(() => particles.petalShower(5000), 2800)
    }

    const down = (e: PointerEvent) => {
      drawing = true
      last = null
      canvas.setPointerCapture(e.pointerId)
      scratch(point(e))
    }
    const move = (e: PointerEvent) => drawing && scratch(point(e))
    const up = () => {
      drawing = false
      checkCleared()
    }

    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', up)
    return () => {
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointercancel', up)
    }
  }, [])

  const d = wedding.revealedDate

  return (
    <section className="relative flex flex-col items-center gap-10 px-5 py-24 text-center">
      <Reveal className="flex flex-col items-center gap-4">
        <p className="text-sm uppercase tracking-[0.5em] text-gold-light/80">Save the date</p>
        <p className="text-pretty text-xl italic text-foreground/80">A golden secret awaits beneath your fingertip</p>
        <Ornament />
      </Reveal>

      <Reveal delay={150} className="w-full max-w-md">
        <div ref={cardRef} className="gold-frame relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
          <div className="flex size-full flex-col items-center justify-center gap-2 p-6">
            <p className="text-lg uppercase tracking-[0.45em] text-gold-light">{d.weekday}</p>
            <p className="gold-text font-serif text-[9rem] leading-none sm:text-[11rem]">{d.day}</p>
            <p className="gold-text font-serif text-5xl sm:text-6xl">{d.month}</p>
            <p className="gold-text font-serif text-6xl tracking-[0.15em] sm:text-7xl">{d.year}</p>
            <div className="gold-rule my-3 w-32" />
            <p className="font-serif text-4xl text-foreground">{d.time}</p>
            <p className="text-pretty text-lg italic text-foreground/80">{d.venue}</p>
          </div>
          <canvas
            ref={canvasRef}
            aria-label="Scratch card. Rub to reveal the wedding date."
            role="img"
            className="absolute inset-0 size-full cursor-grab touch-none rounded-2xl transition-opacity duration-1000"
            style={{ opacity: revealed ? 0 : 1, pointerEvents: revealed ? 'none' : 'auto' }}
          />
        </div>
      </Reveal>
      <p className="sr-only" aria-live="polite">
        {revealed ? `${d.weekday}, ${d.day} ${d.month} ${d.year} at ${d.time}` : ''}
      </p>
    </section>
  )
}
