import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // `npm run dev` (site) + `npm run server` (API) side by side
  server: { proxy: { '/api': 'http://localhost:3000', '/uploads': 'http://localhost:3000' } },
})
