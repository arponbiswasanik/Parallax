'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useTheme } from '../../../context/ThemeContext'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: isDark ? '#0d0f16' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        borderRadius: '8px', padding: '12px 16px', fontSize: '12px',
      }}>
        <p style={{ color: isDark ? '#6b7280' : '#9ca3af', marginBottom: '6px' }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color, margin: '2px 0' }}>
            {p.name}: <span style={{ color: isDark ? '#f0f0ee' : '#0f0f0d', fontWeight: 600 }}>{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ClassificationPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const bg = isDark ? '#080a0f' : '#f9f9f7'
  const textPrimary = isDark ? '#f0f0ee' : '#0f0f0d'
  const textMuted = isDark ? '#4b5563' : '#9ca3af'
  const border = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
  const gridStroke = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'

  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, drifted: 0, avgKL: 0 })

  useEffect(() => {
    async function fetch() {
      const { data: raw } = await supabase
        .from('drift_logs').select('*')
        .order('timestamp', { ascending: true }).limit(100)
      if (!raw) return
      setData(raw.map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        kl_divergence: +d.kl_divergence.toFixed(4),
        js_divergence: +d.js_divergence.toFixed(4),
        ks_statistic: +d.ks_statistic.toFixed(4),
      })))
      const drifted = raw.filter(d => d.is_drifted === 'YES').length
      const avgKL = raw.reduce((a, d) => a + d.kl_divergence, 0) / raw.length
      setStats({ total: raw.length, drifted, avgKL })
    }
    fetch()
  }, [])

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '72px 56px', fontFamily: 'var(--font-sora), sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
        <p style={{ fontSize: '11px', color: '#818cf8', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '16px' }}>Classification Drift</p>
        <h1 style={{ fontSize: '40px', fontWeight: 600, color: textPrimary, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px' }}>Fraud Detection</h1>
        <p style={{ fontSize: '14px', color: textMuted, fontWeight: 300, lineHeight: 1.7 }}>
          Random Forest (primary) vs Logistic Regression (shadow) — PaySim MFS Dataset
        </p>
      </div>

      {/* Stats */}
      <div style={{ borderTop: `1px solid ${border}`, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '64px' }}>
        {[
          { label: 'Total Requests', value: stats.total.toString(), color: textPrimary },
          { label: 'Drifted', value: stats.drifted.toString(), color: '#ef4444' },
          { label: 'Avg KL Divergence', value: stats.avgKL ? stats.avgKL.toFixed(4) : '—', color: '#818cf8' },
        ].map((s, i) => (
          <div key={s.label} style={{
            padding: '32px 0',
            borderRight: i < 2 ? `1px solid ${border}` : 'none',
            paddingRight: i < 2 ? '40px' : '0',
            paddingLeft: i > 0 ? '40px' : '0',
          }}>
            <p style={{ fontSize: '11px', color: textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '12px' }}>{s.label}</p>
            <p style={{ fontSize: '36px', fontWeight: 600, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div>
        <p style={{ fontSize: '12px', color: textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '32px' }}>Drift Metrics Over Time</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="klGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="time" stroke="transparent" tick={{ fontSize: 11, fill: textMuted }} />
            <YAxis stroke="transparent" tick={{ fontSize: 11, fill: textMuted }} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: textMuted, paddingTop: '24px' }} />
            <Area type="monotone" dataKey="kl_divergence" stroke="#818cf8" fill="url(#klGrad)" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="js_divergence" stroke="#22d3ee" fill="none" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="ks_statistic" stroke="#f59e0b" fill="none" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}