<template>
  <div>
    <a-spin :spinning="spinning" tip="系统正在发布中....">
      <a-form :form="form">
        <a-form-item :wrapper-col="{span:18,offset:4}">
          <a-alert
            v-if="publishAlertVisible"
            :type="publishAlertType"
            :message="publishAlertMessage"
            closable
          />
        </a-form-item>
        <a-form-item label="区域" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-select
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
        <a-form-item label="联系人" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-select
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
        <a-form-item label="图书ISBN" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-input
            v-decorator="[
          'bookisbn',
          { rules: [{ required: true, message: '请输入图书ISBN编号!' }] },
        ]"
            placeholder="图书ISBN编号"
          ></a-input>
        </a-form-item>

        <a-form-item label="留言" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-input
            v-decorator="[
          'remark',
          { rules: [{ required: true, message: '留言' }] },
        ]"
            placeholder="留言"
          ></a-input>
        </a-form-item>

        <a-form-item :wrapper-col="tailFormItemLayout.wrapperCol">
          <a-button block type="primary" @click="publishbook">提交</a-button>
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

    <a-modal title="登记图书" v-model="isOpenInputBookWindow" :destroyOnClose="true" :footer="null">
      <InputNewBook :isbn="tagIsbn" type="1" :callBack="callBack"></InputNewBook>
    </a-modal>
  </div>
</template>
<script>
import Http from "./../Https.js";
import AddMemberAddress from "./AddMemberAddress";
import AddMemberLink from "./AddMemberLink";
import InputNewBook from "./InputNewBook";
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
      addressData: null, //地址信息
      linkData: null, //连接信息
      modelvisible: false,
      modelLinkVisible: false,
      modelAddModelVisibal: false,
      alertVisible: false,
      alertType: "error",
      alertMessage: "",
      publishAlertVisible: false,
      publishAlertType: "error",
      publishAlertMessage: "",

      isOpenInputBookWindow: false,
      tagIsbn: null,
      registerBookCode: null,
      spinning:false
    };
  },
  components: {
    AddMemberAddress,
    AddMemberLink,
    InputNewBook
  },
  props: ["code"],
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
        bookisbn: isbn
      });
      this.publishbook();
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
      this.modelLinkVisible = false;
      this.loadLinkData();
    },
    addNewMemberLink() {
      this.modelLinkVisible = true;
    },

    publishbook() {
      this.publishAlertVisible = false;
      this.publishAlertType = "error";
      this.publishAlertMessage = "";
      this.form.validateFields((err, vlaues) => {
        if (!err) {
          vlaues["bookReleaseCode"] = this.code;
          vlaues["registerBookCode"]=this.registerBookCode;
          this.spinning = true;
          Http.ajax("get", "apply/register-book", vlaues, null)
            .then(() => {
              this.spinning = true;
              this.$emit("registerBookSuccess");
            })
            .catch(err => {
              if (err && err.code && err.code == 1) {
                this.$message.error(err.message);
                this.isOpenInputBookWindow = true;
                this.tagIsbn = this.form.getFieldValue("bookisbn");
              } else {
                if (err && err.message) {
                  this.publishAlertVisible = true;
                  this.publishAlertType = "error";
                  this.publishAlertMessage = err.message;
                } else {
                  this.publishAlertVisible = true;
                  this.publishAlertType = "error";
                  this.publishAlertMessage = "未知异常";
                }
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
</style>