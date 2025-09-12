import { useState } from 'react'

export default function HabitForm({ onAdd }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({ name: name.trim(), description: description.trim() })
    setName('')
    setDescription('')
  }

  return (
    <form className="habit-form" onSubmit={submit}>
      <input
        placeholder="Habit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="Habit name"
      />
      <input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Habit description"
      />
      <button type="submit">Add Habit</button>
    </form>
  )
}
