var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: [
        './polyfills.js',
        './src/index.js'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'colormaze.min.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }
        ]
    },
    resolve: {
        alias: {
            'paper': 'paper/dist/paper-core.js',
        }
    }
}