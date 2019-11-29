<template>
  <div>
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form"
      @submit="handleSubmit"
    >
      <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
        <a-alert
          v-if="alertVisible"
          type="error"
          :message="alertMessage"
          closable
          :afterClose="handleCloseAlert"
        />
      </a-form-item>

      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="邮箱"
      >
        <a-input
          v-decorator="[
          'account',
          { rules: [{ required: true, message: '请输入邮箱!' }] },
        ]"
          placeholder="邮箱"
        >
          <!-- <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" /> -->
        </a-input>
      </a-form-item>
      <a-form-item
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
        label="密码"
      >
        <a-input
          v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码!' }] },
        ]"
          type="password"
          placeholder="密码"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-item>
      <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
        <a-checkbox
          v-decorator="[
          'remember',
          {
            valuePropName: 'checked',
            initialValue: true,
          },
        ]"
        >记住账号</a-checkbox>

        <a class="login-form-button" @click="to_forgot_password">忘记密码</a>
        <a-button type="primary" html-type="submit" class="login-form-button">登录</a-button>Or
        <a style="color:#000" @click="to_register">没有账号，赶紧注册吧!</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import Http from "../Https.js";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
};

export default {
  data() {
    return {
      formItemLayout,
      formTailLayout,
      alertVisible: false,
      alertMessage: ""
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    handleSubmit(e) {
      this.alertVisible = false;
      this.alertMessage = "";
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          //调用登录接口
          Http.fetchPost("login", values)
            .then(response => {
              if (response.status == 200) {
                this.$store.commit("setUserToken", response.data.token);
                this.$store.commit("setUserInfo", response.data.member);
                let catchUri = this.$store.getters.getCatchUri;
                window.console.log("登录成功=======》"+catchUri);
                this.$store.commit("setCatchUti", "");
                if (catchUri) {
                  this.$router.push(catchUri);
                } else {
                  this.$router.push("/home");
                }
              } else {
                this.alertVisible = true;
                this.alertMessage = response.error.message;
              }
            })
            .catch(err => {
              this.alertVisible = true;
              this.alertMessage = err.message;
            });
        }
      });
    },
    to_forgot_password() {
      this.$router.push("/forget-password");
    },
    to_register() {
      this.$router.push("/register");
    },
    handleCloseAlert() {
      this.visible = false;
    }
  }
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>