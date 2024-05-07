<template>
  <v-snackbar v-model="showSnackBar" :timeout="2000" location="top" color="red-accent-4">
    <div style="justify-content: center; display: flex; align-items: center;">
      请先登录
    </div>
  </v-snackbar>
  <div class="login-container">
    <div class="loginBox">
      <div class="loginType">
        <h2 class="loginTypeTitle active" @click="changeLoginType(0)">密码登录</h2>
        <h2 class="loginTypeTitle" @click="changeLoginType(1)">验证码登录</h2>
        <h2 class="loginTypeTitle" @click="changeLoginType(2)">注册</h2>
      </div>

      <div class="inputContainer">
        <v-form v-if="loginType === 0" v-model="form[0]" @submit.prevent="onSubmit"
          style="display: flex; flex-direction: column;justify-content: center;align-items: center;">
          <v-text-field v-model="passwordForm.username" :rules="[emptyRule('邮箱或用户名', passwordForm.username)]"
            variant="outlined" :readonly="loading" label="邮箱/用户名" placeholder="请输入邮箱或用户名" bg-color="#212121"
            color="#fff" class="inputBox" spellcheck="false" clearable></v-text-field>
          <v-text-field v-model="passwordForm.password" :rules="[emptyRule('密码', passwordForm.password)]"
            variant="outlined" :readonly="loading" label="密码" placeholder="请输入密码" bg-color="#212121" color="#fff"
            class="inputBox" :type="showPassword ? 'text' : 'password'" spellcheck="false">
            <template v-slot:append-inner>
              <i v-if="showPassword" class='iconfont icon-yanjing_yincang' @click="showPassword = !showPassword"></i>
              <i v-else class='iconfont icon-yanjing_xianshi' @click="showPassword = !showPassword"></i>
            </template>
          </v-text-field>
          <button class="btn">登录
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </v-form>

        <v-form v-if="loginType === 1" v-model="form[1]" @submit.prevent="onSubmit">
          <v-text-field v-model="emailCodeForm.email" :rules="[emptyRule('邮箱', emailCodeForm.email), emailRule]"
            variant="outlined" :readonly="loading" label="邮箱" placeholder="请输入邮箱" bg-color="#212121" color="#fff"
            class="inputBox" spellcheck="false" clearable>
          </v-text-field>
          <span></span>
          <button class="btn">验证邮箱
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </v-form>

        <v-form v-if="loginType === 2" v-model="form[2]" @submit.prevent="onSubmit">
          <v-text-field v-model="registerForm.username" :rules="[emptyRule('用户名', registerForm.username)]"
            variant="outlined" :readonly="loading" label="用户名" placeholder="请输入用户名" bg-color="#212121" color="#fff"
            class="registerInputBox" spellcheck="false" clearable></v-text-field>
          <v-text-field v-model="registerForm.email" :rules="[emptyRule('邮箱', registerForm.email), emailRule]"
            variant="outlined" :readonly="loading" label="邮箱" placeholder="请输入邮箱" bg-color="#212121" color="#fff"
            class="registerInputBox" spellcheck="false" clearable></v-text-field>
          <v-text-field v-model="registerForm.password1"
            :rules="[emptyRule('密码', registerForm.password1), passwordRule]" variant="outlined" :readonly="loading"
            label="密码" placeholder="请输入密码" bg-color="#212121" color="#fff" class="registerInputBox"
            :type="showPassword ? 'text' : 'password'" spellcheck="false" hint="密码长度至少6位，不能超过16位，必须包含数字和字母">
            <template v-slot:append-inner>
              <i v-if="showPassword" class='iconfont icon-yanjing_yincang' @click="showPassword = !showPassword"></i>
              <i v-else class='iconfont icon-yanjing_xianshi' @click="showPassword = !showPassword"></i>
            </template>
          </v-text-field>
          <v-text-field v-model="registerForm.password2"
            :rules="[emptyRule('重复密码', registerForm.password2), passwordRule, passwordAgainRule(registerForm.password1, registerForm.password2)]"
            variant="outlined" :readonly="loading" label="重复密码" placeholder="请再次输入密码" bg-color="#212121" color="#fff"
            class="registerInputBox" :type="showPassword ? 'text' : 'password'" spellcheck="false">
            <template v-slot:append-inner>
              <i v-if="showPassword" class='iconfont icon-yanjing_yincang' @click="showPassword = !showPassword"></i>
              <i v-else class='iconfont icon-yanjing_xianshi' @click="showPassword = !showPassword"></i>
            </template>
          </v-text-field>

          <button class="btn">注册
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </v-form>
      </div>
    </div>
  </div>
  <v-dialog v-model="showDialog" width="auto">
    <v-card max-width="400" prepend-icon="mdi-update" text="我们已经发送验证码到你的邮箱，请注意查收。">
      <v-otp-input></v-otp-input>
    </v-card>
  </v-dialog>

</template>

<script setup lang='ts'>;
import { ref, reactive, onMounted } from 'vue'
const passwordBtn = ref()
const phoneCodeBtn = ref()
const form = [ref(false), ref(false), ref(false)]
const isPassword = ref(true)
const showSnackBar = ref(false)
const showPassword = ref(false)
const showDialog = ref(false)
const loading = ref(false)
const loginType = ref(0)
const passwordForm = ref({
  username: null,
  password: null,
})
const emailCodeForm = ref({
  email: null,
  code: null,
})
const registerForm = ref({
  username: null,
  email: null,
  password1: null,
  password2: null,
  code: null
})


