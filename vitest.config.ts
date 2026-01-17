import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    svelte({ hot: false }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'dist', '**/*.d.ts', '**/*.test.ts', '**/*.spec.ts'],
    },
  },
  resolve: {
    alias: {
      Main: resolve(__dirname, 'src/main'),
      Types: resolve(__dirname, 'src/types'),
      Utils: resolve(__dirname, 'src/utils'),
      Const: resolve(__dirname, 'src/constants'),
      Enums: resolve(__dirname, 'src/types/enums.ts'),
      Storage: resolve(__dirname, 'src/main/Storage.ts'),
      Common: resolve(__dirname, 'src/renderer/Common'),
      Containers: resolve(__dirname, 'src/renderer/Common/Containers'),
      Icons: resolve(__dirname, 'src/renderer/Common/Icons'),
    },
  },
});
