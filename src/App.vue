<template>
  <div id="app">
    <a-layout>
      <a-layout-header>
        <a-row>
          <a-col :span="3">
            <div class="item logo">遇见书</div>
          </a-col>
          <a-col :span="13">
            <a-menu mode="horizontal">
              <a-menu-item key="app">
                <a-icon type="appstore" />
                <span @click="go_home_page">首页</span>
              </a-menu-item>
              <a-menu-item key="homan">
                <a-icon type="smile" />
                <span @click="go_my_page">个人中心</span>
              </a-menu-item>
              <a-menu-item key="publicBook">
                <a-icon type="book" />
                <span @click="go_publish_page">发布图书</span>
              </a-menu-item>
            </a-menu>
          </a-col>
          <a-col :span="8" class="header-right">
            <div class="item">
              <div v-if="$store.getters.isLogin">
                {{$store.state.userInfo.name}}
                <a-button @click="log_out()">退出</a-button>
              </div>
              <a-button v-else @click="to_login_page()">登录</a-button>
            </div>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script>
import Http from "./Https.js";
export default {
  data() {
    return {
      
    };
  },
  computed: {
    isLogin: function() {
      return this.$store.getters.isLogin;
    }
  },
  watch: {
    isLogin: loginState => {
      window.console.log(loginState);
    }
  },
 
 
  methods: {
 
    to_login_page() {
      this.$router.push("/login");
    },
    log_out() {
      Http.fetchGet("log-out")
        .then(response => {
          this.$store.commit("setUserToken", "");
          this.$store.commit("setUserInfo", null);
          this.$router.push("/home");
          window.console.log(response.data);
        })
        .catch(err => {
          this.$store.commit("setUserToken", "");
          this.$store.commit("setUserInfo", null);
          window.console.log(err);
        });
    },
    go_home_page() {
      this.$router.push("/home");
    },
    go_my_page() {
      this.$router.push("/my");
    },
    go_publish_page() {
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
</style>


