/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'dist/stats.html', open: false })
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
    ,rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react')) return 'vendor_react';
          if (id.includes('@supabase') || id.includes('supabase')) return 'vendor_supabase';
          if (id.includes('react-router')) return 'vendor_router';
          if (id.includes('@google/generative-ai')) return 'vendor_google_ai';
          // group markdown / remark / rehype / unified related libs together
          if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('unified') || id.includes('micromark') || id.includes('hast-util') || id.includes('vfile') || id.includes('unist')) return 'vendor_markdown';
          // syntax highlighter and prism/highlight helpers
          if (id.includes('react-syntax-highlighter') || id.includes('prismjs') || id.includes('highlight.js') || id.includes('shiki')) return 'vendor_syntax';
          // router implementations (remix-run) often end up in misc
          if (id.includes('@remix-run') || id.includes('remix-run') || id.includes('history')) return 'vendor_router';
          // css-in-js or small styling libs (goober, emotion, styled-components)
          if (id.includes('goober') || id.includes('@emotion') || id.includes('styled-components')) return 'vendor_css';
          if (id.includes('lucide-react')) return 'vendor_icons';
          if (id.includes('axios')) return 'vendor_axios';
          if (id.includes('react-hot-toast')) return 'vendor_toast';
          return 'vendor_misc';
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
