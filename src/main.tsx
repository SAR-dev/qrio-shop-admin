import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'
import App from './App.tsx'
import { NotificationProvider } from './contexts/NotificationContext.tsx'
import { PocketProvider } from './contexts/PocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <PocketProvider>
        <App />
      </PocketProvider>
    </NotificationProvider>
  </StrictMode>,
)
