const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

const rootFolder = process.cwd();
const resolveExtensions = [".ts", ".tsx", ".js", ".jsx", ".json", ".scss"];
const resolveModules = ["node_modules", "react"];

module.exports = config => {
  config.entry = {
    ["middleware/loadMainContent"]: path.resolve(rootFolder, "src/middleware/loadMainContent.ts"),
    ["middleware/loadContent"]: path.resolve(rootFolder, "src/middleware/loadContent.ts"),
    ["renderer"]: [path.resolve(rootFolder, "src/renderer/index.tsx")],
  };

  config.output = {
    ...config.output,
    publicPath: config.mode === "development" ? "/" : "renderer",
    path: path.resolve(rootFolder, "dist/renderer"),
  };

  config.module.noParse = /webApi/;
  config.module.rules = config.module.rules.map(rule => {
    if (Array.isArray(rule.use)) {
      rule.use = rule.use.map(r => {
        if (r.loader && r.loader === "css-loader") {
          return { ...r, options: { ...r.options, modules: false } };
        }

        return r;
      });
    }

    return rule;
  });

  config.module.rules = [...config.module.rules];

  if (config.resolve.extensions && Array.isArray(config.resolve.extensions)) {
    config.resolve.extensions = [...new Set([...config.resolve.extensions, ...resolveExtensions])];
  } else {
    config.resolve.extensions = resolveExtensions;
  }

  if (config.resolve.modules && Array.isArray(config.resolve.modules)) {
    config.resolve.modules = [...new Set([...config.resolve.modules, ...resolveModules])];
  } else {
    config.resolve.modules = resolveModules;
  }

  config.resolve.alias = {
    ...config.resolve.alias,
    Components: path.resolve(rootFolder, "src/renderer/components"),
    Elements: path.resolve(rootFolder, "src/renderer/elements"),
    Middleware: path.resolve(rootFolder, "src/middleware"),
    Store: path.resolve(rootFolder, "src/renderer/stores"),
    Const: path.resolve(rootFolder, "src/constants"),
    Main: path.resolve(rootFolder, "src/main"),
    Utils: path.resolve(rootFolder, "src/utils"),
  };

  config.devtool = "source-map";

  config.plugins = [
    ...config.plugins,
    new HtmlWebpackPlugin({
      template: path.resolve(rootFolder, "src", "index.html"),
      filename: path.resolve(rootFolder, "dist", "index.html"),
      excludeChunks: ["middleware/loadMainContent", "middleware/loadContent"],
    }),
  ];

  return config;
};
