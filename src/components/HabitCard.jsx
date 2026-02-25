import { useState, useEffect } from 'react'
import './HabitCard.css'

export default function HabitCard({ habit, logEntry, onToggle, onSetCount, readOnly }) {
  if (!logEntry) return null

  const isCounter = logEntry.type === 'counter'
  const state = logEntry.state || 'pending'
  const [countInput, setCountInput] = useState(String(logEntry.count))

  useEffect(() => {
    setCountInput(String(logEntry.count))
  }, [logEntry.count])

  let cardClass = 'habit-card'
  if (state === 'done') cardClass += ' habit-card--done'
  else if (state === 'missed') cardClass += ' habit-card--missed'
  else cardClass += ' habit-card--pending'
  if (readOnly) cardClass += ' habit-card--readonly'

  const stateIcon = state === 'done' ? '✓' : state === 'missed' ? '✗' : '○'

  function handleCardClick() {
    if (readOnly) return
    onToggle(habit.id)
  }

  function handleCountChange(e) {
    setCountInput(e.target.value)
  }

  function handleCountBlur() {
    const val = parseInt(countInput, 10)
    const newCount = isNaN(val) || val < 0 ? 0 : val
    setCountInput(String(newCount))
    if (newCount !== logEntry.count) onSetCount(habit.id, newCount)
  }

  function handleCountKeyDown(e) {
    if (e.key === 'Enter') e.target.blur()
    e.stopPropagation()
  }

  const unit = habit.unit ? ' ' + habit.unit : ''

  return (
    <div
      className={cardClass}
      onClick={handleCardClick}
      role="checkbox"
      aria-checked={state === 'done'}
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
        <div className="habit-card-right" onClick={e => e.stopPropagation()}>
          <input
            className="habit-card-count-input"
            type="number"
            min={0}
            value={countInput}
            onChange={handleCountChange}
            onBlur={handleCountBlur}
            onKeyDown={handleCountKeyDown}
            disabled={readOnly}
            aria-label={`Count for ${habit.name}`}
          />
          {(logEntry.target || habit.unit) && (
            <span className="habit-card-count-label">
              {logEntry.target ? `/ ${logEntry.target}${unit}` : unit}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
