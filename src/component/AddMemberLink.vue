<template>
  <div>
    <a-form id="addMemberLinkForm" :form="form" @submit="handleSubmitAddMemberLink">
      <a-form-item label="联系人" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-input
          v-decorator="[
          'name',
          { rules: [{ required: true, message: '请填写联系人' }] },
        ]"
          placeholder="请填写联系人"
        ></a-input>
      </a-form-item>
      <a-form-item label="手机" :label-col="{span:4}" :wrapper-col="{span:16}">
       <a-input
          v-decorator="[
          'phone',
          { rules: [{ required: true, message: '请填写手机' }] },
        ]"
          placeholder="请填写手机"
        ></a-input>
      </a-form-item>
      <a-form-item label="微信" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-input
          v-decorator="[
          'wechat'
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
     
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "addMemberLinkForm" });
  },
 
  methods: {
    
    handleSubmitAddMemberLink() {
      this.form.validateFields((err, values) => {
        if (!err) {
          Http.fetchGet("member/link/save", values)
            .then(res => {
              if(res.status===200){
                //alert("success");
                this.$emit('addMemberLinkSuccess');
              }else{
                alert(res.error.message);
              }
            })
            .catch(err => {
              window.console.log(err);
            });
        }
      });
    }
  }
};
</script>