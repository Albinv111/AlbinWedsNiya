'use client'

import { CalendarPlus, MapPin } from 'lucide-react'
import { downloadIcs } from '@/lib/ics'
import { formatEventDate, sortedEvents, wedding } from '@/lib/wedding-config'
import { Ornament, Reveal } from './reveal'

const couple = `${wedding.groom.firstName} & ${wedding.bride.firstName}`

export function EventsSection() {
  return (
    <section id="events" className="relative flex flex-col items-center gap-12 px-5 py-24">
      <Reveal className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm uppercase tracking-[0.5em] text-gold-light/80">Join us as we celebrate</p>
        <h2 className="gold-text font-serif text-5xl sm:text-6xl">The Festivities</h2>
        <Ornament />
      </Reveal>

      <ol className="flex w-full max-w-xl flex-col gap-8">
        {sortedEvents.map((event, i) => {
          const d = formatEventDate(event.start)
          return (
            <Reveal as="li" key={event.id} delay={i * 80}>
              <article className="gold-frame flex flex-col items-center gap-6 rounded-t-[8rem] rounded-b-2xl px-6 pb-8 pt-12 text-center">
                <div className="flex items-end justify-center gap-4">
                  <span className="gold-text font-serif text-[6.5rem] leading-[0.85] sm:text-[8rem]">{d.day}</span>
                  <span className="flex flex-col items-start pb-1 text-left">
                    <span className="gold-text font-serif text-4xl leading-none sm:text-5xl">{d.month}</span>
                    <span className="font-serif text-2xl text-foreground/85">{d.year}</span>
                  </span>
                </div>
                <p className="text-base uppercase tracking-[0.4em] text-gold-light">
                  {d.weekday} · {event.timeLabel}
                </p>
                <div className="gold-rule w-24" />
                <div className="flex flex-col items-center gap-1">
                  <h3 className="text-balance font-serif text-4xl text-foreground sm:text-5xl">{event.title}</h3>
                  {event.subtitle && <p className="text-xl italic text-gold">{event.subtitle}</p>}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-2xl font-semibold uppercase tracking-wider text-foreground">{event.venue}</p>
                  <p className="text-pretty text-lg leading-relaxed text-foreground/75">{event.address}</p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row">
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-lg font-semibold text-primary-foreground shadow-[0_0_24px_rgb(212_175_55/0.4)] transition-transform active:scale-95"
                  >
                    <MapPin className="size-5" aria-hidden="true" />
                    Get Directions
                  </a>
                  <button
                    type="button"
                    onClick={() => downloadIcs(event, couple)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gold/70 px-5 py-3 text-lg font-semibold text-gold-light transition-transform active:scale-95"
                  >
                    <CalendarPlus className="size-5" aria-hidden="true" />
                    Save to Calendar
                  </button>
                </div>
              </article>
            </Reveal>
          )
        })}
      </ol>
    </section>
  )
}
