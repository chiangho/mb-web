<template>
  <div>
    <a-row>
      <a-col span="14" offset="5">
        <a-list itemLayout="vertical" size="large" :dataSource="publishBookList">
          <div slot="footer">
            <a-pagination
              v-model="pageNo"
              :total="pageTotal"
              :pageSize.sync="pageSize"
              showSizeChanger
              @showSizeChange="onShowSizeChange"
              @change="onChangePage"
              :pageSizeOptions="pageSizeOptions"
            >
              <template slot="buildOptionText" slot-scope="props">
                <span>{{props.value}}条/页</span>
              </template>
            </a-pagination>
          </div>
          <a-list-item slot="renderItem" slot-scope="item" key="item.bookName">
            <img
              slot="extra"
              width="200"
              height="200"
              alt="logo"
              :src="host+'/common/down-image?path='+item.icon"
            />
            <a-list-item-meta>
              <span slot="title">{{item.bookName}}</span>
              <div slot="description">
                作者：{{item.bookAuthor}}
                <br />
                ISBN：{{item.isbn}}
                <br />
                {{item.address}}
              </div>
            </a-list-item-meta>
            <div>{{item.bookTitle}}</div>
            <div slot="actions">
              <a-button
                type="primary"
                v-if="item.type==='10'||item.type==='11'"
                @click="transactionApplication(item.code,'10')"
              >申请换读</a-button>
              <a-button
                type="primary"
                v-if="item.type==='01'||item.type==='11'"
                @click="transactionApplication(item.code,'01')"
              >申请借阅</a-button>
            </div>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>

    <a-modal title="登记交换图书" v-model="registerModelvisible" :destroyOnClose="destroyOnClose" footer>
      <div>
        <RegisteredBook registerType="1" :publishBookCode="releaseBookCode"></RegisteredBook>
      </div>
    </a-modal>

    <div class="amap-page-container">
      <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center"></el-amap>
    </div>
  </div>
</template>
<script>
import Http from "./../Https";
import Common from "./../Common.js";
import RegisteredBook from "./../component/RegisteredBook";

export default {
  components: {
    RegisteredBook
  },
  data() {
    let self = this;
    return {
      pageSizeOptions: ["10", "25", "50"],
      releaseBookCode: null,
      destroyOnClose: true,
      registerModelvisible: false,
      host: Common.Config.host,
      publishBookList: [],
      center: [121.59996, 31.197646],
      pageSize: 10,
      pageNo: 1,
      pageTotal: 0,
      lng: 0,
      lat: 0,
      bookInfo: "",
      addressCode: "",
      plugin: [
        {
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.$nextTick();
                }
              });
            }
          }
        }
      ]
    };
  },
  created() {
    this.loadPublishBookList();
  },
  watch: {
    lng: function(newLng) {
      window.console.log(newLng);
      this.loadPublishBookList();
    },
    lat: function(newLat) {
      window.console.log(newLat);
      this.loadPublishBookList();
    }
  },
  methods: {
    registerBookSuccess() {
      this.registerModelvisible = false;
    },
    onChangePage(pageNumber) {
      this.pageNo = pageNumber;
      this.loadPublishBookList();
    },
    onShowSizeChange(current, pageSize) {
      this.pageNo = current;
      this.pageSize = pageSize;
      this.loadPublishBookList();
    },
    transactionApplication(code, type) {
      if (type == "10") {
        let isLoginState = this.$store.getters.isLogin;
        if (isLoginState) {
          this.releaseBookCode = code;
          this.registerModelvisible = true;
        } else {
          this.$store.commit("setCatchUti", this.$route.path);
          this.$router.push("/login");
        }
      }
    },
    //加载发布的图书
    loadPublishBookList() {
      Http.ajax(
        "get",
        "home/book/query",
        {
          name: this.bookInfo,
          addressCode: this.addressCode,
          location: this.lng + "," + this.lat,
          pageSize: this.pageSize,
          pageNo: this.pageNo
        },
        null
      )
        .then(res => {
          this.publishBookList = res.data.items;
          let tempTotal = Number(res.data.total);
          this.pageTotal = tempTotal;
        })
        .catch(err => {
          if (!err) {
            this.$message.error(err.message);
          }
        });
    }
  }
};
</script>
<style scoped>
.amap-demo {
  height: 500px;
  width: 80%;
  /* display: inline-block; */
  display: none;
}
.amap-page-container {
  text-align: center;
  width: 100%;
  margin: 0px;
}
</style>
