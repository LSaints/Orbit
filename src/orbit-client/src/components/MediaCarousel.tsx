import { useState, useRef, useCallback } from 'react'
import type { PostagemMediaResponse } from '@/types'

const API_BASE = 'http://localhost:5033'

export function MediaCarousel({
  medias,
  onTap,
}: {
  medias: PostagemMediaResponse[]
  onTap?: () => void
}) {
  const [current, setCurrent] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ startX: 0, dragging: false, moved: false })
  const translateRef = useRef(0)

  const goTo = useCallback((index: number) => {
    setCurrent(Math.max(0, Math.min(index, medias.length - 1)))
  }, [medias.length])

  const start = (clientX: number) => {
    drag.current = { startX: clientX, dragging: true, moved: false }
  }

  const move = (clientX: number) => {
    if (!drag.current.dragging) return
    const diff = clientX - drag.current.startX
    if (Math.abs(diff) > 10) drag.current.moved = true
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${diff - current * 100}%)`
      trackRef.current.style.transition = 'none'
    }
  }

  const end = (clientX: number) => {
    if (!drag.current.dragging) return
    const diff = clientX - drag.current.startX
    drag.current.dragging = false
    if (trackRef.current) {
      trackRef.current.style.transform = ''
      trackRef.current.style.transition = ''
    }
    if (drag.current.moved) {
      if (Math.abs(diff) > 60) {
        goTo(diff < 0 ? current + 1 : current - 1)
      }
    } else if (onTap) {
      onTap()
    }
  }

  const media = medias[current]
  if (!media) return null

  return (
    <div className="relative overflow-hidden rounded-lg select-none">
      <div
        ref={trackRef}
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {medias.map((m) => (
          <div key={m.id} className="w-full shrink-0">
            {m.tipo === 'video' ? (
              <video
                src={`${API_BASE}/${m.url}`}
                className="w-full rounded-lg"
                controls
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={`${API_BASE}/${m.url}`}
                alt=""
                className="w-full rounded-lg object-cover"
                loading="lazy"
                draggable={false}
              />
            )}
          </div>
        ))}
      </div>

      {medias.length > 1 && (
        <>
          <div
            className="absolute inset-0 z-10"
            onMouseDown={(e) => start(e.clientX)}
            onMouseMove={(e) => move(e.clientX)}
            onMouseUp={(e) => end(e.clientX)}
            onMouseLeave={(e) => { if (drag.current.dragging) end(e.clientX) }}
            onTouchStart={(e) => start(e.touches[0].clientX)}
            onTouchMove={(e) => move(e.touches[0].clientX)}
            onTouchEnd={(e) => end(e.changedTouches[0].clientX)}
          />

          {current > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(current - 1) }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              ‹
            </button>
          )}
          {current < medias.length - 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goTo(current + 1) }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {medias.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); goTo(i) }}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
