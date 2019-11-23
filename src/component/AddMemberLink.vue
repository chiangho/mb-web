<template>
  <div>
    <a-form id="addMemberLinkForm" :form="form" @submit="handleSubmitAddMemberLink">
      <a-form-item label="联系人" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-input
          v-decorator="[
          'name',
          { rules: [{ required: true, message: '请填写联系人' }],initialValue:defaultName },
        ]"
          placeholder="请填写联系人"
        ></a-input>
      </a-form-item>
      <a-form-item label="手机" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-input
          v-decorator="[
          'phone',
          { rules: [{ required: true, message: '请填写手机' }] ,initialValue:defaultPhone},
        ]"
          placeholder="请填写手机"
        ></a-input>
      </a-form-item>
      <a-form-item label="微信" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-input
          v-decorator="[
          'wechat',
          {initialValue:defaultWechat}
        ]"
          placeholder="请填写微信"
        ></a-input>
      </a-form-item>

      <a-form-item :wrapper-col="{span:16,offset:4}">
        <a-button type="primary" block html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import Http from "./../Https.js";

export default {
  name: "add-member-link",
  data() {
    return {
      defaultName: null,
      defaultWechat: null,
      defaultPhone: null
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "addMemberLinkForm" });
  },
  props: ["code"],
  created() {
    this.loadLinkInfo();
  },
  methods: {
    handleSubmitAddMemberLink() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if(this.code){
            values["code"]= this.code;
          }
          Http.fetchGet("member/link/save", values)
            .then(res => {
              if (res.status === 200) {
                //alert("success");
                this.$emit("addMemberLinkSuccess");
              } else {
                alert(res.error.message);
              }
            })
            .catch(err => {
              window.console.log(err);
            });
        }
      });
    },
    loadLinkInfo() {
      if (this.code) {
        Http.fetchGet("member/link/detail", { code: this.code })
          .then(res => {
            this.defaultName=res.data.linkmanName;
            this.defaultWechat=res.data.wechat;
            this.defaultPhone=res.data.mobile;
          })
          .catch(err => {
            this.$message.error(JSON.stringify(err));
          });
      }
    }
  }
};
</script>