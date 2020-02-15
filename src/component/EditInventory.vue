<template>
  <div>
    <a-spin :spinning="spinning" :tip="spinningTip">
      <a-form :form="form">
        <a-form-item label="图书条码" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-select
            v-decorator="[
          'isbn',
          { rules: [{ required: false, message: '请选择图书条码!' }] },
        ]"
            :loading="isLoadBookList"
            @search="handleSearchBookSearch"
            @change="handleSearchBookChange"
            showSearch
            notFoundContent="没有找到相应的图书"
            placeholder="请选择条码"
          >
            <a-select-option v-for="book in books" :key="book">{{book}}</a-select-option>
          </a-select>
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
              { rules: [{ required: false, message: '请上传图片!' }] },
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
          <a-button block type="primary" :disabled="submitDisabled" @click="save">提交</a-button>
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

let timeout;
let currentValue;

export default {
  name: "registered-book",
  data() {
    return {
      tailFormItemLayout,
      spinningTip: "正在操作",

      spinning: false,
      imagePath: null,
      imgSrc: null,
      isShowImage: false,

      //select isbn
      isLoadBookList: false,
      books: [],

      // 提交按钮是否禁用
      submitDisabled: false
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
    save() {
      this.form.validateFieldsAndScroll((err, values) => {
        let url = "";
        if (this.code) {
          url = "inventory/update";
        } else {
          url = "inventory/add";
        }
        if (!err) {
          this.submitDisabled = true;
          values.icon = this.imgSrc;
          if (this.code) {
            values.code = this.code;
          }
         
          Http.ajax("post", url, null, values)
            .then(() => {
              this.submitDisabled = false;
              this.$message.success("操作成功");
              if (this.callback) {
                this.callback();
              }
            })
            .catch(err => {
              this.submitDisabled = false;
              if (err && err.message) {
                this.$message.error(err.message);
              } else {
                this.$message.error("操作异常！");
              }
            });
        }
      });
    },
    handleSearchBookSearch(value) {
      if (value.length > 4) {
        this.fetchIsbn(value, this.handleSearchBookChangeCallBack);
      }
    },
    handleSearchBookChange(isbn) {
      if (!isbn) {
        return;
      }
      //查询图书的信息
      Http.fetchGet("book/detail", { isbn: isbn })
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
    },
    handleSearchBookChangeCallBack(books) {
      this.books = books;
    },
    fetchIsbn(value, callback) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      currentValue = value;
      function fake() {
        Http.fetchGet("book/search-isbn", { isbn: currentValue })
          .then(resp => {
            resp.data.push(currentValue);
            callback(resp.data);
          })
          .catch(err => {
            if (err && err.message) {
              window.console.log(err.message);
            } else {
              window.console.log("查询图书库异常");
            }
          });
      }
      timeout = setTimeout(fake, 300);
    },
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
