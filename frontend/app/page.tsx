'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const featuresSection = useInView()
  const techSection = useInView()

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll) }
  }, [])

  const features = [
    {
      tag: 'Classification',
      color: '#818cf8',
      title: 'Fraud Detection Drift',
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

  const fadeUp = (delay: number, visible: boolean) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  })

  return (
    <div style={{
      background: '#080a0f',
      minHeight: '100vh',
      fontFamily: 'var(--font-sora), sans-serif',
      color: '#f0f0ee',
      overflowX: 'hidden',
    }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 56px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: scrolled ? 'rgba(8,10,15,0.9)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '6px',
            background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: '#fff', fontWeight: 600,
          }}>P</div>
          <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.01em' }}>Parallax</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link href="/auth/signin" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>Sign in</Link>
          <Link href="/auth/signup" style={{
            fontSize: '13px', color: '#080a0f', textDecoration: 'none', fontWeight: 500,
            background: '#f0f0ee', padding: '8px 20px', borderRadius: '8px',
            transition: 'opacity 0.2s ease',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
          >Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '180px 56px 120px', maxWidth: '800px' }}>
        <div style={{ ...fadeUp(0, heroVisible), display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: '11px', color: '#22c55e', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>Open source · MIT License</span>
        </div>
        <h1 style={{
          ...fadeUp(150, heroVisible),
          fontSize: '64px', fontWeight: 600, letterSpacing: '-0.04em',
          lineHeight: 1.05, marginBottom: '24px',
        }}>
          Shadow deployment.<br />
          <span style={{ color: '#4b5563' }}>Done right.</span>
        </h1>
        <p style={{
          ...fadeUp(300, heroVisible),
          fontSize: '16px', color: '#4b5563', lineHeight: 1.8,
          maxWidth: '520px', fontWeight: 300, marginBottom: '48px',
        }}>
          Parallax is a model-agnostic framework that silently routes live traffic to candidate models, detects concept drift in real time, and keeps your production system stable.
        </p>
        <div style={{ ...fadeUp(450, heroVisible), display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/auth/signup" style={{
            fontSize: '14px', color: '#080a0f', textDecoration: 'none', fontWeight: 500,
            background: '#f0f0ee', padding: '12px 28px', borderRadius: '8px',
            transition: 'opacity 0.2s ease',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.opacity = '1'}
          >Get started</Link>
          <Link href="/dashboard" style={{
            fontSize: '14px', color: '#6b7280', textDecoration: 'none',
            padding: '12px 28px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'border-color 0.2s ease, color 0.2s ease',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#f0f0ee'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'
              ;(e.currentTarget as HTMLAnchorElement).style.color = '#6b7280'
            }}
          >View dashboard →</Link>
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 56px' }} />

      {/* Features */}
      <section ref={featuresSection.ref} style={{ padding: '96px 56px' }}>
        <p style={{ ...fadeUp(0, featuresSection.inView), fontSize: '11px', color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '64px' }}>Three drift modes</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
          {features.map((f, i) => (
            <div
              key={f.tag}
              style={{
                ...fadeUp(i * 120, featuresSection.inView),
                background: '#080a0f',
                padding: '48px 40px',
                cursor: 'default',
                transition: `opacity 0.7s ease ${i * 120}ms, transform 0.7s ease ${i * 120}ms, border-color 0.2s ease`,
                border: '1px solid transparent',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = f.color + '30'
                ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent'
                ;(e.currentTarget as HTMLDivElement).style.transform = featuresSection.inView ? 'translateY(0)' : 'translateY(24px)'
              }}
            >
              <span style={{
                fontSize: '11px', color: f.color, letterSpacing: '0.1em',
                textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: '20px',
              }}>{f.tag}</span>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#f0f0ee', letterSpacing: '-0.02em', marginBottom: '16px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.8, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 56px' }} />

      {/* Tech Stack */}
      <section ref={techSection.ref} style={{ padding: '96px 56px' }}>
        <p style={{ ...fadeUp(0, techSection.inView), fontSize: '11px', color: '#4b5563', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '40px' }}>Built with</p>
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['FastAPI', 'Scikit-learn', 'Groq', 'Supabase', 'Next.js', 'Recharts'].map((tech, i) => (
            <span key={tech} style={{
              ...fadeUp(i * 80, techSection.inView),
              fontSize: '14px', color: '#374151', fontWeight: 400,
              transition: `opacity 0.7s ease ${i * 80}ms, transform 0.7s ease ${i * 80}ms, color 0.2s ease`,
              cursor: 'default',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLSpanElement).style.color = '#f0f0ee'}
              onMouseLeave={e => (e.currentTarget as HTMLSpanElement).style.color = '#374151'}
            >{tech}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 56px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: '#374151' }}>Parallax · v0.1.0</span>
        <span style={{ fontSize: '12px', color: '#374151' }}>MIT License</span>
      </div>
    </div>
  )
}