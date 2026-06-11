'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Overview() {
  const bg = '#080a0f'
  const textPrimary = '#f0f0ee'
  const textMuted = '#9ca3af'
  const textSub = '#6b7280'
  const border = 'rgba(255,255,255,0.1)'

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

  const rows = [
    {
      href: '/dashboard/classification',
      mode: 'Classification',
      desc: 'Random Forest vs Logistic Regression',
      dataset: 'PaySim MFS Dataset',
      metric: 'KL Divergence',
      value: classLast ? classLast.kl_divergence.toFixed(4) : '—',
      status: classLast?.is_drifted ?? '—',
      color: '#818cf8',
    },
    {
      href: '/dashboard/llm',
      mode: 'LLM Semantic',
      desc: 'LLaMA 3.1 8B vs LLaMA 3.3 70B',
      dataset: 'TF-IDF Cosine Similarity',
      metric: 'Drift Score',
      value: llmLast ? llmLast.semantic_drift_score.toFixed(4) : '—',
      status: llmLast?.is_drifted ?? '—',
      color: '#f43f5e',
    },
    {
      href: '/dashboard/regression',
      mode: 'Regression',
      desc: 'Random Forest vs Linear Regression',
      dataset: 'Energy Consumption',
      metric: 'Wasserstein',
      value: regLast ? regLast.wasserstein_distance.toFixed(2) : '—',
      status: regLast?.is_drifted ?? '—',
      color: '#a78bfa',
    },
  ]

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '72px 56px', fontFamily: 'var(--font-sora), sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: '11px', color: '#22c55e', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>Live</span>
        </div>
        <h1 style={{ fontSize: '52px', fontWeight: 600, color: textPrimary, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '16px' }}>Parallax</h1>
        <p style={{ fontSize: '15px', color: textMuted, maxWidth: '420px', lineHeight: 1.7, fontWeight: 300 }}>
          Model-agnostic shadow deployment framework for real-time concept drift detection.
        </p>
      </div>

      {/* Table */}
      <div style={{ borderTop: `1px solid ${border}` }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr 1fr 80px',
          padding: '12px 0',
          borderBottom: `1px solid ${border}`,
        }}>
          {['Mode', 'Models', 'Metric', 'Latest Score', 'Status'].map(h => (
            <span key={h} style={{ fontSize: '11px', color: textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>{h}</span>
          ))}
        </div>

        {rows.map(row => (
          <Link key={row.href} href={row.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 80px',
                padding: '24px 0',
                borderBottom: `1px solid ${border}`,
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: textPrimary, marginBottom: '4px' }}>{row.mode}</p>
                <p style={{ fontSize: '12px', color: textMuted, fontWeight: 300 }}>{row.dataset}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ fontSize: '13px', color: textMuted, fontWeight: 300 }}>{row.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ fontSize: '13px', color: textMuted, fontWeight: 300 }}>{row.metric}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 600, color: row.color, letterSpacing: '-0.02em' }}>{row.value}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontWeight: 500,
                  background: row.status === 'YES' ? 'rgba(239,68,68,0.08)' : row.status === 'NO' ? 'rgba(34,197,94,0.08)' : 'transparent',
                  color: row.status === 'YES' ? '#ef4444' : row.status === 'NO' ? '#22c55e' : textMuted,
                  border: `1px solid ${row.status === 'YES' ? 'rgba(239,68,68,0.2)' : row.status === 'NO' ? 'rgba(34,197,94,0.2)' : border}`,
                }}>
                  {row.status === 'YES' ? 'Drifted' : row.status === 'NO' ? 'Stable' : '—'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '12px', color: textSub, fontWeight: 300 }}>v0.1.0</p>
      </div>
    </div>
  )
}