import { useRef } from 'react'

function MonthBlock({ year, monthIndex, marks, onToggle }) {
  const audioRef = useRef(null)
  const first = new Date(year, monthIndex, 1)
  const days = new Date(year, monthIndex + 1, 0).getDate()
  const label = first.toLocaleString(undefined, { month: 'short' })
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  function playClickSound() {
    try {
      if (audioRef.current && typeof audioRef.current.play === 'function') {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => synthClick())
        return
      }
    } catch (e) {
      // ignore
    }
    synthClick()
  }

  function synthClick() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'triangle'
      o.frequency.value = 740
      g.gain.value = 0.05
      o.connect(g)
      g.connect(ctx.destination)
      o.start()
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
      o.stop(ctx.currentTime + 0.13)
    } catch (e) {}
  }

  function handleDayClick(key, done) {
    onToggle(key)
    if (!done) playClickSound()
  }

  return (
    <div className="year-month">
      <audio ref={audioRef} src="/check.mp3" preload="auto" />
      <div className="year-month-label">{label}</div>
      <div className="year-days">
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1
          const key = `${year}-${String(monthIndex + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const done = !!marks[key]
          const isToday = key === todayKey && year === today.getFullYear() && monthIndex === today.getMonth()
          return (
            <div
              key={key}
              className={`year-day${done ? ' done' : ''}${isToday ? ' cell-today' : ''}`}
              onClick={() => handleDayClick(key, done)}
              role="button"
              tabIndex={0}
              aria-pressed={done}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleDayClick(key, done)
                }
              }}
            >
              <span style={{ visibility: done ? 'hidden' : 'visible' }}>{day}</span>
              {done && (
                <div className="cell-check" aria-hidden>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function YearView({ year, marks = {}, onToggle }) {
  return (
    <div className="year-view">
      {Array.from({ length: 12 }).map((_, m) => (
        <MonthBlock key={m} year={year} monthIndex={m} marks={marks} onToggle={onToggle} />
      ))}
    </div>
  )
}
