'use client'

import { useRef, useState } from 'react'
import { particles } from '@/lib/particles'
import { wedding } from '@/lib/wedding-config'

type Stage = 'idle' | 'cracking' | 'opening'

const sealEdge = (() => {
  const points: string[] = []
  const steps = 72
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = 94 + Math.sin(t * 9) * 2.6 + Math.sin(t * 23 + 1.3) * 1.6 + Math.cos(t * 5 + 0.4) * 1.8
    points.push(`${(100 + Math.cos(t) * r).toFixed(2)},${(100 + Math.sin(t) * r).toFixed(2)}`)
  }
  return `M ${points.join(' L ')} Z`
})()

const crackLeft = 'polygon(0 0, 52% 0, 46% 18%, 55% 34%, 45% 52%, 54% 68%, 47% 84%, 51% 100%, 0 100%)'
const crackRight = 'polygon(52% 0, 100% 0, 100% 100%, 51% 100%, 47% 84%, 54% 68%, 45% 52%, 55% 34%, 46% 18%)'

function WaxSeal() {
  return (
    <div className="relative size-full">
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.8)]">
        <defs>
          <radialGradient id="wax" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#3a2f22" />
            <stop offset="0.45" stopColor="#17110b" />
            <stop offset="1" stopColor="#050403" />
          </radialGradient>
          <linearGradient id="seal-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3c4" />
            <stop offset="0.3" stopColor="#d4af37" />
            <stop offset="0.6" stopColor="#7a5a16" />
            <stop offset="0.85" stopColor="#f7e7a6" />
            <stop offset="1" stopColor="#8a6a1f" />
          </linearGradient>
        </defs>
        <path d={sealEdge} fill="url(#wax)" stroke="url(#seal-rim)" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="72" fill="none" stroke="url(#seal-rim)" strokeWidth="2" />
        <circle cx="100" cy="100" r="66" fill="none" stroke="url(#seal-rim)" strokeWidth="0.6" strokeDasharray="2 3" />
        <ellipse cx="72" cy="58" rx="30" ry="12" fill="#fff6d8" opacity="0.08" transform="rotate(-30 72 58)" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="gold-text font-serif text-5xl tracking-wide sm:text-6xl">
          {wedding.monogram.left}
          <span className="px-1 font-sans text-4xl italic sm:text-5xl">&amp;</span>
          {wedding.monogram.right}
        </span>
      </div>
    </div>
  )
}

function GateHalf({ side }: { side: 'left' | 'right' }) {
  const bars = Array.from({ length: 7 }, (_, i) => 30 + i * 25)
  return (
    <svg
      viewBox="0 0 200 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
    >
      <defs>
        <linearGradient id={`gate-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e7a6" />
          <stop offset="0.5" stopColor="#d4af37" />
          <stop offset="1" stopColor="#7a5a16" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#gate-${side})`} opacity="0.55">
        <rect x="14" y="14" width="186" height="772" strokeWidth="1.5" />
        <rect x="22" y="22" width="178" height="756" strokeWidth="0.5" />
        {bars.map((x) => (
          <line key={x} x1={x} y1="210" x2={x} y2="778" strokeWidth="1" />
        ))}
        <path d="M 22 210 Q 110 90 200 150" strokeWidth="1.4" />
        <path d="M 22 240 Q 110 130 200 185" strokeWidth="0.8" />
        <line x1="22" y1="520" x2="200" y2="520" strokeWidth="1" />
        <line x1="22" y1="530" x2="200" y2="530" strokeWidth="0.5" />
        {bars.map((x) => (
          <circle key={`c${x}`} cx={x} cy="525" r="3" strokeWidth="0.8" />
        ))}
        <circle cx="200" cy="400" r="46" strokeWidth="1" />
        <circle cx="200" cy="400" r="54" strokeWidth="0.5" strokeDasharray="2 4" />
      </g>
    </svg>
  )
}

