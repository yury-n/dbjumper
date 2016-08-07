module.exports = {
    entry: './src/index.js',
    output: {
        filename: './dist/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};