'use client'

import { useEffect, useState } from 'react'
import { Music, VolumeX } from 'lucide-react'
import { particles } from '@/lib/particles'
import { wedding } from '@/lib/wedding-config'
import { CalendarSection } from './calendar-section'
import { ClosingSection } from './closing-section'
import { Countdown } from './countdown'
import { EventsSection } from './events-section'
import { GoldRings } from './gold-rings'
import { HeavenBackground } from './heaven-background'
import { HeroSection } from './hero-section'
import { InvitationSection } from './invitation-section'
import { ParticleCanvas } from './particle-canvas'
import { ScratchReveal } from './scratch-reveal'
import { ScrollFx } from './scroll-fx'
import { SealCover } from './seal-cover'
import { useBackgroundMusic } from './use-background-music'

export function InvitationApp() {
  const [opened, setOpened] = useState(false)
  const [started, setStarted] = useState(false)
  const music = useBackgroundMusic(wedding.music)

  useEffect(() => {
    document.documentElement.style.overflow = opened ? '' : 'hidden'
    if (opened) {
      window.scrollTo(0, 0)
      particles.enablePetals()
    }
  }, [opened])

  return (
    <>
      <HeavenBackground />
      <ParticleCanvas />

      <main className="relative z-10" aria-hidden={!opened}>
        <HeroSection />
        <InvitationSection />
        <ScratchReveal />
        <Countdown />
        <EventsSection />
        <CalendarSection />
        <ClosingSection />
      </main>

      {opened && <GoldRings />}
      {opened && <ScrollFx />}

      {!opened && (
        <SealCover
          onOpenStart={() => {
            setStarted(true)
            music.start()
          }}
          onOpened={() => setOpened(true)}
        />
      )}

      {started && (
        <button
          type="button"
          onClick={music.toggle}
          aria-label={music.playing ? 'Mute music' : 'Play music'}
          aria-pressed={music.playing}
          className="fixed z-[70] flex size-12 items-center justify-center rounded-full border border-gold/60 bg-background/90 text-gold-light shadow-[0_0_24px_rgb(212_175_55/0.35)] transition-transform active:scale-90"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)',
            right: 'calc(env(safe-area-inset-right) + 1.25rem)',
          }}
        >
          {music.playing ? (
            <Music className="size-5 animate-pulse" aria-hidden="true" />
          ) : (
            <VolumeX className="size-5" aria-hidden="true" />
          )}
        </button>
      )}
    </>
  )
}
