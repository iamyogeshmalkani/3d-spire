import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The site is served from https://<user>.github.io/3d-spire/
export default defineConfig({
  base: '/3d-spire/',
  plugins: [react()],
  // model-viewer (three.js) is split out and only loaded on demand.
  build: { chunkSizeWarningLimit: 1100 },
})
