const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

const rootFolder = process.cwd();

const dev = {
    resolve: {
        modules: ["node_modules", "react"],
        extensions: ['.ts', '.tsx', ".js", ".jsx", ".json"]
    },


    devtool: 'source-map',

    plugins: [
        new CleanWebpackPlugin(['dist']),

        new CopyWebpackPlugin([
            {
                from: path.join(rootFolder, 'src/package.json'),
                to: path.join(rootFolder, 'dist/')
            },
            {
                from: path.join(rootFolder, 'resources/*'),
                to: path.join(rootFolder, 'dist/')
            }
        ])
    ]
};

module.exports = dev;
