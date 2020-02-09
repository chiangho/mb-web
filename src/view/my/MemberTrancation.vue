<template>
  <div>
    <p style="color:red">换读双方确定收书后会将图书变更到对方名下</p>
    <a-table
      :columns="columns"
      :dataSource="data"
      :loading="loading"
      :rowKey="record=>record.code"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: 2000 }"
    >
      <template slot="createTime" slot-scope="createTime">{{createTime | formatDate}}</template>
      <template slot="status" slot-scope="status">{{status | formatStatus}}</template>
      <template
        slot="selfIsReceived"
        slot-scope="selfIsReceived"
      >{{selfIsReceived | formatIsSelfReceived}}</template>
      <span slot="action" slot-scope="text, record">
        <a @click="openDialogue(record.tagerMemberCode)">对话</a>

        <a-divider type="vertical" />
        <a @click="registerLogistics(record.code)">登记物流</a>

        <span v-if="record.selfIsReceived==0">
          <a-divider type="vertical" />
          <a @click="setSelfReceived(record.code)">确认收书</a>
        </span>

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

    <a-modal
      tital="登记物流信息"
      @ok="handleOkRegisterLogistics"
      @cancel="handleCancelRegisterLogistics"
      :visible="registerLogisticsVisible"
      :destroyOnClose="true"
      okText="确认"
      cancelText="取消"
    >
      <div class="input-item">
        <div class="lable">物流公司:</div>
        <div class="input">
          <a-input placeholder="请填写物流公司" v-model="logisticsCompany" />
        </div>
      </div>
      <div class="input-item">
        <div class="lable">物流单号:</div>
        <div class="input">
          <a-input placeholder="请填写物流单号" v-model="logisticsNumber" />
        </div>
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
    title: "换读单号",
    dataIndex: "code",
    key: "code"
  },
  {
    title: "对方书名",
    dataIndex: "tagerBookName",
    key: "tagerBookName"
  },
  {
    title: "对方物流",
    dataIndex: "tagerLogisticsInfo",
    key: "tagerLogisticsInfo"
  },
  {
    title: "对方联系方式",
    dataIndex: "tagerLinkInfo",
    key: "tagerLinkInfo"
  },
  {
    title: "你的书名",
    dataIndex: "selfBookName",
    key: "selfBookName"
  },
  {
    title: "收到图书",
    dataIndex: "selfIsReceived",
    key: "selfIsReceived",
    scopedSlots: { customRender: "selfIsReceived" }
  },
  {
    title: "我的物流",
    dataIndex: "selfLogisticsInfo",
    key: "selfLogisticsInfo"
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    scopedSlots: { customRender: "createTime" }
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    fixed: "right",
    width: 220,
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      registerLogisticsVisible: false,
      logisticsCompany: null,
      logisticsNumber: null,
      editCode: null,

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
    },
    formatIsSelfReceived(state) {
      if (state == 1) {
        return "收到";
      }
      if (state == 0) {
        return "未收到";
      }
    }
  },
  mounted() {
    this.fetch();
  },
  methods: {
    registerLogistics(code) {
      this.editCode = code;
      this.registerLogisticsVisible = true;
      this.logisticsCompany = null;
      this.logisticsNumber = null;
    },
    handleOkRegisterLogistics() {
      if(!this.logisticsCompany&&!this.logisticsNumber){
        this.$message.error("请填写物流公司或者物流单号！")
        return;
      }
      http
        .fetchPost("transaction/register-logistics", {
          company: this.logisticsCompany,
          logisticsNumber: this.logisticsNumber,
          code: this.editCode
        })
        .then(() => {
          this.fetch();
          this.editCode = null;
          this.registerLogisticsVisible = false;
          this.logisticsCompany = null;
          this.logisticsNumber = null;
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("异常");
          }
        });
    },
    handleCancelRegisterLogistics() {
      this.registerLogisticsVisible = false;
    },
    setSelfReceived(code) {
      http
        .ajax(
          "post",
          "transaction/set-member-received-state",
          { code: code },
          null
        )
        .then(() => {
          this.$message.error("收书成功！");
          this.fetch();
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("操作异常");
          }
        });
    },
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
<style scoped>
.input-item {
  margin:5px 0 0 10px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding: 10px;
  
}
.input-item .lable { 
  float: left;
  width: 80px;
}
.input-item .input {
  float: left;
 width: 300px;
}
</style>