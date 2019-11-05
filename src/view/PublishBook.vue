<template>
  <div>
    <h1>发布图书</h1>
    <a-form :form="form" @submit="publishBook">
      <a-form-item label="换书区域">
        <a-select>
          <a-select-option
            v-for="address in addressData"
            :key="address.code"
          >{{address.areaName+'，'+address.address}}</a-select-option>
        </a-select>
        <a-button @click="addNewMemberAddress">添加</a-button>
      </a-form-item>
    </a-form>

    <a-modal title="换书人" v-model="modelvisible" footer>
      <div>
        <AddMemberAddress @addMemberSuccess="addMemberSuccess"></AddMemberAddress>
      </div>
    </a-modal>
  </div>
</template>
<script>
import Http from "../Https.js";
import AddMemberAddress from "./../component/AddMemberAddress";

export default {
  data() {
    return {
      addressData: null, //地址信息
      linkData: null, //连接信息
      modelvisible: false
    };
  },
  components: {
    AddMemberAddress
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
    loadLinkData() {},
    addNewMemberAddress() {
      this.modelvisible = true;
    },
    addMemberSuccess() {
      this.modelvisible = false;
      this.loadAddressData();
    }
  }
};
</script>