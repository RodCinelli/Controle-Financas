import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import App from './App'
import './index.css'

import { AuthProvider } from '@/features/auth/hooks/use-auth'

import { ThemeProvider } from "@/components/common/theme-provider"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
         <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <App />
            </AuthProvider>
         </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
