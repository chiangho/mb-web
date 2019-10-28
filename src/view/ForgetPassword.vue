<template>
  <a-row>
    <a-col :span="4"></a-col>
    <a-col :span="16" class="forgetPassword">
        <div class="read">
            <div>通过邮箱找回密码的步骤。</div>
            <div>1、填写注册邮箱，点击发送验证码</div>
            <div>2、填写验证码，点击校验。</div>
            <div>3、设置新密码。</div>
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
  color:red;
  font-size: 18px;
}
</style>

