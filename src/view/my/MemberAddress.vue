<template>
  <div>
    <a-button type="primary" @click="addNewMemberAddress()">添加新地址</a-button>
    <a-divider />
    <a-list :dataSource="addressArray">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta :description="item.address">
          <span slot="title">{{item.areaName}}</span>
        </a-list-item-meta>
        <div>
          <a-button @click="delMemberAddress(item.code)">删除</a-button>
          <a-button @click="openEditAddressWindow(item.code)">编辑</a-button>
        </div>
      </a-list-item>
    </a-list>

    <a-modal title="添加区域信息" v-model="modelvisible" :destroyOnClose="destroyOnClose" footer>
      <div>
        <AddMemberAddress :code="editMemberCode" @addMemberAddressSuccess="addMemberAddressSuccess"></AddMemberAddress>
      </div>
    </a-modal>
  </div>
</template>
<script>
import http from "./../../Https";
import AddMemberAddress from "./../../component/AddMemberAddress";
export default {
  data() {
    return {
      addressArray: [],
      modelvisible:false,
      destroyOnClose:true,
      editMemberCode:null
    };
  },
  created() {
    this.loadMemberAddress();
  },
  components: {
    AddMemberAddress
  },
  methods: {
    loadMemberAddress() {
      http
        .ajax("post", "member/address/query", null, null)
        .then(res => {
          this.addressArray = res.data;
        })
        .catch(err => {
          window.console.log(JSON.stringify(err));
        });
    },
    delMemberAddress(code) {
      http
        .ajax("post", "member/address/delete", { code: code }, null)
        .then(res => {
          window.console.log(res.status);
          this.loadMemberAddress();
        })
        .catch(err => {
          window.console.log(err.message);
        });
    },
    openEditAddressWindow(code) {
      this.editMemberCode = code;
      this.modelvisible = true;
    },
    addMemberAddressSuccess(){
      this.modelvisible = false;
      this.loadMemberAddress();
    },
    addNewMemberAddress(){
      this.editMemberCode = null;
      this.modelvisible = true;
    }
  }
};
</script>