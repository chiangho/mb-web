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
        <a @click="selectTagBook(record.code)">选择想要交换的图书</a>
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
            :src="host+'/book/down/image?isbn='+item.isbn"
          />
          <a-list-item-meta>
            <span slot="title">{{item.bookName}}</span>
            <div slot="description">
              <span>ISBN：{{item.isbn}}</span>
              <br />
              <span>来自：{{item.address}}</span>
            </div>
          </a-list-item-meta>
          <div>{{item.remark}}</div>
          <div slot="actions">
            <a-button @click="transactionApplication(item.code)">确定换这本书</a-button>
            <a-divider type="vertical" />
            <a-button @click="openDialogue(item.memberCode)">和申请者对话</a-button>
          </div>
        </a-list-item>
      </a-list>
    </a-drawer>

    <a-modal :title="'和'+targeMemberName+'的对话'" :visible="dialogueVisible" :closable="true"> 
      <template slot="footer">
        <div>
          <a-textarea
            placeholder="请输入要发送给对方的内容"
            :autosize="{ minRows: 4, maxRows: 6 }"
          />
        </div>
        <br />
        <div>
          <a-button type="primary" @click="sendMessage()">发送</a-button>
        </div>
      </template>
    </a-modal>
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
      targeMemberName: "",
      dialogueVisible: false,

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
    closeDialogue(){
      this.dialogueVisible = false;
    },
    sendMessage(){

    },
    openDialogue(targeMemberCode) {
      this.dialogueVisible = true;
      //拉去用户信息
      http.ajax("get","member/query-code",{code:targeMemberCode},null).then(resp=>{
        this.targeMemberName=resp.data.name;
      }).catch(err=>{
          if(err&&err.message){
            this.$message.error(err.message);
          }

      });
      //判断是否含有


    },
    transactionApplication(tagCode) {
      http
        .ajax("get", "trancaction/add", { applayCode: tagCode }, null)
        .then(() => {
          this.$message.info("确定换书成功，请到换书记录中查看详情！");
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
    selectTagBook(code) {
      this.visible = true;
      this.loadApplicationList(code);
    },
    loadApplicationList(code) {
      this.editCode = code;
      window.console.log(code);
      http
        .ajax(
          "get",
          "apply/query-release-application-record",
          { code: code, pageNo: 1, pageSize: 9999 },
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
        .ajax("get", "my/publish-book/del", { code: code }, null)
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
        .ajax("get", "my/publish-book/query", param, null)
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