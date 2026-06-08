'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const navItems = [
  { href: '/dashboard', icon: '⬡', label: 'Overview' },
  { href: '/dashboard/classification', icon: '◈', label: 'Classification' },
  { href: '/dashboard/llm', icon: '◎', label: 'LLM Drift' },
  { href: '/dashboard/regression', icon: '◇', label: 'Regression' },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const bg = '#0d0f16'
  const border = 'rgba(255,255,255,0.06)'
  const textMuted = '#ffffff'
  const textActive = '#f9fafb'
  const activeBg = 'rgba(255,255,255,0.06)'

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? '200px' : '56px',
        minHeight: '100vh',
        background: bg,
        borderRight: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '0 16px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        whiteSpace: 'nowrap',
      }}>
        <svg width="24" height="24" viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0 }}>
          <g transform="rotate(30 32 32)">
            <rect x="18" y="10" width="12" height="44" rx="6" fill="url(#sidebarGrad)" />
            <rect x="34" y="10" width="12" height="44" rx="6" fill="#ffffff" fillOpacity="0.04" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
            <circle cx="32" cy="32" r="4.5" fill="#03df53" stroke="#000000" strokeWidth="2" />
          </g>
          <defs>
            <linearGradient id="sidebarGrad" x1="18" y1="10" x2="30" y2="54" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="1" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
        <span style={{
          fontSize: '15px',
          fontWeight: 600,
          color: textActive,
          opacity: expanded ? 1 : 0,
          transition: 'opacity 0.2s ease',
          letterSpacing: '-0.01em',
        }}>Parallax</span>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 8px' }}>
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 8px',
                borderRadius: '8px',
                background: isActive ? activeBg : 'transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.2s ease',
              }}>
                <span style={{
                  fontSize: '16px',
                  color: isActive ? '#818cf8' : textMuted,
                  flexShrink: 0,
                  width: '24px',
                  textAlign: 'center',
                  transition: 'color 0.2s ease',
                }}>{item.icon}</span>
                <span style={{
                  fontSize: '13px',
                  color: isActive ? textActive : textMuted,
                  opacity: expanded ? 1 : 0,
                  transition: 'opacity 0.2s ease',
                  fontWeight: isActive ? 500 : 400,
                }}>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div style={{ padding: '0 8px' }}>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 8px',
            borderRadius: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
        >
          <span style={{
            fontSize: '16px',
            color: textMuted,
            flexShrink: 0,
            width: '24px',
            textAlign: 'center',
          }}>→</span>
          <span style={{
            fontSize: '13px',
            color: textMuted,
            opacity: expanded ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}>Sign out</span>
        </button>
      </div>
    </aside>
  )
}