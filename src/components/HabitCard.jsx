import './HabitCard.css'

export default function HabitCard({ habit, logEntry, onToggle, onIncrement, readOnly }) {
  if (!logEntry) return null

  const isCounter = logEntry.type === 'counter'
  const checkboxState = !isCounter ? (logEntry.state || 'pending') : null
  const counterDone = isCounter ? logEntry.done : false
  const isPartial = isCounter && logEntry.count > 0 && !counterDone

  let cardClass = 'habit-card'
  if (isCounter) {
    if (counterDone) cardClass += ' habit-card--done'
    else if (isPartial) cardClass += ' habit-card--partial'
    else cardClass += ' habit-card--pending'
  } else {
    if (checkboxState === 'done') cardClass += ' habit-card--done'
    else if (checkboxState === 'missed') cardClass += ' habit-card--missed'
    else cardClass += ' habit-card--pending'
  }
  if (readOnly) cardClass += ' habit-card--readonly'

  const stateIcon = isCounter
    ? (counterDone ? '✓' : '○')
    : (checkboxState === 'done' ? '✓' : checkboxState === 'missed' ? '✗' : '○')

  function handleCardClick() {
    if (readOnly || isCounter) return
    onToggle(habit.id)
  }

  function handleIncrementClick(e) {
    e.stopPropagation()
    if (readOnly) return
    onIncrement(habit.id)
  }

  const isDone = isCounter ? counterDone : checkboxState === 'done'

  return (
    <div
      className={cardClass}
      onClick={handleCardClick}
      role={isCounter || readOnly ? undefined : 'checkbox'}
      aria-checked={isCounter || readOnly ? undefined : isDone}
      tabIndex={readOnly ? undefined : 0}
      onKeyDown={e => { if (!readOnly && (e.key === ' ' || e.key === 'Enter')) handleCardClick() }}
    >
      <div className="habit-card-left">
        <span className="habit-card-icon">{stateIcon}</span>
        <span className="habit-card-name">
          {habit.icon ? <span className="habit-card-emoji">{habit.icon} </span> : null}
          {habit.name}
        </span>
      </div>

      {isCounter && (
        <div className="habit-card-right">
          <span className="habit-card-progress">
            {logEntry.count} / {logEntry.target}
          </span>
          <button
            className="habit-card-increment"
            onClick={handleIncrementClick}
            disabled={counterDone || readOnly}
            aria-label={`Increment ${habit.name}`}
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
