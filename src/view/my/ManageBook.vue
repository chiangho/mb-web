<template>
  <div>
    <a-tabs defaultActiveKey="book" @change="callback">
      <a-tab-pane tab="图书管理" key="book">
        <a-table
          :columns="bookColumns"
          :dataSource="bookData"
          :loading="bookLoading"
          :rowKey="record=>record.code"
          :pagination="pagination"
          @change="bookHandleTableChange"
          :scroll="{ x: 800 }"
        >
          <template slot="createTime" slot-scope="createTime">{{createTime | formatDate}}</template>
          <template slot="state" slot-scope="state">{{state | formatStatus}}</template>
          <template slot="icon" slot-scope="icon">
            <img :src="host+'/common/down-image?path='+icon" width="150" height="150" />
          </template>
          <span slot="action" slot-scope="text, record">
            <a @click="setClassification(record.code)">修改分类</a>
            <a-divider type="vertical" />
            <a @click="editBook(record.code)">修改简介</a>
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="图书分类" key="bookType">
        <a-tree
          :defaultExpandedKeys="['0-0-0']"
          @select="onSelectTreeItem"
          @rightClick="treeRightClick"
        >
          <a-tree-node key="0-0">
            <span slot="title" style="color: #1890ff">parent 1</span>
            <a-tree-node title="parent 1-0" key="0-0-0">
              <a-tree-node title="leaf" key="0-0-0-0" />
              <a-tree-node title="leaf" key="0-0-0-1" />
              <a-tree-node title="leaf" key="0-0-0-2" />
            </a-tree-node>
            <a-tree-node title="parent 1-1" key="0-0-1">
              <a-tree-node title="leaf" key="0-0-1-0" />
            </a-tree-node>
            <a-tree-node title="parent 1-2" key="0-0-2">
              <a-tree-node title="leaf" key="0-0-2-0" />
              <a-tree-node title="leaf" key="0-0-2-1" />
            </a-tree-node>
          </a-tree-node>
        </a-tree>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import Common from "./../../Common";
import http from "./../../Https";
const bookColumns = [
  {
    title: "书名",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "图片",
    dataIndex: "icon",
    key: "icon",
    scopedSlots: { customRender: "icon" }
  },
  {
    title: "状态",
    dataIndex: "state",
    scopedSlots: { customRender: "state" },
    key: "state"
  },
  {
    title: "条码",
    dataIndex: "isbn",
    key: "isbn"
  },
  {
    title: "作者",
    dataIndex: "author",
    key: "author"
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
    width: 180,
    scopedSlots: { customRender: "action" }
  }
];

export default {
  data() {
    return {
      host: Common.Config.host,
      bookColumns,
      bookData: [],
      bookLoading: false,
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ["10", "25", "50"],
        pageSize: 10,
        current: 1,
        total: 0,
        showQuickJumper: false
      }
    };
  },
  created() {
    this.loadBookList();
  },
  filters: {
    formatDate(time) {
      if (time == null) {
        return "";
      }
      var date = new Date(time);
      return Common.formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    formatStatus(status) {
      //      free(0),
      // 		has_publish(1),
      // 		has_application(2),
      // 		borrow_wait_out(3),
      // 		borrow_wait_in(4),
      // 		exchange_out(5)
      if (status == 0) {
        return "空闲";
      }
      if (status == 1) {
        return "发布中";
      }
      if (status == 2) {
        return "申请换读";
      }
      if (status == 3) {
        return "借阅待出库";
      }
      if (status == 4) {
        return "借阅待归还";
      }
      if (status == 5) {
        return "换读待出库";
      }
    }
  },
  methods: {
    treeRightClick(data) {
      window.console.log("treeRightClick====>", data.node.eventKey);
    },
    onSelectTreeItem(selectedKeys, info) {
      window.console.log("====>", selectedKeys, info);
    },
    //修改图书的所属分类
    setClassification(code) {
      alert(code);
    },
    //修改图书
    editBook(code) {
      alert(code);
    },
    bookHandleTableChange() {
      this.loadBookList();
    },
    loadBookList(param = {}) {
      if (!param.pageSize) {
        param.pageSize = this.pagination.pageSize;
      }
      if (!param.pageNo) {
        param.pageNo = this.pagination.current;
      }
      this.bookLoading = true;
      http
        .fetchGet("inventory/query-page", param)
        .then(resp => {
          this.bookLoading = false;
          this.bookData = resp.data.items;
          let total = parseInt(resp.data.total);
          this.pagination.total = total;
        })
        .catch(err => {
          this.bookLoading = false;
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("获取图书异常");
          }
        });
    },
    loadBookTypeTree() {
      //加载树形菜单
    },
    callback(key) {
      if (key == "book") {
        this.loadBookList();
      }
      if (key == "bookType") {
        //加载分类树
        this.loadBookTypeTree();
      }
    }
  }
};
</script>