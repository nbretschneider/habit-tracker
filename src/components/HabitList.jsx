import './HabitList.css'
import HabitCard from './HabitCard'

export default function HabitList({ habits, todayLog, onToggle, onIncrement, readOnly }) {
  if (habits.length === 0) {
    return (
      <div className="habit-list-empty">
        <span className="empty-icon">📋</span>
        <p>
          <strong>No habits yet</strong>
          Tap <b>Manage</b> in the top right to add your first habit.
        </p>
      </div>
    )
  }

  const doneCount = habits.filter(h => {
    const entry = todayLog[h.id]
    if (!entry) return false
    if (entry.type === 'checkbox') return entry.state === 'done'
    return entry.done
  }).length
  const allDone = doneCount === habits.length

  return (
    <div className="habit-list">
      <p className={`habit-list-summary${allDone ? ' all-done' : ''}`}>
        {allDone
          ? `All ${habits.length} habits complete! ✓`
          : `${doneCount} of ${habits.length} done`}
      </p>
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          logEntry={todayLog[habit.id]}
          onToggle={onToggle}
          onIncrement={onIncrement}
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}
