import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  envDir: "./env",
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      global: 'globalthis' // 👈 this line is critical
    }
  },
  define: {
    global: 'globalThis'  // 👈 define it so libraries referencing `global` don't break
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()]
    }
  }
})
