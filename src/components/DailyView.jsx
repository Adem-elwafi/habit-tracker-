import { useRef } from 'react'

export default function DailyView({ habits, marks, onToggle }) {
  const audioRef = useRef(null)
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  const dateLabel = today.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  function playClickSound() {
    try {
      if (audioRef.current && typeof audioRef.current.play === 'function') {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => synthClick())
        return
      }
    } catch (e) {
      // ignore 
      e.message ; 
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
      } catch {
        // Web Audio API not supported
      }
  }

  function handleToggle(habitId) {
    const isCurrentlyDone = marks[todayKey] && marks[todayKey][habitId]
    onToggle(habitId, todayKey)
    if (!isCurrentlyDone) playClickSound()
  }

  if (habits.length === 0) {
    return (
      <div className="daily-view">
        <div className="daily-header">
          <h2 className="daily-date">{dateLabel}</h2>
          <p className="muted">No habits to track yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="daily-view">
      <audio ref={audioRef} src="/check.mp3" preload="auto" />
      <div className="daily-header">
        <h2 className="daily-date">{dateLabel}</h2>
        <p className="daily-subtitle">Complete your habits for today</p>
      </div>
      <div className="daily-tasks">
        {habits.map((habit) => {
          const isDone = marks[todayKey] && marks[todayKey][habit.id]
          return (
            <div
              key={habit.id}
              className={`daily-task${isDone ? ' completed' : ''}`}
              onClick={() => handleToggle(habit.id)}
              role="checkbox"
              aria-checked={isDone}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleToggle(habit.id)
                }
              }}
            >
              <div className="task-checkbox">
                {isDone && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="task-content">
                <div className="task-name">{habit.name}</div>
                {habit.description && <div className="task-description">{habit.description}</div>}
              </div>
            </div>
          )
        })}
      </div>
      <div className="daily-progress">
        <div className="progress-text">
          {habits.filter(h => marks[todayKey] && marks[todayKey][h.id]).length} of {habits.length} completed
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(habits.filter(h => marks[todayKey] && marks[todayKey][h.id]).length / habits.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
