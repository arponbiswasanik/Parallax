'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// --- Utilities & Hooks ---
function useInView(threshold = 0.4) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true)
        else setInView(false)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

const fadeUp = (delay: number, visible: boolean): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(24px)',
  transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
})

// RGB properties add kora holo jate gradient blending-e kono color shift (blue) na hoy
const features = [
  {
    tag: 'Classification',
    color: '#818cf8',
    rgb: '129, 140, 248',
    title: 'Categorical Drift',
    desc: 'Monitor behavioral drift between classification models using KL Divergence, JS Divergence, and KS Statistic in real time.',
  },
  {
    tag: 'LLM',
    color: '#f43f5e',
    rgb: '244, 63, 94',
    title: 'Semantic Drift',
    desc: 'Detect response divergence between large language models using TF-IDF cosine similarity across live traffic.',
  },
  {
    tag: 'Regression',
    color: '#a78bfa',
    rgb: '167, 139, 250',
    title: 'Prediction Drift',
    desc: 'Track numeric prediction drift between regression models using Wasserstein Distance on energy consumption data.',
  },
]

// --- Stylized Component Helpers ---
function ChartLabel({ text, color }: { text: string; color?: string }) {
  return (
    <span
      style={{
        fontSize: '12px',
        color: color || '#9ca3af',
        fontWeight: 500,
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </span>
  )
}

// --- Animated Custom Visualizations (Sizes Increased) ---

function ClassificationDriftVisual({ color, active }: { color: string; active: boolean }) {
  return (
    <div style={{ position: 'relative', width: '420px', height: '280px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ position: 'relative', height: '220px' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          
          {/* Straight Baseline / X-Axis */}
          <line 
            x1="0" 
            y1="220" 
            x2="420" 
            y2="220" 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="1.5" 
          />

          {/* Baseline Curve (Fitted exactly within 0 to 420) */}
          <path
            d="M 0 220 C 40 220, 70 80, 150 80 C 230 80, 260 160, 310 160 C 360 160, 380 90, 420 220"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Animated Live Drift Curve */}
          <path
            d="M 0 220 C 40 220, 70 80, 150 80 C 230 80, 260 160, 310 160 C 360 160, 380 90, 420 220"
            stroke={color}
            strokeWidth="3.5"
            fill="none"
            style={{
              transformOrigin: 'center',
              animation: active ? 'driftDist 4s infinite ease-in-out' : 'none',
            }}
          />
        </svg>
      </div>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '2px', background: 'rgba(255,255,255,0.4)' }} />
          <ChartLabel text="Baseline" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '14px', height: '3px', background: color }} />
          <ChartLabel text="Live Traffic" />
        </div>
      </div>
    </div>
  )
}

function LLMDriftVisual({ color, active }: { color: string; active: boolean }) {
  const bars = [
    { target: 0.8, response: 0.55, delay: '0s' },
    { target: 0.65, response: 0.90, delay: '0.2s' },
    { target: 0.95, response: 0.45, delay: '0.4s' },
    { target: 0.50, response: 0.80, delay: '0.6s' },
    { target: 0.75, response: 0.60, delay: '0.8s' },
  ]
  return (
    <div style={{ position: 'relative', width: '420px', height: '280px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ position: 'relative', height: '220px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '0 16px' }}>
        {bars.map((bar, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%' }}>
            {/* Baseline target bar */}
            <div
              style={{
                width: '16px',
                height: `${bar.target * 100}%`,
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '3px 3px 0 0',
              }}
            />
            {/* Animated dynamic drift response bar */}
            <div
              style={{
                width: '20px',
                height: `${bar.response * 100}%`,
                background: color,
                borderRadius: '3px 3px 0 0',
                opacity: 0.85,
                transformOrigin: 'bottom',
                animation: active ? `pulseBar 3s infinite ease-in-out ${bar.delay}` : 'none',
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '14px', height: '10px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px' }} />
          <ChartLabel text="Embeddings" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '14px', height: '10px', background: color, borderRadius: '2px' }} />
          <ChartLabel text="Divergence" />
        </div>
      </div>
    </div>
  )
}

function RegressionDriftVisual({ color, active }: { color: string; active: boolean }) {
  return (
    <div style={{ position: 'relative', width: '420px', height: '280px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ position: 'relative', height: '220px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* Historical Prediction Confidence Band */}
          <path 
            d="M 0 160 Q 105 110, 210 130 T 420 80 L 420 120 Q 315 170, 210 160 T 0 200 Z" 
            fill="rgba(255,255,255,0.03)" 
          />
          
          {/* Constant historical projection range */}
          <path 
            d="M 0 140 Q 105 90, 210 110 T 420 60" 
            stroke="rgba(255,255,255,0.25)" 
            strokeWidth="2" 
            strokeDasharray="6 4" 
            fill="none" 
          />
          
          {/* Animated Custom Prediction Line with sliding dashes + floating vertical wiggle */}
          <path
            d="M 0 140 Q 105 90, 210 110 T 420 60"
            stroke={color}
            strokeWidth="3.5"
            fill="none"
            style={{
              strokeDasharray: '12 12',
              animation: active ? 'slideDash 1s linear infinite, floatPrediction 5s ease-in-out infinite' : 'none',
            }}
          />
        </svg>
      </div>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '10px', height: '2px', background: 'rgba(255,255,255,0.4)' }} />
          <ChartLabel text="Historical" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '14px', height: '3px', background: color }} />
          <ChartLabel text="Live Prediction" />
        </div>
      </div>
    </div>
  )
}

