<template>
  <div>
    <a-form id="addMemberAddressForm" :form="form" @submit="handleSubmitAddMemberAddess">
      <a-form-item label="省" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-select
          @change="handleProvinceChange"
          placeholder="请选择省份"
          v-decorator="[
          'province',
          { rules: [{ required: true, message: '请选择省份' }] },
        ]"
        >
          <a-select-option v-for="province in provinceData" :key="province.id">{{province.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="市" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-select
          @change="handleCityChange"
          placeholder="请选择地市"
          v-decorator="[
          'city',
          { rules: [{ required: true, message: '请选择地市' }] },
        ]"
        >
          <a-select-option v-for="city in cityData" :key="city.id">{{city.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="区/县" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-select
          placeholder="请选择区县"
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
          'address',
          { rules: [{ required: true, message: '请输入详细地址' }] },
        ]"
          placeholder="请填写详细的联系地址"
        ></a-input>
      </a-form-item>

      <a-form-item :wrapper-col="{span:16,offset:4}">
        <a-button type="primary" block html-type="submit">提交</a-button>
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
      provinceData: [],
      cityData: [],
      countyData: []
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "addMemberAddressForm" });
  },
  created() {
    this.loadProvinceData(); //加载省份信息
    this.loadMemberAddressInfo();
  },
  props:[
    "code"
  ],
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
    handleProvinceChange(value) {
      this.cityData = null;
      this.countyData = null;
      let provinceId = value;
      if (provinceId == null || provinceId == "") {
        return;
      }
      const params = { provinceId: provinceId };
      Http.fetchGet("area/city", params)
        .then(res => {
          this.cityData = res.data;
        })
        .catch(err => {
          alert(err);
        });
    },
    handleCityChange(value) {
      this.countyData = null;
      let cityId = value;
      if (cityId == null || cityId == "") {
        return;
      }
      const params = { cityId: cityId };
      Http.fetchGet("area/county", params)
        .then(res => {
          this.countyData = res.data;
        })
        .catch(err => {
          alert(err);
        });
    },
    handleSubmitAddMemberAddess() {
      this.form.validateFields((err, values) => {
        if (!err) {
          Http.fetchPost("member/address/add", values)
            .then(res => {
              if(res.status===200){
                //alert("success");
                this.$emit('addMemberAddressSuccess');
              }else{
                alert(res.error.message);
              }
            })
            .catch(err => {
              window.console.log(err);
            });
        }
      });
    },
    loadMemberAddressInfo(){
      if(this.code){
        //加载地址信息，并默认显示
      }
    }
  }
};
</script>