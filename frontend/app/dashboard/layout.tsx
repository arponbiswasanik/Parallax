'use client'

import Sidebar from '../../components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', background: '#080a0f', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '56px', flex: 1, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}