const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require('path');

const rootFolder = process.cwd();

const render = {
    entry: {
        'settings': path.resolve(rootFolder, 'src/renderer/settings.tsx')
    },

    output: {
        filename: path.relative(rootFolder, 'renderer/[name].js')
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader'
                    }
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
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
            template: path.resolve(rootFolder, 'src', 'settings.html'),
            filename: path.resolve(rootFolder, 'dist', 'settings.html')
        }),
        new MiniCssExtractPlugin({
            filename: 'renderer/settings.css'
        })
    ]
};

module.exports = render;
