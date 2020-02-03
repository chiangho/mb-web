<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="data"
      :loading="loading"
      :rowKey="record=>record.code"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: 1500 }"
    >
      <template slot="createTime" slot-scope="createTime">{{createTime | formatDate}}</template>
      <template slot="status" slot-scope="status">{{status | formatStatus}}</template>
      <span slot="action" slot-scope="text, record">
        <a @click="getLinkInfo(record.code)">对方联系方式</a>
        <a-divider type="vertical" />
        <a @click="openDialogue(record.tagerMemberCode)">对话</a>
        <!-- <a-divider type="vertical" />
        <a @click="complaint(record.tagerMemberCode)">投诉对方</a>-->
      </span>
    </a-table>

    <a-modal
      title="对方联系"
      :visible="memberLinkVisible"
      @ok="handOkMememberLink"
      @cancel="handleCancelMememberLink"
      :destroyOnClose="true"
    >
      <p>{{memberInfo}}</p>
    </a-modal>

    <a-modal
      :visible="dialogueVisible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :destroyOnClose="true"
      :footer="null"
    >
      <MyChat :tagMemberCode="targeMemberCode"></MyChat>
      <div slot="title">聊天</div>
    </a-modal>
  </div>
</template>
<script>
import http from "./../../Https";
import Common from "./../../Common";
import MyChat from "./../../component/MyChat";

const columns = [
  {
    title: "换书单号",
    dataIndex: "code",
    key: "code"
  },
  {
    title: "对方书名",
    dataIndex: "tagerBookName",
    key: "tagerBookName"
  },
  // {
  //   title: "对方ISBN",
  //   dataIndex: "tagerBookIsbn",
  //   key: "tagerBookIsbn"
  // },

  {
    title: "你的书名",
    dataIndex: "selfBookName",
    key: "selfBookName"
  },
  // {
  //   title: "你书的ISBN",
  //   dataIndex: "selfBookIsbn",
  //   key: "selfBookIsbn"
  // },
  {
    title: "确认交换时间",
    dataIndex: "createTime",
    key: "createTime",
    scopedSlots: { customRender: "createTime" }
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 200,
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      memberInfo: "",
      memberLinkVisible: false,

      targeMemberCode: null,
      dialogueVisible: false,
      confirmLoading: false,

      host: Common.Config.host,
      visible: false,
      data: [],
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ["10", "25", "50"],
        pageSize: 10,
        current: 1,
        total: 0,
        showQuickJumper: false
      },
      loading: false,
      columns
    };
  },
  components: {
    MyChat
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return Common.formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    complaint(memberCode) {
      alert(memberCode);
    },
    handleOk() {
      this.dialogueVisible = false;
    },
    handleCancel() {
      this.dialogueVisible = false;
    },
    getLinkInfo(code) {
      this.memberLinkVisible = true;
      http
        .ajax("get", "transaction/query-link-address", { code: code }, null)
        .then(resp => {
          this.memberInfo = resp.data;
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          }
        });
    },
    handOkMememberLink() {
      this.memberLinkVisible = false;
    },
    handleCancelMememberLink() {
      this.memberLinkVisible = false;
    },
    openDialogue(targeMemberCode) {
      this.targeMemberCode = targeMemberCode;
      this.dialogueVisible = true;
    },
    handleTableChange(pagination, filters, sorter) {
      let param = {};
      param.pageSize = pagination.pageSize;
      param.pageNo = pagination.current;
      this.fetch(param);
      window.console.log(filters);
      window.console.log(sorter);
    },
    fetch(param = {}) {
      this.loading = true;
      if (!param.pageSize) {
        param.pageSize = this.pagination.pageSize;
      }
      if (!param.pageNo) {
        param.pageNo = this.pagination.current;
      }

      http
        .ajax("get", "my/transaction/query", param, null)
        .then(res => {
          let tempTotal = Number(res.data.total);
          this.pagination.total = tempTotal;
          this.pagination.pageSize = param.pageSize;
          this.pagination.current = param.pageNo;
          this.loading = false;
          this.data = res.data.items;
        })
        .catch(err => {
          this.loading = false;
          window.console.log(JSON.stringify(err));
        });
    }
  }
};
</script>