const path = require('path');
const HWP = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: path.join(__dirname, '/src/index'),
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'index.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
          "react": "preact/compat",
          "react-dom": "preact/compat"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [
                  /node_modules/,
                  /\.test.tsx?$/
                ],
                use: [
                  { loader: 'ts-loader' }
                ]
            }
        ]
    },
    plugins:[
        new HWP({template: path.join(__dirname, '/public/index.html')})
    ]
};