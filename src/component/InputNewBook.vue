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
        <input type="file" id="people-export" ref="inputer" @change="handleUpdateIcon" />
        <!--         
        <a-upload
          name="image"
          :multiple="false"
          :beforeUpload="beforeUpdateFile"
          :action="host+'/upload-image'"
          :data="updateData"
          :headers="updateHeaders"
          :customRequest="handleUpdateIcon"
          :fileList="fileList"
        >
          <a-button>
            <a-icon type="upload" />上传图书封面
          </a-button>
        </a-upload>-->
      </a-form-item>

      <a-form-item :wrapper-col="{span:8,offset:8}">
        <a-button type="primary" block @click="inputBook">登记</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import Common from "./../Common";
import http from "./../Https";

export default {
  data() {
    return {
      host: Common.Config.host,
      updateData: {},
      inputBookCode: null,
      imagePath: "",
      fileList: [],
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
  props: {
    type:{
      type: String,
      required: true
    }, 
    isbn:{
      type: String,
      required: true
    },
    callBack:{
      type: Function,
      required: true
    }
  },
  methods: {
    inputBook() {
      if (
        !this.form.getFieldValue("bookName") ||
        this.form.getFieldValue("bookName") == ""
      ) {
        this.$message.error("请填写书名！");
        return;
      }

      if (
        !this.form.getFieldValue("isbn") ||
        this.form.getFieldValue("isbn") == ""
      ) {
        this.$message.error("请填写ISBN编号！");
        return;
      }

      if (!this.imagePath || this.imagePath == "") {
        this.$message.error("请上传图片！");
        return;
      }

      http
        .ajax("post", "publish/register-book", null, {
          bookName: this.form.getFieldValue("bookName"),
          isbn: this.form.getFieldValue("isbn"),
          image: this.imagePath,
          type: this.type
        })
        .then(resp => {
          this.inputBookCode = resp.data;
          this.callBack(this.inputBookCode,this.form.getFieldValue("isbn"),this.form.getFieldValue("bookName"))
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          }
        });
    },
    beforeUpdateFile() {
      let isbn_temp = this.form.getFieldValue("isbn");
      this.imagePath = "";
      this.fileList = [];
      if (isbn_temp) {
        this.updateData.isbn = isbn_temp;
        return true;
      } else {
        this.$message.error("图书编号不能为空");
        return false;
      }
    },
    handleUpdateIcon(event) {
      let isbn_temp = this.form.getFieldValue("isbn");
      this.imagePath = "";
      if (!isbn_temp|| isbn_temp=='') {
        this.$message.error("图书编号不能为空");
        return;
      } 
      // 文件上传
      http.update(event,"upload-image","image",{isbn:isbn_temp})
        .then(res => {
          this.$message.success("上传成功");
          this.imagePath=res.data;
          alert(this.imagePath);
        })
        .catch(e => {
          if(e&&e.message){
            this.$.message.error(e.message);
          }else{
            this.$message.error("异常");
          }
        });
    }
  }
};
</script>