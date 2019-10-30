<template>
  <div>
    <div class="header">
      <h2>找回密码</h2>
    </div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="tailFormItemAlertLayout">
        <a-alert
          v-if="alertVisible"
          :type="alertType"
          :message="alertMessage"
          closable
          :afterClose="handleCloseAlert"
        />
      </a-form-item>

      <a-form-item v-bind="tailFormItemAlertLayout">
        <a-input
          v-decorator="[
          'email',
          {
            rules: [
              {
                type: 'email',
                message: '请输入注册账号时的邮箱!',
              },
              {
                required: true,
                message: '请输入注册账号时的邮箱!',
              },
            ],
          },
        ]"
          placeholder="请输入注册账号时的邮箱"
        />
      </a-form-item>

      <a-form-item v-bind="tailFormItemAlertLayout">
        <div>输入注册时邮箱，将会把密码发送到你邮箱</div>
      </a-form-item>
      <a-form-item v-bind="tailFormItemAlertLayout">
        <a-button type="primary" html-type="submit">发送密码</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import Http from "../Https.js";
export default {
  data() {
    return {
      alertVisible: false,
      alertMessage: "",
      alertType: "error",
      tailFormItemAlertLayout: {
        wrapperCol: {
          xs: {
            span: 8,
            offset: 0
          },
          sm: {
            span: 8,
            offset: 8
          }
        }
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "forgetPassword" });
  },
  methods: {
    handleSubmit(e) {
      this.alertVisible = false;
      this.alertMessage = "";
      this.alertType = "error";
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          Http.fetchPost("sent-password", values)
            .then(response => {
              if (response.status == 200) {
                this.alertType = "success";
                this.alertVisible = true;
                this.alertMessage = "密码已经发送到你的邮箱";
              } else {
                this.alertVisible = true;
                this.alertMessage = response.error.message;
              }
            })
            .catch(err => {
              this.alertVisible = true;
              this.alertMessage = JSON.stringify(err.message);
            });
        }
      });
    },
    handleCloseAlert() {}
  }
};
</script>
<style scoped>
.header {
  text-align: center;
}
</style>