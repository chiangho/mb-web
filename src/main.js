import Vue from 'vue'
import VueRouter from 'vue-router'

import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';

import Common from "./Common.js"

Vue.config.productionTip = false;



Vue.use(VueRouter)

Vue.use(Antd);

/**
 * 1、 判断是否登陆，userInfo token 是否存在
 */





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