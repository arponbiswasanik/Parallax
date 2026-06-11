'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
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

export default function LLMPage() {
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
    <div style={{ background: '#080a0f', minHeight: '100vh', padding: '72px 56px', fontFamily: 'var(--font-sora), sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '64px' }}>
        <p style={{ fontSize: '11px', color: '#f43f5e', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '16px' }}>LLM Drift</p>
        <h1 style={{ fontSize: '40px', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '12px' }}>Semantic Drift</h1>
        <p style={{ fontSize: '14px', color: '#d1d5db', fontWeight: 300, lineHeight: 1.7 }}>
          LLaMA 3.1 8B (primary) vs LLaMA 3.3 70B (shadow) — TF-IDF Cosine Similarity
        </p>
      </div>

      {/* Stats */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '64px' }}>
        {[
          { label: 'Total Prompts', value: stats.total.toString(), color: '#ffffff' },
          { label: 'Drifted', value: stats.drifted.toString(), color: '#ef4444' },
          { label: 'Avg Semantic Drift', value: stats.avgDrift ? stats.avgDrift.toFixed(4) : '—', color: '#f43f5e' },
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
        <p style={{ fontSize: '12px', color: '#d1d5db', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '32px' }}>Semantic Drift Over Time</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="semGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cosGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.14)" />
            <XAxis dataKey="time" stroke="transparent" tick={{ fontSize: 11, fill: '#d1d5db' }} />
            <YAxis stroke="transparent" tick={{ fontSize: 11, fill: '#d1d5db' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#d1d5db', paddingTop: '24px' }} />
            <Area type="monotone" dataKey="semantic_drift" stroke="#f43f5e" fill="url(#semGrad)" strokeWidth={1.5} dot={false} />
            <Area type="monotone" dataKey="cosine_similarity" stroke="#34d399" fill="url(#cosGrad)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}