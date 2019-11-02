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
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
        addressData:null,//地址信息
        linkData:null//连接信息
    };
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
      alert(1);
    },
    loadAddressData(){
        alert(1);
    },
    loadLinkData(){
        alert(2);
    }
  }
};
</script>