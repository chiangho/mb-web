<template>
  <div>
    <a-form :form="form">
      <a-form-item label="图书ISBN" :label-col="{span:8}" :wrapper-col="{span:8}">
        <a-input
          v-decorator="[
          'isbn',
          { rules: [{ required: true, message: '请输入图书ISBN编号!' }] },
        ]"
          placeholder="图书ISBN编号"
        ></a-input>
      </a-form-item>

      <a-form-item label="书名" :label-col="{span:8}" :wrapper-col="{span:8}">
        <a-input
          v-decorator="[
          'bookName',
          { rules: [{ required: false, message: '书名' }] },
        ]"
          placeholder="请填写书名"
        ></a-input>
      </a-form-item>

      <a-form-item label="封面图片" :label-col="{span:8}" :wrapper-col="{span:8}">
        <a-upload
          name="image"
          :multiple="false"
          :beforeUpload="beforeUpdateFile"
          :action="host+'/upload-image'"
          :data="updateData"
          :headers="updateHeaders"
          @change="handleUpdateIcon"
        >
          <a-button>
            <a-icon type="upload" />上传图书封面
          </a-button>
        </a-upload>
      </a-form-item>

      <a-form-item :wrapper-col="{span:8,offset:8}">
        <a-button type="primary" block>提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import Common from "./../Common";

export default {
  data() {
    return {
      host: Common.Config.host,
      updateData: {},
      inputBookCode: null,
      updateHeaders: {
        Authorization: this.$store.state.userToken
      }
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "member-input-book" });
  },
  mounted() {
    this.form.setFieldsValue({
      isbn: this.isbn
    });
  },
  props: ["type", "isbn"],
  methods: {
    beforeUpdateFile() {
      let isbn_temp = this.form.getFieldValue("isbn");
      if (isbn_temp) {
        return true;
      } else {
        this.$message.error("图书编号不能为空");
        return false;
      }
    },
    handleUpdateIcon(info) {
      if (info.file.status !== "uploading") {
        window.console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        alert(JSON.stringify(info.file.response));
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    }
  }
};
</script>