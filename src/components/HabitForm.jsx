import { useState } from 'react'
import './HabitForm.css'
import { ICON_CATEGORIES } from '../data/icons'

export default function HabitForm({ initialValues, habitCount, onSave, onCancel }) {
  const isEditing = !!initialValues
  const [name, setName] = useState(initialValues?.name ?? '')
  const [type, setType] = useState(initialValues?.type ?? 'checkbox')
  const [target, setTarget] = useState(initialValues?.target ?? 5)
  const [icon, setIcon] = useState(initialValues?.icon ?? '')
  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!name.trim()) errs.name = 'Name is required.'
    if (type === 'counter') {
      const t = Number(target)
      if (!Number.isInteger(t) || t < 2) errs.target = 'Target must be a whole number of 2 or more.'
    }
    if (!isEditing && habitCount >= 10) errs.limit = 'You already have 10 habits (the maximum).'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave({ name, type, target: Number(target), icon })
  }

  function handleIconClick(emoji) {
    setIcon(prev => prev === emoji ? '' : emoji)
  }

  return (
    <form className="habit-form" onSubmit={handleSubmit} noValidate>

      <div className={`form-field${errors.name ? ' form-field-error' : ''}`}>
        <label htmlFor="habit-name">
          Habit name
          {icon && <span className="form-icon-preview">{icon}</span>}
        </label>
        <input
          id="habit-name"
          type="text"
          placeholder="e.g. Brush teeth, Drink water…"
          value={name}
          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
          maxLength={50}
          autoFocus
        />
        {errors.name && <span className="form-error-msg">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label>Type</label>
        <div className="type-options">
          <label className={`type-option${type === 'checkbox' ? ' type-option--selected' : ''}`}>
            <input
              type="radio"
              name="type"
              value="checkbox"
              checked={type === 'checkbox'}
              onChange={() => setType('checkbox')}
            />
            <span className="type-option-label">✓ Checkbox</span>
            <span className="type-option-desc">Tap once to mark done</span>
          </label>
          <label className={`type-option${type === 'counter' ? ' type-option--selected' : ''}`}>
            <input
              type="radio"
              name="type"
              value="counter"
              checked={type === 'counter'}
              onChange={() => setType('counter')}
            />
            <span className="type-option-label">+ Counter</span>
            <span className="type-option-desc">Tap + to count up to a target</span>
          </label>
        </div>
      </div>

      {type === 'counter' && (
        <div className={`form-field${errors.target ? ' form-field-error' : ''}`}>
          <label htmlFor="habit-target">Target (how many?)</label>
          <input
            id="habit-target"
            type="number"
            min={2}
            max={99}
            value={target}
            onChange={e => { setTarget(e.target.value); setErrors(p => ({ ...p, target: undefined })) }}
          />
          {errors.target && <span className="form-error-msg">{errors.target}</span>}
        </div>
      )}

      <div className="form-field">
        <label>Icon <span className="form-label-optional">(optional)</span></label>
        <div className="icon-picker">
          {ICON_CATEGORIES.map(cat => (
            <div key={cat.label} className="icon-category">
              <span className="icon-category-label">{cat.label}</span>
              <div className="icon-grid">
                {cat.icons.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    className={`icon-btn${icon === emoji ? ' icon-btn--selected' : ''}`}
                    onClick={() => handleIconClick(emoji)}
                    aria-label={emoji}
                    aria-pressed={icon === emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {errors.limit && <span className="form-error-msg">{errors.limit}</span>}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Save Changes' : 'Add Habit'}
        </button>
      </div>

    </form>
  )
}
