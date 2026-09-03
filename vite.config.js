import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';

// Custom plugin: renames dist/main.html -> dist/index.html after build.
// Dev server still serves main.html so we can work with that filename
// during development; the rename only happens for the production build.
function renameMainToIndex() {
  return {
    name: 'rename-main-to-index',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist');
      const files = readdirSync(outDir);
      if (files.includes('main.html')) {
        renameSync(resolve(outDir, 'main.html'), resolve(outDir, 'index.html'));
      }
    },
  };
}

export default defineConfig({
  base: '/discord-timestamp/',
  plugins: [react(), renameMainToIndex()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'main.html'),
      output: {
        // No filename hashing - keep predictable, stable asset names.
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
