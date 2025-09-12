import React from 'react'

export default function Header({ children }) {
  return (
    <header className="app-header">
      <h1>Habit Tracker</h1>
      <p className="subtitle">Small, local-first habit tracking</p>
      {children}
    </header>
  )
}
