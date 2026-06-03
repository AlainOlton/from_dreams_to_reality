import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Square } from 'lucide-react'

interface Props {
  script:   string[]
  autoPlay: boolean
}

const AvatarSpeaker: React.FC<Props> = ({ script, autoPlay }) => {
  const [speaking,    setSpeaking]    = useState(false)
  const [caption,     setCaption]     = useState('')
  const [typedText,   setTypedText]   = useState('')
  const [hasPlayed,   setHasPlayed]   = useState(false)

  const utteranceRef  = useRef<SpeechSynthesisUtterance | null>(null)
  const typeTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const charIndexRef  = useRef(0)

  // ── Typewriter effect ──────────────────────────────────────
  const typeCaption = useCallback((text: string) => {
    setTypedText('')
    charIndexRef.current = 0
    if (typeTimerRef.current) clearInterval(typeTimerRef.current)

    typeTimerRef.current = setInterval(() => {
      charIndexRef.current++
      setTypedText(text.slice(0, charIndexRef.current))
      if (charIndexRef.current >= text.length) {
        clearInterval(typeTimerRef.current!)
      }
    }, 38)
  }, [])

  // ── Speak ──────────────────────────────────────────────────
  const speak = useCallback(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()

    const fullText = script.join(' ')
    const utt      = new SpeechSynthesisUtterance(fullText)

    // Pick a female voice if available
    const voices = window.speechSynthesis.getVoices()
    const female  = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('samantha') ||
         v.name.toLowerCase().includes('victoria') ||
         v.name.toLowerCase().includes('karen') ||
         v.name.toLowerCase().includes('zira') ||
         v.name.toLowerCase().includes('google us english') ||
         v.name.toLowerCase().includes('microsoft zira'))
    ) ?? voices.find((v) => v.lang.startsWith('en')) ?? null

    if (female) utt.voice = female
    utt.pitch = 1.1
    utt.rate  = 0.88
    utt.lang  = 'en-US'

    // Track which sentence is being spoken via boundary events
    let sentenceIdx = 0
    const sentences = script

    utt.onboundary = (e) => {
      if (e.name !== 'sentence' && e.name !== 'word') return
      // Find which sentence the current char position falls in
      let pos = 0
      for (let i = 0; i < sentences.length; i++) {
        pos += sentences[i].length + 1
        if (e.charIndex < pos) {
          if (i !== sentenceIdx) {
            sentenceIdx = i
            setCaption(sentences[i])
            typeCaption(sentences[i])
          }
          break
        }
      }
    }

    utt.onstart = () => {
      setSpeaking(true)
      setCaption(sentences[0])
      typeCaption(sentences[0])
    }

    utt.onend = () => {
      setSpeaking(false)
      setTypedText('')
      setCaption('')
    }

    utt.onerror = () => {
      setSpeaking(false)
    }

    utteranceRef.current = utt
    window.speechSynthesis.speak(utt)
    setHasPlayed(true)
  }, [script, typeCaption])

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
    setTypedText('')
    setCaption('')
    if (typeTimerRef.current) clearInterval(typeTimerRef.current)
  }, [])

  // ── Auto-play on mount ─────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) return

    // Voices may not be loaded immediately
    const tryPlay = () => {
      const voices = window.speechSynthesis?.getVoices() ?? []
      if (voices.length > 0) {
        setTimeout(speak, 1200)
      } else {
        window.speechSynthesis.onvoiceschanged = () => {
          setTimeout(speak, 1200)
        }
      }
    }

    if ('speechSynthesis' in window) tryPlay()

    return () => {
      window.speechSynthesis?.cancel()
      if (typeTimerRef.current) clearInterval(typeTimerRef.current)
    }
  }, [autoPlay, speak])

  return (
    <div className="lnd-avatar-wrap">
      {/* Glow */}
      <div className="lnd-avatar-glow" />

      {/* Avatar circle */}
      <div className="lnd-avatar-circle">
        {/* Orbit ring */}
        <div className="lnd-avatar-orbit">
          <div className="lnd-avatar-orbit-dot" />
        </div>

        {/* Face */}
        <div className="lnd-avatar-face">
          <div className="lnd-avatar-eyes">
            <div className="lnd-avatar-eye" />
            <div className="lnd-avatar-eye" style={{ animationDelay: '0.3s' }} />
          </div>
          <div className="lnd-avatar-cheeks">
            <div className="lnd-avatar-cheek" />
            <div className="lnd-avatar-cheek" />
          </div>
          <div className={`lnd-avatar-mouth${speaking ? ' speaking' : ''}`} />
        </div>
      </div>

      {/* Sound wave */}
      <div className={`lnd-wave${speaking ? ' active' : ''}`}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="lnd-wave-bar" />
        ))}
      </div>

      {/* Caption */}
      <div className="lnd-caption">
        {typedText || (hasPlayed ? '' : 'Click play to hear a welcome message')}
        {speaking && <span className="lnd-caption-cursor" />}
      </div>

      {/* Controls */}
      <button
        className="lnd-play-btn"
        onClick={speaking ? stop : speak}
        aria-label={speaking ? 'Stop welcome message' : 'Play welcome message'}
      >
        {speaking ? (
          <><Square size={12} fill="currentColor" /> Stop</>
        ) : (
          <><Play size={12} fill="currentColor" /> {hasPlayed ? 'Replay' : 'Play welcome'}</>
        )}
      </button>
    </div>
  )
}

export default AvatarSpeaker
