import Vue from 'vue'
import VueRouter from 'vue-router'
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import Home from "./view/Home.vue"
import Login from "./view/Login.vue";
import Register from "./view/Register.vue";

Vue.config.productionTip = false;


Vue.use(VueRouter)
Vue.use(Antd);


const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register }
  ],
})



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
