'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../context/ThemeContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: isDark ? 'rgba(10,10,15,0.95)' : 'rgba(255,255,255,0.95)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: '10px', padding: '12px 16px', fontSize: '12px',
      }}>
        <p style={{ color: isDark ? '#6b7280' : '#9ca3af', marginBottom: '6px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, margin: '2px 0' }}>
            {p.name}: <span style={{ color: isDark ? '#f9fafb' : '#111827', fontWeight: 600 }}>{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function RegressionPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const textPrimary = isDark ? '#f9fafb' : '#111827'
  const textMuted = isDark ? '#6b7280' : '#9ca3af'
  const cardBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const gridStroke = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'

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
    <div style={{ padding: '48px 40px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '12px', color: '#a78bfa', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Regression</p>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: textPrimary, letterSpacing: '-0.02em', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>Energy Consumption Drift</h1>
        <p style={{ fontSize: '14px', color: textMuted }}>Random Forest (primary) vs Linear Regression (shadow) — Wasserstein Distance</p>
      </div>

      {/* Stat Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Requests', value: stats.total.toString(), color: '#a78bfa' },
          { label: 'Drifted', value: stats.drifted.toString(), color: '#ef4444' },
          { label: 'Avg Wasserstein', value: stats.avgWasserstein.toFixed(2), color: '#fb923c' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '20px 24px' }}>
            <p style={{ fontSize: '12px', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: s.color, fontFamily: 'Georgia, serif' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '24px' }}>
        <p style={{ fontSize: '14px', color: textPrimary, fontWeight: 500, marginBottom: '20px' }}>Regression Drift Over Time</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="wasGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="time" stroke={gridStroke} tick={{ fontSize: 11, fill: textMuted }} />
            <YAxis stroke={gridStroke} tick={{ fontSize: 11, fill: textMuted }} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: textMuted }} />
            <Area type="monotone" dataKey="wasserstein" stroke="#a78bfa" fill="url(#wasGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="pct_diff" stroke="#fb923c" fill="none" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}