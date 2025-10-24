import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import prism from 'vite-plugin-prismjs'

// https://vite.dev/config/
export default defineConfig({
  base: '/cheat-sheet/',
  build: { outDir: 'dist' },
  plugins: [
    react(),
    tailwindcss(),
    prism({
      languages: ['javascript', 'python', 'cpp', 'java'],
      plugins: ['line-numbers'],
      theme: 'one-light',
      css: true,
    }),
  ],
})
