<template>
  <div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout" label="邮箱">
        <a-input
          placeholder="邮箱"
          v-decorator="[
          'email',
          {
            rules: [
              {
                type: 'email',
                message: '请输入正确格式的邮箱!',
              },
              {
                required: true,
                message: '请输入邮箱!',
              },
            ],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="密码">
        <a-input
          placeholder="密码"
          v-decorator="[
          'password',
          {
            rules: [
              {
                required: true,
                message: '请输入密码!',
              },
              {
                validator: validateToNextPassword,
              },
            ],
          },
        ]"
          type="password"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="确认密码">
        <a-input
          placeholder="确认密码"
          v-decorator="[
          'confirm',
          {
            rules: [
              {
                required: true,
                message: '请确认密码!',
              },
              {
                validator: compareToFirstPassword,
              },
            ],
          },
        ]"
          type="password"
          @blur="handleConfirmBlur"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout">
        <span slot="label">
          昵称&nbsp;
          <a-tooltip title="希望大家怎样称呼你?">
            <a-icon type="question" />
          </a-tooltip>
        </span>
        <a-input
          placeholder="昵称"
          v-decorator="[
          'nickname',
          {
            rules: [{ required: true, message: '请输入昵称!', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="验证码" extra="验证码将发送到你邮箱，有效时间30分钟">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-input
              placeholder="验证码"
              v-decorator="[
              'captcha',
              { rules: [{ required: true, message: '请填写发送到你邮箱的验证码！' }] },
            ]"
            />
          </a-col>
          <a-col :span="12">
            <a-button @click="sentCaptchaToEmail">发送验证码</a-button>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-checkbox
          v-decorator="['agreement', { valuePropName: 'checked' ,rules:[{ required: true, message: '同意用户协议才能注册!', }]}]"
        >我已经阅读协议并同意协议内容</a-checkbox>
        <a @click="showModal">《用户注册协议》</a>
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button :disabled="submitDisabled" type="primary" html-type="submit">注册账户</a-button>
      </a-form-item>
    </a-form>

    <a-modal
      title="用户注册协议"
      :visible="visible"
      cancelText="不同意"
      okText="同意"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <p>
        1、我们将保护你的注册隐私。换读和借阅的地址信息将暴露出来，你是否接受？
        <br />2、换书过程请诚实守信
        <br />3、平台只提供换书信息发布和沟通的渠道。不负责线下的换书结果，但是如果发现用户有违诚实守信原则我们将封账号
        <br />4、你发布的图书必须符合中华人民共和国的相关法律法规。不得传播色情、暴力等内容
        <br />5、我们将调查不守信行为
        <br />6、如有失信行为，请投诉。
        <br />7、网站的最终解释权在遇见书
      </p>
    </a-modal>
  </div>
</template>

<script>
import Http from "../Https.js";
export default {
  data() {
    return {
      confirmDirty: false,
      visible: false,
      confirmLoading: false,
      submitDisabled: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 16 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 16 },
          sm: { span: 8 }
        }
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 8
          }
        }
      },
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
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
      this.confirmLoading = false;
      this.form.setFieldsValue({ agreement: true });
    },
    handleCancel() {
      this.visible = false;
      this.form.setFieldsValue({ agreement: false });
    },
    handleSubmit(e) {
      let routerTemp = this.$router;
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.submitDisabled = true;
          Http.fetchPost("register", values)
            .then(() => {
              this.$success({
                content: (
                  <div>
                    <p>您已经成功注册账号，请去登录吧</p>
                  </div>
                ),
                onOk() {
                  routerTemp.push("login");
                }
              });
              this.submitDisabled = false;
            })
            .catch(err => {
              this.submitDisabled = false;
              if (err && err.message) {
                this.$message.error(err.message);
              } else {
                window.console.log(err);
                this.$message.error("发生异常");
              }
            });
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次输入的密码不一致!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    sentCaptchaToEmail() {
      let email = this.form.getFieldValue("email");
      if (!email) {
        this.$message.success("请填写注册邮箱");
      }
      const params = {
        email: email
      };
      Http.fetchPost("sent-register-code", params)
        .then(() => {
          this.$message.success("验证码已经发送到你的邮箱，请查收");
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            window.console.log(err);
            this.$message.error("发生异常");
          }
        });
    }
  }
};
</script>
