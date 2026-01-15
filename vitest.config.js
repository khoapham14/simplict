import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Environment
      environment: 'jsdom',

      // Setup files (runs before each test file)
      setupFiles: ['./src/test/setup.js'],

      // Global APIs (describe, test, expect, vi)
      globals: true,

      // Include patterns
      include: ['src/**/*.{test,spec}.{js,jsx}'],

      // Exclude patterns
      exclude: ['node_modules', 'dist'],

      // Coverage configuration
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{js,jsx}'],
        exclude: [
          'src/index.js',
          'src/reportWebVitals.js',
          'src/**/*.test.{js,jsx}',
          'src/test/**',
          'src/setupTests.js',
          'src/Components/UI/index.js',
          'src/Components/UI/Layout.js',
        ],
        thresholds: {
          statements: 45,
          branches: 40,
          functions: 60,
          lines: 45,
        },
      },

      // Reporter options
      reporters: ['default'],

      // Watch mode exclusions
      watchExclude: ['node_modules', 'dist'],

      // CSS handling
      css: false,
    },
  })
);