// --- Background Core Canvas ---
function DriftCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let t = 0

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    function draw() {
      const W = canvas!.width
      const H = canvas!.height
      ctx.clearRect(0, 0, W, H)

      const cy = H / 2
      const amp = H * 0.32
      const freq = 0.013
      const speed = 0.006
      const segments = 600
      const step = W / segments

      const rawDrift = (Math.sin(t * 0.0018) + 1) / 2
      const driftVal = parseFloat(rawDrift.toFixed(2))
      const phaseShift = rawDrift * Math.PI * 0.85

      ctx.beginPath()
      ctx.lineWidth = 1.6
      ctx.strokeStyle = '#60a5fa'
      ctx.globalAlpha = 1.0
      ctx.lineJoin = 'round'
      for (let i = 0; i <= segments; i++) {
        const x = i * step
        const y = cy + amp * Math.sin(i * freq + t * speed)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 1.3
      ctx.strokeStyle = '#60a5fa'
      ctx.globalAlpha = 0.75
      ctx.setLineDash([6, 5])
      for (let i = 0; i <= segments; i++) {
        const x = i * step
        const y = cy + amp * Math.sin(i * freq + t * speed + phaseShift)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.setLineDash([])
      ctx.globalAlpha = 1

      const driftColor = driftVal >= 0.5 ? '#ef4444' : '#22c55e'

      ctx.font = '500 13px monospace'
      ctx.fillStyle = driftColor
      ctx.textAlign = 'right'
      ctx.fillText(`drift: ${driftVal.toFixed(2)}`, W - 16, 20)

      t++
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: 0.8,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  )
}

function DriftBadge({ style }: { style: React.CSSProperties }) {
  const [drift, setDrift] = useState(0)

  useEffect(() => {
    let t = 0
    let animId: number

    function update() {
      const rawDrift = (Math.sin(t * 0.0018) + 1) / 2
      const driftVal = parseFloat(rawDrift.toFixed(2))
      setDrift(driftVal)
      t++
      animId = requestAnimationFrame(update)
    }

    update()
    return () => cancelAnimationFrame(animId)
  }, [])

  const driftColor = drift >= 0.5 ? '#ef4444' : '#22c55e'

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '32px',
      }}
    >
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: driftColor,
          transition: 'background-color 0.3s ease',
        }}
      />
      <span
        style={{
          fontSize: '15px',
          color: driftColor,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: 600,
          fontFamily: 'monospace',
          transition: 'color 0.3s ease',
        }}
      >
        drift: {drift.toFixed(2)}
      </span>
    </div>
  )
}

function AnimatedArrow() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '16px',
        animation: 'bounceDown 2s infinite ease-in-out',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }} />
      </svg>
    </div>
  )
}

