<template>
  <div>
    <a-form id="addMemberAddressForm" :form="form" @submit="handleSubmitAddMemberAddess">
      <a-form-item label="省" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-select
          @change="handleProvinceChange"
          v-decorator="[
          'province',
           { rules: [{ required: true, message: '请选择省份' }],initialValue:provinceDefaultValue },
        ]"
          placeholder="请选择省份"
        >
          <a-select-option v-for="province in provinceData" :key="province.id">{{province.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="市" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-select
          @change="handleCityChange"
          v-decorator="[
          'city',
          { rules: [{ required: true, message: '请选择地市' }],initialValue:cityDefaultValue },
        ]"
          placeholder="请选择地市"
        >
          <a-select-option v-for="city in cityData" :key="city.id">{{city.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="区/县" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-select
          
          v-decorator="[
          'county',
          { rules: [{ required: true, message: '请选择区县' }],initialValue:countyDefaultValue },
        ]"
        placeholder="请选择区县"
        >
          <a-select-option v-for="county in countyData" :key="county.id">{{county.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="详细地址" :label-col="{span:4}" :wrapper-col="{span:16}">
        <a-input
          v-decorator="[
          'address',
          { rules: [{ required: true, message: '请输入详细地址' }],initialValue:addressDefaultValue },
        ]"
          placeholder="请填写详细的联系地址"
        ></a-input>
      </a-form-item>

      <a-form-item :wrapper-col="tailFormItemLayout.wrapperCol">
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import Http from "./../Https.js";
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 4
    }
  }
};
export default {
  name: "add-member-address",
  data() {
    return {
      tailFormItemLayout,
      provinceData: [],
      cityData: [],
      countyData: [],
      provinceDefaultValue: null,
      cityDefaultValue: null,
      countyDefaultValue: null,
      addressDefaultValue: null
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "addMemberAddressForm" });
  },
  created() {
    this.loadProvinceData(); //加载省份信息
    this.loadMemberAddressInfo();
  },
  props: ["code"],
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
          let url = "member/address/add";
          if (this.code) {
            url = "member/address/update";
            values["code"] = this.code;
          }
          Http.fetchPost(url, values)
            .then(res => {
              if (res.status === 200) {
                //alert("success");
                this.$emit("addMemberAddressSuccess");
              } else {
                this.$message.error(res.error.message);
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        }
      });
    },
    loadMemberAddressInfo() {
      if (this.code) {
        Http.ajax("post", "member/address/detail", { code: this.code }, null)
          .then(res => {
            this.provinceDefaultValue = res.data.provinceId;
            this.handleProvinceChange(this.provinceDefaultValue);
            this.cityDefaultValue = res.data.cityId;
            this.handleCityChange(this.cityDefaultValue);
            this.countyDefaultValue = res.data.countyId;
            this.addressDefaultValue = res.data.address;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    }
  }
};
</script>