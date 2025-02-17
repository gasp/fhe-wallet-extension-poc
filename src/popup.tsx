import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { PopupApp } from './popup-app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PopupApp />
  </StrictMode>
)
