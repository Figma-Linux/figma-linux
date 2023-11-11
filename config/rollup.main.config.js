const path = require("path");
const commonjs = require("@rollup/plugin-commonjs");
const alias = require("@rollup/plugin-alias");
const terser = require("@rollup/plugin-terser");
const typescript = require("@rollup/plugin-typescript");

const dotenv = require("dotenv");
dotenv.config();

const watch = process.env.ROLLUP_WATCH === "true";
const production = process.env.NODE_ENV !== "dev";
const projectRootDir = path.resolve(__dirname);

module.exports = {
  input: "src/main/index.ts",
  output: {
    sourcemap: !production,
    format: "cjs",
    name: "app",
    file: "dist/main/main.js",
  },
  plugins: [
    commonjs(),
    typescript({
      tsconfig: "tsconfig.json",
      sourceMap: !production,
      inlineSources: !production,
    }),

    alias({
      entries: [
        {
          find: "Main",
          replacement: path.resolve(projectRootDir, "src/main"),
        },
        {
          find: "Types",
          replacement: path.resolve(projectRootDir, "src/types"),
        },
        {
          find: "Utils",
          replacement: path.resolve(projectRootDir, "src/utils"),
        },
        {
          find: "Enums",
          replacement: path.resolve(projectRootDir, "src/types/enums.ts"),
        },
        {
          find: "Storage",
          replacement: path.resolve(projectRootDir, "src/main/Storage.ts"),
        },
        {
          find: "Const",
          replacement: path.resolve(projectRootDir, "src/constants"),
        },
      ],
    }),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
