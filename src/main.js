import Vue from 'vue'
import VueRouter from 'vue-router'
import AMap from 'vue-amap';
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import Common from "./Common.js"

Vue.config.productionTip = false;



Vue.use(VueRouter)
Vue.use(AMap);
Vue.use(Antd);
AMap.initAMapApiLoader({
    key: 'f9645b34f7a07297a3c90fff903a736b',//刚刚开发者申请哪里的key
    plugin: ['AMap.Autocomplete', 'AMap.Geolocation','AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
    v: '1.4.4'
});


//如果token不存在则调整到登录页面
Common.router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title || '遇见书'
    if (to.meta && to.meta.auth && to.meta.auth == true) {
        let isLoginState = Common.store.getters.isLogin;
        if (isLoginState) {
            next();
        } else {
            next({ path: '/login' });
        }
    } else {
        next();
    }
});


new Vue({
    router: Common.router,
    store: Common.store,
    render: h => h(App),
}).$mount('#app')