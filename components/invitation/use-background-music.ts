'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type YTPlayer = {
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  unMute: () => void
  setVolume: (v: number) => void
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

type Options = { src?: string; youtubeId: string; startAt: number }

export function useBackgroundMusic({ src, youtubeId, startAt }: Options) {
  const [playing, setPlaying] = useState(false)
  const wantsPlayRef = useRef(false)
  const pausedByVisibilityRef = useRef(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ytRef = useRef<YTPlayer | null>(null)
  const ytReadyRef = useRef(false)
  const hostRef = useRef<HTMLDivElement | null>(null)

  const playNow = useCallback(() => {
    if (src) {
      const audio = audioRef.current
      if (!audio) return
      if (audio.currentTime < startAt) audio.currentTime = startAt
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      )
      return
    }
    const yt = ytRef.current
    if (!yt || !ytReadyRef.current) return
    yt.unMute()
    yt.setVolume(75)
    yt.playVideo()
  }, [src, startAt])

  const pauseNow = useCallback(() => {
    if (src) audioRef.current?.pause()
    else if (ytReadyRef.current) ytRef.current?.pauseVideo()
    setPlaying(false)
  }, [src])

  useEffect(() => {
    if (src) {
      const audio = new Audio(src)
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0.75
      audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = startAt
      })
      audio.addEventListener('ended', () => {
        audio.currentTime = startAt
        audio.play()
      })
      audioRef.current = audio
      return () => {
        audio.pause()
        audioRef.current = null
      }
    }

    const host = document.createElement('div')
    host.setAttribute('aria-hidden', 'true')
    host.style.cssText = 'position:fixed;width:1px;height:1px;left:-10px;bottom:0;opacity:0;pointer-events:none;'
    const mount = document.createElement('div')
    host.appendChild(mount)
    document.body.appendChild(host)
    hostRef.current = host

    const create = () => {
      if (!window.YT?.Player) return
      ytRef.current = new window.YT.Player(mount, {
        videoId: youtubeId,
        width: 1,
        height: 1,
        playerVars: { start: startAt, autoplay: 0, controls: 0, playsinline: 1, disablekb: 1, rel: 0 },
        events: {
          onReady: () => {
            ytReadyRef.current = true
            if (wantsPlayRef.current) playNow()
          },
          onStateChange: (e: { data: number }) => {
            const state = window.YT!.PlayerState
            if (e.data === state.PLAYING) setPlaying(true)
            else if (e.data === state.PAUSED) setPlaying(false)
            else if (e.data === state.ENDED) {
              ytRef.current?.seekTo(startAt, true)
              ytRef.current?.playVideo()
            }
          },
        },
      })
    }

    if (window.YT?.Player) create()
    else {
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previous?.()
        create()
      }
      if (!document.querySelector('script[data-yt-api]')) {
        const s = document.createElement('script')
        s.src = 'https://www.youtube.com/iframe_api'
        s.async = true
        s.dataset.ytApi = 'true'
        document.head.appendChild(s)
      }
    }

    return () => {
      host.remove()
      ytRef.current = null
      ytReadyRef.current = false
    }
  }, [src, youtubeId, startAt, playNow])

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (wantsPlayRef.current) {
          pausedByVisibilityRef.current = true
          pauseNow()
        }
      } else if (pausedByVisibilityRef.current) {
        pausedByVisibilityRef.current = false
        playNow()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [pauseNow, playNow])

  const start = useCallback(() => {
    wantsPlayRef.current = true
    playNow()
  }, [playNow])

  const toggle = useCallback(() => {
    if (playing) {
      wantsPlayRef.current = false
      pauseNow()
    } else {
      wantsPlayRef.current = true
      playNow()
    }
  }, [playing, pauseNow, playNow])

  return { playing, start, toggle }
}
