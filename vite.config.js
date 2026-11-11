import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from /3d-spire/; Vercel serves from the domain root.
const base = process.env.VERCEL ? '/' : '/3d-spire/'

export default defineConfig({
  base,
  plugins: [react()],
  // model-viewer (three.js) is split out and only loaded on demand.
  build: { chunkSizeWarningLimit: 1100 },
})
