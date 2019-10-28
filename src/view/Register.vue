<template>
  <div>
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item v-bind="formItemLayout" label="邮箱">
        <a-input
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
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-input
          v-decorator="[
          'nickname',
          {
            rules: [{ required: true, message: '请输入昵称!', whitespace: true }],
          },
        ]"
        />
      </a-form-item>
      <!-- <a-form-item
      v-bind="formItemLayout"
      label="Captcha"
      extra="We must make sure that your are a human."
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-input
            v-decorator="[
              'captcha',
              { rules: [{ required: true, message: 'Please input the captcha you got!' }] },
            ]"
          />
        </a-col>
        <a-col :span="12">
          <a-button>Get captcha</a-button>
        </a-col>
      </a-row>
      </a-form-item>-->
      <a-form-item v-bind="tailFormItemLayout">
        <a-checkbox  v-decorator="['agreement', { valuePropName: 'checked' }]">
          我已经阅读协议并同意协议内容
        </a-checkbox> 
        <a @click="showModal">《用户协议》</a>
      </a-form-item>
      <a-form-item v-bind="tailFormItemLayout">
        <a-button type="primary" html-type="submit">Register</a-button>
      </a-form-item>
    </a-form>

    <a-modal
      title="用户注册协议"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <p>
          用户协议
      
        <br/><br/><br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        asdfsadfsad
      </p>
    </a-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      confirmDirty: false,
      visible: false,
     
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
      this.confirmLoading = true;
      setTimeout(() => {
        this.visible = false;
        this.confirmLoading = false;
        this.$form.setFieldsValue({'agreement':true});
      }, 500);
    },
    handleCancel() {
      this.visible = false;
      this.$form.setFieldsValue({'agreement':false});
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          window.console.log("Received values of form: ", values);
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
        callback("Two passwords that you enter is inconsistent!");
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
    }
  }
};
</script>
