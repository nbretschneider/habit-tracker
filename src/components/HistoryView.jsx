import './HistoryView.css'
import HabitList from './HabitList'
import { getTodayKey, offsetDateKey } from '../utils/dateUtils'

function formatDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function HistoryView({ habits, getLogForDate, historyDate, onDateChange }) {
  const yesterdayKey = offsetDateKey(getTodayKey(), -1)
  const canGoForward = historyDate < yesterdayKey
  const dayLog = getLogForDate(historyDate)
  const hasData = Object.keys(dayLog).length > 0

  return (
    <div className="history-view">
      <div className="history-nav">
        <button
          className="btn btn-ghost btn-sm history-nav-arrow"
          onClick={() => onDateChange(offsetDateKey(historyDate, -1))}
          aria-label="Previous day"
        >
          ←
        </button>
        <span className="history-date-label">{formatDate(historyDate)}</span>
        <button
          className="btn btn-ghost btn-sm history-nav-arrow"
          onClick={() => onDateChange(offsetDateKey(historyDate, 1))}
          disabled={!canGoForward}
          aria-label="Next day"
        >
          →
        </button>
      </div>

      {!hasData ? (
        <div className="history-empty">
          <span className="empty-icon">📅</span>
          <p>No data recorded for this day.</p>
        </div>
      ) : (
        <HabitList
          habits={habits}
          todayLog={dayLog}
          onToggle={() => {}}
          onIncrement={() => {}}
          readOnly
        />
      )}
    </div>
  )
}
