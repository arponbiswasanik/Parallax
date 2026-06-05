'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({ theme: 'dark', toggleTheme: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-theme={theme} style={{
        background: theme === 'dark' ? '#080a0f' : '#f8f9fb',
        minHeight: '100vh',
        transition: 'background 0.3s ease'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)