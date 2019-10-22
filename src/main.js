import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from "vuex";
import Antd from 'ant-design-vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import Home from "./view/Home.vue"
import Login from "./view/Login.vue";
import Register from "./view/Register.vue";
import ForgetPassword from "./view/ForgetPassword.vue";
import Common from "./Common.js"

Vue.config.productionTip = false;



Vue.use(VueRouter)
Vue.use(Vuex);
Vue.use(Antd);

/**
 * 1、 判断是否登陆，userInfo token 是否存在
 */ 

const store = new Vuex.Store({
  state: {
    /***
     * userInfo：{userName:"",email:""}
     */
    userInfo: JSON.parse(localStorage.getItem(Common.Config.userInfoCacheKey)),
    userToken:localStorage.getItem(Common.Config.userTokenCacheKey)
  },
  mutations: {
    setUserInfo (state,userInfo) {
      state.userInfo=userInfo;
      localStorage.setItem(Common.Config.userInfoCacheKey, JSON.stringify(userInfo));
    },
    setUserToken(state,token){
      state.token = token;
    }
  }
})

const router = new VueRouter({
  routes: [
    { path: '/', component: Home},
    { path: '/home', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register},
    { path: '/forget-password', component: ForgetPassword},
    { path: '/404', component: 404}
  ],
})

//如果token不存在则调整到登录页面
router.beforeEach((to,from,next)=>{
  if(to.meta&&to.meta.auth&&to.meta.auth==true){
    if(store.state.userToken){
       next();
    }else{
      next({path:'/login'});
    }
  }else{
    next();
  }
});


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
