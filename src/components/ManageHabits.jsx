import './ManageHabits.css'

export default function ManageHabits({ habits, onAdd, onEdit, onDelete, onSignOut }) {
  const atMax = habits.length >= 10

  function handleDelete(habit) {
    if (window.confirm(`Delete "${habit.name}"? This can't be undone.`)) {
      onDelete(habit.id)
    }
  }

  return (
    <div className="manage-habits">
      <p className="manage-habits-count">
        {habits.length} / 10 habits configured
      </p>

      <button
        className="btn btn-primary"
        onClick={onAdd}
        disabled={atMax}
      >
        + Add Habit
      </button>

      {atMax && (
        <p className="manage-habits-limit">Maximum of 10 habits reached.</p>
      )}

      {habits.length === 0 ? (
        <div className="manage-empty">
          <span className="empty-icon">✏️</span>
          <p>No habits yet. Add your first one above!</p>
        </div>
      ) : (
        habits.map(habit => (
          <div key={habit.id} className="manage-habit-item">
            <div className="manage-habit-info">
              <div className="manage-habit-name">
              {habit.icon && <span className="manage-habit-icon">{habit.icon} </span>}
              {habit.name}
            </div>
              <div className="manage-habit-meta">
                {habit.type === 'checkbox'
                  ? 'Checkbox'
                  : `Counter · target: ${habit.target}`}
              </div>
            </div>
            <div className="manage-habit-actions">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onEdit(habit)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(habit)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
      <button className="btn btn-ghost manage-signout" onClick={onSignOut}>
        Sign out
      </button>
    </div>
  )
}
