'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  async function handleSignUp() {
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px', color: '#f0f0ee', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: 'var(--font-sora), sans-serif',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06080c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-sora), sans-serif',
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>

        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
            <g transform="rotate(30 32 32)">
              <rect x="18" y="10" width="12" height="44" rx="6" fill="url(#signupGrad)" />
              <rect x="34" y="10" width="12" height="44" rx="6" fill="#ffffff" fillOpacity="0.04" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
              <circle cx="32" cy="32" r="4.5" fill="#03df53" stroke="#000000" strokeWidth="2" />
            </g>
            <defs>
              <linearGradient id="signupGrad" x1="18" y1="10" x2="30" y2="54" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#f0f0ee', letterSpacing: '-0.01em' }}>Parallax</span>
        </Link>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#f0f0ee', letterSpacing: '-0.02em', marginBottom: '8px' }}>Create account</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: 300 }}>Start monitoring drift today</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.2)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.2)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.2)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              onKeyDown={e => e.key === 'Enter' && handleSignUp()}
            />
          </div>

          {error && <p style={{ fontSize: '13px', color: '#ef4444', margin: '0' }}>{error}</p>}

          <button
            onClick={handleSignUp}
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: '#f0f0ee', border: 'none', borderRadius: '8px',
              color: '#06080c', fontSize: '14px', fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s ease',
              fontFamily: 'var(--font-sora), sans-serif', marginTop: '8px',
            }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '32px' }}>
          Already have an account?{' '}
          <Link href="/auth/signin" style={{ color: '#f0f0ee', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}