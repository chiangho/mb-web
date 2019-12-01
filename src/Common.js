import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "./view/Home.vue"
import Login from "./view/Login.vue";
import Register from "./view/Register.vue";
import ForgetPassword from "./view/ForgetPassword.vue";
import My from "./view/My.vue";
import PublishBook from "./view/PublishBook.vue";
import MyMemberAddress from "./view/my/MemberAddress.vue";
import MyMemberLink from "./view/my/MemberLink.vue";
import MyMemberRelease from "./view/my/MemberRelease.vue";
import Vuex from "vuex";

//配置信息
var Config = {
    userInfoCacheKey: "UserInfo",
    userTokenCacheKey: "UserToken",
    host: "http://127.0.0.1:9001",
    unauthorized: "unauthorized",
    unauthorization: "unauthorization"
}

//全局状态信息
const storeInfo = {
    state: {
        /***
         * userInfo：{name:"",email:"",icon:""}
         */
        userInfo: JSON.parse(localStorage.getItem(Config.userInfoCacheKey)),
        userToken: localStorage.getItem(Config.userTokenCacheKey),
        catchUri:''
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
            localStorage.setItem(Config.userInfoCacheKey, JSON.stringify(userInfo));
        },
        setUserToken(state, token) {
            state.userToken = token;
            localStorage.setItem(Config.userTokenCacheKey, token);
        },
        setCatchUti(state,uri){
            state.catchUri = uri;
        }

    },
    getters: {
        isLogin: state => {
            if (state && state.userToken && state.userToken != "") {
                return true;
            }
            return false;
        },
        getCatchUri: state=>{
            return state.catchUri;
        }
    }
};

Vue.use(Vuex);
const store = new Vuex.Store(storeInfo)

//路由
const router = new VueRouter({
    routes: [
        { path: '/', component: Home, meta: { "title": "遇见书" } },
        { path: '/home', component: Home, meta: { "title": "遇见书" } },
        { path: '/login', component: Login, meta: { "title": "登录" } },
        { path: '/register', component: Register, meta: { "title": "注册" } },
        { path: '/forget-password', component: ForgetPassword, meta: { "title": "忘记密码" } },
        {
            path: '/my', component: My, meta: { "auth": true, "title": "个人中心" },
            children: [
                { path: "member-address", component: MyMemberAddress, meta: { "auth": true, "title": "区域信息" } },
                { path: "member-link",component:MyMemberLink,meta:{"auth":true,title:"联系人信息编辑"}},
                { path: "member-release",component:MyMemberRelease,meta:{"auth":true,title:"我发布的图书"}}
            ]
        },
        { path: '/publish-book', component: PublishBook, meta: { "auth": true, "title": "发布图书" } }
    ],
})

const  formatDate =function(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
 
function padLeftZero (str) {
    return ('00' + str).substr(str.length);
}

export default {
    Config,
    store,
    router,
    formatDate
}