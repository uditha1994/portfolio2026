import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/anybody/wdth.css'
import '@fontsource-variable/instrument-sans/index.css'
import '@fontsource-variable/martian-mono/wdth.css'
import 'lenis/dist/lenis.css'
import './styles.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
