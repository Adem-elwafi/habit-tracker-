import { useEffect, useMemo, useState } from 'react'
import './App.css'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import CalendarGrid from './components/CalendarGrid'
import YearView from './components/YearView'
import DailyView from './components/DailyView'
import Header from './components/Header'

const STORAGE_KEY = 'habit-tracker:v1'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export default function App() {
  const [state, setState] = useState(() => load() || { habits: [], marks: {} })
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('daily') // daily | month | year
  const [viewDate, setViewDate] = useState(() => new Date())

  useEffect(() => save(state), [state])

  const habits = state.habits

  function addHabit({ name, description }) {
    const h = { id: uid(), name, description }
    setState((s) => ({ ...s, habits: [...s.habits, h] }))
    setSelected(h.id)
  }

  function deleteHabit(id) {
    setState((s) => {
      const nextHabits = s.habits.filter((h) => h.id !== id)
      const nextMarks = { ...s.marks }
      // remove marks for deleted habit
      Object.keys(nextMarks).forEach((k) => {
        if (nextMarks[k] && nextMarks[k][id]) {
          const copy = { ...nextMarks[k] }
          delete copy[id]
          nextMarks[k] = Object.keys(copy).length ? copy : undefined
        }
      })
      return { ...s, habits: nextHabits, marks: nextMarks }
    })
    if (selected === id) setSelected(null)
  }

  function toggleDay(key) {
    if (!selected) return
    setState((s) => {
      const marks = { ...s.marks }
      const day = marks[key] ? { ...marks[key] } : {}
      if (day[selected]) delete day[selected]
      else day[selected] = true
      marks[key] = Object.keys(day).length ? day : undefined
      return { ...s, marks }
    })
  }

  function toggleDailyTask(habitId, key) {
    setState((s) => {
      const marks = { ...s.marks }
      const day = marks[key] ? { ...marks[key] } : {}
      if (day[habitId]) delete day[habitId]
      else day[habitId] = true
      marks[key] = Object.keys(day).length ? day : undefined
      return { ...s, marks }
    })
  }

  function prevMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  function nextMonth() {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  const marksForCurrent = useMemo(() => {
    if (!selected) return {}
    const map = {}
    for (const [day, blob] of Object.entries(state.marks || {})) {
      if (blob && blob[selected]) map[day] = true
    }
    return map
  }, [state.marks, selected])

  function editHabit(id, { name, description }) {
    setState(s => ({
      ...s,
      habits: s.habits.map(h => h.id === id ? { ...h, name, description } : h)
    }))
  }

  return (
    <div className="app-root">
      <Header>
        <HabitForm onAdd={addHabit} />
      </Header>

      <div className="habit-list">
        <HabitList habits={habits} onSelect={setSelected} selectedId={selected} onDelete={deleteHabit} onEdit={editHabit} />
      </div>

      <div className="view-toggle">
        <button type="button" onClick={() => setMode('daily')} aria-pressed={mode==='daily'} className={mode==='daily'? 'active':''}>Daily</button>
        <button type="button" onClick={() => setMode('month')} aria-pressed={mode==='month'} className={mode==='month'? 'active':''}>Month</button>
        <button type="button" onClick={() => setMode('year')} aria-pressed={mode==='year'} className={mode==='year'? 'active':''}>Year</button>
      </div>

      <div className="content">
        {mode === 'daily' ? (
          <DailyView habits={habits} marks={state.marks} onToggle={toggleDailyTask} />
        ) : (
          <>
            {!selected && <div className="muted">Select a habit to start tracking</div>}
            {selected && <div className="tracking-info">Tracking: <strong>{(habits.find(h=>h.id===selected)||{}).name}</strong></div>}

            {mode === 'month' ? (
              <CalendarGrid date={viewDate} marks={marksForCurrent} onToggleDay={toggleDay} onPrevMonth={prevMonth} onNextMonth={nextMonth} />
            ) : (
              <YearView year={viewDate.getFullYear()} marks={marksForCurrent} onToggle={toggleDay} />
            )}
          </>
        )}
      </div>

  <footer className="app-footer">Built with React · Data stored locally</footer>
    </div>
  )
}
