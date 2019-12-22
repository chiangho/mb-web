let webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
    // 选项...
    publicPath: "./",
    productionSourceMap: false,
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        },
        extract: true, // 是否使用css分离插件 ExtractTextPlugin
        sourceMap: false, // 开启 CSS source maps
        modules: false // 启用 CSS modules for all css / pre-processor files.
    },
    configureWebpack() {
        const myConfig = {}
        myConfig.plugins = [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)]
        myConfig.plugins.push(
            new CompressionPlugin({
                // test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                // threshold: 8192,
                // minRatio: 0.8
                algorithm: 'gzip',
                test: /\.js$|\.html$|\.json$|\.css/,
                threshold: 10240,
                minRatio: 0.8
            })
        )
        myConfig.externals = {
            'moment': 'moment'
        }
        myConfig.performance = {
            hints: 'warning',
            //入口起点的最大体积
            maxEntrypointSize: 50000000,
            //生成文件的最大体积
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }


        myConfig.optimization = {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 10000,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `npm.${packageName.replace('@', '')}`
                        }
                    }
                }
            }
        };

        return myConfig
    },
}