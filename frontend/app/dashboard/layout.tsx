'use client'

import { ThemeProvider } from '../../context/ThemeContext'
import Sidebar from '../../components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ marginLeft: '56px', flex: 1, minHeight: '100vh' }}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}