export function SealCover({ onOpenStart, onOpened }: { onOpenStart: () => void; onOpened: () => void }) {
  const [stage, setStage] = useState<Stage>('idle')
  const sealRef = useRef<HTMLButtonElement>(null)

  const open = () => {
    if (stage !== 'idle') return
    onOpenStart()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      onOpened()
      return
    }
    setStage('cracking')
    const rect = sealRef.current?.getBoundingClientRect()
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
    const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
    particles.sparkle(cx, cy, 40)
    setTimeout(() => {
      setStage('opening')
      particles.glitterBomb(cx, cy, 1.1)
    }, 650)
    setTimeout(() => {
      particles.petalShower(3500)
      onOpened()
    }, 2300)
  }

  const opening = stage === 'opening'
  const cracked = stage !== 'idle'
  const gateTransition = 'transform 1.6s cubic-bezier(0.7, 0, 0.2, 1)'

  return (
    <div
      className="fixed inset-0 z-50 h-dvh overflow-hidden"
      style={{ perspective: '1600px' }}
      role="dialog"
      aria-label="Wedding invitation cover"
    >
      {/* golden light behind the gates */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: opening ? 1 : 0,
          background:
            'radial-gradient(60% 70% at 50% 50%, rgb(255 246 208 / 0.95), rgb(212 175 55 / 0.6) 35%, rgb(122 90 22 / 0.2) 70%, transparent)',
        }}
      />

      {(['left', 'right'] as const).map((side) => (
        <div
          key={side}
          aria-hidden="true"
          className="absolute top-0 h-full w-1/2 overflow-hidden bg-background"
          style={{
            [side]: 0,
            transformOrigin: side === 'left' ? 'left center' : 'right center',
            transform: opening
              ? `rotateY(${side === 'left' ? 78 : -78}deg) translateX(${side === 'left' ? '-18%' : '18%'})`
              : 'none',
            transition: gateTransition,
            background:
              side === 'left'
                ? 'linear-gradient(90deg, #050406, #0d0a08 70%, #1a140c)'
                : 'linear-gradient(270deg, #050406, #0d0a08 70%, #1a140c)',
          }}
        >
          <GateHalf side={side} />
        </div>
      ))}

      {/* light leaking through the seam */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2"
        style={{
          background: 'linear-gradient(180deg, transparent, #f7e7a6 20%, #fff6d8 50%, #f7e7a6 80%, transparent)',
          boxShadow: '0 0 24px 6px rgb(212 175 55 / 0.55), 0 0 80px 20px rgb(247 231 166 / 0.25)',
          animation: 'seam-glow 3.5s ease-in-out infinite',
          opacity: opening ? 0 : undefined,
          transition: 'opacity 0.6s',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-sm border border-gold/40"
        style={{
          boxShadow: 'inset 0 0 60px rgb(212 175 55 / 0.18), 0 0 30px rgb(212 175 55 / 0.25)',
          opacity: cracked ? 0 : 1,
          transition: 'opacity 0.8s',
        }}
      />

      <div
        className="relative flex h-full flex-col items-center justify-between px-6 text-center"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 3.5rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 3rem)',
        }}
      >
        <div
          className="flex flex-col items-center gap-3 transition-all duration-700"
          style={{ opacity: cracked ? 0 : 1, transform: cracked ? 'translateY(-16px)' : 'none' }}
        >
          <p className="text-sm uppercase tracking-[0.45em] text-gold-light/80">With the blessings of their families</p>
          <div className="gold-rule w-40" />
        </div>

        <button
          ref={sealRef}
          type="button"
          onClick={open}
          aria-label="Tap the seal to open the invitation"
          className="relative size-44 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold sm:size-52"
          style={{ animation: stage === 'idle' ? 'float-soft 4s ease-in-out infinite' : undefined }}
        >
          <span
            aria-hidden="true"
            className="absolute -inset-10 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgb(247 231 166 / 0.45), rgb(212 175 55 / 0.15) 45%, transparent 70%)',
              animation: 'beam-breathe 3s ease-in-out infinite',
            }}
          />
          <span
            className="absolute inset-0"
            style={{
              clipPath: crackLeft,
              transform: opening ? 'translate(-60px, 30px) rotate(-28deg)' : cracked ? 'translateX(-3px) rotate(-2deg)' : 'none',
              opacity: opening ? 0 : 1,
              transition: 'transform 0.9s cubic-bezier(0.5,0,0.2,1), opacity 0.9s',
            }}
          >
            <WaxSeal />
          </span>
          <span
            className="absolute inset-0"
            style={{
              clipPath: crackRight,
              transform: opening ? 'translate(60px, 30px) rotate(28deg)' : cracked ? 'translateX(3px) rotate(2deg)' : 'none',
              opacity: opening ? 0 : 1,
              transition: 'transform 0.9s cubic-bezier(0.5,0,0.2,1), opacity 0.9s',
            }}
          >
            <WaxSeal />
          </span>
        </button>

        <div
          className="flex flex-col items-center gap-4 transition-all duration-700"
          style={{ opacity: cracked ? 0 : 1, transform: cracked ? 'translateY(16px)' : 'none' }}
        >
          <h1 className="gold-text text-balance font-serif text-5xl leading-tight sm:text-6xl">
            {wedding.groom.firstName} <span className="font-sans italic">&amp;</span> {wedding.bride.firstName}
          </h1>
          <p className="text-lg italic text-foreground/80">joyfully request the honour of your presence</p>
          <p className="mt-2 animate-pulse text-sm uppercase tracking-[0.4em] text-gold">Tap to break the seal</p>
        </div>
      </div>
    </div>
  )
}
