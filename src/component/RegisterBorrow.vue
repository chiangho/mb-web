<template>
  <div>
    <a-form :form="form">
      <a-form-item label="所在地址" :label-col="{span:4}" :wrapper-col="{span:18}">
        <a-select
          v-decorator="[
          'memberAddressCode',
          { rules: [{ required: true, message: '请输入区域地址!' }] },
        ]"
          placeholder="请选择图书地址"
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
          'memberLinkCode',
          { rules: [{ required: true, message: '请输入联系人!' }] },
        ]"
          placeholder="请选择图书联系人"
        >
          <a-select-option
            v-for="link in linkData"
            :key="link.code"
          >{{link.linkmanName+'，'+link.mobile+' '+(link.wechat==null?'':('，'+link.wechat))}}</a-select-option>
        </a-select>

        <span style="cursor: pointer" @click="addNewMemberLink">添加联系人</span>
      </a-form-item>

      <a-form-item label="留言" :label-col="{span:4}" :wrapper-col="{span:18}">
        <a-textarea
          :rows="4"
          v-decorator="[
          'remark',
          { rules: [{ required: false, message: '留言' }] },
        ]"
          placeholder="留言"
        ></a-textarea>
      </a-form-item>

      <a-form-item :wrapper-col="tailFormItemLayout.wrapperCol">
        <a-button block type="primary" @click="applicationBorrow">提交</a-button>
      </a-form-item>
    </a-form>

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
  </div>
</template>
<script>
import AddMemberAddress from "./AddMemberAddress";
import AddMemberLink from "./AddMemberLink";
import Http from "./../Https.js";

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
  data() {
    return {
      tailFormItemLayout,
      modelLinkVisible: false,
      modelvisible: false,
      addressData: [],
      linkData: []
    };
  },
  props: {
    publishBookCode: {
      type: String,
      required: true
    },
    callback: {
      type: Function,
      required: true
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "publish-book" });
  },
  components: {
    AddMemberAddress,
    AddMemberLink
  },
  created() {
    this.loadAddressData();
    this.loadLinkData();
  },
  methods: {
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
    applicationBorrow() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.publishBookCode) {
            this.$message.error("发布编号不能为空");
            return;
          }
          values["publishBookCode"] = this.publishBookCode;
          Http.ajax(
            "post",
            "my/application/application-borrowing",
            null,
            values
          )
            .then(() => {
              this.$message.success("申请成功！");
              this.callback();
            })
            .catch(err => {
              if (err && err.message != undefined) {
                this.$message.error(err.message);
              } else {
                this.$message.error("操作异常！");
              }
            });
        }
      });
    }
  }
};
</script>