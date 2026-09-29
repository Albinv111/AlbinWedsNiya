'use client'

import { useEffect, useRef } from 'react'
import { particles } from '@/lib/particles'
import { wedding } from '@/lib/wedding-config'

const TOP = 50
const BOTTOM = 68
const OUTER = { rx: 44, ry: 19 }
const INNER = { rx: 37, ry: 15.5 }

function Ring({ id, name, gem }: { id: string; name: string; gem?: boolean }) {
  const engraving = name.toUpperCase()
  const l = 60 - OUTER.rx
  const r = 60 + OUTER.rx
  const il = 60 - INNER.rx
  const ir = 60 + INNER.rx
  const midY = (TOP + BOTTOM) / 2 + 1.5

  const frontWall = `M ${l} ${TOP} A ${OUTER.rx} ${OUTER.ry} 0 0 0 ${r} ${TOP} L ${r} ${BOTTOM} A ${OUTER.rx} ${OUTER.ry} 0 0 1 ${l} ${BOTTOM} Z`
  const innerBackWall = `M ${il} ${TOP} A ${INNER.rx} ${INNER.ry} 0 0 1 ${ir} ${TOP} L ${ir} ${BOTTOM} A ${INNER.rx} ${INNER.ry} 0 0 0 ${il} ${BOTTOM} Z`
  const topRim = `M ${l} ${TOP} a ${OUTER.rx} ${OUTER.ry} 0 1 0 ${OUTER.rx * 2} 0 a ${OUTER.rx} ${OUTER.ry} 0 1 0 ${-OUTER.rx * 2} 0 Z M ${il} ${TOP} a ${INNER.rx} ${INNER.ry} 0 1 0 ${INNER.rx * 2} 0 a ${INNER.rx} ${INNER.ry} 0 1 0 ${-INNER.rx * 2} 0 Z`
  const engravePath = `M ${l} ${midY} A ${OUTER.rx} ${OUTER.ry} 0 0 0 ${r} ${midY}`

  return (
    <svg viewBox="0 0 120 120" className="size-full overflow-visible drop-shadow-[0_10px_12px_rgba(0,0,0,0.65)]">
      <defs>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5c410c" />
          <stop offset="0.12" stopColor="#a67c22" />
          <stop offset="0.3" stopColor="#f7e7a6" />
          <stop offset="0.38" stopColor="#fffbe8" />
          <stop offset="0.5" stopColor="#d4af37" />
          <stop offset="0.72" stopColor="#8a6a1f" />
          <stop offset="0.86" stopColor="#e9cf7a" />
          <stop offset="1" stopColor="#4a3208" />
        </linearGradient>
        <linearGradient id={`${id}-front-v`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6d8" stopOpacity="0.45" />
          <stop offset="0.35" stopColor="#fff6d8" stopOpacity="0" />
          <stop offset="0.8" stopColor="#1a1003" stopOpacity="0" />
          <stop offset="1" stopColor="#1a1003" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9cf7a" />
          <stop offset="0.25" stopColor="#6b4c12" />
          <stop offset="0.55" stopColor="#b8912e" />
          <stop offset="0.8" stopColor="#3f2a07" />
          <stop offset="1" stopColor="#c9a445" />
        </linearGradient>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffbe8" />
          <stop offset="0.5" stopColor="#e6c460" />
          <stop offset="1" stopColor="#9c7621" />
        </linearGradient>
        <path id={`${id}-engrave`} d={engravePath} />
      </defs>

      <path d={innerBackWall} fill={`url(#${id}-inner)`} />
      <path d={topRim} fill={`url(#${id}-rim)`} fillRule="evenodd" />
      <path d={frontWall} fill={`url(#${id}-front)`} />
      <path d={frontWall} fill={`url(#${id}-front-v)`} />

      {[0, 50].map((offset) => (
        <g key={offset} data-engrave-offset={offset}>
          <text fontSize="8" letterSpacing="1.4" fontFamily="var(--font-italiana), serif" textAnchor="middle" dy="0.5">
            <textPath href={`#${id}-engrave`} fill="#fff6d8" fillOpacity="0.55" startOffset={`${offset}%`}>
              {engraving}
            </textPath>
          </text>
          <text fontSize="8" letterSpacing="1.4" fontFamily="var(--font-italiana), serif" textAnchor="middle">
            <textPath href={`#${id}-engrave`} fill="#3a2606" startOffset={`${offset}%`}>
              {engraving}
            </textPath>
          </text>
        </g>
      ))}

      <path
        d={`M ${l + 4} ${TOP + 4} A ${OUTER.rx - 2} ${OUTER.ry - 1} 0 0 0 ${60 - 8} ${TOP + OUTER.ry + 1.5}`}
        fill="none"
        stroke="#fffdf4"
        strokeOpacity="0.7"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {gem && (
        <g transform={`translate(60 ${TOP - INNER.ry - 5})`}>
          <path d="M -5 7 L -3 -1 M 5 7 L 3 -1" stroke="#d4af37" strokeWidth="1.6" strokeLinecap="round" />
          <polygon points="0,-11 8,-3 0,6 -8,-3" fill="#fffdf4" stroke="#d4af37" strokeWidth="1" />
          <polygon points="0,-11 3,-3 0,6 -3,-3" fill="#e8e4d6" opacity="0.85" />
          <line x1="-8" y1="-3" x2="8" y2="-3" stroke="#d4af37" strokeWidth="0.6" />
        </g>
      )}
    </svg>
  )
}

export function GoldRings() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const left = leftRef.current
    const right = rightRef.current
    if (!left || !right) return
    let raf = 0
    let joined = false
    let appliedRoll = -1

    const engravings = [left, right].map((el) =>
      Array.from(el.querySelectorAll<SVGGElement>('[data-engrave-offset]')).map((g) => ({
        base: Number(g.dataset.engraveOffset),
        paths: Array.from(g.querySelectorAll('textPath')),
      })),
    )

    const update = () => {
      raf = 0
      const vw = window.innerWidth
      const vh = window.innerHeight
      const size = left.offsetWidth
      const max = document.documentElement.scrollHeight - vh
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      const safeTop = 12
      const endY = vh - size - 24
      const overlap = size * 0.42
      const y = safeTop + (endY - safeTop) * ease
      const leftStart = 8
      const leftEnd = vw / 2 - size + overlap / 2
      const rightStart = vw - size - 8
      const rightEnd = vw / 2 - overlap / 2
      const sway = Math.sin(p * Math.PI * 3) * (1 - p) * 18
      const lx = leftStart + (leftEnd - leftStart) * ease + sway
      const rx = rightStart + (rightEnd - rightStart) * ease - sway
      const rock = Math.sin(p * Math.PI * 6) * 10 * (1 - ease)
      const finalTilt = 16 * ease
      left.style.transform = `translate3d(${lx}px, ${y}px, 0) rotate(${rock - finalTilt}deg)`
      right.style.transform = `translate3d(${rx}px, ${y}px, 0) rotate(${-rock + finalTilt}deg)`

      // Quantized so SVG text is only re-laid-out when the engraving visibly moves.
      const roll = Math.round(((p * 260) % 100) * 2) / 2
      if (roll !== appliedRoll) {
        appliedRoll = roll
        engravings.forEach((groups, i) => {
          groups.forEach(({ base, paths }) => {
            const offset = ((i === 0 ? roll : -roll) + base + 100) % 100
            paths.forEach((tp) => tp.setAttribute('startOffset', `${offset}%`))
          })
        })
      }

      if (p > 0.985 && !joined) {
        joined = true
        particles.sparkle(vw / 2, y + size / 2, 50)
        particles.glitterBomb(vw / 2, y + size / 2, 0.35)
      } else if (p < 0.9) {
        joined = false
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 animate-in fade-in duration-1000">
      <div
        ref={leftRef}
        className="absolute left-0 top-0 size-20 will-change-transform sm:size-24 lg:size-32"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        <Ring id="ring-groom" name={wedding.groom.firstName} />
      </div>
      <div
        ref={rightRef}
        className="absolute left-0 top-0 size-20 will-change-transform sm:size-24 lg:size-32"
        style={{ marginTop: 'env(safe-area-inset-top)' }}
      >
        <Ring id="ring-bride" name={wedding.bride.firstName} gem />
      </div>
    </div>
  )
}
