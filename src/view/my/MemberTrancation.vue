<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="data"
      :loading="loading"
      :rowKey="record=>record.code"
      :pagination="pagination"
      @change="handleTableChange"
    >
      <template slot="createTime" slot-scope="createTime">{{createTime | formatDate}}</template>
      <template slot="status" slot-scope="status">{{status | formatStatus}}</template>
      <span slot="action" slot-scope="text, record">
        <a @click="getLinkInfo(record.code)">获取对方联系方式</a>
        <a-divider type="vertical" />
        <a @click="openDialogue(item.memberCode)">对话</a>
      </span>
    </a-table>
  </div>
</template>
<script>
import http from "./../../Https";
import Common from "./../../Common";
const columns = [
  {
    title: "对方书名",
    dataIndex: "releaseBookName",
    key: "releaseBookName"
  },
  {
    title: "对方ISBN",
    dataIndex: "releaseBookIsbn",
    key: "releaseBookIsbn"
  },

  {
    title: "你的书名",
    dataIndex: "bookName",
    key: "bookName"
  },
  {
    title: "你书的ISBN",
    dataIndex: "isbn",
    key: "isbn"
  },
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
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      host: Common.Config.host,
      applicationData: [],
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
    openDialogue(targeMemberCode){
      alert(targeMemberCode)
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
        .ajax("get", "transaction/query", param, null)
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