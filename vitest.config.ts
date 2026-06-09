import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'components/**/*.test.{ts,tsx}',
      'lib/**/*.test.{ts,tsx}',
      'tests/integration/**/*.test.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.test.{ts,tsx}',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
