let webpack = require('webpack');
module.exports = {
    // 选项...
    publicPath: "./",
    configureWebpack: {
        plugins: [new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)],
        // CDN 加载组件
        // externals: {
        //     // 'vue-router': 'VueRouter',
        //     Vuex: 'Vuex',
        //     axios: 'axios',
        //     moment: 'moment'
        // }
    }

}