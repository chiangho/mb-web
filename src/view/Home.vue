<template>
  <div>
    <a-row>
      <a-col span="14" offset="5">
        <a-list
          itemLayout="vertical"
          size="large"
          :dataSource="publishBookList"
        >
          <div slot="footer">
            <a-pagination v-model="pageNo" :total="pageTotal" @change="onChangePage"/>
          </div>
          <a-list-item slot="renderItem" slot-scope="item" key="item.bookName">
            <img
              slot="extra"
              width="180"
              height="180"
              alt="logo"
              :src="host+'/book/down/image?isbn='+item.isbn"
            />
            <a-list-item-meta>
              <a slot="title" :href="item.bookName">{{item.bookName}}</a>
              <div slot="description">
                作者：{{item.bookAuthor}}<br/>
                ISBN：{{item.isbn}}<br/>
                {{item.address}}
              </div>
            </a-list-item-meta>
            <div>
              {{item.bookTitle}}
            </div>
            <div slot="actions">
              <a-button @click="transactionApplication(item.code)">请求读它</a-button>
            </div>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>

    <div class="amap-page-container">
      <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center"></el-amap>
    </div>
  </div>
</template>
<script>
import Http from "./../Https";
import Common from "./../Common.js"

export default {
  data() {
    let self = this;
    return {
      host:Common.Config.host,
      publishBookList: [],
      center: [121.59996, 31.197646],
      pageSize: 25,
      pageNo: 1,
      pageTotal:0,
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
  created() {},
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
    onChangePage(pageNumber) {
        alert('Page: ', pageNumber);
    },
    transactionApplication(code){
      alert(code);
    },
    //加载发布的图书
    loadPublishBookList() {
      Http.ajax(
        "get",
        "book/publish-book/query",
        {
          name: this.bookInfo,
          addressCode: this.addressCode,
          location: this.lng + "," + this.lat,
          pageSize: this.pageSize,
          pageNo: this.pageNo
        },
        null
      ).then(res => {
          this.publishBookList = res.data.items;
          let tempTotal = Number(res.data.total) ;
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
