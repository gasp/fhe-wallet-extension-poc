import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { RPCProvider } from './providers/rpc'
import { App } from './app'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RPCProvider>
      <App />
    </RPCProvider>
  </StrictMode>
)
