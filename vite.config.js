import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      // Support for class properties (used in your components)
      babel: {
        plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]]
      }
    }),
    tailwindcss()
  ],

  // GitHub Pages deployment base path
  base: '/simplict/',

  // Configure esbuild to handle JSX in .js files
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: []
  },

  // Optimize dependencies
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,

    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2']
        }
      }
    }
  },

  // Dev server configuration
  server: {
    port: 3000,
    open: true
  },

  // Path aliases (optional, for cleaner imports)
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/Components'
    }
  }
})
