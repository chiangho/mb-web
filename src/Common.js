import Vue from 'vue'
import VueRouter from 'vue-router'




// import Home from "./view/Home.vue"
// import Login from "./view/Login.vue";
// import Register from "./view/Register.vue";
// import ForgetPassword from "./view/ForgetPassword.vue";
// import My from "./view/My.vue";
// import PublishBook from "./view/PublishBook.vue";
// import MyMemberAddress from "./view/my/MemberAddress.vue";
// import MyMemberLink from "./view/my/MemberLink.vue";
// import MyMemberRelease from "./view/my/MemberRelease.vue";
// import MyMemberApplication from "./view/my/MemberApplication.vue";
// import MyMemberTrancation from "./view/my/MemberTrancation.vue";
// import MyMemberSetting from "./view/my/MemberSetting.vue";



const Home = () => import('./view/Home.vue');
const Login = () => import('./view/Login.vue');
const Register = () => import('./view/Register.vue');
const ForgetPassword = () => import('./view/ForgetPassword.vue');
const My = () => import('./view/My.vue');
const PublishBook = () => import('./view/PublishBook.vue');
const MyMemberAddress = () => import('./view/my/MemberAddress.vue');
const MyMemberLink = () => import('./view/my/MemberLink.vue');
const MyMemberRelease = () => import('./view/my/MemberRelease.vue');
const MyMemberApplication = () => import('./view/my/MemberApplication.vue');
const MyMemberTrancation = () => import('./view/my/MemberTrancation.vue');
const MyMemberSetting = () => import('./view/my/MemberSetting.vue');




import Vuex from "vuex";
import http from "./Https"

//配置信息
var Config = {
    userInfoCacheKey: "UserInfo",
    userTokenCacheKey: "UserToken",
    host: "http://49.234.70.238:9001",
    webSocketHost: "ws://49.234.70.238:9001/websocket",
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
        catchUri: '',
        unDialogueCount: 0,
        /*
         {
           12121212:{
               windowCount:1,//打开窗口数量
               unReadCount:2,//未读数量
               memberName:'zhangshan',
               data:[        //数据
                   {showPersionCode,showPersionName,time,content,isSelf}
               ]
           }  
         }
        */
        dialogueData: {}
    },
    mutations: {
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
            localStorage.setItem(Config.userInfoCacheKey, JSON.stringify(userInfo));
        },
        setUserName(state, userName) {
            if (state.userInfo) {
                state.userInfo["name"] = userName;
            }
            localStorage.setItem(Config.userInfoCacheKey, JSON.stringify(state.userInfo));
        },
        setUserToken(state, token) {
            state.userToken = token;
            localStorage.setItem(Config.userTokenCacheKey, token);
        },
        setCatchUti(state, uri) {
            state.catchUri = uri;
        },
        cleanUserDialogueData(state, userCode) {
            if (state.dialogueData[userCode]) {
                state.dialogueData[userCode].data = [];
            }
        },
        sumDialogueUnreadCount(state) {
            let count = 0;
            for (let key in state.dialogueData) {
                let _a = state.dialogueData[key].unReadCount;
                if (_a > 0) {
                    count = count + _a;
                }
            }
            state.unDialogueCount = count;
        },
        cleanUserDialogue(state){
            state.dialogueData={};
        },
        addDialogue(state, dialogue) {
            //设置对话数据
            let userCode = dialogue["tagMemberCode"];
            let md = null;
            let memberName = dialogue.showPersionName;
            if (state.dialogueData[userCode]) {
                md = state.dialogueData[userCode];
                md.data.push(dialogue);
                if (!dialogue.isSelf) {
                    if(md.windowCount<=0){
                        md.unReadCount = md.unReadCount + 1;
                        md.memberName = memberName;
                    }
                    play();
                }
                state.dialogueData[userCode] = md;
                this.commit('sumDialogueUnreadCount');
            }else{
                md = {
                    data: [],
                    windowCount: 0,
                    unReadCount: 0,
                    memberName:memberName
                };
                http
                    .ajax(
                        "get",
                        "dialogue/load-member",
                        { targeMemberCode: userCode },
                        null
                    )
                    .then(resp => {
                        resp.data.forEach(item => {
                            md.data.push(item);
                        });
                        md.data.push(dialogue);
                        if (!dialogue.isSelf) {
                            if(md.windowCount<=0){
                                md.unReadCount = md.unReadCount + 1;
                                md.memberName = memberName;
                            }
                            play();
                        }
                        state.dialogueData[userCode] = md;
                        this.commit('sumDialogueUnreadCount');

                    })
                    .catch(() => { 
                        md.data.push(dialogue);
                        if (!dialogue.isSelf) {
                            if(md.windowCount<=0){
                                md.unReadCount = md.unReadCount + 1;
                                md.memberName = memberName;
                            }
                            play();
                        }
                       
                        state.dialogueData[userCode] = md;
                        this.commit('sumDialogueUnreadCount');
                    }); 
            }
            
        },
        openDialogueWindow(state, tagMemberCode) {
            let md = null;
            if (state.dialogueData[tagMemberCode]) {
                md = state.dialogueData[tagMemberCode];
                md.windowCount = md.windowCount + 1;
                md.unReadCount = 0;
                state.dialogueData[tagMemberCode] = md;
            } 
            this.commit('sumDialogueUnreadCount');
        },
        closeDialogueWindow(state, tagMemberCode) {
            let md = null;
            if (state.dialogueData[tagMemberCode]) {
                md = state.dialogueData[tagMemberCode];
                if( md.windowCount>0){
                    md.windowCount = md.windowCount - 1;
                    state.dialogueData[tagMemberCode] = md;
                }
            } 
            this.commit('sumDialogueUnreadCount');
        }
    },
    getters: {
        isLogin: state => {
            if (state && state.userToken && state.userToken != "") {
                return true;
            }
            return false;
        },
        getCatchUri: state => {
            return state.catchUri;
        },
        getUserDialogueData: (state) => (userCode,memberName) => {
            if (!state.dialogueData[userCode]) {
                let md = {
                    data: [],
                    windowCount: 0,
                    unReadCount: 0,
                    memberName: memberName
                };
                state.dialogueData[userCode] = md;
                http
                    .ajax(
                        "get",
                        "dialogue/load-member",
                        { targeMemberCode: userCode },
                        null
                    )
                    .then(resp => {
                        resp.data.forEach(item => {
                            md.data.push(item);
                        });
                        state.dialogueData[userCode] = md;
                    })
                    .catch(() => { });
            }
            return state.dialogueData[userCode].data;
        },
        getUnReadMemberInfo: (state) =>  {
            let data = new Array();
            for (let key in state.dialogueData) {
                data.push({
                    memberCode:key,
                    memberName:state.dialogueData[key].memberName,
                    count:state.dialogueData[key].unReadCount
                });
            }
            return data;
        }
    }
};

