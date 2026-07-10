import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 프로젝트 사이트 경로: https://<user>.github.io/kids-english-quiz/
  base: "/kids-english-quiz/",
  plugins: [react(), tailwindcss()],
})
