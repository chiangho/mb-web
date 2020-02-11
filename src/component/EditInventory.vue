<template>
  <div>
    <a-spin :spinning="spinning" :tip="spinningTip">
      <a-form :form="form">
        <a-form-item label="图书条码" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-input
            v-decorator="[
          'isbn',
          { rules: [{ required: false, message: '请填写图书条码!' }] },
        ]"
            placeholder="请填写图书条码"
            @blur="finishIsbn"
          ></a-input>
        </a-form-item>
        <a-form-item label="图书名称" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-input
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请填写图书名称!' }] },
            ]"
            placeholder="请填写图书名称"
          ></a-input>
        </a-form-item>

        <a-form-item label="封面图片" :label-col="{span:4}" :wrapper-col="{span:18}">
          <input
            type="file"
            id="people-export"
            ref="inputer"
            @change="handleUpdateIcon"
            placeholder="请上传图片"
            v-decorator="[
              'icon',
              { rules: [{ required: true, message: '请上传图片!' }] },
            ]"
          />
          <img v-if="isShowImage" :src="imagePath" />
        </a-form-item>
        <a-form-item label="图书简介" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-textarea
            :rows="4"
            v-decorator="[
          'introduction',
          { rules: [{ required: false, message: '请输入图书简介!' }] },
        ]"
            placeholder="请填写图书简介"
          ></a-textarea>
        </a-form-item>
        <a-form-item :wrapper-col="tailFormItemLayout.wrapperCol">
          <a-button block type="primary">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>
<script>
import Http from "./../Https.js";
import Common from "./../Common";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 18,
      offset: 0
    },
    sm: {
      span: 18,
      offset: 4
    }
  }
};

export default {
  name: "registered-book",
  data() {
    return {
      tailFormItemLayout,
      spinningTip: "正在操作",

      spinning: false,
      imagePath: null,
      imgSrc: null,
      isShowImage: false
    };
  },
  props: {
    code: {
      type: String,
      required: false,
      default: null
    },
    callback: {
      type: Function,
      required: false,
      default: null
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "inventory-book" });
  },
  created() {
    if (this.code) {
      //加载图书信息
      Http.fetchGet("inventory/detail", { code: this.code })
        .then(resp => {
          let data = resp.data;
          this.form.setFieldsValue({
            isbn: data.isbn,
            name: data.name,
            introduction: data.introduction
          });
          this.imgSrc = data.icon;
          //设置显示图片
          if (data.icon) {
            this.isShowImage = true;
            this.imagePath =
              Common.Config.host + "/common/down-image?path=" + data.icon;
          }
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("异常");
          }
        });
    }
  },
  methods: {
    finishIsbn() {},
    handleUpdateIcon(event) {
      this.imagePath = "";
      this.imgSrc = "";
      this.spinning = true;
      this.spinningTip = "图片上传中....";
      // 文件上传
      Http.update(event, "upload-image", "image", null)
        .then(res => {
          this.spinning = false;
          this.$message.success("上传成功");
          this.imagePath =
            Common.Config.host + "/common/down-image?path=" + res.data;
          this.imgSrc = res.data;
          this.isShowImage = true;
        })
        .catch(e => {
          this.spinning = false;
          this.form.setFieldsValue({ icon: null });
          if (e && e.message) {
            this.$message.error(e.message);
          } else {
            this.$message.error("异常");
          }
        });
    }
  }
};
</script>
