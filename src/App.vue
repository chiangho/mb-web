<template>
  <div id="app">
    <a-layout>
      <a-layout-header>
        <a-row >
          <a-col :span="4">
            <div class="item logo">遇见书</div>
          </a-col>
          <a-col :span="16">
            <a-menu  mode="horizontal">
              <a-menu-item key="mail">
                <!-- <a-icon type="mail"/> -->
                <router-link to="/home">首页</router-link>
              </a-menu-item>
              <!-- <a-menu-item key="app">
                <a-icon type="appstore"/>Navigation Two
              </a-menu-item> -->
            </a-menu>
          </a-col>
          <a-col :span="4">
            <div class="item right">
              <router-link to="/login">登录</router-link>
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
export default {
  methods:{

  }
}
</script>

<style>
#app{
  font-size: 14px
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
.ant-layout-header .right {
  text-align: right;
}
.ant-layout-header .ant-menu {
  height: 65px;
  line-height: 65px;
  background: #001529;
  color: white;
}
a{
  color: white !important;
  text-decoration:underline
}
a:hover{
  color: #1890ff !important
}
a:link{
  color: #1890ff !important
}
a:active{
  color: #1890ff !important
}
</style>


