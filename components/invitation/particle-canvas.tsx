'use client'

import { useEffect, useRef } from 'react'
import { particles } from '@/lib/particles'

export function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    particles.attach(ref.current)
    return () => particles.detach()
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />
}
