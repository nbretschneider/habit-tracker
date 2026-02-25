import { useState } from 'react'
import './App.css'
import { useHabits } from './hooks/useHabits'
import HabitList from './components/HabitList'
import ManageHabits from './components/ManageHabits'
import HabitForm from './components/HabitForm'
import HistoryView from './components/HistoryView'
import { getTodayKey, offsetDateKey } from './utils/dateUtils'

function formatDate(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function App() {
  const [currentView, setCurrentView] = useState('today')
  const [editingHabit, setEditingHabit] = useState(null)
  const [historyDate, setHistoryDate] = useState(() => offsetDateKey(getTodayKey(), -1))
  const { habits, todayLog, addHabit, updateHabit, deleteHabit, toggleHabit, incrementHabit, getLogForDate } = useHabits()

  function handleEdit(habit) {
    setEditingHabit(habit)
    setCurrentView('form')
  }

  function handleAdd() {
    setEditingHabit(null)
    setCurrentView('form')
  }

  function handleSave(data) {
    if (editingHabit) {
      updateHabit(editingHabit.id, data)
    } else {
      addHabit(data)
    }
    setCurrentView('manage')
  }

  function handleCancel() {
    setCurrentView('manage')
  }

  function handleOpenHistory() {
    setHistoryDate(offsetDateKey(getTodayKey(), -1))
    setCurrentView('history')
  }

  const headerTitle = currentView === 'today'
    ? 'Habit Tracker'
    : currentView === 'manage'
    ? 'Manage Habits'
    : currentView === 'history'
    ? 'History'
    : editingHabit ? 'Edit Habit' : 'Add Habit'

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>{headerTitle}</h1>
          {currentView === 'today' && (
            <span className="header-date">{formatDate(getTodayKey())}</span>
          )}
        </div>
        {currentView === 'today' && (
          <div className="header-actions">
            <button className="btn btn-ghost" onClick={handleOpenHistory}>
              History
            </button>
            <button className="btn btn-ghost" onClick={() => setCurrentView('manage')}>
              Manage
            </button>
          </div>
        )}
        {(currentView === 'manage' || currentView === 'form') && (
          <button
            className="btn btn-ghost"
            onClick={() => currentView === 'manage' ? setCurrentView('today') : handleCancel()}
          >
            {currentView === 'manage' ? '← Today' : 'Cancel'}
          </button>
        )}
        {currentView === 'history' && (
          <button className="btn btn-ghost" onClick={() => setCurrentView('today')}>
            ← Today
          </button>
        )}
      </header>

      <main className="app-content">
        {currentView === 'today' && (
          <HabitList
            habits={habits}
            todayLog={todayLog}
            onToggle={toggleHabit}
            onIncrement={incrementHabit}
          />
        )}
        {currentView === 'manage' && (
          <ManageHabits
            habits={habits}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={deleteHabit}
          />
        )}
        {currentView === 'form' && (
          <HabitForm
            initialValues={editingHabit}
            habitCount={habits.length}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
        {currentView === 'history' && (
          <HistoryView
            habits={habits}
            getLogForDate={getLogForDate}
            historyDate={historyDate}
            onDateChange={setHistoryDate}
          />
        )}
      </main>
    </div>
  )
}
