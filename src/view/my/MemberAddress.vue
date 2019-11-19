<template>
  <div>
    <a-list :dataSource="addressArray">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-list-item-meta :description="item.address">
          <span slot="title">{{item.areaName}}</span>
        </a-list-item-meta>
        <div>
          <a-button @click="delMemberAddress(item.code)">删除</a-button>
          <a-button>编辑</a-button>
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>
<script>
import http from "./../../Https";

export default {
  data() {
    return {
      addressArray: []
    };
  },
  created() {
    this.loadMemberAddress();
  },
  methods: {
    loadMemberAddress() {
      http
        .ajax("post", "member/address/query", null, null)
        .then(res => {
          this.addressArray = res.data;
        })
        .catch(err => {
          alert(JSON.stringify(err));
        });
    },
    delMemberAddress(code){
      http.ajax("post","member/address/delete",{code:code},null).then(res=>{
        window.console.log(res.status);
        this.loadMemberAddress();
      }).catch(err=>{
        alert(err.message);
      });
    }
  }
};
</script>