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
  test: {
    // Pure JS utility tests - no DOM needed, keeps tests fast.
    environment: 'node',
    include: ['src/**/*.test.js'],
    // Imports settings for the test process only, 
    // so tests that rely on the system config are deterministic
    // regardless of which machine/CI runs them. 
    // Has no effect on the actual deployed app.
    setupFiles: ['./vitest.setup.js'],
  },
  build: {
    // Disable inlining small assets as base64 data URIs - keep everything
    // (including small SVGs like background-motif.svg) as separate files.
    assetsInlineLimit: 0,
    rollupOptions: {
      // Named 'index' so [name] resolves to 'index' in output filenames
      // (index.js, index.css) even though the source entry is main.html.
      input: { index: resolve(__dirname, 'main.html') },
      output: {
        // No hashing for JS entry points and CSS - keeps asset URLs
        // predictable for the gh-pages branch. All other assets (images,
        // fonts, SVGs processed by Vite, etc.) keep their content hash for
        // cache-busting purposes.
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'assets/[name].[ext]';
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
});