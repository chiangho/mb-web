<template>
  <div>
    <a-spin :spinning="spinning" tip="系统正在发布中....">
      <a-form :form="form">
        <a-form-item :wrapper-col="{span:8,offset:8}">
          <a-alert
            v-if="publishAlertVisible"
            :type="publishAlertType"
            :message="publishAlertMessage"
            closable
          />
        </a-form-item>
        <a-form-item label="换书区域" :label-col="{span:8}" :wrapper-col="{span:8}">
          <a-select
            placeholder="请选择图书交换的地点"
            v-decorator="[
          'address',
          { rules: [{ required: true, message: '请输入区域地址!' }] },
        ]"
          >
            <a-select-option
              v-for="address in addressData"
              :key="address.code"
            >{{address.areaName+'，'+address.address}}</a-select-option>
          </a-select>
          <span style="cursor: pointer" @click="addNewMemberAddress">添加区域</span>
        </a-form-item>

        <a-form-item label="换书联系人" :label-col="{span:8}" :wrapper-col="{span:8}">
          <a-select
            placeholder="请选择图书交换的联系人"
            v-decorator="[
          'persion',
          { rules: [{ required: true, message: '请输入联系人!' }] },
        ]"
          >
            <a-select-option
              v-for="link in linkData"
              :key="link.code"
            >{{link.linkmanName+'，'+link.mobile+' '+(link.wechat==null?'':('，'+link.wechat))}}</a-select-option>
          </a-select>
          <span style="cursor: pointer" @click="addNewMemberLink">添加联系人</span>
        </a-form-item>

        <a-form-item label="图书ISBN" :label-col="{span:8}" :wrapper-col="{span:8}">
          <a-input
            v-decorator="[
          'isbn',
          { rules: [{ required: true, message: '请输入图书ISBN编号!' }] },
        ]"
            placeholder="图书ISBN编号"
          ></a-input>
        </a-form-item>

        <a-form-item label="留言" :label-col="{span:8}" :wrapper-col="{span:8}">
          <a-input
            v-decorator="[
          'remark',
          { rules: [{ required: true, message: '留言' }] },
        ]"
            placeholder="留言"
          ></a-input>
        </a-form-item>

        <a-form-item :wrapper-col="tailFormItemLayout.wrapperCol">
          <a-button block type="primary" @click="publishbook">发布</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
    <a-modal title="添加区域信息" v-model="modelvisible" footer>
      <div>
        <AddMemberAddress @addMemberAddressSuccess="addMemberAddressSuccess"></AddMemberAddress>
      </div>
    </a-modal>

    <a-modal title="添加联系人" v-model="modelLinkVisible" footer>
      <div>
        <AddMemberLink @addMemberLinkSuccess="addMemberLinkSuccess"></AddMemberLink>
      </div>
    </a-modal>

    <a-modal
      title="发布图书成功"
      v-model="modelPublishSuccess"
      cancelText="继续"
      okText="去看看首页"
      @ok="handleOkPublishSuccess"
      @cancel="handleCancelPublishSuccess"
    >
      <p>图书已经发布成功，请等待审核！</p>
    </a-modal>

    <a-modal title="登记图书" v-model="isOpenInputBookWindow" :destroyOnClose="true" :footer="null">
      <InputNewBook :isbn="tagIsbn" type="0" :callBack="callBack"></InputNewBook>
    </a-modal>
  </div>
</template>
<script>
import Http from "../Https.js";

import AddMemberAddress from "./../component/AddMemberAddress";
import AddMemberLink from "./../component/AddMemberLink";
import InputNewBook from "./../component/InputNewBook";

const tailFormItemLayout = {
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
};

export default {
  data() {
    return {
      tailFormItemLayout,
      addressData: null, //地址信息
      linkData: null, //连接信息
      modelvisible: false,
      modelLinkVisible: false,

      alertVisible: false,
      alertType: "error",
      alertMessage: "",

      publishAlertVisible: false,
      publishAlertType: "error",
      publishAlertMessage: "",
      modelPublishSuccess: false,

      isOpenInputBookWindow: false,
      tagIsbn: null,
      registerBookCode: null,

      spinning: false
    };
  },
  components: {
    AddMemberAddress,
    AddMemberLink,
    InputNewBook
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "publish-book" });
  },
  created() {
    this.loadLinkData();
    this.loadAddressData();
  },
  methods: {
    callBack(code, isbn, bookName) {
      this.isOpenInputBookWindow = false;
      this.registerBookCode = code;
      window.console.log(bookName);
      this.form.setFieldsValue({
        isbn: isbn
      });
      this.publishbook();
    },
    handleOkPublishSuccess() {
      this.$router.push("/home");
    },
    handleCancelPublishSuccess() {
      this.$router.go(0);
      //this.$router.push("/publish-book");
    },

    loadAddressData() {
      Http.fetchPost("member/address/query", null)
        .then(res => {
          this.addressData = res.data;
        })
        .catch(err => {
          window.console.log(err);
        });
    },
    loadLinkData() {
      Http.fetchGet("member/link/query", null)
        .then(res => {
          this.linkData = res.data;
        })
        .catch(err => {
          window.console.log(err);
        });
    },
    addNewMemberAddress() {
      this.modelvisible = true;
    },
    addMemberAddressSuccess() {
      this.modelvisible = false;
      this.loadAddressData();
    },
    addMemberLinkSuccess() {
      this.modelvisible = false;
      this.loadLinkData();
    },
    addNewMemberLink() {
      this.modelLinkVisible = true;
    },

    publishbook() {
      this.publishAlertVisible = false;
      this.publishAlertType = "error";
      this.publishAlertMessage = "";

      this.form.validateFields(err => {
        if (!err) {
          this.spinning = true;
          Http.ajax("post", "release", null, {
            registerBookCode: this.registerBookCode,
            isbn: this.form.getFieldValue("isbn"),
            memberLinkCode: this.form.getFieldValue("persion"),
            memberAddressCode: this.form.getFieldValue("address"),
            remark: this.form.getFieldValue("remark")
          })
            .then(() => {
              this.modelPublishSuccess = true;
              this.spinning = false;
            })
            .catch(err => {
              if (err && err.code && err.code == 1) {
                this.$message.error(err.message);
                this.isOpenInputBookWindow = true;
                this.tagIsbn = this.form.getFieldValue("isbn");
              } else {
                this.publishAlertVisible = true;
                this.publishAlertType = "error";
                let messge = "发布失败";
                if (err && err.message) {
                  messge = err.message;
                }
                this.publishAlertMessage = messge;
              }
              this.spinning = false;
            });
        }
      });
    }
  }
};
</script>
<style>
.addSpan {
  position: relative;
  float: right;
  top: -40px;
  right: -130px;
  text-align: left;
  width: 120px;
  cursor: pointer;
}
.spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
</style>