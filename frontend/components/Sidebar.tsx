'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { href: '/', icon: '⬡', label: 'Overview' },
  { href: '/classification', icon: '◈', label: 'Classification' },
  { href: '/llm', icon: '◎', label: 'LLM Drift' },
  { href: '/regression', icon: '◇', label: 'Regression' },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'
  const bg = isDark ? '#0d0f16' : '#ffffff'
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const textMuted = isDark ? '#4b5563' : '#9ca3af'
  const textActive = isDark ? '#f9fafb' : '#111827'
  const activeBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'

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
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: '#fff',
          fontWeight: 700,
        }}>P</div>
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

      {/* Theme Toggle */}
      <div style={{ padding: '0 8px' }}>
        <button
          onClick={toggleTheme}
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
        >
          <span style={{
            fontSize: '16px',
            color: textMuted,
            flexShrink: 0,
            width: '24px',
            textAlign: 'center',
          }}>{isDark ? '☀' : '☾'}</span>
          <span style={{
            fontSize: '13px',
            color: textMuted,
            opacity: expanded ? 1 : 0,
            transition: 'opacity 0.2s ease',
          }}>{isDark ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </div>
    </aside>
  )
}