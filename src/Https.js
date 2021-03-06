import axios from 'axios'
import qs from 'qs'
import Common from "./Common.js"
import wsConnection from "./Socket.js"

axios.defaults.timeout = 30000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'; //配置请求头
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
axios.defaults.baseURL = Common.Config.host; //配置接口地址

//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if (config.method === 'post') {
        if (config.params) {
            let queryString = qs.stringify(config.params);
            if (!config.data) {
                config.data = queryString;

            }
            // if(config.url.indexOf("?")>0){
            //     let lastChar = config.url.substr(config.url.length-1,1);
            //     if(lastChar=="&"){
            //         config.url = config.url+ queryString;
            //     }else{
            //         config.url = config.url+"&"+ queryString;
            //     }
            // }else{
            //     config.url = config.url+"?"+ queryString;
            // }
            // window.console.log("==========>"+config.url);
            // config.params=null;
        }
    }
    let token = "";
    try {
        if (Common.store) {
            token = Common.store.state.userToken;
        }
    } catch (e) {
        token = ""
    }

    config.headers.Authorization = token;
    return config;
}, (error) => {
    window.console.log('错误的传参')
    return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
    //对响应数据做些事

    if (res.status === 200) {
        let status = res.data.status;
        if (status === 200) {
            return Promise.resolve(res.data);
        } else {
            let error = res.data.error.code;
            if (error == Common.Config.unauthorization || error == Common.Config.unauthorized) {
                if (Common.store) {
                    //websocker 退出登录
                    wsConnection.logout();
                    //设置缓存
                    Common.store.commit("setCatchUti", Common.router.history.current.path);
                    //清楚登录信息 
                    Common.store.commit("cleanUserDialogue");
                    //清楚token
                    Common.store.commit("setUserToken", "");
                    //清楚userInfo
                    Common.store.commit("setUserInfo", "");
                }
                Common.router.push("/login");
                res.data.error.message="登记超时，重新登录";
                return Promise.reject(res.data.error);
            } else {
                return Promise.reject(res.data.error);
            }
        }
    } else {
        return Promise.reject(res);
    }
}, (error) => {
    window.console.log('网络异常')
    return Promise.reject(error);
});

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        ajax("post", url, params, null).then(
                (response) => {
                    resolve(response);
                },
                (err) => {
                    reject(err);
                }
            )
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送get请求)
export function fetchGet(url, params) {
    let config = {
        params: params
    }
    return new Promise((resolve, reject) => {
        axios.get(url, config)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


export function update(e, url, fileName, args) { // 上传照片
    let file = e.target.files[0]
    /* eslint-disable no-undef */
    let param = new FormData() // 创建form对象
    param.append(fileName, file) // 通过append向form对象添加数据
    if (args) {
        for (var item in args) {
            param.append(item, args[item]) // 添加form表单中其他数据
        }
    }
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    // 添加请求头
    return new Promise((resolve, reject) => {
        axios.post(url, param, config)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    });
}



export function ajax(method, url, params, data) {
    // method = method.tolocaleUpperCase();
    return new Promise((resolve, reject) => {
        axios.request({
                url: url,
                method: method,
                params: params,
                data: data
            })
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    });
}

export default {
    fetchPost,
    fetchGet,
    ajax,
    update
}