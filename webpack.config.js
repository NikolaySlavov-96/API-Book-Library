const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production', // Set mode to 'production' or 'development'
    entry: './index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: 'node',
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/.*$/,
            contextRegExp: /@mapbox\/node-pre-gyp/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /pg-native/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /bufferutil/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /utf-8-validate/
        })
    ]
};