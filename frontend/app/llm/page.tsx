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

export default function LLMPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const textPrimary = isDark ? '#f9fafb' : '#111827'
  const textMuted = isDark ? '#6b7280' : '#9ca3af'
  const cardBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'
  const gridStroke = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'

  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, drifted: 0, avgDrift: 0 })

  useEffect(() => {
    async function fetch() {
      const { data: raw } = await supabase
        .from('llm_drift_logs').select('*')
        .order('timestamp', { ascending: true }).limit(100)
      if (!raw) return
      setData(raw.map(d => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        semantic_drift: +d.semantic_drift_score.toFixed(4),
        cosine_similarity: +d.cosine_similarity.toFixed(4),
      })))
      const drifted = raw.filter(d => d.is_drifted === 'YES').length
      const avgDrift = raw.reduce((a, d) => a + d.semantic_drift_score, 0) / raw.length
      setStats({ total: raw.length, drifted, avgDrift })
    }
    fetch()
  }, [])

  return (
    <div style={{ padding: '48px 40px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '12px', color: '#f43f5e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>LLM</p>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: textPrimary, letterSpacing: '-0.02em', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>Semantic Drift</h1>
        <p style={{ fontSize: '14px', color: textMuted }}>LLaMA 3.1 8B (primary) vs LLaMA 3.3 70B (shadow) — TF-IDF Cosine Similarity</p>
      </div>

      {/* Stat Row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Prompts', value: stats.total.toString(), color: '#f43f5e' },
          { label: 'Drifted', value: stats.drifted.toString(), color: '#ef4444' },
          { label: 'Avg Semantic Drift', value: stats.avgDrift.toFixed(4), color: '#34d399' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '20px 24px' }}>
            <p style={{ fontSize: '12px', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 700, color: s.color, fontFamily: 'Georgia, serif' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '24px' }}>
        <p style={{ fontSize: '14px', color: textPrimary, fontWeight: 500, marginBottom: '20px' }}>Semantic Drift Over Time</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="semGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="time" stroke={gridStroke} tick={{ fontSize: 11, fill: textMuted }} />
            <YAxis stroke={gridStroke} tick={{ fontSize: 11, fill: textMuted }} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: textMuted }} />
            <Area type="monotone" dataKey="semantic_drift" stroke="#f43f5e" fill="url(#semGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="cosine_similarity" stroke="#34d399" fill="none" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}