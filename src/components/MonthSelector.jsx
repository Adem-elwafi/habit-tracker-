export default function MonthSelector({ date, onPrev, onNext }) {
  const label = date.toLocaleString(undefined, { month: 'long', year: 'numeric' })
  return (
    <div className="month-selector">
      <button type="button" onClick={onPrev} aria-label="Previous month">◀</button>
      <div className="month-label">{label}</div>
      <button type="button" onClick={onNext} aria-label="Next month">▶</button>
    </div>
  )
}
