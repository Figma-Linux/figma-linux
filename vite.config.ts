import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron-renderer';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';

const production = process.env.NODE_ENV !== 'dev';

// Common alias configuration
const alias = {
  Main: resolve(__dirname, 'src/main'),
  Types: resolve(__dirname, 'src/types'),
  Utils: resolve(__dirname, 'src/utils'),
  Const: resolve(__dirname, 'src/constants'),
  Enums: resolve(__dirname, 'src/types/enums.ts'),
  Storage: resolve(__dirname, 'src/main/Storage.ts'),
  Common: resolve(__dirname, 'src/renderer/Common'),
  Containers: resolve(__dirname, 'src/renderer/Common/Containers'),
  Icons: resolve(__dirname, 'src/renderer/Common/Icons'),
};

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        dev: !production,
      },
    }),
    electron([
      // Main process
      {
        entry: resolve(__dirname, 'src/main/index.ts'),
        vite: {
          resolve: { alias },
          build: {
            outDir: 'dist/main',
            minify: production,
            sourcemap: !production,
            lib: {
              entry: resolve(__dirname, 'src/main/index.ts'),
              formats: ['cjs'],
              fileName: () => 'main.js',
            },
            rollupOptions: {
              external: ['electron', 'adm-zip', 'chokidar', 'fs', 'path', 'url', 'crypto', 'util', 'child_process', 'fs/promises', 'node:child_process'],
            },
          },
        },
      },
      // Preload scripts
      {
        entry: resolve(__dirname, 'src/preload/panel.ts'),
        vite: {
          resolve: { alias },
          build: {
            outDir: 'dist/preload',
            minify: production,
            sourcemap: !production,
            lib: {
              entry: resolve(__dirname, 'src/preload/panel.ts'),
              formats: ['cjs'],
              fileName: () => 'panel.js',
            },
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
      {
        entry: resolve(__dirname, 'src/preload/settings.ts'),
        vite: {
          resolve: { alias },
          build: {
            outDir: 'dist/preload',
            minify: production,
            sourcemap: !production,
            lib: {
              entry: resolve(__dirname, 'src/preload/settings.ts'),
              formats: ['cjs'],
              fileName: () => 'settings.js',
            },
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
      {
        entry: resolve(__dirname, 'src/preload/tab.ts'),
        vite: {
          resolve: { alias },
          build: {
            outDir: 'dist/preload',
            minify: production,
            sourcemap: !production,
            lib: {
              entry: resolve(__dirname, 'src/preload/tab.ts'),
              formats: ['cjs'],
              fileName: () => 'tab.js',
            },
            rollupOptions: {
              external: ['electron'],
            },
          },
        },
      },
      // Injected renderer scripts (DesktopAPI)
      {
        entry: resolve(__dirname, 'src/renderer/DesktopAPI/loadContent.ts'),
        vite: {
          resolve: { alias },
          build: {
            outDir: 'dist/renderer',
            minify: production,
            sourcemap: !production,
            lib: {
              entry: resolve(__dirname, 'src/renderer/DesktopAPI/loadContent.ts'),
              formats: ['cjs'],
              fileName: () => 'loadContent.js',
            },
            rollupOptions: {
              external: ['electron', 'url'],
            },
          },
        },
      },
      {
        entry: resolve(__dirname, 'src/renderer/DesktopAPI/loadMainContent.ts'),
        vite: {
          resolve: { alias },
          build: {
            outDir: 'dist/renderer',
            minify: production,
            sourcemap: !production,
            lib: {
              entry: resolve(__dirname, 'src/renderer/DesktopAPI/loadMainContent.ts'),
              formats: ['cjs'],
              fileName: () => 'loadMainContent.js',
            },
            rollupOptions: {
              external: ['electron', 'url'],
            },
          },
        },
      },
      {
        entry: resolve(__dirname, 'src/renderer/DesktopAPI/themePreviewPreload.ts'),
        vite: {
          resolve: { alias },
          build: {
            outDir: 'dist/renderer',
            minify: production,
            sourcemap: !production,
            lib: {
              entry: resolve(__dirname, 'src/renderer/DesktopAPI/themePreviewPreload.ts'),
              formats: ['cjs'],
              fileName: () => 'themePreviewPreload.js',
            },
            rollupOptions: {
              external: ['electron', 'url'],
            },
          },
        },
      },
    ]),
    electronRenderer(),
    viteStaticCopy({
      targets: [
        { src: 'src/package.json', dest: '.' },
      ],
    }),
    // Post-build: move HTML files to root dist and fix paths
    {
      name: 'move-html',
      closeBundle: async () => {
        const fs = await import('fs/promises');
        try {
          // Read, fix paths, and write HTML files
          for (const file of ['index.html', 'settings.html']) {
            let content = await fs.readFile(`dist/src/${file}`, 'utf-8');
            content = content.replace(/\.\.\/renderer\//g, './renderer/');
            await fs.writeFile(`dist/${file}`, content);
          }
          await fs.rm('dist/src', { recursive: true });
        } catch (e) {
          // Ignore if files don't exist (e.g., during dev)
        }
      },
    },
  ],
  resolve: { alias },
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't clear dist since electron plugin writes there too
    minify: production,
    sourcemap: !production,
    rollupOptions: {
      input: {
        panel: resolve(__dirname, 'src/index.html'),
        settings: resolve(__dirname, 'src/settings.html'),
      },
      output: {
        entryFileNames: 'renderer/[name].js',
        chunkFileNames: 'renderer/[name].js',
        assetFileNames: 'renderer/[name].[ext]',
      },
      external: ['electron'],
    },
  },
  server: {
    port: 3330,
  },
});
