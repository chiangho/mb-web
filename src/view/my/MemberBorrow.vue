<template>
  <div>
    <a-tabs defaultActiveKey="borrow_in" @change="callback">
      <a-tab-pane tab="借入记录" key="borrow_in">
        <a-table
          :columns="borrowInColumns"
          :dataSource="borrowInData"
          :loading="borrowInLoading"
          :rowKey="record=>record.code"
          :pagination="borrowInPagination"
          @change="borrowInHandleTableChange"
          :scroll="{ x: 800 }"
        >
          <template slot="createTime" slot-scope="createTime">{{createTime | formatDate}}</template>
          <template slot="state" slot-scope="state">{{state | formatInStatus}}</template>
          <span slot="action" slot-scope="text, record">
            <a @click="openDialogue(record.fromMemberCode)">对话</a>
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="借出记录" key="borrow_out">
        <a-table
          :columns="borrowOutColumns"
          :dataSource="borrowOutData"
          :loading="borrowOutLoading"
          :rowKey="record=>record.code"
          :pagination="borrowOutPagination"
          @change="borrowOutHandleTableChange"
          :scroll="{ x: 800 }"
        >
          <template slot="createTime" slot-scope="createTime">{{createTime | formatDate}}</template>
          <template slot="state" slot-scope="state">{{state | formatOutStatus}}</template>
          <span slot="action" slot-scope="text, record">
            <a v-if="record.state==0" @click="borrowOutInventory(record.code)">出书</a>
            <a v-if="record.state==1" @click="borrowInInventory(record.code)">回书</a>
            <a-divider v-if="record.state==0 || record.state==1 " type="vertical" />
            <a @click="openDialogue(record.borrowMemberCode)">对话</a>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      :visible="dialogueVisible"
      @ok="handleOkDialog"
      :confirmLoading="confirmLoading"
      @cancel="handleCancelDialog"
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

const borrowInColumns = [
  {
    title: "书名",
    dataIndex: "bookName",
    key: "bookName"
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    scopedSlots: { customRender: "createTime" }
  },
  {
    title: "借书者",
    dataIndex: "fromMemberName",
    key: "fromMemberName"
  },
  {
    title: "联系地址",
    dataIndex: "fromMemberAddress",
    key: "fromMemberAddress"
  },
  {
    title: "状态",
    dataIndex: "state",
    scopedSlots: { customRender: "state" },
    key: "state"
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 150,
    scopedSlots: { customRender: "action" }
  }
];

const borrowOutColumns = [
  {
    title: "书名",
    dataIndex: "bookName",
    key: "bookName",
    width: 200
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    scopedSlots: { customRender: "createTime" }
  },
  {
    title: "联系地址",
    dataIndex: "borrowMemberAddress",
    key: "borrowMemberAddress"
  },
  {
    title: "联系人",
    dataIndex: "borrowMemberLinkInfo",
    key: "borrowMemberLinkInfo"
  },
  {
    title: "状态",
    dataIndex: "state",
    scopedSlots: { customRender: "state" },
    key: "state"
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 150,
    scopedSlots: { customRender: "action" }
  }
];

export default {
  data() {
    return {
      borrowInColumns,
      borrowInData: [],
      borrowInLoading: false,
      borrowInPagination: {
        showSizeChanger: true,
        pageSizeOptions: ["10", "25", "50"],
        pageSize: 10,
        current: 1,
        total: 0,
        showQuickJumper: false
      },

      borrowOutColumns,
      borrowOutData: [],
      borrowOutLoading: false,
      borrowOutPagination: {
        showSizeChanger: true,
        pageSizeOptions: ["10", "25", "50"],
        pageSize: 10,
        current: 1,
        total: 0,
        showQuickJumper: false
      },

      targeMemberCode: null,
      confirmLoading: false,
      dialogueVisible: false
    };
  },
  components: {
    MyChat
  },
  created() {
    this.loadBorrowInRecord();
    this.loadBorrowInRecord();
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return Common.formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatInStatus(status) {
      if (status == 0) {
        return "待取";
      }
      if (status == 1) {
        return "待还书";
      }
      if (status == 2) {
        return "完成";
      }
    },
    formatOutStatus(status) {
      if (status == 0) {
        return "待出库";
      }
      if (status == 1) {
        return "待归还";
      }
      if (status == 2) {
        return "完成";
      }
    }
  },
  methods: {
    handleOkDialog() {
      this.dialogueVisible = false;
    },
    handleCancelDialog() {
      this.dialogueVisible = false;
    },
    openDialogue(targeMemberCode) {
      this.targeMemberCode = targeMemberCode;
      this.dialogueVisible = true;
    },
    loadBorrowInRecord(param = {}) {
      if (!param.pageSize) {
        param.pageSize = this.borrowInPagination.pageSize;
      }
      if (!param.pageNo) {
        param.pageNo = this.borrowInPagination.current;
      }
      http
        .fetchGet("my/borrow/in/page-list", param)
        .then(resp => {
          this.borrowInData = resp.data.items;
          let total = parseInt(resp.data.total);
          this.borrowInPagination.total = total;
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            window.console.log(err);
            this.$message.error("获取借入记录异常!");
          }
        });
    },
    borrowInHandleTableChange() {
      this.loadBorrowInRecord();
    },

    loadBorrowOutRecord(param = {}) {
      if (!param.pageSize) {
        param.pageSize = this.borrowOutPagination.pageSize;
      }
      if (!param.pageNo) {
        param.pageNo = this.borrowOutPagination.current;
      }
      http
        .fetchGet("my/borrow/out/page-list", {
          pageSize: this.borrowOutPagination.pageSize,
          pageNo: this.borrowOutPagination.current
        })
        .then(resp => {
          this.borrowOutData = resp.data.items;
          let total = parseInt(resp.data.total);
          this.borrowOutPagination.total = total;
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            window.console.log(err);
            this.$message.error("获取借出记录异常!");
          }
        });
    },
    borrowOutHandleTableChange() {
      this.loadBorrowOutRecord();
    },
    callback(key) {
      if (key == "borrow_in") {
        this.loadBorrowInRecord();
      }
      if (key == "borrow_out") {
        this.loadBorrowOutRecord();
      }
    }
  }
};
</script>