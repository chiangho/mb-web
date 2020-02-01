<template>
  <div>
    <a-layout>
      <a-layout-sider
        collapsible
        v-model="collapsed"
        collapsedWidth="80"
        @breakpoint="toggleCollapsed"
      >
        <div style="width: 200px">
          <!-- <a-button type="primary" @click="toggleCollapsed" style="margin-bottom: 16px">
            <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
          </a-button>-->
          <a-menu mode="inline" :inlineCollapsed="collapsed" v-model="leftMenuCurrent">
            <a-menu-item key="my_menu_memberaddress" @click="go_member_address_page">
              <a-icon type="pushpin" />
              <span>换书区域</span>
            </a-menu-item>
            <a-menu-item key="my_menu_memberlink" @click="go_member_link_page">
              <a-icon type="user" />
              <span>换书联系人</span>
            </a-menu-item>
            <a-menu-item key="member_publish_age" @click="go_member_publish_page">
              <a-icon type="upload" />
              <span>发布记录</span>
            </a-menu-item>
            <a-menu-item key="member_application" @click="go_member_application">
              <a-icon type="paper-clip" />
              <span>申请记录</span>
            </a-menu-item>
            <a-menu-item key="member_trancation" @click="go_member_member_trancation">
              <a-icon type="book" />
              <span>换读记录</span>
            </a-menu-item>
            <a-menu-item key="member_borrow" @click="go_member_borrow">
              <a-icon type="gold" />
              <span>借阅记录</span>
            </a-menu-item>
            <a-menu-item key="manage_book" @click="go_manage_book">
              <a-icon type="setting" />
              <span>图书管理</span>
            </a-menu-item>
            <a-menu-item key="member_setting" @click="go_member_setting">
              <a-icon type="setting" />
              <span>个人设置</span>
            </a-menu-item>
          </a-menu>
        </div>
      </a-layout-sider>
      <a-layout class="content_border">
        <a-layout-content>
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>

import Common from "./../Common";

export default {
  data() {
    return {
      collapsed: false,
      leftMenuCurrent: [],
      screenWidth: null
    };
  },
  created() {
    this.leftMenuCurrent = this.$store.getters.getLeftMenuCurrent;
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
 
  methods: {
    toggleCollapsed() {
      alert(1);
      this.collapsed = !this.collapsed;
    },
    go_manage_book(){
      this.$store.commit("setLeftMenuCurrent", "manage_book");
      this.$router.push("/my/manage_book");
    },
    go_member_setting() {
      this.$store.commit("setLeftMenuCurrent", "member_setting");
      this.$router.push("/my/member-setting");
    },
    go_member_member_trancation() {
      this.$store.commit("setLeftMenuCurrent", "member_trancation");
      this.$router.push("/my/member-trancation");
    },
    go_member_address_page() {
      this.$store.commit("setLeftMenuCurrent", "my_menu_memberaddress");
      this.$router.push("/my/member-address");
    },
    go_member_application() {
      this.$store.commit("setLeftMenuCurrent", "member_application");
      this.$router.push("/my/member-application");
    },
    go_member_link_page() {
      this.$store.commit("setLeftMenuCurrent", "my_menu_memberlink");
      this.$router.push("/my/member-link");
    },
    go_member_publish_page() {
      this.$store.commit("setLeftMenuCurrent", "member_publish_age");
      this.$router.push("/my/member-release");
    },
    go_member_borrow(){
      this.$store.commit("setLeftMenuCurrent", "member_borrow");
      this.$router.push("/my/member_borrow");
    }

  },
  watch: {
    openKeys(val) {
      window.console.log("openKeys", val);
    },
    screenWidth(val){//普通的watch监听
      if(val<Common.Config.simailWindowWidthSize){
        this.collapsed = true;
      }else{
        this.collapsed = false;
      }
    },
  }
};
</script>
<style scoped>
.ant-layout-sider {
  background-color: #fff;
}
.content_border {
  background-color: #fff;
}
.ant-layout-content {
  margin: 10px 10px;
}
</style>