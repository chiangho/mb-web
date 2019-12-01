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
        <a @click="deleteRow(record.code)">删除</a>
        <a-divider type="vertical" />
        <a @click="editRow(record.code)">编辑</a>
      </span>
    </a-table>
  </div>
</template>
<script>
import http from "./../../Https";
import Common from "./../../Common";
const columns = [
  {
    title: "书名",
    dataIndex: "bookName",
    key: "bookName",
    width: 200
  },
  {
    title: "ISBN",
    dataIndex: "isbn",
    key: "isbn"
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    scopedSlots: { customRender: "createTime" },
    sorter: true
  },
  {
    title: "联系人",
    dataIndex: "linkInfo",
    key: "linkInfo"
  },
  {
    title: "联系地址",
    dataIndex: "address",
    key: "address"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
    filters: [
      { text: "成功", value: "1" },
      { text: "失败", value: "0" },
      { text: "待审核", value: "-1" }
    ]
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  mounted() {
    this.fetch();
  },
  data() {
    return {
      data: [],
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['1', '25', '50'],
        pageSize: 25,
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
    },
    formatStatus(status) {
      if (status == 1) {
        return "发布成功";
      } else if (status == 0) {
        return "发布失败";
      } else {
        return "待审核";
      }
    }
  },
  methods: {
      deleteRow(code){
          alert(code);
      },
    handleTableChange(pagination, filters, sorter) {
      alert(JSON.stringify(pagination));
      alert(JSON.stringify(filters));
      alert(JSON.stringify(sorter));
    },
    fetch(param = {}) {
      this.loading = true;
      if (!param.status) {
        param.status = 1;
      }
      http
        .ajax("get", "my/publish-book/query", param, null)
        .then(res => {
          const _pagination = { ...this.pagination };
          let tempTotal = Number(res.data.total);
          _pagination.total = tempTotal;
          this.pagination = _pagination;
          //window.console.log(this.pagination);
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