function FeatureSection({ feature, index, isLast }: { feature: typeof features[0]; index: number; isLast: boolean }) {
  const { ref, inView } = useInView(0.4)
  const isEven = index % 2 === 0

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
        // RGBA explicitly used instead of Hex-Alpha to prevent 'blue' fallback bug
        background: inView 
          ? `radial-gradient(circle at ${isEven ? '75%' : '25%'} 50%, rgba(${feature.rgb}, 0.1) 0%, #06080c 65%)`
          : '#06080c',
        transition: 'background 1.5s ease-in-out',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: isEven ? 'row' : 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '500px',
          width: '100%',
          maxWidth: '1200px',
          zIndex: 2,
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ flex: 1, maxWidth: '540px' }}>
          <span
            style={{
              fontSize: '12px',
              color: feature.color,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
              display: 'block',
              marginBottom: '20px',
            }}
          >
            {feature.tag}
          </span>
          <h2
            style={{
              fontSize: '48px',
              fontWeight: 600,
              color: '#f0f0ee',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              lineHeight: 1.15,
            }}
          >
            {feature.title}
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#d1d5db',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            {feature.desc}
          </p>
        </div>

        <div 
          style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'relative',
            height: '450px',
            minWidth: '500px',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              transform: inView ? 'scale(1)' : 'scale(0.96)',
              opacity: inView ? 1 : 0,
              transition: 'all 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {feature.tag === 'Classification' && <ClassificationDriftVisual color={feature.color} active={inView} />}
            {feature.tag === 'LLM' && <LLMDriftVisual color={feature.color} active={inView} />}
            {feature.tag === 'Regression' && <RegressionDriftVisual color={feature.color} active={inView} />}
          </div>

          <div
            style={{
              position: 'absolute',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: feature.color,
              filter: 'blur(130px)',
              opacity: inView ? 0.22 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: 1,
            }}
          />
        </div>
      </div>

      {isLast && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '32px 56px',
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            background: 'rgba(6,8,12,0.4)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <span style={{ fontSize: '12px', color: '#9ca3af' }}>Parallax · v0.1.0</span>
        </div>
      )}
    </section>
  )
}

// --- Main Page Architecture ---
export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      style={{
        background: '#06080c',
        minHeight: '100vh',
        width: '100%',
        fontFamily: 'var(--font-sora), sans-serif',
        color: '#f0f0ee',
        overflowX: 'hidden',
      }}
    >
      {/* Global CSS Keyframe Animations */}
      <style>{`
        @keyframes bounceDown {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(10px); opacity: 1; }
        }
        @keyframes driftDist {
          0%, 100% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(24px) scaleY(1.05); }
        }
        @keyframes pulseBar {
          0%, 100% { transform: scaleY(1); filter: brightness(1); }
          50% { transform: scaleY(0.8); filter: brightness(1.2); }
        }
        @keyframes slideDash {
          to { stroke-dashoffset: -24; }
        }
        @keyframes floatPrediction {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '20px 56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: scrolled ? 'rgba(6,8,12,0.85)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transition: 'all 0.3s ease',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="rotate(30 32 32)">
              <rect x="18" y="10" width="12" height="44" rx="6" fill="url(#primaryGrad)" />
              <rect x="34" y="10" width="12" height="44" rx="6" fill="#ffffff" fillOpacity="0.04" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
              <circle cx="32" cy="32" r="4.5" fill="#03df53" stroke="#000000" strokeWidth="2" />
            </g>
            <defs>
              <linearGradient id="primaryGrad" x1="18" y1="10" x2="30" y2="54" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.01em' }}>Parallax</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/auth/signin" style={{ fontSize: '13px', color: '#e5e7eb', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#ffffff')} onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#e5e7eb')}>
            Sign in
          </Link>
          <Link href="/auth/signup" style={{ fontSize: '13px', color: '#06080c', textDecoration: 'none', fontWeight: 500, background: '#f0f0ee', padding: '8px 20px', borderRadius: '8px', transition: 'opacity 0.2s ease' }} onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')} onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}>
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero Block */}
      <section style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 56px', overflow: 'hidden' }}>
        <DriftCanvas />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, #06080c 85%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <DriftBadge style={fadeUp(0, heroVisible)} />
          <h1 style={{ ...fadeUp(150, heroVisible), fontSize: '64px', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '24px' }}>
            Shadow deployment.<br /><span style={{ color: '#31b4ec' }}>Done right.</span>
          </h1>
          <p style={{ ...fadeUp(300, heroVisible), fontSize: '16px', color: '#e5e7eb', lineHeight: 1.8, maxWidth: '520px', fontWeight: 300, marginBottom: '48px' }}>
            Parallax is a model-agnostic framework that silently routes live traffic to candidate models, detects concept drift in real time, and keeps your production system stable.
          </p>
          <div style={{ ...fadeUp(450, heroVisible), display: 'flex', gap: '16px', alignItems: 'center' }}>

            <Link href="/auth/signin" style={{ fontSize: '14px', color: '#e5e7eb', textDecoration: 'none', padding: '12px 28px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                e.currentTarget.style.color = '#e5e7eb'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}>
              View dashboard
            </Link>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '40px', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>drift modes</span>
          <AnimatedArrow />
        </div>
      </section>

      {/* Feature Explainer Blocks */}
      {features.map((f, i) => (
        <FeatureSection key={f.tag} feature={f} index={i} isLast={i === features.length - 1} />
      ))}
    </div>
  )
}