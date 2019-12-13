<template>
  <div>
    <a-card title="昵称设置" :bordered="false">
      <div>
        <a-input placeholder="请填写昵称" v-model="name" style="width: 200px" />
        <a-button type="primary" @click="submitName()">提交</a-button>
      </div>
    </a-card>
    <a-divider />
    <a-card title="修改密码" :bordered="false">
      <a-input-password placeholder="请填写密码" v-model="password" style="width: 200px" />
      <a-button type="primary" @click="submitPassword()">提交</a-button>
    </a-card>
  </div>
</template>
<script>
import http from "./../../Https";
export default {
  data() {
    return {
      name: this.$store.state.userInfo.name,
      password: ""
    };
  },
  methods: {
    submitName() {
      if (this.name) {
        http
          .ajax("post", "member/set-name", { name: this.name }, null)
          .then(() => {
            this.$store.commit("setUserName", this.name);
            this.$message.success("修改成功");
          })
          .catch(err => {
            if (err && err.message) {
              this.$message.error(err.message);
            }
          });
      }
    },
    submitPassword() {
      if (this.password) {
        http
          .ajax(
            "post",
            "member/reset-password",
            { password: this.password },
            null
          )
          .then(() => {
            this.password="";
            this.$message.success("修改成功");
          })
          .catch(err => {
            if (err && err.message) {
              this.$message.error(err.message);
            }
          });
      }
    }
  }
};
</script>