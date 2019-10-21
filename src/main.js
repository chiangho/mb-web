import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from "vuex";
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import Home from "./view/Home.vue"
import Login from "./view/Login.vue";
import Register from "./view/Register.vue";

Vue.config.productionTip = false;

const userCacheKey = "UserInfo";


Vue.use(VueRouter)
Vue.use(Vuex);
Vue.use(Antd);

/**
 * 1、 判断是否登陆，userInfo token 是否存在
 */ 

const store = new Vuex.Store({
  state: {
    /***
     * userInfo：{token:"",userName:"",email:""}
     */
    userInfo: JSON.parse(localStorage.getItem(userCacheKey)),
    isLogin:false,
  },
  mutations: {
    setUserName (state,userInfo) {
      state.userInfo=userInfo;
      localStorage.setItem(userCacheKey, JSON.stringify(userInfo));
    },
    setLoginState(state,loginState){
      state.isLogin = loginState
    }
  }
})

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
  store,
  render: h => h(App),
}).$mount('#app')
