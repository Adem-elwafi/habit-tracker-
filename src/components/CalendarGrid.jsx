

import MonthSelector from './MonthSelector'
import { useRef, useState } from 'react'

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = firstDay.getDay() // 0..6
  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  return cells
}



export default function CalendarGrid({ date, marks = {}, onToggleDay, onPrevMonth, onNextMonth }) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const cells = getMonthDays(year, month)
  const weekdays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  // Sound effect: prefer audio file, fallback to WebAudio synth
  const audioRef = useRef()

  function playClickSound() {
    // Try DOM audio first
    try {
      if (audioRef.current && typeof audioRef.current.play === 'function') {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {
          // play could be blocked; fallback to synth
          synthClick()
        })
        return
      }
    } catch (e) {
      // ignore and fallback
    }
    synthClick()
  }

  function synthClick() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioCtx()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 900
      g.gain.value = 0.05
      o.connect(g)
      g.connect(ctx.destination)
      o.start()
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12)
      o.stop(ctx.currentTime + 0.13)
    } catch (e) {
      // final fallback: no-op
    }
  }

  function handleCellClick(key, done) {
    onToggleDay(key)
    // Only play sound when marking as done
    if (!done) playClickSound()
  }

  // Force update for flames effect
  const [, forceUpdate] = useState(0)

  return (
    <div className="calendar">
      <audio ref={audioRef} src="/check.mp3" preload="auto" />
      <MonthSelector date={date} onPrev={onPrevMonth} onNext={onNextMonth} />
      <div className="weekdays">
        {weekdays.map((w) => <div key={w} className="weekday">{w}</div>)}
      </div>
      <div className="cells">
        {cells.map((dt, i) => {
          if (!dt) return <div key={`empty-${i}`} className="cell empty" />
          const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
          const done = !!marks[key]
          const isToday = key === todayKey && dt.getMonth() === today.getMonth() && dt.getFullYear() === today.getFullYear()
          return (
            <div
              key={key}
              className={`cell${done ? ' done' : ''}${isToday ? ' cell-today' : ''}`}
              onClick={() => { handleCellClick(key, done); forceUpdate(x => x+1) }}
              tabIndex={0}
              role="button"
              aria-pressed={done}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleCellClick(key, done)
                  forceUpdate(x => x + 1)
                }
              }}
            >
              <div className="cell-num">{dt.getDate()}</div>
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
