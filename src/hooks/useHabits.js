import { useState, useEffect } from 'react'
import { getTodayKey } from '../utils/dateUtils'

const HABITS_KEY = 'habit-tracker-habits'
const LOG_KEY = 'habit-tracker-log'

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function useHabits() {
  const [habits, setHabits] = useState(() => loadFromStorage(HABITS_KEY, []))
  const [log, setLog] = useState(() => loadFromStorage(LOG_KEY, {}))

  // Persist habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
  }, [habits])

  // Persist log to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOG_KEY, JSON.stringify(log))
  }, [log])

  // Initialize today's log entries when date changes or habits change
  useEffect(() => {
    const today = getTodayKey()
    setLog(prev => {
      const todayLog = prev[today] || {}
      const updated = { ...todayLog }
      let changed = false

      habits.forEach(h => {
        if (!updated[h.id]) {
          updated[h.id] = h.type === 'checkbox'
            ? { type: 'checkbox', done: false }
            : { type: 'counter', count: 0, target: h.target, done: false }
          changed = true
        }
      })

      if (!changed && prev[today]) return prev
      return { ...prev, [today]: updated }
    })
  }, [habits])

  const todayLog = log[getTodayKey()] || {}

  function toggleHabit(id) {
    const today = getTodayKey()
    setLog(prev => {
      const entry = prev[today]?.[id]
      if (!entry) return prev
      return {
        ...prev,
        [today]: {
          ...prev[today],
          [id]: { ...entry, done: !entry.done }
        }
      }
    })
  }

  function incrementHabit(id) {
    const today = getTodayKey()
    setLog(prev => {
      const entry = prev[today]?.[id]
      if (!entry || entry.type !== 'counter') return prev
      const newCount = Math.min(entry.count + 1, entry.target)
      const done = newCount >= entry.target
      return {
        ...prev,
        [today]: {
          ...prev[today],
          [id]: { ...entry, count: newCount, done }
        }
      }
    })
  }

  function addHabit(data) {
    if (habits.length >= 10) return
    const newHabit = {
      id: 'h_' + Date.now(),
      name: data.name.trim(),
      type: data.type,
      target: data.type === 'counter' ? Number(data.target) : null,
      order: habits.length,
    }
    setHabits(prev => [...prev, newHabit])
  }

  function updateHabit(id, data) {
    setHabits(prev =>
      prev.map(h =>
        h.id === id
          ? {
              ...h,
              name: data.name.trim(),
              type: data.type,
              target: data.type === 'counter' ? Number(data.target) : null,
            }
          : h
      )
    )
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  return {
    habits,
    todayLog,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    incrementHabit,
  }
}
