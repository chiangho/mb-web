<template>
  <div class="header">
    <a-spin :spinning="spinning" :tip="spinningTip">
      <a-form :form="form">
        <a-form-item label="图书来源" :label-col="{span:4}" :wrapper-col="{span:18}">
          <a-radio-group
            @change="onChangeBookChoodeType"
            
            buttonStyle="solid"
            v-decorator="[
            'bookChooseTypeValue',
             { rules: [{ required: true, message: '请选择图书选择形式!' }],initialValue: '0' },
            ]"
          >
            <a-radio-button value="0">新建</a-radio-button>
            <a-radio-button value="1">从库中选择</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="bookChooseType==1"
          label="选择图书"
          :label-col="{span:4}"
          :wrapper-col="{span:18}"
        >
          <a-select
            v-decorator="[
          'bookInventoryCode',
          { rules: [{ required: false, message: '请选择图书!' }] },
        ]"
            :loading="isLoadBookList"
            @search="handleSearchBookSearch"
            @change="handleSearchBookChange"
            showSearch
            notFoundContent="没有找到相应的图书"
            placeholder="请选择图书"
          >
            <a-select-option v-for="book in books" :key="book.code">{{book.name}}</a-select-option>
          </a-select>
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

        <a-form-item
          v-if="bookChooseType==0"
          label="图书名称"
          :label-col="{span:4}"
          :wrapper-col="{span:18}"
        >
          <a-input
            v-decorator="[
              'bookName',
              { rules: [{ required: true, message: '请填写图书名称!' }] },
            ]"
            placeholder="请填写图书名称"
          ></a-input>
        </a-form-item>

        <a-form-item
          v-if="bookChooseType==0"
          label="图书图片"
          :label-col="{span:4}"
          :wrapper-col="{span:18}"
        >
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

        <a-form-item
          v-if="bookChooseType==0"
          label="图书简介"
          :label-col="{span:4}"
          :wrapper-col="{span:18}"
        >
          <a-textarea
            :rows="4"
            v-decorator="[
          'introduction',
          { rules: [{ required: false, message: '请输入图书简介!' }] },
        ]"
            placeholder="请填写图书简介"
          ></a-textarea>
        </a-form-item>

        <a-form-item v-if="registerType==0" label="发布方式" :label-col="{span:4}" :wrapper-col="{span:18}">
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

let timeout;
let currentValue;

function fetch(value, callback) {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  function fake() {
    Http.fetchGet("inventory/query", { name: currentValue })
      .then(resp => {
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

  timeout = setTimeout(fake, 500);
}

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
      imgSrc:null,
      isShowImage: false,
      bookChooseType: 0,
      isLoadBookList: false,
      books: []
    };
  },
  components: {
    AddMemberAddress,
    AddMemberLink
  },
  props: {
    registerType: {
      type: String, //0 发布图书  1 申请换读
      required: true
    },
    publishBookCode: {
      type: String,
      default: null
    },
    callback: {
      type: Function,
      required: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "publish-book" });
  },
  created() {
    this.loadLinkData();
    this.loadAddressData();
  },
  methods: {
    fetchBookList(value) {
      fetch(value, books => {
        this.books = books;
      });
    },
    handleSearchBookSearch(value) {
      this.fetchBookList(value);
    },
    handleSearchBookChange(value) {
      this.fetchBookList(value);
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

    handleUpdateIcon(event) {
      this.imagePath = "";
      this.imgSrc="";
      this.spinning = true;
      this.spinningTip = "图片上传中....";
      // 文件上传
      Http.update(event, "upload-image", "image", null)
        .then(res => {
          this.spinning = false;
          this.$message.success("上传成功");
          this.imagePath = Common.Config.host + "/common/down-image?path=" + res.data;
          this.imgSrc=res.data;
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
      //alert(1);
    },
    onChangeBookChoodeType(e) {
      let value = e.target.value;
      this.bookChooseType = value;
      if (value == 1) {
        this.fetchBookList(null);
      }
    },
    publishbook() {
      this.form.validateFields((err, vlaues) => {
        if (!err) {
          this.spinning = true;

          let url = "";

          if (this.registerType === '0') {
            url = url+"my/release/add";
            this.spinningTip = "系统处理中....";
          }
          if (this.registerType === '1') {
            url = url+"my/application/application-change-reading";
            this.spinningTip = "系统处理中....";
          }
         
          vlaues.publishBookCode=this.publishBookCode;
          vlaues.icon=this.imgSrc;
          Http.ajax("post", url, null, vlaues)
            .then(()=> {
              alert("success");
              this.spinning = false;
            })
            .catch(err => {
              if (err && err.message) {
                this.$message.error(err.message);
              } else {
                this.$message.error("发布异常");
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