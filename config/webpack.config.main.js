const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

const rootFolder = process.cwd();

const main = {
    module: {
        rules: [
            {
                test: /\.node$/,
                loader: 'native-ext-loader'
            }
        ]
    },

    resolve: {
        modules: ['node_modules', 'react'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', 'node'],

        alias: {
            Components: path.resolve(rootFolder, 'src/renderer/components'),
            Middleware: path.resolve(rootFolder, 'src/middleware'),
            Store: path.resolve(rootFolder, 'src/renderer/stores'),
            Const: path.resolve(rootFolder, 'src/constants'),
            Utils: path.resolve(rootFolder, 'src/utils')
        }
    },


    devtool: 'source-map',

    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(rootFolder, 'src/package.json'),
                to: path.join(rootFolder, 'dist/')
            },
            {
                from: path.join(rootFolder, 'resources'),
                to: path.join(rootFolder, 'dist/resources/')
            }
        ])
    ]
};

module.exports = main;
