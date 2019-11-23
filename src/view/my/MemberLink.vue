<template>
  <div>
    <div style="text-align:right">
      <a-button type="primary" @click="addNewMemberLink()">添加联系人</a-button>
    </div>
    <a-divider />
    <a-list :dataSource="linkArray">
      <a-list-item slot="renderItem" slot-scope="item">
        <a slot="actions" @click="delMemberLink(item.code)">删除</a>
        <a slot="actions" @click="openEditLinkWindow(item.code)">编辑</a>
        <a-list-item-meta>
          <span slot="title">
            名称：{{item.linkmanName}}
            <a-divider type="vertical" />
            电话：{{item.mobile}}
            <a-divider type="vertical" />
            微信：{{item.wechat}}
          </span>
        </a-list-item-meta>
      </a-list-item>
    </a-list>

    <a-modal title="添加联系人" v-model="modelvisible" :destroyOnClose="destroyOnClose" footer>
      <div>
        <AddMemberLink :code="editMemberCode" @addMemberLinkSuccess="addMemberLinkSuccess"></AddMemberLink>
      </div>
    </a-modal>
  </div>
</template>
<script>
import http from "./../../Https";
import AddMemberLink from "./../../component/AddMemberLink.vue";
export default {
  data() {
    return {
      linkArray: [],
      modelvisible: false,
      destroyOnClose: true,
      editMemberCode: null
    };
  },
  created() {
    this.loadMemberLink();
  },
  components: {
    AddMemberLink
  },
  methods: {
    loadMemberLink() {
      http
        .ajax("get", "member/link/query", null, null)
        .then(res => {
          this.linkArray = res.data;
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    delMemberLink(code) {
      http
        .ajax("get", "member/link/del", { code: code }, null)
        .then(res => {
          window.console.log(res.status);
          this.loadMemberLink();
        })
        .catch(err => {
          window.console.log(err.message);
        });
    },
    openEditLinkWindow(code) {
      this.editMemberCode = code;
      this.modelvisible = true;
    },
    addMemberLinkSuccess() {
      this.modelvisible = false;
      this.loadMemberLink();
    },
    addNewMemberLink() {
      this.editMemberCode = null;
      this.modelvisible = true;
    }
  }
};
</script>