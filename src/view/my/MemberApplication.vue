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
        <a @click="openDialogue(record.releaseBookMemberCode)">对话</a>
      </span>
    </a-table>

    <a-modal
      :visible="dialogueVisible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :destroyOnClose="true"
      :footer="null"
    >
      
      <MyChat :tagMemberCode="targeMemberCode" ></MyChat>
      <div slot="title">
        聊天
      </div>
    </a-modal>
  </div>
</template>
<script>
import http from "./../../Https";
import Common from "./../../Common";
import MyChat from "./../../component/MyChat";

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
    title: "申请时间",
    dataIndex: "createTime",
    key: "createTime",
    scopedSlots: { customRender: "createTime" }
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
  data() {
    return {
      dialogueVisible: false,
      confirmLoading: false,
      targeMemberCode:null,

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
      sorterField: "",
      sorterOrder: "",
      filters: null,
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
        return "申请成功";
      } else if (status == 0) {
        return "申请失败";
      } else {
        return "系统审核中..";
      }
    }
  },
  mounted() {
    this.fetch();
  },
  components:{
    MyChat
  },
  methods: {
    handleOk() {
      this.dialogueVisible = false;
    },
    handleCancel() {
      this.dialogueVisible = false;
    },
    openDialogue(releaseBookMemberCode) {
      this.targeMemberCode = releaseBookMemberCode;
      this.dialogueVisible=true;
    },
    deleteRow(code) {
      http
        .ajax("get", "apply/del", { code: code }, null)
        .then(resp => {
          window.console.log(resp);
          this.fetch();
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          }
        });
      window.console.log(code);
    },
    handleTableChange(pagination, filters, sorter) {
      let param = {};

      this.sorterField = sorter.field;
      this.sorterOrder = sorter.order;
      this.filters = filters;

      param.pageSize = pagination.pageSize;
      param.pageNo = pagination.current;
      param.sorter = sorter.field;
      param.order = sorter.order;
      if (filters.status) {
        param.status = filters.status.toString();
      }

      this.fetch(param);
    },
    fetch(param = {}) {
      this.loading = true;
      if (!param.status) {
        param.status = 1;
      }
      if (!param.pageSize) {
        param.pageSize = this.pagination.pageSize;
      }
      if (!param.pageNo) {
        param.pageNo = this.pagination.current;
      }

      http
        .ajax("get", "apply/user-application-record", param, null)
        .then(res => {
          let tempTotal = Number(res.data.total);
          this.pagination.total = tempTotal;
          this.pagination.pageSize = param.pageSize;
          this.pagination.current = param.pageNo;
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