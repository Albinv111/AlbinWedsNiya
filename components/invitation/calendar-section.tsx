import { formatEventDate, sortedEvents, wedding } from '@/lib/wedding-config'
import { cn } from '@/lib/utils'
import { Ornament, Reveal } from './reveal'

const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function MonthGrid({ year, month }: { year: number; month: number }) {
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const monthName = new Intl.DateTimeFormat('en-IN', { month: 'long', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  )

  const eventsByDay = new Map<number, { title: string; label: string }[]>()
  const monthEvents = sortedEvents.filter((e) => {
    const d = formatEventDate(e.start)
    return d.monthNumber === month && d.yearNumber === year
  })
  for (const e of monthEvents) {
    const d = formatEventDate(e.start)
    const list = eventsByDay.get(d.dayNumber) ?? []
    list.push({ title: e.shortTitle, label: e.subtitle ? `${e.title} · ${e.subtitle}` : e.title })
    eventsByDay.set(d.dayNumber, list)
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className="gold-frame flex flex-col gap-5 rounded-2xl p-5 sm:p-7">
      <div className="flex items-baseline justify-between">
        <h3 className="gold-text font-serif text-5xl">{monthName}</h3>
        <span className="font-serif text-3xl text-foreground/80">{year}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center" role="grid" aria-label={`${monthName} ${year}`}>
        {weekdays.map((w, i) => (
          <span key={i} className="pb-2 text-sm font-semibold tracking-widest text-gold" role="columnheader">
            {w}
          </span>
        ))}
        {cells.map((day, i) => {
          const events = day ? eventsByDay.get(day) : undefined
          return (
            <div
              key={i}
              role="gridcell"
              aria-label={events ? `${day} ${monthName}: ${events.map((e) => e.label).join(', ')}` : undefined}
              className="flex min-h-14 flex-col items-center justify-start gap-0.5 py-1"
            >
              {day && (
                <>
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full font-serif text-xl tabular-nums',
                      events
                        ? 'bg-gold text-primary-foreground shadow-[0_0_18px_rgb(247_231_166/0.7)]'
                        : 'text-foreground/80',
                    )}
                  >
                    {day}
                  </span>
                  {events && (
                    <span className="text-[0.62rem] font-semibold uppercase leading-tight tracking-wide text-gold-light sm:text-xs">
                      {events.map((e) => e.title).join(' & ')}
                    </span>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>
      <ul className="flex flex-col gap-2 border-t border-gold/25 pt-4">
        {monthEvents.map((e) => {
          const d = formatEventDate(e.start)
          return (
            <li key={e.id} className="flex items-baseline gap-3">
              <span className="gold-text w-10 shrink-0 font-serif text-3xl leading-none">{d.day}</span>
              <span className="text-lg leading-snug text-foreground/90">
                {e.title}
                {e.subtitle && <span className="italic text-gold"> · {e.subtitle}</span>}
                <span className="text-foreground/60"> — {e.timeLabel}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function CalendarSection() {
  return (
    <section className="relative flex flex-col items-center gap-12 px-5 py-20">
      <Reveal className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm uppercase tracking-[0.5em] text-gold-light/80">Dates to treasure</p>
        <Ornament />
      </Reveal>
      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
        {wedding.calendarMonths.map((m, i) => (
          <Reveal key={`${m.year}-${m.month}`} delay={i * 120}>
            <MonthGrid year={m.year} month={m.month} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
