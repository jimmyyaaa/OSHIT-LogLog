import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LogProvider } from './context/LogContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LogProvider>
        <App />
      </LogProvider>
    </BrowserRouter>
  </StrictMode>,
)
