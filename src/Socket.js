//这里需要引入vuex
import Common from './Common.js';

let wsConnection = {
  $ws: null,
  lockReturn: false,
  timeout: 30 * 1000,
  timeoutObj: null,
  timeoutNum: null,
  serverTimeoutObj: null,
  //初始化webSocket长连接
  initWebSocket: function () {
    this.$ws = new WebSocket(Common.Config.webSocketHost); //写入地址 这里的地址可以在initWebSocket方法加入参数
    this.$ws.onopen = this.wsOpen;
    this.$ws.onclose = this.wsClose;
    this.$ws.onmessage = this.wsMsg;
    this.$ws.onerror = this.wsError;
  },
  //打开websocket
  wsOpen: function (e) {
    //开始websocket心跳
    window.console.log(e);
    window.console.log('ws success');
    wsConnection.login();
    wsConnection.startWsHeartbeat();
  },
  wsClose: function (e) {
    window.console.log(e, 'ws close')
    wsConnection.reconnect()
  },
  wsMsg: function (msg) {
    //每次接收到服务端消息后 重置websocket心跳
    wsConnection.resetHeartbeat();
    //服务端发送来的消息存到vuex
    window.console.log(msg);
    try {
      if (msg.data) {
        let jsonContent = JSON.parse(msg.data);
        if (jsonContent.type && jsonContent.type === 1) {
          Common.store.commit("addDialogue", jsonContent.content);
        }
      }
    } catch (err) {
      window.console.log(err);
    }
  },
  wsError: function (err) {
    window.console.log(err, 'ws error');
    wsConnection.reconnect()
  },
  //重启websocket
  reconnect: function () {
    let _this = this;
    if (_this.lockReturn) {
      return;
    }
    _this.lockReturn = true;
    _this.timeoutNum && clearTimeout(_this.timeoutNum);
    _this.timeoutNum = setTimeout(function () {
      _this.initWebSocket();
      _this.lockReturn = false;
    }, 10000);
  },
  startWsHeartbeat: function () {
    let _this = this;
    _this.timeoutObj && clearTimeout(_this.timeoutObj);
    _this.serverTimeoutObj && clearTimeout(_this.serverTimeoutObj);
    _this.timeoutObj = setInterval(function () {
      //判断websocket当前状态
      if (_this.$ws.readyState != 1) {
        _this.reconnect();
      } else {
        let WebSocketOutVo = {
          type: 3,
          content: "心跳检测"
        }
        _this.$ws.send(JSON.stringify(WebSocketOutVo));
      }
    }, _this.timeout);
  },
  //重置websocket心跳
  resetHeartbeat: function () {
    let _this = this;
    clearTimeout(_this.timeoutObj);
    clearTimeout(_this.serverTimeoutObj);
    _this.startWsHeartbeat()
  },
  sendMessage: (msg) => {
    //发送信息
    wsConnection.$ws.send(msg);
  },
  login: () => {
    if (Common.store.state.userToken) {
      let WebSocketOutVo = {
        type: 4,
        content: Common.store.state.userToken
      }
      wsConnection.sendMessage(JSON.stringify(WebSocketOutVo));
    } else {
      wsConnection.logout();
    }
  },
  logout: () => {
    let WebSocketOutVo = {
      type: 5,
      content: "退出系统"
    }
    wsConnection.sendMessage(JSON.stringify(WebSocketOutVo));
  }
};

//抛出websocket对象
export default wsConnection