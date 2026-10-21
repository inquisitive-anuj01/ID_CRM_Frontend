import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause, Trash2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

const MAX_MS = 2 * 60 * 1000 // 2 minutes
const MAX_BYTES = 5 * 1024 * 1024 // 5MB

export function VoiceRecorder({ onRecorded, className }) {
  const [state, setState] = useState('idle') // idle | recording | preview
  const [audioUrl, setAudioUrl] = useState(null)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const mediaRecorder = useRef(null)
  const chunks = useRef([])
  const timerRef = useRef(null)
  const audioRef = useRef(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      chunks.current = []

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setState('preview')
        onRecorded?.(blob)
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.current.start(100)
      setState('recording')
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((d) => {
          if (d >= MAX_MS) {
            stopRecording()
            return d
          }
          return d + 1000
        })
      }, 1000)
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setPermissionDenied(true)
      }
    }
  }

  const stopRecording = () => {
    clearInterval(timerRef.current)
    mediaRecorder.current?.stop()
  }

  const reset = () => {
    setAudioUrl(null)
    setState('idle')
    setDuration(0)
    setIsPlaying(false)
    onRecorded?.(null)
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const fmtTime = (ms) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-[11px] font-bold uppercase tracking-widest text-muted">
        Voice Note
      </label>

      {permissionDenied && (
        <p className="rounded-lg bg-[var(--warn)]/10 border border-[var(--warn)] px-3 py-2 text-xs text-[var(--warn)]">
          Microphone permission denied. Please allow mic access in browser settings.
        </p>
      )}

      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-3">
        {state === 'idle' && (
          <Button variant="solid" size="sm" onClick={startRecording} type="button">
            <Mic size={14} />
            Record
          </Button>
        )}

        {state === 'recording' && (
          <>
            <div className="h-2 w-2 rounded-full bg-[var(--danger)] overdue-dot" />
            <span className="text-sm font-bold tabular-nums text-ink">{fmtTime(duration)}</span>
            <div className="flex-1" />
            <Button variant="danger" size="sm" onClick={stopRecording} type="button">
              <Square size={12} />
              Stop
            </Button>
          </>
        )}

        {state === 'preview' && (
          <>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-black"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <span className="text-sm text-muted">{fmtTime(duration)}</span>
            <div className="flex-1" />
            <Button variant="ghost" size="icon-sm" onClick={reset} type="button" title="Re-record">
              <RotateCcw size={14} />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={reset} type="button" title="Delete">
              <Trash2 size={14} className="text-[var(--danger)]" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
