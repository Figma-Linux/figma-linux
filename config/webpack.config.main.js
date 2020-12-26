const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");

const rootFolder = process.cwd();

module.exports = config => {
  config.entry = {
    ["main"]: [path.resolve(rootFolder, "src/main/index.ts")],
  };

  config.output = {
    ...config.output,
    path: path.resolve(rootFolder, "dist/main"),
  };

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.node$/,
      loader: "native-ext-loader",
    },
  ];

  config.resolve.modules = ["node_modules", "react"];
  config.resolve.extensions = [".ts", ".tsx", ".js", ".jsx", ".json", "node"];
  config.resolve.alias = {
    ...config.resolve.alias,
    // Components: path.resolve(rootFolder, 'src/renderer/components'),
    Middleware: path.resolve(rootFolder, "src/middleware"),
    // Store: path.resolve(rootFolder, 'src/renderer/stores'),
    Const: path.resolve(rootFolder, "src/constants"),
    Main: path.resolve(rootFolder, "src/main"),
    Utils: path.resolve(rootFolder, "src/utils"),
    Enums: path.resolve(rootFolder, "@types/enums.ts"),
    Storage: path.resolve(rootFolder, "src/main/Storage.ts"),
  };

  config.devtool = "source-map";

  config.plugins = [
    ...config.plugins,
    new CopyWebpackPlugin([
      {
        from: path.join(rootFolder, "src/package.json"),
        to: path.join(rootFolder, "dist/"),
      },
      {
        from: path.join(rootFolder, "resources"),
        to: path.join(rootFolder, "dist/resources/"),
      },
    ]),
  ];

  return config;
};
