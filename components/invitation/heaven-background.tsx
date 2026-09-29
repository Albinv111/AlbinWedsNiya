const arches = [
  { w: 380, h: 760, o: 0.55, sw: 1.3 },
  { w: 320, h: 680, o: 0.45, sw: 1.05 },
  { w: 260, h: 600, o: 0.36, sw: 0.9 },
  { w: 200, h: 520, o: 0.28, sw: 0.8 },
]

function archPath(w: number, h: number) {
  const cx = 200
  const bottom = 800
  const left = cx - w / 2
  const right = cx + w / 2
  const top = bottom - h
  const r = w / 2
  return `M ${left} ${bottom} L ${left} ${top + r} A ${r} ${r} 0 0 1 ${right} ${top + r} L ${right} ${bottom}`
}

const auroras = [
  { className: 'left-[-20%] top-[-10%] size-[80vmax]', color: 'rgb(212 175 55 / 0.22)', dur: 22, delay: 0 },
  { className: 'right-[-25%] top-[25%] size-[70vmax]', color: 'rgb(255 214 120 / 0.16)', dur: 28, delay: -8 },
  { className: 'left-[10%] bottom-[-30%] size-[75vmax]', color: 'rgb(160 110 30 / 0.24)', dur: 25, delay: -14 },
]

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 0.7  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

export function HeavenBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 60% at 50% 0%, rgb(212 175 55 / 0.26), transparent 65%), radial-gradient(70% 50% at 50% 100%, rgb(122 90 22 / 0.3), transparent 70%)',
        }}
      />

      {auroras.map((a) => (
        <div
          key={a.dur}
          className={`absolute rounded-full will-change-transform ${a.className}`}
          style={{
            background: `radial-gradient(closest-side, ${a.color}, transparent)`,
            animation: `aurora-drift ${a.dur}s ease-in-out ${a.delay}s infinite alternate`,
          }}
        />
      ))}

      {[-18, -8, 0, 8, 18].map((deg, i) => (
        <div
          key={deg}
          className="absolute left-1/2 top-[-10%] h-[120%] w-[26vw] min-w-32 origin-top will-change-[opacity]"
          style={{
            transform: `translateX(-50%) rotate(${deg}deg)`,
            // Soft edges come from the horizontal gradient mask, not a blur filter.
            background: 'linear-gradient(180deg, rgb(247 231 166 / 0.24), rgb(212 175 55 / 0.06) 55%, transparent 85%)',
            maskImage: 'linear-gradient(90deg, transparent, #000 35%, #000 65%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 35%, #000 65%, transparent)',
            animation: `beam-breathe ${6 + i * 1.3}s ease-in-out ${i * 0.7}s infinite`,
          }}
        />
      ))}

      <div
        className="absolute inset-y-0 left-0 w-[60vw] will-change-transform"
        style={{
          background:
            'linear-gradient(100deg, transparent 20%, rgb(255 236 180 / 0.07) 40%, rgb(255 248 220 / 0.13) 50%, rgb(255 236 180 / 0.07) 60%, transparent 80%)',
          animation: 'leak-sweep 11s cubic-bezier(0.45, 0, 0.2, 1) infinite',
        }}
      />

      <div id="heaven-arches" className="absolute inset-x-0 bottom-0 h-[110dvh] will-change-transform">
        <svg
          className="absolute bottom-0 left-1/2 h-[96dvh] w-auto max-w-none -translate-x-1/2"
          viewBox="0 0 400 800"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            <linearGradient id="arch-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff3c4" />
              <stop offset="0.4" stopColor="#d4af37" />
              <stop offset="1" stopColor="#7a5a16" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="arch-halo" cx="0.5" cy="0.3" r="0.5">
              <stop offset="0" stopColor="#fff3c4" stopOpacity="0.28" />
              <stop offset="1" stopColor="#d4af37" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="260" rx="190" ry="240" fill="url(#arch-halo)" />
          {arches.map((a) => (
            <path key={a.w} d={archPath(a.w, a.h)} fill="none" stroke="url(#arch-gold)" strokeWidth={a.sw} opacity={a.o} />
          ))}
          {arches.slice(0, 2).map((a) => (
            <path
              key={`inner-${a.w}`}
              d={archPath(a.w - 10, a.h - 10)}
              fill="none"
              stroke="url(#arch-gold)"
              strokeWidth={0.5}
              strokeDasharray="1 5"
              opacity={a.o * 0.9}
            />
          ))}
          <g opacity="0.8">
            <circle cx="200" cy="120" r="3" fill="#fff3c4" />
            <circle cx="200" cy="120" r="9" fill="none" stroke="#f7e7a6" strokeWidth="0.5" opacity="0.6" />
          </g>
        </svg>
      </div>

      <svg
        className="absolute bottom-0 left-0 h-[70dvh] w-auto max-w-none -translate-x-1/3 opacity-45"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMax meet"
      >
        <path d={archPath(300, 700)} fill="none" stroke="url(#arch-gold)" strokeWidth="1" />
        <path d={archPath(240, 620)} fill="none" stroke="url(#arch-gold)" strokeWidth="0.7" />
      </svg>
      <svg
        className="absolute bottom-0 right-0 h-[70dvh] w-auto max-w-none translate-x-1/3 opacity-45"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMax meet"
      >
        <path d={archPath(300, 700)} fill="none" stroke="url(#arch-gold)" strokeWidth="1" />
        <path d={archPath(240, 620)} fill="none" stroke="url(#arch-gold)" strokeWidth="0.7" />
      </svg>

      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: GRAIN }} />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 45%, transparent 45%, rgb(20 12 4 / 0.55) 75%, rgb(7 6 10 / 0.95) 100%)',
        }}
      />
    </div>
  )
}
