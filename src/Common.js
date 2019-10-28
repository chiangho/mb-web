import VueRouter from 'vue-router'
import Home from "./view/Home.vue"
import Login from "./view/Login.vue";
import Register from "./view/Register.vue";
import ForgetPassword from "./view/ForgetPassword.vue";
import RegisterXieyi from "./view/RegisterXieyi.vue";

//配置信息
var Config = {
    userInfoCacheKey: "UserInfo",
    userTokenCacheKey: "UserToken",
    host: "http://127.0.0.1:9001",
    unauthorized: "unauthorized",
    unauthorization: "unauthorization"
}

//全局状态信息
const store = {
    state: {
        /***
         * userInfo：{name:"",email:"",icon:""}
         */
        userInfo: JSON.parse(localStorage.getItem(Config.userInfoCacheKey)),
        userToken: localStorage.getItem(Config.userTokenCacheKey)
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
            localStorage.setItem(Config.userInfoCacheKey, JSON.stringify(userInfo));
        },
        setUserToken(state, token) {
            state.userToken = token;
            localStorage.setItem(Config.userTokenCacheKey, token);
        }
    },
    getters: {
        isLogin: state => {
            if (state.userToken && state.userToken != "") {
                return true;
            }
            return false;
        }
    }
};


//路由
const router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/home', component: Home },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/forget-password', component: ForgetPassword },
        { path: '/register-xieyi', component: RegisterXieyi }
    ],
})


export default {
    Config,
    store,
    router
}