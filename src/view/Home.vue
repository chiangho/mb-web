<template>
  <div>
    
    
    
    
    <div class="amap-page-container">
      <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center"></el-amap>
    </div>
  </div>
</template>
<script>
import Http from "./../Https";

export default {
  data() {
    let self = this;
    return {
      publishBookList: [],
      center: [121.59996, 31.197646],
      pageSize: 25,
      pageNo: 1,
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
