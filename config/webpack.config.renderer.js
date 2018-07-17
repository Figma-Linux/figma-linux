const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

const rootFolder = process.cwd();

const dev = {

    entry: {
        '../middleware/web': path.resolve(rootFolder, 'src/middleware/web.ts')
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
        extensions: ['.ts', '.tsx', ".js", ".jsx", ".json", ".scss"],
        modules: [
            "node_modules", 
            "preact"],
        alias: {
            'components': path.resolve(rootFolder, 'src/renderer/components'),
            'store': path.resolve(rootFolder, 'src/renderer/store'),
            'react': 'preact-compat',
            'react-dom': 'preact-compat',
            'create-react-class': 'preact-compat/lib/create-react-class',
            'react-dom-factories': 'preact-compat/lib/react-dom-factories'
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
