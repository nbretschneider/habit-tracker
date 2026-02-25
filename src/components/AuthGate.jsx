import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './AuthGate.css'

export default function AuthGate() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="auth-gate">
      <div className="auth-card">
        <div className="auth-icon">✅</div>
        <h1>Habit Tracker</h1>
        <p className="auth-subtitle">Track your daily habits, permanently.</p>

        {sent ? (
          <div className="auth-sent">
            <span className="auth-sent-icon">📧</span>
            <p><strong>Check your email!</strong></p>
            <p>We sent a sign-in link to <strong>{email}</strong>. Click it to continue.</p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="auth-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Sending…' : 'Send Magic Link'}
            </button>
            <p className="auth-hint">No password needed — we'll email you a sign-in link.</p>
          </form>
        )}
      </div>
    </div>
  )
}
