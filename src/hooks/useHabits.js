import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getTodayKey } from '../utils/dateUtils'

const CHECKBOX_CYCLE = { pending: 'done', done: 'missed', missed: 'pending' }

export function useHabits(userId) {
  const [habits, setHabits] = useState([])
  const [log, setLog] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setHabits([])
      setLog({})
      setLoading(false)
      return
    }
    loadAll()
  }, [userId])

  async function loadAll() {
    setLoading(true)

    const [{ data: habitsData }, { data: logData }] = await Promise.all([
      supabase.from('habits').select('*').order('created_at'),
      supabase.from('habit_log').select('*'),
    ])

    const loadedHabits = habitsData || []

    // Build log map: { date: { habitId: uiEntry } }
    const logMap = {}
    ;(logData || []).forEach(row => {
      if (!logMap[row.date]) logMap[row.date] = {}
      logMap[row.date][row.habit_id] = row.type === 'checkbox'
        ? { type: 'checkbox', state: row.state || 'pending' }
        : { type: 'counter', count: row.count ?? 0, target: row.target, done: row.done ?? false }
    })

    // Ensure today's entries exist locally for all habits
    const today = getTodayKey()
    if (!logMap[today]) logMap[today] = {}
    loadedHabits.forEach(h => {
      if (!logMap[today][h.id]) {
        logMap[today][h.id] = h.type === 'checkbox'
          ? { type: 'checkbox', state: 'pending' }
          : { type: 'counter', count: 0, target: h.target, done: false }
      }
    })

    setHabits(loadedHabits)
    setLog(logMap)
    setLoading(false)
  }

  const todayLog = log[getTodayKey()] || {}

  async function toggleHabit(id) {
    const today = getTodayKey()
    const entry = log[today]?.[id]
    if (!entry || entry.type !== 'checkbox') return

    const nextState = CHECKBOX_CYCLE[entry.state] || 'done'

    // Optimistic UI update
    setLog(prev => ({
      ...prev,
      [today]: { ...prev[today], [id]: { ...entry, state: nextState } }
    }))

    await supabase.from('habit_log').upsert({
      user_id: userId,
      habit_id: id,
      date: today,
      type: 'checkbox',
      state: nextState,
    }, { onConflict: 'user_id,habit_id,date' })
  }

  async function incrementHabit(id) {
    const today = getTodayKey()
    const entry = log[today]?.[id]
    if (!entry || entry.type !== 'counter') return

    const newCount = Math.min(entry.count + 1, entry.target)
    const done = newCount >= entry.target

    // Optimistic UI update
    setLog(prev => ({
      ...prev,
      [today]: { ...prev[today], [id]: { ...entry, count: newCount, done } }
    }))

    await supabase.from('habit_log').upsert({
      user_id: userId,
      habit_id: id,
      date: today,
      type: 'counter',
      count: newCount,
      done,
      target: entry.target,
    }, { onConflict: 'user_id,habit_id,date' })
  }

  async function addHabit(data) {
    if (habits.length >= 10) return
    const newHabit = {
      id: 'h_' + Date.now(),
      user_id: userId,
      name: data.name.trim(),
      type: data.type,
      target: data.type === 'counter' ? Number(data.target) : null,
      icon: data.icon ?? '',
    }

    const { error } = await supabase.from('habits').insert(newHabit)
    if (error) return

    setHabits(prev => [...prev, newHabit])

    // Add pending entry for today in local state
    const today = getTodayKey()
    const todayEntry = newHabit.type === 'checkbox'
      ? { type: 'checkbox', state: 'pending' }
      : { type: 'counter', count: 0, target: newHabit.target, done: false }
    setLog(prev => ({
      ...prev,
      [today]: { ...(prev[today] || {}), [newHabit.id]: todayEntry }
    }))
  }

  async function updateHabit(id, data) {
    const updates = {
      name: data.name.trim(),
      type: data.type,
      target: data.type === 'counter' ? Number(data.target) : null,
      icon: data.icon ?? '',
    }

    const { error } = await supabase.from('habits').update(updates).eq('id', id).eq('user_id', userId)
    if (!error) {
      setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h))
    }
  }

  async function deleteHabit(id) {
    const { error } = await supabase.from('habits').delete().eq('id', id).eq('user_id', userId)
    if (!error) {
      setHabits(prev => prev.filter(h => h.id !== id))
    }
  }

  function getLogForDate(dateKey) {
    return log[dateKey] || {}
  }

  return {
    habits,
    todayLog,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    incrementHabit,
    getLogForDate,
  }
}