Vue.use(Vuex);
const store = new Vuex.Store(storeInfo)

//路由
const router = new VueRouter({
    routes: [{
        path: '/',
        component: Home,
        meta: {
            "title": "遇见书"
        }
    },
    {
        path: '/home',
        component: Home,
        meta: {
            "title": "遇见书"
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            "title": "登录"
        }
    },
    {
        path: '/register',
        component: Register,
        meta: {
            "title": "注册"
        }
    },
    {
        path: '/forget-password',
        component: ForgetPassword,
        meta: {
            "title": "忘记密码"
        }
    },
    {
        path: '/my',
        component: My,
        meta: {
            "auth": true,
            "title": "个人中心"
        },
        children: [{
            path: "member-address",
            component: MyMemberAddress,
            meta: {
                "auth": true,
                "title": "区域信息"
            }
        },
        {
            path: "member-link",
            component: MyMemberLink,
            meta: {
                "auth": true,
                "title": "联系人信息编辑"
            }
        },
        {
            path: "member-release",
            component: MyMemberRelease,
            meta: {
                "auth": true,
                "title": "我发布的图书"
            }
        },
        {
            path: "member-application",
            component: MyMemberApplication,
            meta: {
                "auth": true,
                "title": "我申请的图书"
            }
        },
        {
            path: "member-trancation",
            component: MyMemberTrancation,
            meta: {
                "auth": true,
                "title": "我的换书记录"
            }
        },
        {
            path: "member-setting",
            component: MyMemberSetting,
            meta: {
                "auth": true,
                "title": "个人信息设置"
            }
        }
        ]
    },
    {
        path: '/publish-book',
        component: PublishBook,
        meta: {
            "auth": true,
            "title": "发布图书"
        }
    }
    ],
})

const formatDate = function (date, fmt) {
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

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

const defalutWebSocketParam = {
    open: function () { },
    message: function (msg) {
        window.console.log(msg);
    },
    close: function () { },
    error: function () { }
}

const webSocket = function (param = defalutWebSocketParam) {
    if (typeof (WebSocket) == "undefined") {
        window.console.log("您的浏览器不支持WebSocket");
    } else if (!store.state.userToken) {
        window.console.log("token不能为空");
    } else {
        let socket = new WebSocket(Config.webSocketHost);
        socket.onopen = function () {
            window.console.log("Socket 已打开");
            param.open();
            let WebSocketOutVo = {
                type: 4,
                content: store.state.userToken
            }
            socket.send(JSON.stringify(WebSocketOutVo));
        };
        //获得消息事件  
        socket.onmessage = function (msg) {
            window.console.log(msg.data);
            //发现消息进入    开始处理前端触发逻辑
            param.message(msg);
        };
        //关闭事件  
        socket.onclose = function () {
            window.console.log("Socket已关闭");
            param.close();
        };
        //发生了错误事件  
        socket.onerror = function () {
            window.console.log("Socket发生了错误");
            //此时可以尝试刷新页面
            param.error();
        }
        return socket;
    }
}


var play = function () {
    //let audio = document.querySelector('#audio_newmsg');
    try{
        Vue.prototype.playAudio();
        //audio.play();
    }catch(e){
        window.console.log(e);
    }
    
}

export default {
    Config,
    store,
    router,
    formatDate,
    webSocket
}