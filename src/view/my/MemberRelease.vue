<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="data"
      :loading="loading"
      :rowKey="record=>record.code"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: 1000 }"
    >
      <template slot="createTime" slot-scope="createTime">{{createTime | formatDate}}</template>
      <!-- <template slot="status" slot-scope="status">{{status | formatStatus}}</template> -->
      <span slot="action" slot-scope="text, record">
        <a @click="deleteRow(record.code)">删除</a>
        <a-divider type="vertical" v-if="record.status==1" />
        <a
          v-if="record.status==1 && (record.type=='10' || record.type=='11')"
          @click="selectTagBook(record.code)"
        >选择换本</a>
        <a
          v-if="record.status==1 && (record.type=='01' || record.type=='11')"
          @click="selectBorrowTagBook(record.code)"
        >确定借阅</a>
      </span>
    </a-table>

    <a-drawer width="50%" placement="right" :closable="false" @close="onClose" :visible="visible">
      <a-list itemLayout="vertical" :dataSource="applicationData">
        <a-list-item slot="renderItem" slot-scope="item">
          <img
            slot="extra"
            width="180"
            height="180"
            alt="logo"
            :src="host+'/common/down-image?path='+item.icon"
          />
          <a-list-item-meta>
            <span slot="title">{{item.bookName}}</span>
            <div slot="description">
              <span v-if="item.isbn!=null && item.isbn!=''">
                ISBN：{{item.isbn}}
                <br />>
              </span>
              <span v-if="item.remark!=null && item.remark!=''">
                留言：{{item.remark}}
                <br />
              </span>
              <span>地址：{{item.address}}</span>
            </div>
          </a-list-item-meta>
          <div>{{item.remark}}</div>
          <div slot="actions">
            <a @click="transactionApplication(item.code,'0')">确定换读</a>
            <a-divider type="vertical" />
            <a @click="openDialogue(item.memberCode)">在线聊天</a>
          </div>
        </a-list-item>
      </a-list>
    </a-drawer>

    <a-drawer
      width="50%"
      placement="right"
      :closable="false"
      @close="onBorrowClose"
      :visible="borrowDrawerVisible"
    >
      <a-list itemLayout="vertical" :dataSource="borrowApplicationData">
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta>
            <!-- <span slot="title">{{item.bookName}}</span> -->
            <div slot="description">
              <span>
                联系人：{{item.linkInfo}}
                <br />
              </span>
              <span>地址：{{item.address}}</span>
            </div>
          </a-list-item-meta>
          <div>{{item.remark}}</div>
          <div slot="actions">
            <a @click="openWindowWriteBorrowRemark(item.code)">确定借阅</a>
            <a-divider type="vertical" />
            <a @click="openDialogue(item.memberCode)">在线聊天</a>
          </div>
        </a-list-item>
      </a-list>
    </a-drawer>

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

    <a-modal
      :visible="openWindowWriteBorrowRemarkVaild"
      title="确认借阅"
      @ok="handleOkBorrowBook"
      @cancel="handleCancelBorrowBook"
      cancelText="取消"
      okText="确定"
    >
      <a-input placeholder="填写备注" v-model="borrowBookRemark" />
    </a-modal>
  </div>
</template>
<script>
import http from "./../../Https";
import Common from "./../../Common";
import MyChat from "./../../component/MyChat";

