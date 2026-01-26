import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/core/index.ts',
    react: 'src/react/index.ts',
    vue: 'src/vue/index.ts',
    vanilla: 'src/vanilla/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom', 'vue'],
  outExtension({ format }) {
    return { js: `.${format}.js` };
  },
});
