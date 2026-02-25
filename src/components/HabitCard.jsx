import './HabitCard.css'

export default function HabitCard({ habit, logEntry, onToggle, onIncrement }) {
  if (!logEntry) return null

  const { done, type } = logEntry
  const isCounter = type === 'counter'
  const isPartial = isCounter && logEntry.count > 0 && !done

  let cardClass = 'habit-card'
  if (done) cardClass += ' habit-card--done'
  else if (isPartial) cardClass += ' habit-card--partial'
  else cardClass += ' habit-card--pending'

  const icon = done ? '✓' : '✗'

  function handleCardClick() {
    if (!isCounter) {
      onToggle(habit.id)
    }
  }

  function handleIncrementClick(e) {
    e.stopPropagation()
    onIncrement(habit.id)
  }

  return (
    <div
      className={cardClass}
      onClick={handleCardClick}
      role={isCounter ? undefined : 'checkbox'}
      aria-checked={isCounter ? undefined : done}
      tabIndex={0}
      onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') handleCardClick() }}
    >
      <div className="habit-card-left">
        <span className="habit-card-icon">{icon}</span>
        <span className="habit-card-name">{habit.name}</span>
      </div>

      {isCounter && (
        <div className="habit-card-right">
          <span className="habit-card-progress">
            {logEntry.count} / {logEntry.target}
          </span>
          <button
            className="habit-card-increment"
            onClick={handleIncrementClick}
            disabled={done}
            aria-label={`Increment ${habit.name}`}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
