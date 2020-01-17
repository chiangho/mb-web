<template>
  <div class="header">
    <a-spin :spinning="spinning" :tip="spinningTip">
      <a-form :form="form">
        

        <a-form-item label="图书来源" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-radio-group
            @change="onChangeBookChoodeType"
            defaultValue=0
            buttonStyle="solid"
            v-decorator="[
            'bookChooseTypeValue',
             { rules: [{ required: true, message: '请选择图书选择形式!' }] },
            ]"
          >
            <a-radio-button value="0">新建</a-radio-button>
            <a-radio-button value="1">从库中选择</a-radio-button>
          </a-radio-group>
        </a-form-item>


        <a-form-item v-if="bookChooseType==0" :wrapper-col="tailFormItemLayout.wrapperCol">
          <span class="title">输入图书条码后会自动配置图书信息，如匹配错误或者匹配不到，请修改或者填写图书名称、简介等信息!</span>
        </a-form-item>
        <a-form-item
          v-if="bookChooseType==0"
          label="图书条码"
          :label-col="{span:4}"
          :wrapper-col="{span:18}"
        >
          <a-input
            v-decorator="[
          'isbn',
          { rules: [{ required: false, message: '请填写图书条码!' }] },
        ]"
            placeholder="请填写图书条码"
            @blur="finishIsbn"
          ></a-input>
        </a-form-item>

        <a-form-item label="发布方式" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-radio-group
            buttonStyle="solid"
            v-decorator="[
            'type',
             { rules: [{ required: true, message: '请选择发布方式!' }] },
            ]"
          >
            <a-radio-button value="10">换读</a-radio-button>
            <a-radio-button value="01">借阅</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="图书地址" :label-col="{span:4}" :wrapper-col="{span:18}">
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
        <a-form-item label="图书联系人" :label-col="{span:4}" :wrapper-col="{span:18}">
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

    <!-- <a-modal title="提交" v-model="isOpenInputBookWindow" :destroyOnClose="true" :footer="null">
      <InputNewBook :isbn="tagIsbn" type="1" :callBack="callBack"></InputNewBook>
    </a-modal>-->
  </div>
</template>
<script>
import Http from "./../Https.js";
import AddMemberAddress from "./AddMemberAddress";
import AddMemberLink from "./AddMemberLink";
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
      addressData: null, //地址信息
      linkData: null, //连接信息
      modelvisible: false,
      modelLinkVisible: false,
      modelAddModelVisibal: false,
      spinningTip: "系统在识别条码中....",

      spinning: false,
      imagePath: null,
      isShowImage: false,
      bookChooseType: 0
    };
  },
  components: {
    AddMemberAddress,
    AddMemberLink
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

    handleUpdateIcon(event) {
      this.imagePath = "";
      this.spinning = true;
      this.spinningTip = "图片上传中....";
      // 文件上传
      Http.update(event, "upload-image", "image", null)
        .then(res => {
          this.spinning = false;
          this.$message.success("上传成功");
          this.imagePath = Common.Config.host + "" + res.data;
          this.isShowImage = true;
        })
        .catch(e => {
          this.spinning = false;
          if (e && e.message) {
            this.$message.error(e.message);
          } else {
            this.$message.error("异常");
          }
        });
    },
    finishIsbn() {
      //isbn输入完成匹配isbn的信息，自动填写图书信息
      alert(1);
    },
    onChangeBookChoodeType(e) {
      let value = e.target.value;
      alert(value);
      this.bookChooseType = value;
    },
    publishbook() {
      this.form.validateFields((err, vlaues) => {
        if (!err) {
          vlaues["bookReleaseCode"] = this.code;
          vlaues["registerBookCode"] = this.registerBookCode;
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
                  this.$message.error(err.message);
                } else {
                  this.$message.error("未知异常");
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
.header {
  margin-top: 20px;
}
.title {
  text-align: left;
  color: red;
}
img {
  width: 150px;
  height: 150px;
}
</style>