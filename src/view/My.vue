<template>
  <div>
    <a-menu
      @click="handleClick"
      style="width: 256px"
      :defaultSelectedKeys="['1']"
      :openKeys.sync="openKeys"
      mode="inline"
    >
      <a-menu-item key="9">换书区域</a-menu-item>
      <a-menu-item key="10">换书联系人</a-menu-item>
      <a-menu-item key="11">我发起的换书</a-menu-item>
      <a-menu-item key="12">我的换书历史</a-menu-item>
      
      
      <!-- <a-sub-menu key="sub1" @titleClick="titleClick">
        <span slot="title">
          <a-icon type="mail" />
          <span>Navigation One</span>
        </span>
      </a-sub-menu> -->
    
    </a-menu>
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
    handleClick(e) {
      window.console.log("click", e);
    },
    titleClick(e) {
      window.console.log("titleClick", e);
    }
  },
  watch: {
    openKeys(val) {
      window.console.log("openKeys", val);
    }
  }
};
</script>
