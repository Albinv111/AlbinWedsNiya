import { wedding } from '@/lib/wedding-config'
import { Ornament, Reveal } from './reveal'

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      style={{ paddingTop: 'calc(env(safe-area-inset-top) + 6rem)', paddingBottom: '7rem' }}
    >
      <Reveal className="flex flex-col items-center gap-6">
        <p className="text-sm uppercase tracking-[0.5em] text-gold-light/80">Two hearts, one covenant</p>
        <Ornament />
      </Reveal>

      <Reveal delay={200} className="mt-8 flex flex-col items-center">
        <h2 className="flex flex-col items-center font-serif leading-none">
          <span className="gold-text text-7xl sm:text-8xl md:text-9xl">{wedding.groom.firstName}</span>
          <span className="mt-2 text-lg uppercase tracking-[0.5em] text-foreground/70">
            {wedding.groom.fullName.split(' ').slice(1).join(' ')}
          </span>
          <span className="gold-text my-4 font-sans text-6xl font-light italic sm:text-7xl">&amp;</span>
          <span className="gold-text text-7xl sm:text-8xl md:text-9xl">{wedding.bride.firstName}</span>
          <span className="mt-2 text-lg uppercase tracking-[0.5em] text-foreground/70">
            {wedding.bride.fullName.split(' ').slice(1).join(' ')}
          </span>
        </h2>
      </Reveal>

      <Reveal delay={400} className="mt-12 flex max-w-md flex-col items-center gap-4">
        <blockquote className="text-pretty text-2xl italic leading-relaxed text-foreground/90 sm:text-3xl">
          {`“${wedding.verse.text}”`}
        </blockquote>
        <cite className="text-sm not-italic uppercase tracking-[0.4em] text-gold">— {wedding.verse.reference}</cite>
      </Reveal>

      <a
        href="#invitation"
        className="absolute bottom-[calc(env(safe-area-inset-bottom)+2rem)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold-light/70"
      >
        <span>Scroll</span>
        <span className="flex h-10 w-6 justify-center rounded-full border border-gold/60 pt-2">
          <span className="size-1.5 rounded-full bg-gold" style={{ animation: 'scroll-dot 1.8s ease-in-out infinite' }} />
        </span>
        <span className="sr-only">to the invitation</span>
      </a>
    </section>
  )
}
