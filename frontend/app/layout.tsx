import type { Metadata } from 'next'
import { ThemeProvider } from '../context/ThemeContext'
import Sidebar from '../components/Sidebar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Parallax',
  description: 'Model-agnostic shadow deployment & concept drift detection',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider>
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{
              marginLeft: '56px',
              flex: 1,
              minHeight: '100vh',
              transition: 'margin-left 0.3s ease'
            }}>
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}