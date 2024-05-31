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
        <v-form v-if="loginType == 0" v-model="form[0]" @submit.prevent="onSubmit"
          style="display: flex; flex-direction: column;justify-content: center;align-items: center;">
          <v-text-field v-model="passwordForm.email" :rules="[ruleStore.emptyRule('邮箱', passwordForm.email)]"
            variant="outlined" :readonly="loading" label="邮箱" placeholder="请输入邮箱 bg-color=" #212121" color="#fff"
            class="inputBox" spellcheck="false" clearable></v-text-field>
          <v-text-field v-model="passwordForm.password" :rules="[ruleStore.emptyRule('密码', passwordForm.password)]"
            variant="outlined" :readonly="loading" label="密码" placeholder="请输入密码" bg-color="#212121" color="#fff"
            class="inputBox" :type="passwordForm.showPassword ? 'text' : 'password'" spellcheck="false">
            <template v-slot:append-inner>
              <i v-if="passwordForm.showPassword" class='iconfont icon-yanjing_yincang'
                @click="passwordForm.showPassword = !passwordForm.showPassword"></i>
              <i v-else class='iconfont icon-yanjing_xianshi'
                @click="passwordForm.showPassword = !passwordForm.showPassword"></i>
            </template>
          </v-text-field>
          <button class="btn">登录
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </v-form>

        <v-form v-if="loginType == 1" v-model="form[1]" @submit.prevent="onSubmit">
          <v-text-field v-model="codeForm.email"
            :rules="[ruleStore.emptyRule('邮箱', codeForm.email), ruleStore.emailRule]" variant="outlined"
            :readonly="loading" label="邮箱" placeholder="请输入邮箱" bg-color="#212121" color="#fff" class="inputBox"
            spellcheck="false" clearable>
          </v-text-field>
          <span></span>
          <button class="btn">验证邮箱
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </v-form>

        <v-form v-if="loginType == 2" v-model="form[2]" @submit.prevent="onSubmit">
          <v-text-field v-model="registerForm.username"
            :rules="[ruleStore.emptyRule('用户名', registerForm.username), ruleStore.usernameRule]" variant="outlined"
            :readonly="loading" label="用户名" placeholder="请输入用户名" bg-color="#212121" color="#fff"
            class="registerInputBox" spellcheck="false" clearable></v-text-field>
          <v-text-field v-model="registerForm.email"
            :rules="[ruleStore.emptyRule('邮箱', registerForm.email), ruleStore.emailRule]" variant="outlined"
            :readonly="loading" label="邮箱" placeholder="请输入邮箱" bg-color="#212121" color="#fff" class="registerInputBox"
            spellcheck="false" clearable></v-text-field>
          <v-text-field v-model="registerForm.password1"
            :rules="[ruleStore.emptyRule('密码', registerForm.password1), ruleStore.passwordRule]" variant="outlined"
            :readonly="loading" label="密码" placeholder="请输入密码" bg-color="#212121" color="#fff" class="registerInputBox"
            :type="registerForm.showPassword1 ? 'text' : 'password'" spellcheck="false"
            hint="密码长度至少6位，不能超过16位，必须包含数字和字母">
            <template v-slot:append-inner>
              <i v-if="registerForm.showPassword1" class='iconfont icon-yanjing_yincang'
                @click="registerForm.showPassword1 = !registerForm.showPassword1"></i>
              <i v-else class='iconfont icon-yanjing_xianshi'
                @click="registerForm.showPassword1 = !registerForm.showPassword1"></i>
            </template>
          </v-text-field>
          <v-text-field v-model="registerForm.password2"
            :rules="[ruleStore.emptyRule('重复密码', registerForm.password2), ruleStore.passwordRule, ruleStore.passwordAgainRule(registerForm.password1, registerForm.password2)]"
            variant="outlined" :readonly="loading" label="重复密码" placeholder="请再次输入密码" bg-color="#212121" color="#fff"
            class="registerInputBox" :type="registerForm.showPassword2 ? 'text' : 'password'" spellcheck="false">
            <template v-slot:append-inner>
              <i v-if="registerForm.showPassword2" class='iconfont icon-yanjing_yincang'
                @click="registerForm.showPassword2 = !registerForm.showPassword2"></i>
              <i v-else class='iconfont icon-yanjing_xianshi'
                @click="registerForm.showPassword2 = !registerForm.showPassword2"></i>
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
  <v-dialog v-model="showDialog" width="auto" persistent>
    <v-card max-width="400" prepend-icon="mdi-update">
      <h3 style="margin:0 15px;">{{ sendCodeText }}</h3>
      <v-otp-input @finish="codeSubmit" v-model="code"></v-otp-input>
      <v-btn @click="showDialog.value = false">取消</v-btn>
    </v-card>
  </v-dialog>

