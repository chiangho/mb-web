<template>
  <div id="app">
    <a-layout>
      <a-layout-header>
        <a-row>
          <a-col :span="3">
            <div class="item logo">遇见书</div>
          </a-col>
          <a-col :span="11">
            <a-menu mode="horizontal" v-model="topMenuCurrent">
              <a-menu-item key="app" @click="go_home_page">
                <a-icon type="appstore" />
                <span>首页</span>
              </a-menu-item>
              <a-menu-item key="homan" @click="go_my_page">
                <a-icon type="smile" />
                <span>个人中心</span>
              </a-menu-item>
              <a-menu-item key="publicBook" @click="go_publish_page">
                <a-icon type="book" />
                <span>发布图书</span>
              </a-menu-item>
            </a-menu>
          </a-col>
          <a-col :span="10" class="header-right">
            <div class="item noUnLink right">
              <div v-if="$store.getters.isLogin">
                {{$store.state.userInfo.name}}
                <a-popover
                  placement="bottom"
                  trigger="hover"
                  @visibleChange="handleHoverChange"
                  :visible="hovered"
                  v-if="$store.state.unDialogueCount>0"
                >
                  <template slot="content">
                    <a-list size="small" bordered :dataSource="unReadMemberInfoData">
                      <a-list-item
                        slot="renderItem"
                        slot-scope="item"
                        @click="openDialogue(item.memberCode)"
                      >{{item.memberName+'的消息['+item.count+']条未读'}}</a-list-item>
                    </a-list>
                  </template>

                  <a-badge
                    :numberStyle="{backgroundColor: 'red', color: '#FFF', boxShadow: '0 0 0 1px #d9d9d9 inset',borderRadius:'8px',width:'18px',height:'18px',lineHeight:'18px', textAlign:'center'}"
                  >
                    <span slot="count">{{$store.state.unDialogueCount}}</span>
                    <a-icon type="bell" />
                  </a-badge>
                </a-popover>

                <a-icon type="bell" v-else />
                <a style="margin-left:20px" @click="log_out()">退出</a>
              </div>
              <div v-else>
                <a @click="to_login_page()">登录</a>
                <a-divider type="vertical" />
                <router-link to="/register">注册</router-link>
              </div>
            </div>
            <div class="right" style="cursor:pointer" @click="openLinkInfoWindow">联系我们</div>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
    <audio
      controls="controls"
      muted
      id="audio_newmsg"
      hidden
    >Your browser does not support the audio element.</audio>
    <div clickMusic="true"></div>

    <a-modal
      :visible="dialogueVisible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :destroyOnClose="true"
      :footer="null"
    >
      <MyChat :tagMemberCode="targeMemberCode"></MyChat>
      <div slot="title">聊天</div>
    </a-modal>

    <a-modal
      :visible="isShowLinkInfo"
      @ok="handleOkShowLinkInfo"
      @cancel="handleCancelShowLinkInfo"
      :destroyOnClose="true"
      :footer="null"
      title="联系我们"
    >
      <div>
        <div>QQ:524119442</div>
        <div>邮箱：meetingbook@163.com</div>
        <div>遇见书由磐石软件开发</div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import Http from "./Https.js";
import MyChat from "./component/MyChat";

export default {
  components: {
    MyChat
  },
  data() {
    return {
      hovered: false,
      unReadMemberInfoData: [],
      targeMemberCode: null,
      dialogueVisible: false,
      confirmLoading: false,
      isShowLinkInfo: false,
      topMenuCurrent:[]
    };
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.isLogin;
    }
  },
  created(){
    this.topMenuCurrent = this.$store.getters.getTopMenuCurrent;
  },
  watch: {
    isLogin: loginState => {
      window.console.log(loginState);
    }
  },
  methods: {
    openLinkInfoWindow() {
      this.isShowLinkInfo = true;
    },
    handleOkShowLinkInfo() {
      this.isShowLinkInfo = false;
    },
    handleCancelShowLinkInfo() {
      this.isShowLinkInfo = false;
    },
    handleOk() {
      this.dialogueVisible = false;
    },
    handleCancel() {
      this.dialogueVisible = false;
    },
    openDialogue(memberCode) {
      this.dialogueVisible = true;
      this.targeMemberCode = memberCode;
    },
    handleHoverChange(visible) {
      this.hovered = visible;
      if (this.hovered) {
        this.unReadMemberInfoData = this.$store.getters.getUnReadMemberInfo;
      }
    },
    to_login_page() {
      this.$router.push("/login");
    },
    log_out() {
      Http.fetchGet("log-out")
        .then(response => {
          this.$setWs.logout();
          this.$store.commit("setUserToken", "");
          this.$store.commit("setUserInfo", null);
          this.$store.commit("cleanUserDialogue");
          this.$router.push("/home");
          window.console.log(response.data);
        })
        .catch(err => {
          this.$setWs.logout();
          this.$store.commit("setUserToken", "");
          this.$store.commit("setUserInfo", null);
          this.$store.commit("cleanUserDialogue");
          window.console.log(err);
        });
    },
    go_home_page() {
      this.$store.commit("setTopMenuCurrent", "app");
      this.$router.push("/home");
    },
    go_my_page() {
      this.$store.commit("setTopMenuCurrent", "homan");
      if(this.$store.getters.isLogin){
        this.$router.push("/my");
      }else{
        this.$router.push("/login");
      }
    },
    go_publish_page() {
      this.$store.commit("setTopMenuCurrent", "publicBook");
      this.$router.push("/publish-book").catch(err => {
        window.console.log(err);
      });
    }
  }
};
</script>

<style>
#app {
  font-size: 14px;
}
.ant-layout-header {
  color: white;
  padding: 0 20px !important;
}
.ant-layout-header .item {
  height: 64px;
  height: 64px;
  line-height: 64px;
}
.ant-layout-header .logo {
  font-size: 24px;
  text-align: left;
}
.ant-layout-header .header-right {
  text-align: right !important;
}

.right {
  float: right;
  margin-left: 10px;
}
.ant-layout-header .ant-menu {
  height: 65px;
  line-height: 65px;
  background: #001529;
  color: white;
}
.ant-layout-header a {
  color: white !important;
  text-decoration: underline;
}
.ant-layout-header a:hover {
  color: #1890ff !important;
}
.ant-layout-header a:link {
  color: #1890ff !important;
}
.ant-layout-header a:active {
  color: #1890ff !important;
}
.noUnLink a {
  color: white !important;
  text-decoration: none !important;
}
.noUnLink a:hover {
  color: #1890ff !important;
  text-decoration: none !important;
}
.noUnLink a:link {
  color: #1890ff !important;
  text-decoration: none !important;
}
.noUnLink a:active {
  color: #1890ff !important;
  text-decoration: none !important;
}
</style>


