import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { reducedMotion } from './motion.js'

// Entrance/scroll animations are opt-in via this class, so with JS disabled or
// prefers-reduced-motion set, every element renders in its final, visible state.
if (!reducedMotion()) document.documentElement.classList.add('motion')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