</template>

<script setup lang='js'>;
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useLoginStore, useRuleStore } from '@/store/store'
const loginStore = useLoginStore()
const ruleStore = useRuleStore()
const router = useRouter();
const form = [ref(false), ref(false), ref(false)]
const showSnackBar = ref(false)
const showDialog = ref(false)
const loading = ref(false)
const loginType = ref(0)
const code = ref(null)
const sendCodeText = ref('验证码发送成功！请在10分钟内填写。')
const passwordForm = ref({
  email: null,
  password: null,
  showPassword: false
})
const codeForm = ref({
  email: null,
  code: null,
})
const registerForm = ref({
  uid: null,
  username: null,
  email: null,
  password1: null,
  password2: null,
  showPassword1: false,
  showPassword2: false,
  code: null
})

const setJWTandCookie = (key, value) => {
  localStorage.setItem(key, value);
  setCookie(key, value, 30 * 24 * 60 * 60)//存储localStorage的同时，也存储一个cookie来监听
}
//设置cookie    
const setCookie = (name, value, seconds) => {
  seconds = seconds || 0;   //seconds有值就直接赋值，没有为0    
  var expires = "";
  if (seconds != 0) {      //设置cookie生存时间    
    var date = new Date();
    date.setTime(date.getTime() + (seconds * 1000));
    expires = "; expires=" + date.toGMTString();
  }
  document.cookie = name + "=" + escape(value) + expires + "; path=/";   //转码并赋值   
}

const onSubmit = () => {
  if (!form[loginType.value]) return
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)

  if (loginType.value === 0) {
    console.log(passwordForm);
    loginByPassword();
  } else if (loginType.value === 1) {
    console.log(codeForm);
    sendLoginEmailCode();
  } else if (loginType.value === 2) {
    console.log(registerForm);
    sendRegisterEmailCode();
  }
}

const loginByPassword = () => {
  axios.request({
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/login/password',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      "email": passwordForm.value.email,
      "password": passwordForm.value.password
    }
  })
    .then((response) => {
      setJWTandCookie("JWT_TOKEN", response.data.data.jwt)
      loginStore.login();
      loginStore.setIsNowLogin(true)
      router.push('/HQBlog/home')
    })
    .catch((error) => {
      console.log(error);
    });
}

const sendLoginEmailCode = () => {
  axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://8.134.215.31:2002/login/code?email=${codeForm.value.email}`,
    headers: {}
  })
    .then((response) => {
      if (response.data.code == 1) {
        showDialog.value = true;
      } else {
        console.log(response.data.msg);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

const sendRegisterEmailCode = () => {
  axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://8.134.215.31:2002/register/code?email=${registerForm.value.email}`,
    headers: {}
  })
    .then((response) => {
      if (response.data.code == 1) {
        showDialog.value = true;
      } else {
        console.log(response.data.msg);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

const codeSubmit = () => {
  showDialog.value = false;
  if (loginType.value === 1) {
    loginCodeSubmit();
  } else if (loginType.value === 2) {
    registerCodeSubmit();
  }
}

const loginCodeSubmit = () => {
  axios.request({
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/login/code/submit',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      "email": codeForm.value.email,
      "code": code.value
    }
  })
    .then((response) => {
      setJWTandCookie("JWT_TOKEN", response.data.data.jwt)
      loginStore.login();
      loginStore.setIsNowLogin(true)
      router.push('/HQBlog/home')
    })
    .catch((error) => {
      console.log(error);
    });
}

const registerCodeSubmit = () => {
  axios.request({
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/register/submit',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      "email": registerForm.value.email,
      "username": registerForm.value.username,
      "password": registerForm.value.password1,
      "code": code.value,
      "uid": registerForm.value.uid
    }
  })
    .then((response) => {
      setJWTandCookie("JWT_TOKEN", response.data.data.jwt)
      loginStore.login();
      loginStore.setIsNowLogin(true)
      router.push('/HQBlog/home')
    })
    .catch((error) => {
      console.log(error);
    });
}

const changeLoginType = (type) => {
  loginType.value = type;
  for (let i = 0; i < document.querySelectorAll('.loginTypeTitle').length; i++) {
    document.querySelectorAll('.loginTypeTitle')[i].classList.remove('active')
  }
  document.querySelectorAll('.loginTypeTitle')[type].classList.add('active')
}

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