const emptyRule = (name, v) => {
  if (v) return true;
  return '请输入' + name
}

const passwordRule = (v) => {
  if (v.length < 6)
    return '密码长度至少6位'
  else if (v.length > 16)
    return '密码长度不能超过16位'
  else if (!/\d/.test(v))
    return '密码必须包含数字'
  else if (!/[a-zA-Z]/.test(v))
    return '密码必须包含字母'
}

const passwordAgainRule = (v1, v2) => {
  if (v1 !== v2)
    return '两次密码输入不一致'
}

const emailRule = (v) => {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return true;
  return '请输入正确的邮箱'
}

const onSubmit = () => {
  console.log(passwordForm)
  if (!form[loginType.value]) return
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
  if (loginType.value === 1 || loginType.value === 2) {
    showDialog.value = true;
  }
}

const changeLoginType = (type) => {
  loginType.value = type;
  for (let i = 0; i < document.querySelectorAll('.loginTypeTitle').length; i++) {
    document.querySelectorAll('.loginTypeTitle')[i].classList.remove('active')
  }
  document.querySelectorAll('.loginTypeTitle')[type].classList.add('active')
}

const clickpassword = () => {
  passwordBtn.value.classList.add('btn-selected')
  phoneCodeBtn.value.classList.remove('btn-selected')
  isPassword.value = true
}
const clickPhoneCode = () => {
  passwordBtn.value.classList.remove('btn-selected')
  phoneCodeBtn.value.classList.add('btn-selected')
  isPassword.value = false
}

const gotoRegister = () => {
  clickPhoneCode()
}

const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};

onMounted(() => {
  showSnackBar.value = true;
})
</script>

<style scoped>
input,
button {
  background: transparent;
  border: 0;
  outline: none;
}

.login-container {
  height: 100vh;
  width: 100vw;
  background: var(--light-background);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  background-image: url('../../public/background/login-background.jpg');
  background-repeat: no-repeat;
  background-position: center;
}

.loginBox {
  width: 45vw;
  height: 70vh;
  background-color: var(--dark-background);
  margin: 100px auto;
  border-radius: 10px;
  box-shadow: 0 15px 25px 0 rgba(0, 0, 0, .6);
  box-sizing: border-box;
}

/* h2 {
  text-align: center;
  color: aliceblue;
  margin-bottom: 30px;
  font-family: 'Courier New', Courier, monospace;
} */

.item {
  height: 45px;
  border-bottom: 1px solid #fff;
  margin-bottom: 40px;
  position: relative;
}

.item input {
  width: 100%;
  height: 100%;
  color: #fff;
  padding-top: 20px;
  box-sizing: border-box;
}

.item input:focus+label,
.item input:valid+label {
  top: 0px;
  font-size: 2px;
}

.item label {
  position: absolute;
  left: 0;
  top: 12px;
  transition: all 0.5s linear;
}

.btn {
  color: var(--primary-color);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 2px;
  width: 25vw;
  height: 6vh;
  margin: 10px;
  margin-top: 30px;
}

.btn:hover {
  border-radius: 5px;
  color: #fff;
  background: var(--primary-color);
  box-shadow: 0 0 5px 0 var(--primary-color),
    0 0 25px 0 var(--primary-color),
    0 0 50px 0 var(--primary-color),
    0 0 100px 0 var(--primary-color);
  transition: all 1s linear;
}

.btn>span {
  position: absolute;
}

.btn>span:nth-child(1) {
  width: 100%;
  height: 2px;
  background: -webkit-linear-gradient(left, transparent, var(--primary-color));
  left: -100%;
  top: 0px;
  animation: line1 1s linear infinite;
}

@keyframes line1 {

  50%,
  100% {
    left: 100%;
  }
}

.btn>span:nth-child(2) {
  width: 2px;
  height: 100%;
  background: -webkit-linear-gradient(top, transparent, var(--primary-color));
  right: 0px;
  top: -100%;
  animation: line2 1s 0.25s linear infinite;
}

@keyframes line2 {

  50%,
  100% {
    top: 100%;
  }
}

.btn>span:nth-child(3) {
  width: 100%;
  height: 2px;
  background: -webkit-linear-gradient(left, var(--primary-color), transparent);
  left: 100%;
  bottom: 0px;
  animation: line3 1s 0.75s linear infinite;
}

@keyframes line3 {

  50%,
  100% {
    left: -100%;
  }
}

.btn>span:nth-child(4) {
  width: 2px;
  height: 100%;
  background: -webkit-linear-gradient(top, transparent, var(--primary-color));
  left: 0px;
  top: 100%;
  animation: line4 1s 1s linear infinite;
}

@keyframes line4 {

  50%,
  100% {
    top: -100%;
  }
}


.loginType {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 10vh;
}

.loginTypeTitle {
  cursor: pointer;
  color: var(--light-background);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  /* border: var(--primary-color) solid 3px; */
}

.loginTypeTitle:hover {
  color: var(--primary-color);
}

.active {
  background-color: var(--light-background);
  color: var(--primary-color);
}

.active:hover {
  background-color: var(--light-background);
  color: var(--primary-color);
}

.inputContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.inputBox {
  margin: 10px;
  width: 25vw;
  height: 12vh;
  color: var(--light-background);
}

.registerInputBox {
  margin: 10px;
  width: 25vw;
  height: 10vh;
  color: var(--light-background);
}

i:hover {
  cursor: pointer;
}
</style>