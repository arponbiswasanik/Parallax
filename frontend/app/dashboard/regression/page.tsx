'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0d0f16',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px', padding: '12px 16px', fontSize: '12px',
      }}>
        <p style={{ color: '#9ca3af', marginBottom: '6px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, margin: '2px 0' }}>
            {p.name}: <span style={{ color: '#ffffff', fontWeight: 600 }}>{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function RegressionPage() {
  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, drifted: 0, avgWasserstein: 0 })

  useEffect(() => {
    async function fetch() {
      const { data: raw } = await supabase
        .from('regression_drift_logs').select('*')
        .order('timestamp', { ascending: true }).limit(100)
      if (!raw) return
      setData(raw.map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        wasserstein: +d.wasserstein_distance.toFixed(2),
        pct_diff: +d.percentage_difference.toFixed(2),
      })))
      const drifted = raw.filter(d => d.is_drifted === 'YES').length
      const avgWasserstein = raw.reduce((a, d) => a + d.wasserstein_distance, 0) / raw.length
      setStats({ total: raw.length, drifted, avgWasserstein })
    }
    fetch()
  }, [])

  return (
    <div style={{ background: '#080a0f', minHeight: '100vh', padding: '72px 56px', fontFamily: 'var(--font-sora), sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
        <p style={{ fontSize: '11px', color: '#a78bfa', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '16px' }}>Regression Drift</p>
        <h1 style={{ fontSize: '40px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px' }}>Energy Consumption</h1>
        <p style={{ fontSize: '14px', color: '#d1d5db', fontWeight: 300, lineHeight: 1.7 }}>
          Random Forest (primary) vs Linear Regression (shadow) — Wasserstein Distance
        </p>
      </div>

      {/* Stats */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '64px' }}>
        {[
          { label: 'Total Requests', value: stats.total.toString(), color: '#ffffff' },
          { label: 'Drifted', value: stats.drifted.toString(), color: '#ef4444' },
          { label: 'Avg Wasserstein', value: stats.avgWasserstein ? stats.avgWasserstein.toFixed(2) : '—', color: '#a78bfa' },
        ].map((s, i) => (
          <div key={s.label} style={{
            padding: '32px 0',
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            paddingRight: i < 2 ? '40px' : '0',
            paddingLeft: i > 0 ? '40px' : '0',
          }}>
            <p style={{ fontSize: '11px', color: '#d1d5db', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '12px' }}>{s.label}</p>
            <p style={{ fontSize: '36px', fontWeight: 600, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div>
        <p style={{ fontSize: '12px', color: '#d1d5db', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '32px' }}>Regression Drift Over Time</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="wasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pctGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.14)" />
            <XAxis dataKey="time" stroke="transparent" tick={{ fontSize: 11, fill: '#d1d5db' }} />
            <YAxis stroke="transparent" tick={{ fontSize: 11, fill: '#d1d5db' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#d1d5db', paddingTop: '24px' }} />
            <Area type="monotone" dataKey="wasserstein" stroke="#a78bfa" fill="url(#wasGrad)" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="pct_diff" stroke="#fb923c" fill="url(#pctGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}