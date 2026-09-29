import { wedding } from '@/lib/wedding-config'
import { Ornament, Reveal } from './reveal'

export function ClosingSection() {
  return (
    <footer
      className="relative flex min-h-dvh flex-col items-center justify-center gap-8 px-6 pt-24 text-center"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 11rem)' }}
    >
      <Reveal className="flex flex-col items-center gap-6">
        <p className="text-pretty text-2xl italic leading-relaxed text-foreground/85">
          Your presence is our most cherished gift, and your prayers our richest blessing.
        </p>
        <Ornament />
        <p className="gold-text font-serif text-6xl sm:text-7xl">{wedding.closing.heading}</p>
      </Reveal>
      <Reveal delay={150} as="div" className="flex flex-col items-center gap-2">
        {wedding.closing.names.map((name) => (
          <p key={name} className="font-serif text-3xl text-foreground sm:text-4xl">
            {name}
          </p>
        ))}
        <p className="mt-4 text-sm uppercase tracking-[0.5em] text-gold">{wedding.closing.place}</p>
      </Reveal>
      <Reveal delay={300}>
        <p className="gold-text font-serif text-4xl">
          {wedding.groom.firstName} <span className="font-sans italic">&amp;</span> {wedding.bride.firstName}
        </p>
      </Reveal>
    </footer>
  )
}
