<template>
  <a-row>
    <a-col :span="4"></a-col>
    <a-col :span="16" class="forgetPassword">
        <div class="read">
            <div>通过邮箱找回密码的步骤。</div>
            <div>1、输入邮箱，点击发送验证码</div>
            <div>2、填写严重码，并校验。</div>
            <div>3、重置新密码。</div>
        </div>
        
    </a-col>
    <a-col :span="4"></a-col>
  </a-row>
</template>
<style scoped>
.forgetPassword {
  text-align: center;
  margin:0px auto;
}
.forgetPassword .read {
  text-align: left;
  margin-left: 30%;
}
</style>

