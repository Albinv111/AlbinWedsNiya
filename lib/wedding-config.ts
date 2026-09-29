// Edit everything about the invitation here: names, parents, events, links and music.

export type WeddingEvent = {
  id: string
  title: string
  subtitle?: string
  shortTitle: string
  /** ISO start time with IST offset. Used for sorting, calendar grids and the .ics file. */
  start: string
  /** ISO end time with IST offset. Used for the .ics file. */
  end: string
  /** Text shown for the time (e.g. "9:00 AM", "Evening"). */
  timeLabel: string
  venue: string
  address: string
  mapUrl: string
}

export const wedding = {
  monogram: { left: 'A', right: 'N' },
  groom: {
    firstName: 'Albin',
    fullName: 'Albin Varghese',
    parentsLabel: 'Beloved son of',
    father: 'Mr. Varghese Daniel',
    mother: 'Mrs. Lizy Varghese',
  },
  bride: {
    firstName: 'Niya',
    fullName: 'Niya Dominic',
    parentsLabel: 'Beloved daughter of',
    father: 'Mr. Dominic N.A',
    mother: 'Mrs. Sincy Dominic',
  },
  verse: {
    text: 'I have found the one whom my soul loves.',
    reference: 'Song of Songs 3:4',
  },
  invitationMessage:
    'By the grace of God and with the blessings of our beloved families, we joyfully invite you to witness the sacred union of our hearts. Come share in our prayers, our laughter and our first steps as one — for our day would not be complete without you.',
  /** The moment the countdown counts down to. */
  countdownTarget: '2026-11-07T11:00:00+05:30',
  /** Shown under the scratch card once revealed. */
  revealedDate: {
    weekday: 'Saturday',
    day: '07',
    month: 'November',
    year: '2026',
    time: '11:00 AM',
    venue: 'Salem Mar Thoma Syrian Church, Kayamkulam',
  },
  events: [
    {
      id: 'wedding',
      title: 'Holy Matrimony',
      subtitle: 'The Sacred Vows',
      shortTitle: 'Wedding',
      start: '2026-11-07T11:00:00+05:30',
      end: '2026-11-07T13:00:00+05:30',
      timeLabel: '11:00 AM',
      venue: 'Salem Mar Thoma Syrian Church',
      address: 'Kayamkulam, Kerala, India',
      mapUrl: 'https://maps.app.goo.gl/rR8AwwcAainVaSNp8?g_st=ic',
    },
    {
      id: 'madhuram-veppu',
      title: 'Madhuram Veppu',
      subtitle: 'The Sweetening Ceremony',
      shortTitle: 'Madhuram',
      start: '2026-10-31T18:00:00+05:30',
      end: '2026-10-31T21:00:00+05:30',
      timeLabel: 'Evening',
      venue: 'Edeshery Resorts',
      address: 'Cheranalloor Ferry Road, Cheranallur, Kochi, Ernakulam, Kerala 682034, India',
      mapUrl: 'https://maps.app.goo.gl/Nw5nJvHWhfkLPM2Z6?g_st=ic',
    },
    {
      id: 'reception-kayamkulam',
      title: 'Followed By Wedding Reception',
      subtitle: 'Kayamkulam',
      shortTitle: 'Followed By Reception',
      start: '2026-11-07T12:30:00+05:30',
      end: '2026-11-07T15:00:00+05:30',
      timeLabel: 'Afternoon',
      venue: 'Mikas Convention Center',
      address: 'K.P. Road, Murukummoodu, Kayamkulam, Kerala 690502, India',
      mapUrl: 'https://maps.app.goo.gl/UAfe7KAP1H3WSYwN6?g_st=ic',
    },
    {
      id: 'reception-kochi',
      title: 'Wedding Reception',
      subtitle: 'Kochi',
      shortTitle: 'Reception',
      start: '2026-11-13T18:00:00+05:30',
      end: '2026-11-13T21:00:00+05:30',
      timeLabel: 'Evening',
      venue: 'Alfa Horizon Business Centre',
      address: 'Goshree Road, opposite ICTT, Vallarpadam, Kochi, Ernakulam, Kerala 682504, India',
      mapUrl: 'https://maps.app.goo.gl/RZ3UgYqPe4j2PGXJ8?g_st=ic',
    },
  ] satisfies WeddingEvent[],
  /** Months shown in the calendar section (month is 1-12). */
  calendarMonths: [
    { year: 2026, month: 10 },
    { year: 2026, month: 11 },
  ],
  closing: {
    heading: 'With love & prayers',
    names: ['Geo Antony', 'Jinsha Geo', 'Ethen Dominic', 'Alona Varghese', 'Carlynn', 'Aithal'],
    place: '',
  },
  music: {
    /** Optional local file, e.g. "/audio/wedding-song.mp3". When set it is used instead of YouTube. */
    src: '',
    youtubeId: 'SOJpE1KMUbo',
    /** Start position in seconds (2:24). */
    startAt: 144,
  },
}

export const sortedEvents = [...wedding.events].sort(
  (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
)

const IST = 'Asia/Kolkata'

export function formatEventDate(iso: string) {
  const date = new Date(iso)
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-IN', { timeZone: IST, ...options }).format(date)
  return {
    day: part({ day: '2-digit' }),
    month: part({ month: 'short' }).toUpperCase(),
    monthLong: part({ month: 'long' }),
    weekday: part({ weekday: 'long' }),
    year: part({ year: 'numeric' }),
    dayNumber: Number(part({ day: 'numeric' })),
    monthNumber: Number(part({ month: 'numeric' })),
    yearNumber: Number(part({ year: 'numeric' })),
  }
}
