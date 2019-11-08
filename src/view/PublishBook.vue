<template>
  <div>
    <h1 style="text-align: center">发布图书</h1>
    <a-form :form="form" @submit="publishBook">
      <a-form-item label="换书区域" :label-col="{span:8}" :wrapper-col="{span:8}">
        <div>
          <a-select   
          v-decorator="[
          'address',
          { rules: [{ required: true, message: '请输入区域地址!' }] },
        ]">
            <a-select-option
              v-for="address in addressData"
              :key="address.code"
            >{{address.areaName+'，'+address.address}}</a-select-option>
          </a-select>
          <div class="addSpan" @click="addNewMemberAddress">添加区域</div>
        </div>
      </a-form-item>

      <a-form-item label="换书联系人" :label-col="{span:8}" :wrapper-col="{span:8}">
        <div>
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
          <div class="addSpan" @click="addNewMemberLink">添加联系人</div>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{span:8,offset:8}">
        <div>
          <div>
            <a-tag
              closable
              :afterClose="() => delBookInfo(item)"
              :key="item"
              v-for="item in bookIsbnArray"
            >{{item}}</a-tag>
          </div>
          <a-button  @click="openAddBookWindow">添加图书</a-button>
        </div>
      </a-form-item>

      <a-form-item :wrapper-col="{span:8,offset:8}">
        <a-button block type="primary" @click="publishbook">发布</a-button>
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

    <a-modal
      title="添加图书"
      v-model="modelAddModelVisibal"
      cancelText="取消"
      okText="添加"
      @ok="handleOkBookIsbn"
      @cancel="handleCancelBookIsbn"
    >
      <div>
        <a-alert v-if="alertVisible" :type="alertType" :message="alertMessage" closable />
        <a-input v-model="bookInfo" placeholder="填写图书的条码"></a-input>
      </div>
    </a-modal>
  </div>
</template>
<script>
import Http from "../Https.js";
import AddMemberAddress from "./../component/AddMemberAddress";
import AddMemberLink from "./../component/AddMemberLink";
export default {
  data() {
    return {
      addressData: null, //地址信息
      linkData: null, //连接信息
      modelvisible: false,
      modelLinkVisible: false,
      modelAddModelVisibal: false,
      bookInfo: "",
      bookIsbnArray: [],
      alertVisible: false,
      alertType: "error",
      alertMessage: ""
    };
  },
  components: {
    AddMemberAddress,
    AddMemberLink
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "publish-book" });
  },
  created() {
    this.loadLinkData();
    this.loadAddressData();
  },
  methods: {
    publishBook() {},
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
    openAddBookWindow() {
      this.bookInfo = "";
      this.modelAddModelVisibal = true;
    },
    handleOkBookIsbn() {
      this.alertVisible = false;
      this.alertType = "success";
      this.alertMessage = "";
      //校验值是否存在

      let notExistBook = this.bookIsbnArray.every(element => {
        if (element == this.bookInfo) {
          return false;
        } else {
          return true;
        }
      });

      if (notExistBook) {
        this.bookIsbnArray.push(this.bookInfo);
        this.modelAddModelVisibal = false;
      } else {
        this.alertVisible = true;
        this.alertType = "error";
        this.alertMessage = "图书条码不能重复";
      }
      this.bookInfo = "";
    },
    handleCancelBookIsbn() {
      this.modelAddModelVisibal = false;
      this.bookInfo = "";
    },
    delBookInfo(removedTag) {
      this.bookIsbnArray = this.bookIsbnArray.filter(tag => {
        if (tag === removedTag) {
          return false;
        } else {
          return true;
        }
      });
    },
    publishbook(){
      //method, url, params, data
       Http.ajax("post","release",{"a":123},{
         "isbns":this.bookIsbnArray,
         "memberLinkCode":this.form.getFieldValue("address"),
         "memberAddressCode":this.form.getFieldValue("persion")
       })
        .then(res => {
          this.linkData = res.data;
        })
        .catch(err => {
          window.console.log(err);
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
</style>