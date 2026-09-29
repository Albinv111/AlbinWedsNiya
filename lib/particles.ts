type Kind = 'glitter' | 'petal' | 'spark' | 'comet'

type Particle = {
  kind: Kind
  x: number
  y: number
  vx: number
  vy: number
  z: number
  size: number
  life: number
  maxLife: number
  rot: number
  vr: number
  phase: number
  twinkle: number
  sprite: number
  gravity: number
  drag: number
}

const GOLD_TONES = [
  [255, 240, 196],
  [247, 225, 150],
  [226, 188, 90],
  [212, 175, 55],
  [255, 255, 240],
  [255, 214, 120],
]

const STAR = -1
const TAU = Math.PI * 2

function makeCanvas(w: number, h = w) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}

function makeGlowSprite(rgb: number[], size = 64) {
  const [c, g] = makeCanvas(size)
  const half = size / 2
  const grad = g.createRadialGradient(half, half, 0, half, half, half)
  grad.addColorStop(0, 'rgba(255,255,245,1)')
  grad.addColorStop(0.16, `rgba(${rgb.join(',')},0.95)`)
  grad.addColorStop(0.42, `rgba(${rgb.join(',')},0.3)`)
  grad.addColorStop(1, `rgba(${rgb.join(',')},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

function makeStarSprite(size = 96) {
  const [c, g] = makeCanvas(size)
  const half = size / 2
  const glow = g.createRadialGradient(half, half, 0, half, half, half * 0.5)
  glow.addColorStop(0, 'rgba(255,252,230,1)')
  glow.addColorStop(1, 'rgba(240,200,100,0)')
  g.fillStyle = glow
  g.fillRect(0, 0, size, size)
  g.fillStyle = 'rgba(255,245,210,0.95)'
  for (let i = 0; i < 4; i++) {
    const len = i % 2 === 0 ? half : half * 0.55
    g.save()
    g.translate(half, half)
    g.rotate((Math.PI / 4) * i)
    g.beginPath()
    g.moveTo(0, -len)
    g.quadraticCurveTo(size * 0.03, 0, 0, len)
    g.quadraticCurveTo(-size * 0.03, 0, 0, -len)
    g.fill()
    g.restore()
  }
  return c
}

/** Horizontal tapered streak, head on the right. Drawn rotated along velocity. */
function makeStreakSprite(w = 128, h = 16) {
  const [c, g] = makeCanvas(w, h)
  const grad = g.createLinearGradient(0, 0, w, 0)
  grad.addColorStop(0, 'rgba(212,175,55,0)')
  grad.addColorStop(0.6, 'rgba(240,205,120,0.45)')
  grad.addColorStop(0.92, 'rgba(255,245,210,1)')
  grad.addColorStop(1, 'rgba(255,255,245,0)')
  g.fillStyle = grad
  g.beginPath()
  g.moveTo(0, h / 2)
  g.quadraticCurveTo(w * 0.8, 0, w, h / 2)
  g.quadraticCurveTo(w * 0.8, h, 0, h / 2)
  g.fill()
  return c
}

function makePetalSprite(size = 64, tone = 0) {
  const [c, g] = makeCanvas(size)
  g.translate(size / 2, size / 2)
  const grad = g.createLinearGradient(-size * 0.3, -size * 0.4, size * 0.3, size * 0.4)
  const palettes = [
    ['#fff1c1', '#e6c068', '#b8892a', '#f6dc92'],
    ['#fbe7b0', '#d4af37', '#8a6a1f', '#e9c877'],
    ['#fff8e0', '#f0d38a', '#c99a3a', '#fff0c0'],
  ]
  const stops = palettes[tone % palettes.length]
  grad.addColorStop(0, stops[0])
  grad.addColorStop(0.4, stops[1])
  grad.addColorStop(0.75, stops[2])
  grad.addColorStop(1, stops[3])
  g.fillStyle = grad
  g.beginPath()
  g.moveTo(0, -size * 0.42)
  g.bezierCurveTo(size * 0.34, -size * 0.3, size * 0.3, size * 0.25, 0, size * 0.42)
  g.bezierCurveTo(-size * 0.3, size * 0.25, -size * 0.34, -size * 0.3, 0, -size * 0.42)
  g.fill()
  const sheen = g.createLinearGradient(-size * 0.2, -size * 0.3, size * 0.1, 0)
  sheen.addColorStop(0, 'rgba(255,255,240,0.55)')
  sheen.addColorStop(1, 'rgba(255,255,240,0)')
  g.fillStyle = sheen
  g.fill()
  g.strokeStyle = 'rgba(255,248,220,0.55)'
  g.lineWidth = size * 0.02
  g.beginPath()
  g.moveTo(0, -size * 0.34)
  g.quadraticCurveTo(size * 0.04, 0, 0, size * 0.34)
  g.stroke()
  return c
}

class ParticleEngine {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private particles: Particle[] = []
  private width = 0
  private height = 0
  private dpr = 1
  private raf = 0
  private last = 0
  private mobile = false
  private reduced = false
  private glows: HTMLCanvasElement[] = []
  private star: HTMLCanvasElement | null = null
  private streak: HTMLCanvasElement | null = null
  private petals: HTMLCanvasElement[] = []
  private basePetals = 0
  private baseGlitter = 0
  private petalTarget = 0
  private glitterTarget = 0
  private showerUntil = 0
  private maxParticles = 1100
  private petalsEnabled = false
  private nextComet = 0
  private scrollShift = 0
  private quality = 1
  private frameAcc = 0
  private frameCount = 0
  private lastTrail = 0

  attach(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', { alpha: true })
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.mobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
    this.maxParticles = this.mobile ? 340 : 720
    this.baseGlitter = this.reduced ? 0 : this.mobile ? 60 : 130
    this.basePetals = this.reduced ? 0 : this.mobile ? 12 : 22
    this.glitterTarget = this.baseGlitter
    this.petalTarget = this.basePetals
    this.glows = GOLD_TONES.map((t) => makeGlowSprite(t))
    this.star = makeStarSprite()
    this.streak = makeStreakSprite()
    this.petals = [0, 1, 2].map((t) => makePetalSprite(64, t))
    this.resize()
    window.addEventListener('resize', this.resize, { passive: true })
    window.addEventListener('pointermove', this.onPointer, { passive: true })
    window.addEventListener('pointerdown', this.onPointer, { passive: true })
    document.addEventListener('visibilitychange', this.onVisibility)
    for (let i = 0; i < this.glitterTarget; i++) this.spawnGlitter(true)
    this.nextComet = performance.now() + 1500
    this.start()
  }

  detach() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.onPointer)
    window.removeEventListener('pointerdown', this.onPointer)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.particles = []
    this.canvas = null
    this.ctx = null
  }

  enablePetals() {
    if (this.petalsEnabled || this.reduced) return
    this.petalsEnabled = true
    for (let i = 0; i < this.petalTarget; i++) this.spawnPetal(true)
  }

  /** Feed scroll delta (px) each frame; glitter parallaxes and fast flicks throw off sparks. */
  scrollBy(dy: number) {
    if (this.reduced || !this.ctx) return
    this.scrollShift += dy
    const speed = Math.abs(dy)
    if (speed > 28 && this.particles.length < this.maxParticles * 0.8) {
      const n = Math.min(6, Math.floor(speed / 28))
      for (let i = 0; i < n; i++) {
        const x = Math.random() * this.width
        const y = dy > 0 ? this.height + 10 : -10
        const angle = (dy > 0 ? -Math.PI / 2 : Math.PI / 2) + (Math.random() - 0.5) * 0.5
        this.spark(x, y, angle, 6 + Math.random() * speed * 0.18, { gravity: 0.02, drag: 0.955, life: 60, maxLife: 60 })
      }
    }
  }

  private onPointer = (e: PointerEvent) => {
    if (this.reduced || !this.ctx || this.particles.length > this.maxParticles * 0.85) return
    const now = performance.now()
    const isDown = e.type === 'pointerdown'
    if (!isDown && now - this.lastTrail < (this.mobile ? 40 : 24)) return
    this.lastTrail = now
    const n = isDown ? (this.mobile ? 8 : 14) : 2
    for (let i = 0; i < n; i++) {
      this.spark(e.clientX, e.clientY, Math.random() * TAU, (isDown ? 1.5 : 0.4) + Math.random() * (isDown ? 4 : 1.4), {
        size: 3 + Math.random() * 7,
        gravity: 0.025,
        drag: 0.94,
        life: 34 + Math.random() * 30,
        maxLife: 64,
        sprite: Math.random() < 0.3 ? STAR : Math.floor(Math.random() * GOLD_TONES.length),
      })
    }
  }

  private resize = () => {
    if (!this.canvas) return
    // Soft glow sprites look identical at 1.5x, and fill cost drops ~44% vs 2x on retina phones.
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas.width = Math.round(this.width * this.dpr)
    this.canvas.height = Math.round(this.height * this.dpr)
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
  }

  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf)
      this.raf = 0
    } else {
      this.start()
    }
  }

  private start() {
    if (this.raf || this.reduced || !this.ctx) return
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  private spawnGlitter(anywhere = false) {
    const z = 0.35 + Math.random() * 1.15
    const big = Math.random() < 0.1
    this.particles.push({
      kind: 'glitter',
      x: Math.random() * this.width,
      y: anywhere ? Math.random() * this.height : -10,
      vx: (Math.random() - 0.5) * 1.1 * z,
      vy: (Math.random() - 0.45) * 0.9 * z,
      z,
      size: (2 + Math.random() * (big ? 14 : 5)) * z,
      life: 1,
      maxLife: 1,
      rot: 0,
      vr: 0,
      phase: Math.random() * TAU,
      twinkle: 0.002 + Math.random() * 0.006,
      sprite: Math.random() < 0.16 ? STAR : Math.floor(Math.random() * GOLD_TONES.length),
      gravity: 0,
      drag: 1,
    })
  }

  private spawnPetal(anywhere = false) {
    const z = 0.6 + Math.random() * 0.8
    this.particles.push({
      kind: 'petal',
      x: Math.random() * this.width,
      y: anywhere ? Math.random() * this.height - this.height * 0.2 : -30 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (0.6 + Math.random() * 0.9) * z,
      z,
      size: ((this.mobile ? 12 : 14) + Math.random() * 14) * z,
      life: 1,
      maxLife: 1,
      rot: Math.random() * TAU,
      vr: (Math.random() - 0.5) * 0.03,
      phase: Math.random() * TAU,
      twinkle: 0.0008 + Math.random() * 0.0018,
      sprite: Math.floor(Math.random() * 3),
      gravity: 0,
      drag: 1,
    })
  }

  private spawnComet() {
    const fromLeft = Math.random() < 0.5
    const x = fromLeft ? -40 : this.width + 40
    const y = Math.random() * this.height * 0.55
    const angle = fromLeft ? 0.25 + Math.random() * 0.35 : Math.PI - 0.25 - Math.random() * 0.35
    const speed = (this.mobile ? 11 : 15) + Math.random() * 6
    this.particles.push({
      kind: 'comet',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      z: 1,
      size: 10 + Math.random() * 6,
      life: 140,
      maxLife: 140,
      rot: 0,
      vr: 0,
      phase: 0,
      twinkle: 0,
      sprite: STAR,
      gravity: 0,
      drag: 1,
    })
  }

  private spark(x: number, y: number, angle: number, speed: number, opts: Partial<Particle> = {}) {
    if (this.particles.length >= this.maxParticles * this.quality) return
    const life = 50 + Math.random() * 60
    this.particles.push({
      kind: 'spark',
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      z: 1,
      size: 4 + Math.random() * 10,
      life,
      maxLife: life,
      rot: 0,
      vr: 0,
      phase: Math.random() * TAU,
      twinkle: 0.2 + Math.random() * 0.3,
      sprite: Math.random() < 0.22 ? STAR : Math.floor(Math.random() * GOLD_TONES.length),
      gravity: 0.045,
      drag: 0.965,
      ...opts,
    })
  }

  glitterBomb(x: number, y: number, scale = 1) {
    if (this.reduced || !this.ctx) return
    const count = Math.round((this.mobile ? 110 : 230) * scale * this.quality)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * TAU
      const speed = 2 + Math.pow(Math.random(), 0.55) * (this.mobile ? 13 : 18)
      this.spark(x, y, angle, speed, {
        size: 3 + Math.random() * (Math.random() < 0.15 ? 20 : 9),
        gravity: 0.035 + Math.random() * 0.045,
        drag: 0.955 + Math.random() * 0.02,
      })
    }
  }

  firework(x: number, y: number) {
    if (this.reduced || !this.ctx) return
    const count = Math.round((this.mobile ? 48 : 90) * this.quality)
    const speed = 4.5 + Math.random() * 2.5
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TAU + Math.random() * 0.05
      this.spark(x, y, angle, speed * (0.85 + Math.random() * 0.3), {
        size: 4 + Math.random() * 6,
        gravity: 0.032,
        drag: 0.968,
        life: 70 + Math.random() * 40,
        maxLife: 110,
      })
    }
    // inner ring for a double-shell look
    for (let i = 0; i < count / 2; i++) {
      const angle = (i / (count / 2)) * TAU
      this.spark(x, y, angle, speed * 0.45, { size: 3 + Math.random() * 4, gravity: 0.02, drag: 0.97, sprite: 4 })
    }
    for (let i = 0; i < (this.mobile ? 8 : 16); i++) {
      this.spark(x, y, Math.random() * TAU, Math.random() * 2, { sprite: STAR, size: 10 + Math.random() * 14 })
    }
  }

  sparkle(x: number, y: number, count = 24) {
    if (this.reduced || !this.ctx) return
    const n = this.mobile ? Math.ceil(count / 2) : count
    for (let i = 0; i < n; i++) {
      this.spark(x, y, Math.random() * TAU, 0.5 + Math.random() * 3.5, {
        gravity: 0.01,
        drag: 0.95,
        sprite: Math.random() < 0.5 ? STAR : 0,
        size: 5 + Math.random() * 12,
      })
    }
  }

  petalShower(duration = 4000) {
    if (this.reduced || !this.ctx) return
    this.enablePetals()
    this.showerUntil = performance.now() + duration
    const burst = this.mobile ? 22 : 42
    for (let i = 0; i < burst; i++) this.spawnPetal(false)
  }

  /** Drops density when the device can't hold ~50fps, recovers when it can. */
  private adaptQuality(frameMs: number) {
    this.frameAcc += frameMs
    this.frameCount++
    if (this.frameCount < 45) return
    const avg = this.frameAcc / this.frameCount
    this.frameAcc = 0
    this.frameCount = 0
    if (avg > 20 && this.quality > 0.35) this.quality = Math.max(0.35, this.quality - 0.2)
    else if (avg < 17.5 && this.quality < 1) this.quality = Math.min(1, this.quality + 0.05)
    this.glitterTarget = Math.round(this.baseGlitter * this.quality)
    this.petalTarget = Math.round(this.basePetals * (0.6 + 0.4 * this.quality))
  }

  private tick = (now: number) => {
    const ctx = this.ctx
    if (!ctx) return
    const frameMs = now - this.last
    const dt = Math.min(frameMs / 16.667, 3)
    this.last = now
    // Ignore long hitches (tab switch, GC) so one stall doesn't downgrade quality.
    if (frameMs < 100) this.adaptQuality(frameMs)
    const w = this.width
    const h = this.height
    const shift = this.scrollShift
    this.scrollShift = 0
    ctx.clearRect(0, 0, w, h)

    let petalCount = 0
    let glitterCount = 0
    const list = this.particles
    let write = 0

    ctx.globalCompositeOperation = 'source-over'
    for (let i = 0; i < list.length; i++) {
      const p = list[i]
      if (p.kind !== 'petal') continue
      p.x += (p.vx + Math.sin(now * p.twinkle + p.phase) * 0.9) * dt
      p.y += p.vy * dt - shift * 0.25 * p.z
      p.rot += p.vr * dt
      if (p.y > h + 40 || p.y < -h * 0.5) {
        p.kind = 'glitter'
        p.life = -1
        continue
      }
      petalCount++
      const flip = Math.cos(now * p.twinkle * 1.8 + p.phase)
      const angle = p.rot + Math.sin(now * 0.001 + p.phase) * 0.4
      const sx = 0.3 + Math.abs(flip) * 0.7
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      ctx.setTransform(cos * sx * this.dpr, sin * sx * this.dpr, -sin * this.dpr, cos * this.dpr, p.x * this.dpr, p.y * this.dpr)
      ctx.globalAlpha = 0.7 + Math.abs(flip) * 0.3
      ctx.drawImage(this.petals[p.sprite], -p.size / 2, -p.size / 2, p.size, p.size)
    }
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)

    ctx.globalCompositeOperation = 'lighter'
    for (let i = 0; i < list.length; i++) {
      const p = list[i]
      if (p.kind === 'petal') {
        list[write++] = p
        continue
      }
      if (p.life === -1) continue

      let alpha: number
      if (p.kind === 'glitter') {
        p.vx += (Math.random() - 0.5) * 0.09 * dt
        p.vy += (Math.random() - 0.5) * 0.09 * dt
        const lim = 1.3 * p.z
        if (p.vx > lim) p.vx = lim
        else if (p.vx < -lim) p.vx = -lim
        if (p.vy > lim) p.vy = lim
        else if (p.vy < -lim) p.vy = -lim
        p.x += p.vx * dt
        p.y += p.vy * dt - shift * 0.35 * p.z
        if (p.x < -20) p.x = w + 20
        else if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        else if (p.y > h + 20) p.y = -20
        const s = Math.sin(now * p.twinkle + p.phase)
        alpha = (0.12 + 0.88 * s * s) * Math.min(1, 0.45 + p.z * 0.5)
        glitterCount++
        if (glitterCount > this.glitterTarget + 20) continue
      } else if (p.kind === 'comet') {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.life -= dt
        if (p.life <= 0 || p.x < -200 || p.x > w + 200 || p.y > h + 200) continue
        if (Math.random() < 0.6 * dt && list.length < this.maxParticles) {
          this.spark(p.x, p.y, Math.atan2(-p.vy, -p.vx) + (Math.random() - 0.5) * 0.9, 0.5 + Math.random() * 1.5, {
            size: 3 + Math.random() * 5,
            gravity: 0.03,
            drag: 0.95,
            life: 40,
            maxLife: 40,
          })
        }
        const speed = Math.hypot(p.vx, p.vy)
        const len = speed * 14
        const ang = Math.atan2(p.vy, p.vx)
        const cos = Math.cos(ang)
        const sin = Math.sin(ang)
        ctx.globalAlpha = 0.95
        ctx.setTransform(cos * this.dpr, sin * this.dpr, -sin * this.dpr, cos * this.dpr, p.x * this.dpr, p.y * this.dpr)
        ctx.drawImage(this.streak!, -len, -p.size * 0.35, len + p.size * 0.4, p.size * 0.7)
        ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
        ctx.drawImage(this.star!, p.x - p.size * 1.6, p.y - p.size * 1.6, p.size * 3.2, p.size * 3.2)
        list[write++] = p
        continue
      } else {
        p.vx *= Math.pow(p.drag, dt)
        p.vy = p.vy * Math.pow(p.drag, dt) + p.gravity * dt
        p.x += p.vx * dt
        p.y += p.vy * dt - shift * 0.15
        p.life -= dt
        if (p.life <= 0) continue
        const t = p.life / p.maxLife
        alpha = Math.min(1, t * 1.6) * (0.65 + 0.35 * Math.sin(p.life * p.twinkle + p.phase))

        const speed2 = p.vx * p.vx + p.vy * p.vy
        if (speed2 > 9) {
          const speed = Math.sqrt(speed2)
          const len = Math.min(90, speed * 5)
          const cos = p.vx / speed
          const sin = p.vy / speed
          ctx.globalAlpha = Math.max(0, alpha * 0.85)
          ctx.setTransform(cos * this.dpr, sin * this.dpr, -sin * this.dpr, cos * this.dpr, p.x * this.dpr, p.y * this.dpr)
          ctx.drawImage(this.streak!, -len, -p.size * 0.2, len + p.size * 0.3, p.size * 0.4)
          ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
        }
      }
      list[write++] = p
      const sprite = p.sprite === STAR ? this.star! : this.glows[p.sprite]
      const size = p.sprite === STAR ? p.size * 1.8 : p.size
      ctx.globalAlpha = Math.max(0, alpha)
      ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size)
    }
    // Comet trail sparks pushed mid-loop are visited by the same loop (it reads list.length live), so compaction is safe.
    list.length = write
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'

    if (this.petalsEnabled) {
      const showering = now < this.showerUntil
      const target = showering ? this.petalTarget * 3 : this.petalTarget
      if (petalCount < target && Math.random() < (showering ? 0.55 : 0.1) * dt) this.spawnPetal()
    }
    while (glitterCount < this.glitterTarget) {
      this.spawnGlitter(true)
      glitterCount++
    }
    if (now > this.nextComet) {
      this.spawnComet()
      this.nextComet = now + (this.mobile ? 3200 : 2400) + Math.random() * 3500
    }

    this.raf = requestAnimationFrame(this.tick)
  }
}

export const particles = new ParticleEngine()
