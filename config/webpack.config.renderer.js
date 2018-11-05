const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const rootFolder = process.cwd();

const dev = {

    entry: {
        '../middleware/loadMainContetnt': path.resolve(rootFolder, 'src/middleware/loadMainContetnt.ts'),
        '../middleware/loadContetnt': path.resolve(rootFolder, 'src/middleware/loadContetnt.ts')
    },

    module: {
        rules: [
            {
                test: /\.sass$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
        modules: [
            'node_modules',
            'react'
        ],
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
        new HtmlWebpackPlugin({
            template: path.resolve(rootFolder, 'src', 'index.html'),
            filename: path.resolve(rootFolder, 'dist', 'index.html')
        })
    ]
};

module.exports = dev;
