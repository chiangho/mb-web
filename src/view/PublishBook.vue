<template>
  <div>
    <h1>发布图书</h1>
    <a-form :form="form" @submit="publishBook">
      <a-form-item label="联系人">
        <a-select>
          <a-select-option
            v-for="i in 25"
            :key="(i + 9).toString(36) + i"
          >{{(i + 9).toString(36) + i}}</a-select-option>
        </a-select>
        <a-button @click="addNewMemberAddress">添加</a-button>
      </a-form-item>
    </a-form>


    <a-modal
      title="添加换书区域"
      :visible="modelvisible"
      @ok="handleOk"
    >
      <AddMemberAddress></AddMemberAddress>
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
      modelvisible:false
    };
  },
  components:{
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
    publishBook() {
      
    },
    loadAddressData() {
      Http.fetchPost("member/address/query", null)
        .then(res => {
          window.console.log(res);
        })
        .catch(err => {
          window.console.log(err);
        });
    },
    loadLinkData() {
       
    },
    addNewMemberAddress(){
        this.modelvisible = true;
    },
    handleOk(){
        this.modelvisible = false;
    }
  }
};
</script>