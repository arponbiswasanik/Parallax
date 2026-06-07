import type { Metadata } from 'next'
import { Sora } from 'next/font/google'
import { ThemeProvider } from '../context/ThemeContext'
import Sidebar from '../components/Sidebar'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sora',
})

export const metadata: Metadata = {
  title: 'Parallax',
  description: 'Model-agnostic shadow deployment & concept drift detection',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sora.variable}>
      <body style={{ margin: 0, padding: 0, fontFamily: 'var(--font-sora), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}