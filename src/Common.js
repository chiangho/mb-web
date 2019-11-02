import VueRouter from 'vue-router'
import Home from "./view/Home.vue"
import Login from "./view/Login.vue";
import Register from "./view/Register.vue";
import ForgetPassword from "./view/ForgetPassword.vue";
import My from "./view/My.vue";
import PublishBook from "./view/PublishBook.vue";



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
        { path: '/', component: Home,meta:{"title":"遇见书"} },
        { path: '/home', component: Home,meta:{"title":"遇见书"} },
        { path: '/login', component: Login,meta:{"title":"登录"} },
        { path: '/register', component: Register,meta:{"title":"注册"} },
        { path: '/forget-password', component: ForgetPassword,meta:{"title":"忘记密码"} },
        { path: '/my', component: My,meta:{"auth":true,"title":"个人中心"} },
        { path: '/publish-book',component:PublishBook,meta:{"auth":false,"title":"发布图书"}}
    ],
})


export default {
    Config,
    store,
    router
}