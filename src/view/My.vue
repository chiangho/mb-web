<template>
  <div>
    <a-layout>
      <a-layout-sider>
        <a-menu
          style="width: 200px"
          :defaultSelectedKeys="['1']"
          :openKeys.sync="openKeys"
          mode="inline"
        >
          <a-menu-item key="9">
            <span @click="go_member_address_page">换书区域</span>
          </a-menu-item>
          <a-menu-item key="10">换书联系人</a-menu-item>
          <a-menu-item key="11">我发起的换书</a-menu-item>
          <a-menu-item key="12">我的换书记录</a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
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
    go_member_address_page() {
      this.$router.push("/my/member-address");
    }
  },
  watch: {
    openKeys(val) {
      window.console.log("openKeys", val);
    }
  }
};
</script>
