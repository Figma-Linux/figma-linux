const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const rootFolder = process.cwd();

const render = {
    entry: {
        '../middleware/loadMainContetnt': path.resolve(rootFolder, 'src/middleware/loadMainContetnt.ts'),
        '../middleware/loadContetnt': path.resolve(rootFolder, 'src/middleware/loadContetnt.ts'),
        // '../middleware/webApi': path.resolve(rootFolder, 'src/middleware/webApi.ts')
    },

    module: {
        noParse: /webApi/
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
        modules: [
            'node_modules',
            'react'
        ],
        alias: {
            Components: path.resolve(rootFolder, 'src/renderer/components'),
            Elements: path.resolve(rootFolder, 'src/renderer/elements'),
            Middleware: path.resolve(rootFolder, 'src/middleware'),
            Store: path.resolve(rootFolder, 'src/renderer/stores'),
            Const: path.resolve(rootFolder, 'src/constants'),
            Main: path.resolve(rootFolder, 'src/main'),
            Utils: path.resolve(rootFolder, 'src/utils')
        }
    },

    devtool: 'source-map',

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(rootFolder, 'src', 'index.html'),
            filename: path.resolve(rootFolder, 'dist', 'index.html'),
            excludeChunks: [
                '../middleware/loadMainContetnt',
                '../middleware/loadContetnt'
            ]
        })
    ]
};

module.exports = render;
