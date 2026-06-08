'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

// --- Utilities & Hooks ---
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true)
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
  transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
})

const features = [
  {
    tag: 'Classification',
    color: '#818cf8',
    title: 'Categorical Drift',
    desc: 'Monitor behavioral drift between classification models using KL Divergence, JS Divergence, and KS Statistic in real time.',
  },
  {
    tag: 'LLM',
    color: '#f43f5e',
    title: 'Semantic Drift',
    desc: 'Detect response divergence between large language models using TF-IDF cosine similarity across live traffic.',
  },
  {
    tag: 'Regression',
    color: '#a78bfa',
    title: 'Prediction Drift',
    desc: 'Track numeric prediction drift between regression models using Wasserstein Distance on energy consumption data.',
  },
]

// --- Components ---
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

function FeatureRow({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { ref, inView } = useInView(0.25)
  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: isEven ? 'row' : 'row-reverse',
        alignItems: 'center',
        gap: '80px',
        padding: '64px 0',
      }}
    >
      {/* Text Section */}
      <div style={{ flex: 1, ...fadeUp(0, inView) }}>
        <span
          style={{
            fontSize: '11px',
            color: feature.color,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            display: 'block',
            marginBottom: '20px',
          }}
        >
          {feature.tag}
        </span>
        <h3
          style={{
            fontSize: '36px',
            fontWeight: 600,
            color: '#f0f0ee',
            letterSpacing: '-0.02em',
            marginBottom: '24px',
            lineHeight: 1.2,
          }}
        >
          {feature.title}
        </h3>
        <p
          style={{
            fontSize: '16px',
            color: '#e5e7eb',
            lineHeight: 1.8,
            fontWeight: 300,
            maxWidth: '480px',
          }}
        >
          {feature.desc}
        </p>
      </div>

      {/* Visual Abstract Box Section */}
      <div
        style={{
          flex: 1,
          height: '340px',
          background: `linear-gradient(135deg, rgba(255,255,255,0.02), ${feature.color}15)`,
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          ...fadeUp(200, inView),
        }}
      >
        <div
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: feature.color,
            filter: 'blur(70px)',
            opacity: 0.25,
          }}
        />
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            border: `1px solid ${feature.color}20`,
            borderRadius: '24px',
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  )
}

// --- Main Page Component ---
export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const introSection = useInView()
  const techSection = useInView()

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      style={{
        background: '#080a0f',
        minHeight: '100vh',
        fontFamily: 'var(--font-sora), sans-serif',
        color: '#f0f0ee',
        overflowX: 'hidden',
      }}
    >
      {/* Navbar */}
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
          background: scrolled ? 'rgba(8,10,15,0.9)' : 'transparent',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid transparent',
          transition: 'all 0.3s ease',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* logo */}
          <svg
            width="36"
            height="36"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="rotate(30 32 32)">
              {/* Primary Live Traffic */}
              <rect x="18" y="10" width="12" height="44" rx="6" fill="url(#primaryGrad)" />
              {/* Shadow Candidate Traffic */}
              <rect
                x="34"
                y="10"
                width="12"
                height="44"
                rx="6"
                fill="#ffffff"
                fillOpacity="0.04"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              {/* Routing Bridge Node */}
              <circle
                cx="32"
                cy="32"
                r="4.5"
                fill="#03df53ff"
                stroke="#000000ff"
                strokeWidth="2"
              />
            </g>
            <defs>
              <linearGradient
                id="primaryGrad"
                x1="18"
                y1="10"
                x2="30"
                y2="54"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#818cf8" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>

          <span style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Parallax
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/auth/signin" style={{ fontSize: '13px', color: '#e5e7eb', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#ffffff')} onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = '#e5e7eb')}>
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            style={{
              fontSize: '13px',
              color: '#080a0f',
              textDecoration: 'none',
              fontWeight: 500,
              background: '#f0f0ee',
              padding: '8px 20px',
              borderRadius: '8px',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '180px 56px 120px',
          minHeight: '520px',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <DriftCanvas />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, #080a0f 85%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <DriftBadge style={fadeUp(0, heroVisible)} />
          <h1
            style={{
              ...fadeUp(150, heroVisible),
              fontSize: '64px',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              marginBottom: '24px',
            }}
          >
            Shadow deployment.
            <br />
            <span style={{ color: '#d1d5db' }}>Done right.</span>
          </h1>
          <p
            style={{
              ...fadeUp(300, heroVisible),
              fontSize: '16px',
              color: '#e5e7eb',
              lineHeight: 1.8,
              maxWidth: '520px',
              fontWeight: 300,
              marginBottom: '48px',
            }}
          >
            Parallax is a model-agnostic framework that silently routes live
            traffic to candidate models, detects concept drift in real time, and
            keeps your production system stable.
          </p>
          <div style={{ ...fadeUp(450, heroVisible), display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link
              href="/auth/signup"
              style={{
                fontSize: '14px',
                color: '#080a0f',
                textDecoration: 'none',
                fontWeight: 500,
                background: '#f0f0ee',
                padding: '12px 28px',
                borderRadius: '8px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.85')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
            >
              Get started
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontSize: '14px',
                color: '#e5e7eb',
                textDecoration: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)'
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'
                ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.05)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.15)'
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#e5e7eb'
                ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'
              }}
            >
              View dashboard →
            </Link>
          </div>
        </div>
      </section>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 56px' }} />

      <section style={{ padding: '96px 56px' }}>
        <div ref={introSection.ref}>
          <p
            style={{
              ...fadeUp(0, introSection.inView),
              fontSize: '11px',
              color: '#e5e7eb',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
             drift modes
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {features.map((f, i) => (
            <FeatureRow key={f.tag} feature={f} index={i} />
          ))}
        </div>
      </section>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 56px' }} />

      <section ref={techSection.ref} style={{ padding: '96px 56px' }}>
        <p
          style={{
            ...fadeUp(0, techSection.inView),
            fontSize: '11px',
            color: '#e5e7eb',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 500,
            marginBottom: '40px',
          }}
        >
          Built with
        </p>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['FastAPI', 'Machine Learning', 'Groq', 'Supabase', 'Next.js', 'Recharts'].map((tech, i) => (
            <span
              key={tech}
              style={{
                ...fadeUp(i * 80, techSection.inView),
                fontSize: '14px',
                color: '#d1d5db',
                fontWeight: 400,
                transition: `opacity 0.7s ease ${i * 80}ms, transform 0.7s ease ${i * 80}ms, color 0.2s ease`,
                cursor: 'default',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLSpanElement).style.color = '#ffffff')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLSpanElement).style.color = '#d1d5db')}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '32px 56px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>Parallax · v0.1.0</span>
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>MIT License</span>
      </div>
    </div>
  )
}