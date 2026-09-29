'use client'

import { useEffect, useRef } from 'react'
import { particles } from '@/lib/particles'

/** One rAF-throttled scroll listener: drives the gold progress bar, background parallax, and particle scroll velocity. */
export function ScrollFx() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const root = document.documentElement
    // Transform the parallax layer directly; a CSS variable on <html> would restyle the whole document every frame.
    const arches = document.getElementById('heaven-arches')

    const update = () => {
      ticking = false
      const y = window.scrollY
      const max = root.scrollHeight - window.innerHeight
      const progress = max > 0 ? y / max : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
      if (arches) arches.style.transform = `translate3d(0, ${(progress * window.innerHeight * 0.06).toFixed(1)}px, 0)`
      particles.scrollBy(y - lastY)
      lastY = y
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[3px]"
      style={{ top: 'env(safe-area-inset-top)' }}
    >
      <div
        ref={barRef}
        className="h-full origin-left will-change-transform"
        style={{
          transform: 'scaleX(0)',
          background: 'linear-gradient(90deg, #7a5a16, #d4af37 40%, #fff3c4 80%, #ffffff)',
          boxShadow: '0 0 12px rgb(247 231 166 / 0.8), 0 0 2px #fff3c4',
        }}
      />
    </div>
  )
}
