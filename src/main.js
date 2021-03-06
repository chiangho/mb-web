import Vue from 'vue'
import VueRouter from 'vue-router'
import AMap from 'vue-amap';
//import Antd from 'ant-design-vue'
import App from './App.vue'
// import 'ant-design-vue/dist/antd.css';
import Common from "./Common.js"
import wsConnection from './Socket.js'
import audio from './assets/newmsg.mp3'

import {
    Base,
    Layout,
    Col,
    Row,
    Modal,
    Icon,
    Menu,
    List,
    Form,
    Input,
    Divider,
    Button,
    Checkbox,
    Tooltip,
    Pagination,
    Select,
    Table,
    Message,
    Alert,
    message,
    Card,
    Upload,
    Drawer,
    Spin,
    Badge,
    Popover,
    Dropdown,
    Radio,
    Tabs,
    Tree,
    TreeSelect
} from 'ant-design-vue';


Vue.config.productionTip = false;
Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$success = Modal.success

Vue.use(VueRouter)
Vue.use(AMap);
// Vue.use(Antd);
Vue.use(Base).use(Layout).use(Col).use(Row).use(Modal).use(Icon).use(Menu).use(List).
use(Form).use(Input).use(Divider).use(Button).use(Checkbox).use(Tooltip).use(Pagination).use(Select).use(Table).use(Message)
    .use(Alert).use(Card).use(Upload).use(Drawer).use(Spin).use(Badge).use(Popover).use(Dropdown).use(Radio).use(Tabs).use(Tree).use(TreeSelect);


AMap.initAMapApiLoader({
    key: 'f9645b34f7a07297a3c90fff903a736b', //刚刚开发者申请哪里的key
    plugin: ['AMap.Autocomplete', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
    v: '1.4.4'
});


//如果token不存在则调整到登录页面
Common.router.beforeEach((to, from, next) => {
    // alert(to.path+"===="+from.path);
    // if(to.path===from.path){
    //     next(false);
    // }
    window.document.title = to.meta.title || '遇见书'
    if (to.meta && to.meta.auth && to.meta.auth == true) {
        let isLoginState = Common.store.getters.isLogin;
        if (isLoginState) {
            next();
        } else {
            window.console.log("未认证，请先登录！" + to.path);
            Common.store.commit("setCatchUti", to.path);
            next({
                path: '/login'
            });
        }
    } else {
        next();
    }
});

Vue.prototype.$setWs = wsConnection;
wsConnection.initWebSocket();


function toEmotion(text, isNoGif) {
    var list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极', '嘿哈', '捂脸', '奸笑', '机智', '皱眉', '耶', '红包', '鸡'];

    if (!text) {
        return text;
    }

    text = text.replace(/\[[\u4E00-\u9FA5]{1,3}\]/gi, function(word) {
        var newWord = word.replace(/\[|\]/gi, '');
        var index = list.indexOf(newWord);
        var backgroundPositionX = -index * 24
        var imgHTML = '';
        if (index < 0) {
            return word;
        }

        if (isNoGif) {
            if (index > 104) {
                return word;
            }
            imgHTML = `<i class="static-emotion" style="background:url(https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif) ${backgroundPositionX}px 0;"></i>`
        } else {
            var path = index > 104 ? '/img' : 'https://res.wx.qq.com/mpres/htmledition/images/icon';
            imgHTML = `<img class="static-emotion-gif" style="vertical-align: middle" src="${path}/emotion/${index}.gif">`
        }
        return imgHTML;
    });
    return text;
}


Vue.directive('emotion', {
    bind: function(el, binding) {
        el.innerHTML = toEmotion(binding.value)
    }
});

Vue.prototype.playAudio = () => {
    let buttonAudio = document.getElementById('audio_newmsg');
    buttonAudio.setAttribute('src', audio)
    buttonAudio.play()
}

new Vue({
    router: Common.router,
    store: Common.store,
    render: h => h(App),
}).$mount('#app')