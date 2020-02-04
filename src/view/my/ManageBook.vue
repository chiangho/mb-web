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
            <a @click="editBookIntroduction(record.code,record.introduction)">修改简介</a>
          </span>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="图书分类" key="bookType">
        <p>
          操作说明：
          <br />1、对准分类，鼠标右击会有“删除”、“添加”、“修改”的操作。
          <br />2、点击鼠标拖动能移动图书分类。
        </p>
        <a-tree
          :treeData="treeData"
          @rightClick="treeRightClick"
          :defaultExpandedKeys="expandedKeys"
          draggable
          @dragenter="onDragEnter"
          @drop="onDrop"
        ></a-tree>
      </a-tab-pane>
    </a-tabs>

    <div
      class="m-popover"
      v-if="isShowTreeMenu"
      :style="{ top: treeMenuTop + 'px', left: treeMenuLeft + 'px'} "
    >
      <div class="treeMenuHeader">
        <span class="treeMenuTitle">操作</span>
        <span class="treeMenuClose" @click="closeTreeMenu">
          <a-icon type="close" />
        </span>
      </div>
      <div>
        <a-list bordered>
          <a-list-item @click="delNode" v-if="isShowTreeMenuItem">删除</a-list-item>
          <a-list-item @click="editNode" v-if="isShowTreeMenuItem">修改</a-list-item>
          <a-list-item @click="addNode">添加</a-list-item>
        </a-list>
      </div>
    </div>

    <a-modal
      :title="editBookTypeTitle"
      v-model="addNewBookTypeVisible"
      @ok="handleOkAddNewBookType"
      okText="确认"
      cancelText="取消"
      :destroyOnClose="true"
      :okButtonProps="okButtonProps"
      :cancelButtonProps="okButtonProps"
    >
      <a-input placeholder="请填写分类名称" v-model="addNewBookTypeValue" />
    </a-modal>

    <a-modal
      title="选择图书分类"
      v-model="selectBookTypeVisible"
      @ok="handleOkSelectBookType"
      okText="确认"
      cancelText="取消"
      :destroyOnClose="true"
    >
      <a-tree-select
        style="width:400px"
        :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
        :treeData="inputTreeData"
        placeholder="请选择图书分类"
        treeDefaultExpandAll
        v-model="inputTreeValue"
      ></a-tree-select>
    </a-modal>

    <a-modal
      title="修改图书简介"
      v-model="modifyBookVisible"
      @ok="handleOkmodifyBook"
      okText="确认"
      cancelText="取消"
      :destroyOnClose="true"
    >
      <a-textarea placeholder="请填写图书简介" :rows="4" v-model="bookIntroductionValue" />
    </a-modal>
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
    title: "图书分类",
    dataIndex: "bookTypeName",
    key: "bookTypeName"
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
    title: "简介",
    dataIndex: "introduction",
    key: "introduction"
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
      //node操作
      exitNodeCode: null,
      addNewBookTypeValue: null,
      addNewBookTypeVisible: false,
      okButtonProps: { props: { disabled: false } },
      editBookTypeTitle: null,
      editOrAddBookType: "", //add / update
      isShowTreeMenuItem: true,
      treeData: [],
      expandedKeys: ["-1"],
      treeMenuTop: 0,
      treeMenuLeft: 0,
      isShowTreeMenu: false,

      //Input 输入框 tree结构
      inputTreeData: [],
      selectBookTypeVisible: false,
      okSelectButtonProps: { props: { disabled: false } },
      inputTreeValue: null,

      //修改图书简介
      modifyBookVisible: false,
      bookIntroductionValue: null,

      modifyBookCode: null,
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
    handleOkmodifyBook() {
      if (!this.bookIntroductionValue) {
        this.$message.error("请填写图书简介");
        return;
      }
      if (!this.modifyBookCode) {
        this.$message.error("请选择对应的图书再操作！");
        return;
      }
      http
        .fetchPost("inventory/update-introduction", {
          code: this.modifyBookCode,
          introduction: this.bookIntroductionValue
        })
        .then(() => {
          this.modifyBookVisible = false;
          this.bookIntroductionValue = null;
          this.modifyBookCode = null;
          this.$message.error("设置成功！");
          this.loadBookList();
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("设置异常");
          }
        });
    },
    editBookIntroduction(code, content) {
      this.modifyBookVisible = true;
      this.bookIntroductionValue = content;
      this.modifyBookCode = code;
    },
    handleOkSelectBookType() {
      if (!this.inputTreeValue) {
        this.$message.error("请选择图书分类");
        return;
      }
      if (!this.modifyBookCode) {
        this.$message.error("请选择对应的图书再操作！");
        return;
      }
      http
        .fetchPost("inventory/update-booktype", {
          code: this.modifyBookCode,
          bookTypeCode: this.inputTreeValue
        })
        .then(() => {
          this.selectBookTypeVisible = false;
          this.inputTreeValue = null;
          this.modifyBookCode = null;
          this.$message.error("设置成功！");
          this.loadBookList();
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("设置异常");
          }
        });
    },
    onDragEnter() {
      //window.console.log(info);
    },
    onDrop(info) {
      const parentCode = info.node.eventKey;
      const code = info.dragNode.eventKey;
      http
        .fetchPost("book-type/move-node", {
          code: code,
          parentCode: parentCode
        })
        .then(() => {
          this.loadBookTypeTree();
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("操作异常");
          }
        });
    },
    handleOkAddNewBookType() {
      this.okButtonProps.props.disabled = true;
      if (!this.addNewBookTypeValue) {
        this.$message.error("请填写分类名称");
        this.okButtonProps.props.disabled = false;
        return null;
      }
      if (!this.exitNodeCode) {
        this.$message.error("请选择分类的父节点再操作！");
        this.okButtonProps.props.disabled = false;
        return null;
      }
      let url = "";
      let param = {};
      if (this.editOrAddBookType == "add") {
        url = "book-type/add";
        param = {
          parentCode: this.exitNodeCode,
          name: this.addNewBookTypeValue
        };
      }
      if (this.editOrAddBookType == "update") {
        url = "book-type/update-name";
        param = {
          code: this.exitNodeCode,
          name: this.addNewBookTypeValue
        };
      }
      http
        .fetchPost(url, param)
        .then(() => {
          this.okButtonProps.props.disabled = false;
          this.addNewBookTypeVisible = false;
          this.$message.success("操作成功");
          this.loadBookTypeTree();
          this.closeTreeMenu();
        })
        .catch(err => {
          this.okButtonProps.props.disabled = false;
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("添加异常");
          }
        });
    },
    delNode() {
      if (this.exitNodeCode == null) {
        this.$message.error("请选择对应的图书分类再操作");
        return;
      }
      let nodecode = this.exitNodeCode;
      let _this = this;
      this.$confirm({
        title: "确定删除此分类?",
        content: "删除此分类将导致分类下的所有图书变成未分类状态，是否删除",
        okText: "确认",
        cancelText: "取消",
        onOk() {
          http
            .ajax("delete", "book-type/del", { code: nodecode }, null)
            .then(() => {
              _this.$message.success("删除成功");
              _this.loadBookTypeTree();
              _this.closeTreeMenu();
            })
            .catch(err => {
              if (err && err.message) {
                _this.$message.error(err.message);
              } else {
                _this.message.error("删除异常");
              }
            });
        },
        onCancel() {}
      });
    },
    editNode() {
      if (this.exitNodeCode == null) {
        this.$message.error("请选择对应的图书分类再操作");
        return;
      }
      this.editBookTypeTitle = "修改图书分类";
      this.addNewBookTypeValue = null;
      this.addNewBookTypeVisible = true;
      this.editOrAddBookType = "update";
      http
        .fetchGet("book-type/detail", { code: this.exitNodeCode })
        .then(resp => {
          this.addNewBookTypeValue = resp.data.name;
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("获取节点信息异常");
          }
        });
    },
    addNode() {
      if (this.exitNodeCode == null) {
        this.$message.error("请选择对应的图书分类再操作");
        return;
      }
      this.editOrAddBookType = "add";
      this.editBookTypeTitle = "添加图书分类";
      this.addNewBookTypeValue = null;
      this.addNewBookTypeVisible = true;
    },
    closeTreeMenu() {
      this.isShowTreeMenu = false;
      this.treeMenuTop = 0;
      this.treeMenuLeft = 0;
      this.exitNodeCode = null;
    },
    treeRightClick(data) {
      this.isShowTreeMenuItem = true;
      this.isShowTreeMenu = true;
      this.addNewBookTypeVisible = false;
      this.treeMenuTop = data.event.y;
      this.treeMenuLeft = data.event.x + data.event.offsetX + 5;
      this.exitNodeCode = data.node.eventKey;
      if (this.exitNodeCode == -1) {
        this.isShowTreeMenuItem = false;
      }
    },
    onSelectTreeItem(selectedKeys, info) {
      window.console.log("====>", selectedKeys, info);
    },
    //修改图书的所属分类
    setClassification(code) {
      this.selectBookTypeVisible = true;
      this.inputTreeValue = null;
      this.modifyBookCode = code;
      http
        .fetchGet("book-type/query-tree", { isRoot: false })
        .then(resp => {
          this.inputTreeData = resp.data;
        })
        .catch(err => {
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("获取分类异常");
          }
        });
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
      http
        .fetchGet("book-type/query-tree", null)
        .then(resp => {
          this.treeData = resp.data;
        })
        .catch(err => {
          this.bookLoading = false;
          if (err && err.message) {
            this.$message.error(err.message);
          } else {
            this.$message.error("获取分类异常");
          }
        });
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
<style scoped>
.m-popover {
  position: absolute;
  z-index: 1000;
  /* display: none; */
  width: 100px;
  background-color: #e6f7ff;
}
.treeMenuHeader {
  height: 30px !important;
  width: 100px !important;
  border: 1px solid #1890ff;
  line-height: 30px;
}
.treeMenuTitle {
  width: 60px !important;
  height: 30px !important;
  left: 3px !important;
  top: 0px !important;
  position: relative !important;
}
.treeMenuClose {
  width: 20px !important;
  height: 30px !important;
  left: 50px !important;
  top: 0px !important;
  position: relative !important;
}

.m-popover .ant-list-bordered {
  border: 1px solid #1890ff;
  border-radius: 0px;
  text-align: center;
  cursor: pointer;
}
</style>