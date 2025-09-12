import { useState } from 'react'

export default function HabitList({ habits, onSelect, selectedId, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')

  function startEdit(habit) {
    setEditingId(habit.id)
    setEditName(habit.name)
    setEditDesc(habit.description || '')
  }
  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditDesc('')
  }
  function saveEdit(id) {
    if (!editName.trim()) return
    onEdit(id, { name: editName.trim(), description: editDesc.trim() })
    cancelEdit()
  }

  return (
    <div className="habit-list">
      {habits.length === 0 && <p className="muted">No habits yet</p>}
      {habits.map((h) => (
        <div
          key={h.id}
          className={`habit-item ${selectedId === h.id ? 'selected' : ''}`}
          onClick={() => editingId ? undefined : onSelect(h.id)}
        >
          {editingId === h.id ? (
            <form className="habit-edit-form" onSubmit={e => { e.preventDefault(); saveEdit(h.id) }} style={{display:'flex',gap:8,alignItems:'center',width:'100%'}}>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Habit name"
                style={{flex:1,minWidth:0}}
                autoFocus
              />
              <input
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                placeholder="Description (optional)"
                style={{flex:1,minWidth:0}}
              />
              <button type="submit" title="Save" style={{padding:'0.3em 0.8em'}}>💾</button>
              <button type="button" onClick={cancelEdit} title="Cancel" style={{padding:'0.3em 0.8em'}}>✕</button>
            </form>
          ) : (
            <>
              <div className="habit-main">
                <strong>{h.name}</strong>
                {h.description && <small>{h.description}</small>}
              </div>
              <div className="habit-actions" style={{display:'flex',gap:4}}>
                <button type="button" onClick={e => { e.stopPropagation(); startEdit(h) }} aria-label="Edit" title="Edit">✎</button>
                <button type="button" onClick={e => { e.stopPropagation(); onDelete(h.id) }} aria-label="Delete" title="Delete">✕</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
