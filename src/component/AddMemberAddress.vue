<template>
  <div>
    <a-form id="addMemberAddressForm" :form="form">
      <a-form-item label="省" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-select @change="handleProvinceChange" placeholder="请选择省份"
         v-decorator="[
          'province',
          { rules: [{ required: true, message: '请选择省份' }] },
        ]"
        
        >
          <a-select-option v-for="province in provinceData" :key="province.id">{{province.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="市" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-select @change="handleCityChange" placeholder="请选择地市"
         v-decorator="[
          'city',
          { rules: [{ required: true, message: '请选择地市' }] },
        ]"
        >
          <a-select-option v-for="city in cityData" :key="city.id">{{city.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="区/县" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-select @change="handleCountyChange" placeholder="请选择区县"
        v-decorator="[
          'county',
          { rules: [{ required: true, message: '请选择区县' }] },
        ]"
        >
          <a-select-option v-for="county in countyData" :key="county.id">{{county.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="详细地址" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-input
          v-decorator="[
          'adress',
          { rules: [{ required: true, message: '请输入详细地址' }] },
        ]"
          placeholder="请填写详细的联系地址"
        ></a-input>
      </a-form-item>
    </a-form>
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
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "addMemberAddressForm" });
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
    handleProvinceChange() {},
    handleCityChange() {},
    handleCountyChange() {}
  }
};
</script>