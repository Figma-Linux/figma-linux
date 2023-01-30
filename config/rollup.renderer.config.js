const path = require("path");
const svelte = require("rollup-plugin-svelte");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const livereload = require("rollup-plugin-livereload");
const serve = require("rollup-plugin-serve");
const alias = require("@rollup/plugin-alias");
const terser = require("@rollup/plugin-terser");
const sveltePreprocess = require("svelte-preprocess");
const typescript = require("@rollup/plugin-typescript");
const css = require("rollup-plugin-css-only");
const copy = require("rollup-plugin-copy");
const postcss = require("rollup-plugin-postcss");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.DEV_PANEL_PORT;
const production = process.env.NODE_ENV !== "dev";
const watch = process.env.ROLLUP_WATCH === "true";
const projectRootDir = path.resolve(__dirname);
const commonExternal = ["electron"];
const commonPlugins = [
  typescript({
    tsconfig: "src/renderer/tsconfig.json",
    sourceMap: !production,
    inlineSources: !production,
  }),

  alias({
    entries: [
      {
        find: "Types",
        replacement: path.resolve(projectRootDir, "src/types"),
      },
      {
        find: "Const",
        replacement: path.resolve(projectRootDir, "src/constants"),
      },
      {
        find: "Utils",
        replacement: path.resolve(projectRootDir, "src/utils"),
      },
    ],
  }),
];

function runElectron() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn("npm", ["run", "run:watch", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true,
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    },
  };
}

module.exports = [
  {
    input: "src/renderer/DesktopAPI/loadContent.ts",
    output: {
      sourcemap: !production,
      format: "cjs",
      name: "app",
      file: "dist/renderer/loadContent.js",
    },
    external: commonExternal,
    plugins: [...commonPlugins],
  },
  {
    input: "src/renderer/DesktopAPI/loadMainContent.ts",
    output: {
      sourcemap: !production,
      format: "cjs",
      name: "app",
      file: "dist/renderer/loadMainContent.js",
    },
    external: commonExternal,
    plugins: [...commonPlugins],
  },
  {
    input: "src/renderer/Settings/index.ts",
    output: {
      sourcemap: !production,
      format: "cjs",
      name: "app",
      file: "dist/renderer/settings.js",
    },
    external: commonExternal,
    plugins: [
      svelte({
        preprocess: sveltePreprocess({
          sourceMap: !production,
        }),
        compilerOptions: {
          dev: !production,
        },
      }),
      postcss({
        extract: "base.css",
      }),
      css({
        output: "bundle.css",
      }),
      resolve({
        browser: false,
        dedupe: ["svelte"],
      }),
      commonjs(),
      ...commonPlugins,
      watch && livereload("dist"),
      watch &&
        serve({
          port,
          contentBase: "dist",
        }),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/renderer/Panel/index.ts",
    output: {
      sourcemap: !production,
      format: "cjs",
      name: "app",
      file: "dist/renderer/panel.js",
    },
    external: commonExternal,
    plugins: [
      svelte({
        preprocess: sveltePreprocess({
          sourceMap: !production,
        }),
        compilerOptions: {
          dev: !production,
        },
      }),
      postcss({
        extract: "base.css",
      }),
      css({
        output: "bundle.css",
      }),
      copy({
        targets: [
          {
            src: "src/index.html",
            dest: "dist",
          },
          {
            src: "src/settings.html",
            dest: "dist",
          },
        ],
      }),
      resolve({
        browser: false,
        dedupe: ["svelte"],
      }),
      commonjs(),
      ...commonPlugins,
      watch && livereload("dist"),
      watch &&
        serve({
          port,
          contentBase: "dist",
        }),
      watch && runElectron(),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
];
