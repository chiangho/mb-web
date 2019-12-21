let webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
    // 选项...
    publicPath: "./",
    configureWebpack() {
        const myConfig = {}
        myConfig.plugins = [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)]
        if (process.env.NODE_ENV === 'production') {
            myConfig.plugins.push(
                new CompressionPlugin({
                    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                    threshold: 8192,
                    minRatio: 0.8
                })
            )
        }
        return myConfig
    },
}

