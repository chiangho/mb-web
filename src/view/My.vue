<template>
  <div>
    <a-layout>
      <a-layout-sider>
        <a-menu style="width: 200px" mode="inline">
          <a-menu-item key="my_menu_memberaddress">
            <span @click="go_member_address_page">换书区域</span>
          </a-menu-item>
          <a-menu-item key="my_menu_memberlink">
            <span @click="go_member_link_page">换书联系人</span>
          </a-menu-item>
          <a-menu-item key="member_publish_age">
            <span @click="go_member_publish_page">你发布的换书</span>
          </a-menu-item>
          <a-menu-item key="member_application">
            <span @click="go_member_application">申请读他人书的记录</span>
          </a-menu-item>
          <a-menu-item key="member_trancation">
            <span @click="go_member_member_trancation">双方确认换书的记录</span>
          </a-menu-item>
          <a-menu-item key="member_setting">
            <span @click="go_member_setting">个人设置</span>
          </a-menu-item>
        </a-menu>
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
export default {
  data() {
    return {
      current: ["mail"],
      openKeys: ["sub1"]
    };
  },
  methods: {
    go_member_setting(){
      this.$router.push("/my/member-setting");
    },
    go_member_member_trancation() {
      this.$router.push("/my/member-trancation");
    },
    go_member_address_page() {
      this.$router.push("/my/member-address");
    },
    go_member_application() {
      this.$router.push("/my/member-application");
    },
    go_member_link_page() {
      this.$router.push("/my/member-link");
    },
    go_member_publish_page() {
      this.$router.push("/my/member-release");
    }
  },
  watch: {
    openKeys(val) {
      window.console.log("openKeys", val);
    }
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