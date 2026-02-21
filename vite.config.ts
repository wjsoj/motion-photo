import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',
  plugins: [react(), vue()],
  resolve: {
    alias: [
      { find: 'motion-photo/react', replacement: resolve(__dirname, 'src/react/index.ts') },
      { find: 'motion-photo/vue', replacement: resolve(__dirname, 'src/vue/index.ts') },
      { find: 'motion-photo/vanilla', replacement: resolve(__dirname, 'src/vanilla/index.ts') },
      { find: 'motion-photo', replacement: resolve(__dirname, 'src/core/index.ts') },
      { find: 'vue', replacement: 'vue/dist/vue.esm-bundler.js' },
    ],
  },
  build: {
    outDir: resolve(__dirname, 'demo-dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'demo/index.html'),
      },
    },
  },
});
