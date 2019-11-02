<template>
  <div>
    <a-select style="width: 120px" @change="handleProvinceChange">
      <a-select-option v-for="province in provinceData" :key="province.id">{{province.name}}</a-select-option>
    </a-select>
  </div>
</template>
<script>
import Http from "./../Https.js";

export default {
  name: "add-member-address",
  data() {
    return {
      provinceData: null,
      cityData: null,
      countyData: null
    };
  },
  created() {
    this.loadProvinceData(); //加载省份信息
  },
  methods: {
    loadProvinceData() {
      Http.fetchGet("area/province", null)
        .then(res => {
          this.provinceData = res.data;
        })
        .catch(err => {
          alert(err);
        });
    },
    handleProvinceChange(){
      
    }
  }
};
</script>