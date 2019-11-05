<template>
  <div>
    <h1 style="text-align: center">发布图书</h1>
    <a-form :form="form" @submit="publishBook">
      <a-form-item label="换书区域" :label-col="{span:4}" :wrapper-col="{span:16}">
        <div>
          <a-select>
            <a-select-option
              v-for="address in addressData"
              :key="address.code"
            >{{address.areaName+'，'+address.address}}</a-select-option>
          </a-select>
          <div class="addSpan" @click="addNewMemberAddress">添加区域</div>
        </div>
      </a-form-item>

      <a-form-item label="还书联系人" :label-col="{span:4}" :wrapper-col="{span:16}">
        <div>
          <a-select>
            <a-select-option
              v-for="address in addressData"
              :key="address.code"
            >{{address.areaName+'，'+address.address}}</a-select-option>
          </a-select>
          <div class="addSpan" @click="addNewMemberAddress">添加联系人</div>
        </div>
      </a-form-item>
    </a-form>

    <a-modal title="添加区域信息" v-model="modelvisible" footer>
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
<style>
.addSpan {
  position: relative;
  float: right;
  top: -40px;
  right: -130px;
  text-align: left;
  width: 120px;
  cursor:pointer;
}
</style>