'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../context/ThemeContext'
import Link from 'next/link'

const MetricCard = ({
  title, subtitle, value, unit, status, href, color, isDark
}: {
  title: string, subtitle: string, value: string,
  unit: string, status: string, href: string, color: string, isDark: boolean
}) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <div style={{
      background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: '16px',
      padding: '28px',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, border-color 0.2s ease',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = color
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '12px', color: isDark ? '#6b7280' : '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{title}</p>
          <p style={{ fontSize: '13px', color: isDark ? '#4b5563' : '#d1d5db' }}>{subtitle}</p>
        </div>
        <span style={{
          fontSize: '11px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: status === 'YES' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
          color: status === 'YES' ? '#ef4444' : '#22c55e',
          border: `1px solid ${status === 'YES' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
        }}>{status === 'YES' ? 'Drifted' : 'Stable'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: '36px', fontWeight: 700, color, fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>{value}</span>
        <span style={{ fontSize: '13px', color: isDark ? '#6b7280' : '#9ca3af' }}>{unit}</span>
      </div>
    </div>
  </Link>
)

export default function Overview() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const textPrimary = isDark ? '#f9fafb' : '#111827'
  const textMuted = isDark ? '#6b7280' : '#9ca3af'

  const [classLast, setClassLast] = useState<any>(null)
  const [llmLast, setLlmLast] = useState<any>(null)
  const [regLast, setRegLast] = useState<any>(null)

  useEffect(() => {
    async function fetch() {
      const { data: c } = await supabase.from('drift_logs').select('*').order('timestamp', { ascending: false }).limit(1)
      const { data: l } = await supabase.from('llm_drift_logs').select('*').order('timestamp', { ascending: false }).limit(1)
      const { data: r } = await supabase.from('regression_drift_logs').select('*').order('timestamp', { ascending: false }).limit(1)
      if (c?.[0]) setClassLast(c[0])
      if (l?.[0]) setLlmLast(l[0])
      if (r?.[0]) setRegLast(r[0])
    }
    fetch()
  }, [])

  return (
    <div style={{ padding: '48px 40px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
          <span style={{ fontSize: '11px', color: '#22c55e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Monitoring</span>
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: 700, color: textPrimary, letterSpacing: '-0.03em', fontFamily: 'Georgia, serif', marginBottom: '10px' }}>Parallax</h1>
        <p style={{ fontSize: '15px', color: textMuted, maxWidth: '480px', lineHeight: 1.6 }}>
          Model-agnostic shadow deployment framework for real-time concept drift detection across classification, LLM, and regression models.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        <MetricCard
          title="Classification Drift" subtitle="Random Forest vs Logistic Regression"
          value={classLast ? classLast.kl_divergence.toFixed(4) : '—'}
          unit="KL Divergence"
          status={classLast?.is_drifted ?? 'NO'}
          href="/classification" color="#818cf8" isDark={isDark}
        />
        <MetricCard
          title="LLM Semantic Drift" subtitle="LLaMA 3.1 8B vs LLaMA 3.3 70B"
          value={llmLast ? llmLast.semantic_drift_score.toFixed(4) : '—'}
          unit="Semantic Drift Score"
          status={llmLast?.is_drifted ?? 'NO'}
          href="/llm" color="#f43f5e" isDark={isDark}
        />
        <MetricCard
          title="Regression Drift" subtitle="Random Forest vs Linear Regression"
          value={regLast ? regLast.wasserstein_distance.toFixed(2) : '—'}
          unit="Wasserstein Distance"
          status={regLast?.is_drifted ?? 'NO'}
          href="/regression" color="#a78bfa" isDark={isDark}
        />
      </div>

      <div style={{ marginTop: '48px', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '12px', color: isDark ? '#374151' : '#d1d5db' }}>FastAPI · Scikit-learn · Groq · Supabase</p>
        <p style={{ fontSize: '12px', color: isDark ? '#374151' : '#d1d5db' }}>v0.1.0</p>
      </div>
    </div>
  )
}