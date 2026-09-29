import { wedding } from '@/lib/wedding-config'
import { Ornament, Reveal } from './reveal'

function Family({ person }: { person: typeof wedding.groom }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="gold-text font-serif text-5xl sm:text-6xl">{person.fullName}</p>
      <p className="text-sm uppercase tracking-[0.45em] text-gold-light/70">{person.parentsLabel}</p>
      <div className="flex flex-col items-center gap-1">
        <p className="font-sans text-2xl font-medium tracking-wide text-foreground sm:text-3xl">{person.father}</p>
        <p className="font-sans text-xl italic text-gold">&amp;</p>
        <p className="font-sans text-2xl font-medium tracking-wide text-foreground sm:text-3xl">{person.mother}</p>
      </div>
    </div>
  )
}

export function InvitationSection() {
  return (
    <section id="invitation" className="relative flex scroll-mt-10 flex-col items-center px-5 py-24">
      <Reveal className="gold-frame flex w-full max-w-xl flex-col items-center gap-10 rounded-t-[12rem] rounded-b-2xl px-6 pb-14 pt-20 text-center sm:px-12">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm uppercase tracking-[0.5em] text-gold-light/80">A heartfelt invitation</p>
          <Ornament />
        </div>
        <p className="text-pretty text-xl leading-relaxed text-foreground/90 sm:text-2xl">{wedding.invitationMessage}</p>

        <Family person={wedding.groom} />
        <p className="gold-text font-sans text-5xl font-light italic" aria-hidden="true">
          &amp;
        </p>
        <Family person={wedding.bride} />
      </Reveal>
    </section>
  )
}
