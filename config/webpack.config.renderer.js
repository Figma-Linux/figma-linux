const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const rootFolder = process.cwd();

const dev = {
    resolve: {
        modules: ["node_modules", "react"],
        extensions: ['.ts', '.tsx', ".js", ".jsx", ".json"]
    },

    devtool: 'source-map',

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(rootFolder, 'src', 'index.html'),
            filename: path.resolve(rootFolder, 'dist', 'index.html')
        })
    ]
};

module.exports = dev;