const columns = [
  {
    title: "书名",
    dataIndex: "bookName",
    key: "bookName",
    width: 200
  },
  // {
  //   title: "ISBN",
  //   dataIndex: "isbn",
  //   key: "isbn"
  // },
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
  // {
  //   title: "状态",
  //   dataIndex: "status",
  //   key: "status",
  //   scopedSlots: { customRender: "status" },
  //   filters: [
  //     { text: "成功", value: "1" },
  //     { text: "失败", value: "0" },
  //     { text: "待审核", value: "-1" }
  //   ]
  // },
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
  mounted() {
    this.fetch();
  },
  components: {
    MyChat
  },
  data() {
    return {
      borrowDrawerVisible: false,
      borrowApplicationData: [],

      targeMemberName: "",
      dialogueVisible: false,
      confirmLoading: false,
      sendMessage: "",
      targeMemberCode: null,

      editCode: null,
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
      columns,

      activeApplicationCode: null,
      openWindowWriteBorrowRemarkVaild: false,
      borrowBookRemark: null
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
    handleOkBorrowBook() {
      this.transactionApplication(this.activeApplicationCode, 1);
    },
    cleanBorrowBookInfo() {
      this.activeApplicationCode = null;
      this.openWindowWriteBorrowRemarkVaild = false;
      this.borrowBookRemark = null;
    },
    handleCancelBorrowBook() {
      this.cleanBorrowBookInfo();
    },
    openWindowWriteBorrowRemark(code) {
      this.activeApplicationCode = code;
      this.openWindowWriteBorrowRemarkVaild = true;
    },
    getUpperData() {
      alert(1);
    },
    getUnderData() {
      alert(2);
    },
    handleOk() {},
    handleCancel() {
      this.dialogueVisible = false;
    },
    sendMessageAction() {
      if (this.targeMemberCode && this.sendMessage) {
        //添加自己发送的内容。
        http
          .ajax(
            "post",
            "dialogue/send",
            { tagMemberCode: this.targeMemberCode, content: this.sendMessage },
            null
          )
          .then(resp => {
            this.sendMessage = "";
            window.console.log(resp);
          })
          .catch(err => {
            if (err && err.message) {
              this.$message.error(err.message);
            }
          });
      }
    },
    openDialogue(targeMemberCode) {
      this.dialogueVisible = true;
      this.targeMemberCode = targeMemberCode;
      // http
      //   .ajax("get", "member/query-code", { code: targeMemberCode }, null)
      //   .then(resp => {
      //     this.targeMemberName = resp.data.name;
      //   })
      //   .catch(err => {
      //     if (err && err.message) {
      //       this.$message.error(err.message);
      //     }
      //   });
    },
    transactionApplication(tagCode, type) {
      http
        .ajax(
          "get",
          "my/trancaction/add",
          {
            applayCode: tagCode,
            type: type,
            bookBorrowRemark: this.borrowBookRemark
          },
          null
        )
        .then(() => {
          this.$message.info("操作成功！");
          this.cleanBorrowBookInfo();
          this.fetch();
          this.onClose();
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          }
        });
    },
    onClose() {
      this.visible = false;
    },
    onBorrowClose() {
      this.borrowDrawerVisible = false;
    },
    selectTagBook(code) {
      this.visible = true;
      this.loadApplicationList(code);
    },
    selectBorrowTagBook(code) {
      this.borrowDrawerVisible = true;
      this.loadBorrowApplicationList(code);
    },
    loadBorrowApplicationList(code) {
      this.editCode = code;
      http
        .ajax(
          "get",
          "my/release/query-application",
          { code: code, pageNo: 1, pageSize: 9999, type: 1 },
          null
        )
        .then(resp => {
          this.borrowApplicationData = resp.data.items;
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          }
        });
    },
    loadApplicationList(code) {
      this.editCode = code;
      http
        .ajax(
          "get",
          "my/release/query-application",
          { code: code, pageNo: 1, pageSize: 9999, type: 0 },
          null
        )
        .then(resp => {
          this.applicationData = resp.data.items;
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          }
        });
    },
    deleteRow(code) {
      //删除换书记录
      http
        .ajax("get", "my/release/del", { code: code }, null)
        .then(() => {
          let param = {
            pageSize: this.pagination.pageSize,
            pageNo: this.pagination.current,
            sorter: this.sorterField,
            order: this.sorterOrder
          };
          if (this.filters && this.filters.status) {
            param["status"] = this.filters.status.toString();
          }
          this.fetch(param);
        })
        .catch(err => {
          this.loading = false;
          window.console.log(JSON.stringify(err));
        });
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
        .ajax("get", "my/release/query", param, null)
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