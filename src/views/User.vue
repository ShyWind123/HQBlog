<template>
  <div v-if="!isGetData" style="height: 100vh;">
    <loading></loading>
  </div>
  <div class="userContainer">
    <div class="subContainer1">
      <div class="userInfoContainer">
        <div class="userAvatarContainer">
          <div class="userAvatar">
            <v-avatar :image="userBasicInfo.avatar" size="70" @click="openFilePicker"></v-avatar>
            <input type="file" id="avatarInput" ref="fileInput" accept="image/*" style="display: none"
              @change="handleFileChange" />
          </div>
          <div class="userEmail">{{ userBasicInfo.email }}</div>
        </div>

        <div class="userBasicInfo">
          <div class="userNameSetting">
            <div class="userNameInputContainer" id="userNameInputContainer">
              <v-text-field v-model="changeUsernameForm.newUsername" class="userNameInput" id="userNameInput"
                label="修改用户名" :placeholder="userBasicInfo.userName" variant="outlined"
                @keyup.enter="updateUserName"></v-text-field>
            </div>
            <div v-if="!changeUsernameForm.showChangeUserNameInput" class="userName" @click="onUserNameClick()">{{
    userBasicInfo.userName
  }}
            </div>
          </div>
          <div class="userOtherInfoContainer">
            <span class="userOtherInfo" style="margin-right: 0;"><i class="iconfont icon-boke" style="color:blue;"></i>
              博客数量: {{
      userBasicInfo.totalBlogs }}</span>
            <span class="userOtherInfo" style="margin-right: 0;"><i class="iconfont icon-xihuan" style="color:red;"></i>
              点赞量: {{
    userBasicInfo.totalLikes }}</span>
            <span class="userOtherInfo" style="margin-right: 0;"><i class="iconfont icon-guankan"
                style="color:green;"></i> 阅读量: {{
    userBasicInfo.totalViews }}</span>
          </div>
        </div>

        <div class="buttonsContainer" v-if="route.params.uid == userStore.getUid()">
          <v-btn color="#000000" size="large" class="changePasswordBtn"
            @click="showChangePasswordDialog = true">修改密码</v-btn>
          <v-btn color="#e90000" size="large" class="logoutBtn" @click="showLogoutDialog = true">退出登录</v-btn>
        </div>
      </div>

      <div class="userBlogHeatmapContainer">
        <div class="userBlogHeatmap boxshadow">
          <div class="userBlogHeatmapTitle">博客记录</div>
          <div class="heatmapContainer" id="heatmapContainer"></div>
        </div>
      </div>
    </div>


    <div class="subContainer2">
      <div class="userBlogListContainer">
        <div class="boxshadow userBlogList">
          <div class="userBlogListTitle">我的博客</div>
          <v-timeline line-color="white" class="timelineContainer" side="end">
            <v-timeline-item dot-color="#e90000" size="lx-smallarge" v-for="blog in userBlogList">
              <template v-slot:opposite>
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:8vw;">
                  <span style="color: #fff;">{{ blog.date }}</span>
                  <span style="color: #fff;">{{ blog.time }}</span>
                </div>
              </template>
              <div class="blogCard boxshadow">
                <div class="blogTitleContainer">
                  <span class="blogTitle" @click="onBlogTitleClick(blog.id)">{{ blog.title }}</span>
                </div>

                <div class="blogSummary">{{ blog.summary }}</div>

                <div class="blogTags">
                  <v-chip-group>
                    <v-chip v-for="tag in blog.tags" label>{{ tag }}</v-chip>
                  </v-chip-group>
                </div>
              </div>
              <!-- <span v-if="blog.state == '草稿'" style="color:antiquewhite; margin: 0 20px;">草稿</span> -->
            </v-timeline-item>
          </v-timeline>
        </div>
      </div>

      <div class="userBlogTagsContainer boxshadow">
        <div class="userBlogTagsTitle">博客标签</div>
        <v-responsive class="overflow-y-auto">
          <v-chip-group class="mt-3" column>
            <v-chip v-for="tag in userTagsList" label style="color: var(--light-background);">
              {{ tag.name }}
            </v-chip>
          </v-chip-group>
        </v-responsive>
      </div>
    </div>
  </div>
  <v-dialog v-model="showLogoutDialog" width="auto">
    <v-card width="250" prepend-icon="mdi-update" title="是否退出登录？">
      <v-btn @click="logout()">确定</v-btn>
      <v-btn @click="showLogoutDialog = false">取消</v-btn>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showChangePasswordDialog" width="auto">
    <v-card width="500" prepend-icon="mdi-update" title="修改密码">
      <v-form v-model="formCompleted" class="changePasswordFormContainer">
        <v-text-field v-model="changePasswordForm.oldPassword"
          :rules="[ruleStore.emptyRule('原密码', changePasswordForm.oldPassword)]" variant="outlined" :readonly="loading"
          label="原密码" placeholder="请输入原密码" class="registerInputBox"
          :type="changePasswordForm.showOldPassword ? 'text' : 'password'" spellcheck="false">
          <template v-slot:append-inner>
            <i v-if="changePasswordForm.showOldPassword" class='iconfont icon-yanjing_yincang'
              @click="changePasswordForm.showOldPassword = !changePasswordForm.showOldPassword"></i>
            <i v-else class='iconfont icon-yanjing_xianshi'
              @click="changePasswordForm.showOldPassword = !changePasswordForm.showOldPassword"></i>
          </template>
        </v-text-field>
        <v-text-field v-model="changePasswordForm.password1"
          :rules="[ruleStore.emptyRule('新密码', changePasswordForm.password1), ruleStore.passwordRule]" variant="outlined"
          :readonly="loading" label="新密码" placeholder="请输入新密码" class="registerInputBox"
          :type="changePasswordForm.showPassword1 ? 'text' : 'password'" spellcheck="false"
          hint="密码长度至少6位，不能超过16位，必须包含数字和字母">
          <template v-slot:append-inner>
            <i v-if="changePasswordForm.showPassword1" class='iconfont icon-yanjing_yincang'
              @click="changePasswordForm.showPassword1 = !changePasswordForm.showPassword1"></i>
            <i v-else class='iconfont icon-yanjing_xianshi'
              @click="changePasswordForm.showPassword1 = !changePasswordForm.showPassword1"></i>
          </template>
        </v-text-field>
        <v-text-field v-model="changePasswordForm.password2"
          :rules="[ruleStore.emptyRule('重复新密码', changePasswordForm.password2), ruleStore.passwordRule, ruleStore.passwordAgainRule(changePasswordForm.password1, changePasswordForm.password2)]"
          variant="outlined" :readonly="loading" label="重复新密码" placeholder="请再次输入新密码" class="registerInputBox"
          :type="changePasswordForm.showPassword2 ? 'text' : 'password'" spellcheck="false">
          <template v-slot:append-inner>
            <i v-if="changePasswordForm.showPassword2" class='iconfont icon-yanjing_yincang'
              @click="changePasswordForm.showPassword2 = !changePasswordForm.showPassword2"></i>
            <i v-else class='iconfont icon-yanjing_xianshi'
              @click="changePasswordForm.showPassword2 = !changePasswordForm.showPassword2"></i>
          </template>
        </v-text-field>
      </v-form>
      <v-btn @click="changePassword()">确定</v-btn>
      <v-btn @click="showChangePasswordDialog = false">取消</v-btn>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbarInfo.show" :timeout="2000" location="top"
    :color="snackbarInfo.success ? 'green-accent-4' :'red-accent-4'">
    <div style="justify-content: center; display: flex; align-items: center;color: #fff;">
      {{ snackbarInfo.msg }}
    </div>
  </v-snackbar>
  <BackTop></BackTop>
</template>

<script setup lang='js'>
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts';
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { useLoginStore } from '@/store/LoginStore'
import { useRuleStore } from '@/store/RuleStore'
import { useUserStore } from '@/store/UserStore'
import BackTop from '../components/BackTop.vue';
import Loading from '../components/Loading.vue';

const loginStore = useLoginStore()
const ruleStore = useRuleStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const isGetData = ref(false)

let calendarData = {
  startDate: null,
  endDate: null,
}

const snackbarInfo = ref({
  show: false,
  success: false,
  msg: '',
})

const changePasswordForm = ref({
  oldPassword: '',
  password1: '',
  password2: '',
  showOldPassword: false,
  showPassword1: false,
  showPassword2: false,
})

const changeUsernameForm = ref({
  newUsername: '',
  showChangeUserNameInput: false,
})

const formCompleted = ref(false)

const fileInput = ref(null)
const showLogoutDialog = ref(false)
const showChangePasswordDialog = ref(false)

const userBasicInfo = ref({
  userName: "",
  email: "",
  avatar: 'http://8.134.215.31:2002/avatar/default.jpg',
  totalLikes: 0,
  totalViews: 0,
  totalBlogs: 0,
})

let blogCnt = 0;
let userBlogCnt = []
const userTagsList = ref()
const userBlogList = ref([])

const option = {
  title: {
    top: 10,
    left: 'center',
    text: '',
    textStyle: {
      color: '#fff'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return `<div>${params.value[0]}</div>
              <div>发表博客数量: ${params.value[1]}</div>`;
    },
    axisPointer: {
      type: 'shadow'
    }
  },
  // visualMap: {
  //   show: true,
  //   top: 60,
  //   max: 10,
  //   min: 0,
  //   orient: 'horizontal',
  //   type: 'piecewise',
  //   textStyle: {
  //     color: '#ffffff'
  //   },
  //   left: 'center',
  //   inRange: {
  //     color: ['#ffffff', '#008024']
  //   },
  //   // type: 'piecewise'
  // },
  visualMap: {
    show: false,
    top: 60,
    max: 0,
    min: 0,
    orient: 'horizontal',
    type: 'piecewise',
    textStyle: {
      color: '#ffffff'
    },
    left: 'center',
    inRange: {
      color: ['#ffffff', '#008024']
    },
    // type: 'piecewise'
  },
  calendar: {
    // bottom: 30,
    top: 80,
    left: 20,
    right: 20,
    cellSize: [15, 15],
    range: null,
    itemStyle: {
      borderWidth: 0.5,
    },
    yearLabel: { show: false },
    monthLabel: {
      color: "#fff",
    },
    dayLabel: {
      color: "#fff"
    }
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: null,
  }
};

const changePassword = () => {
  if (!formCompleted.value) {
    return;
  }
  axios.request({
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/user/change_password',
    headers: {
      'token': localStorage.getItem("JWT_TOKEN"),
      'Content-Type': 'application/json'
    },
    data: {
      "uid": userStore.getUid(),
      "oldPassword": changePasswordForm.value.oldPassword,
      "newPassword": changePasswordForm.value.password1
    }
  })
    .then((response) => {
      if (response.data.code === 1) {
        snackbarInfo.value.success = true

        changePasswordForm.value.oldPassword = ''
        changePasswordForm.value.password1 = ''
        changePasswordForm.value.password2 = ''

        showChangePasswordDialog.value = false
      } else {
        snackbarInfo.value.success = false
      }
      snackbarInfo.value.msg = response.data.msg
      snackbarInfo.value.show = true
    })
    .catch((error) => {
      console.log(error);
    });
}

const getDataFromOriginData = () => {
  const data = [];
  for (let i = 0; i < userBlogCnt.length; i++) {
    data.push([userBlogCnt[i].date, userBlogCnt[i].cnt])
  }
  return data;
}

const clearCookie = (name, value) => {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const expires = "; expires=" + exp.toGMTString();
  document.cookie = name + "=" + escape(value) + expires + "; path=/";   //转码并赋值   
}

const logout = () => {
  clearCookie('JWT_TOKEN', localStorage.getItem('JWT-TOKEN'))
  localStorage.removeItem('JWT_TOKEN')
  loginStore.logout()
  loginStore.setIsNowLogout(true)
  userStore.clear();
  router.push('/HQBlog/home')
}

const initHeatmap = () => {
  getHeatMapDate();
  option.series.data = getDataFromOriginData();
  var chartDom = document.getElementById('heatmapContainer');
  var myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
}

const getHeatMapDate = () => {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let day = currentDate.getDate().toString().padStart(2, '0');
  calendarData.startDate = (year - 1) + '-' + month + '-' + day
  calendarData.endDate = year + '-' + month + '-' + day

  option.calendar.range = [calendarData.startDate, calendarData.endDate];
}

const onBlogTitleClick = (blogId) => {
  router.push({ name: 'blogDetail', params: { id: blogId } })
}

const updateUserName = (event) => {
  axios.request({
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/user/change_username?',
    headers: {
      'token': localStorage.getItem("JWT_TOKEN"),
      'Content-Type': 'application/json'
    },
    data: {
      "uid": userStore.getUid(),
      "username": changeUsernameForm.value.newUsername,
    }
  })
    .then((response) => {
      if (response.data.code === 1) {
        snackbarInfo.value.success = true

        userBasicInfo.value.userName = changeUsernameForm.value.newUsername;
        changeUsernameForm.value.showChangeUserNameInput = false
        document.getElementById('userNameInputContainer').style.display = 'none';
      } else {
        snackbarInfo.value.success = false
      }
      snackbarInfo.value.msg = response.data.msg
      snackbarInfo.value.show = true
    })
    .catch((error) => {
      console.log(error);
    });
}

const onUserNameClick = () => {
  if (route.params.uid != userStore.getUid()) {
    return;
  }
  changeUsernameForm.value.showChangeUserNameInput = true;
  const userNameInputContainer = document.getElementById('userNameInputContainer');
  userNameInputContainer.style.display = 'block';
  const userNameInput = document.getElementById('userNameInput');

  userNameInput.focus();
  userNameInput.addEventListener('blur', () => {
    changeUsernameForm.value.showChangeUserNameInput = false
    userNameInputContainer.style.display = 'none';
  })
}

const openFilePicker = (event) => {
  if (route.params.uid != userStore.getUid()) {
    return;
  }
  event.stopPropagation(); // 阻止事件冒泡
  fileInput.value.click();
}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('uid', '1');
    formData.append('avatar', file);

    axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://8.134.215.31:2002/user/change_avatar',
      headers: {
        "Content-Type": "multipart/form-data",
        'token': localStorage.getItem("JWT_TOKEN")
      },
      data: formData
    })
      .then((response) => {
        if (response.data.code === 1) {
          userBasicInfo.value.avatar = response.data.data
          router.go(0)

          snackbarInfo.value.success = true
        } else {
          snackbarInfo.value.success = false
        }
        snackbarInfo.value.msg = response.data.msg
        snackbarInfo.value.show = true
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    // 提示用户选择文件
    alert('请选择要上传的文件');
  }
}

const getUserInfoData = async () => {
  await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/user/get_info?uid=' + route.params.uid,
    headers: {
      "token": localStorage.getItem('JWT_TOKEN')
    }
  })
    .then((response) => {
      const resData = response.data.data;

      userBasicInfo.value.userName = resData.username;
      userBasicInfo.value.email = resData.email;
      userBasicInfo.value.avatar = resData.avatar;
      userBasicInfo.value.totalLikes = resData.likes;
      userBasicInfo.value.totalViews = resData.views;
      userBasicInfo.value.totalBlogs = resData.blogs;
      changeUsernameForm.value.newUsername = resData.username;
    })
    .catch((error) => {
      console.log(error);
    });
}

const getUserTags = async () => {
  await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/user/get_tags?uid=' + route.params.uid,
    headers: {
      'token': localStorage.getItem('JWT_TOKEN')
    }
  })
    .then((response) => {
      userTagsList.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const getHeatMapOriginData = async () => {
  await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/user/get_heatmap?uid=' + route.params.uid + '&type=year',
    headers: {
      'token': localStorage.getItem('JWT_TOKEN')
    }
  })
    .then((response) => {
      userBlogCnt = response.data.data.heatmaps;
      option.title.text = '过去一年共发表博客' + response.data.data.totalCnt + '篇'
      option.visualMap.max = response.data.data.maxCnt;
    })
    .catch((error) => {
      console.log(error);
    });
}

const getMyBlogs = async () => {
  axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/blog/get_my_blogs?uid=' + route.params.uid + '&state=' + "发布",
    headers: {
      'token': localStorage.getItem('JWT_TOKEN')
    }
  })
    .then((response) => {
      userBlogList.value = response.data.data.reverse();
    })
    .catch((error) => {
      console.log(error);
    });
}

onMounted(async () => {
  await getUserInfoData()
  await getUserTags()
  await getHeatMapOriginData()
  await getMyBlogs()

  isGetData.value = true;
  initHeatmap()
})

</script>

<style scoped>
.userContainer {
  /* background-color: var(--primary-color); */
  height: auto;
  min-height: 100vh;
  width: 75vw;
  overflow: auto;
  padding: 15px;
}

.subContainer1 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
  width: 100%;
}

.userInfoContainer {
  display: flex;
  align-items: center;
  justify-content: left;
  height: 20vh;
  width: 70vw;
  padding: 15px;
  background-color: #fff;
}

.userAvatar {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
}

.userAvatarContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  margin: 0 20px;
}

.userBasicInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 20vh;
  width: 60vw;
  padding: 15px;
  height: 20vh;
}

.userNameSetting {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: auto;
  width: 100%;
}

.userName {
  font-size: 50px;
  font-weight: bold;
  color: var(--dark-background);
}

.userName:hover {
  cursor: pointer;
}

.userNameInputContainer {
  height: 5vh;
  margin: 10px 0;
  display: none;
}

.userNameInput {
  font-size: 30px;
  font-weight: bold;
  color: var(--dark-background);
  width: 20vw;
}

.userOtherInfoContainer {
  border-top: 2px solid var(--primary-color);
  padding: 5px 0;
}

.userOtherInfo {
  margin: 10px;
}

.userEmail {
  font-size: 15px;
  margin: 10px;
}

.buttonsContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.changePasswordBtn {
  margin: 6px 0;
}

.changePasswordFormContainer {
  margin: 20px 50px;
}

.logoutBtn {
  margin: 6px 0;
}

.userBlogHeatmapContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: auto;
  width: 100%;
  padding: 15px;
}


.userBlogHeatmap {
  width: 100%;
  height: auto;
  background-color: var(--dark-background);
  border-radius: 5px;
  padding: 15px;
}

.userBlogHeatmapTitle {
  color: var(--light-background);
  font-size: 20px;
  font-weight: bold;
}

.heatmapContainer {
  height: 32vh;
  width: 100%;
}

.subContainer2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.userBlogTagsContainer {
  width: 20vw;
  height: auto;
  background-color: var(--dark-background);
  border-radius: 5px;
  margin-left: 10px;
  padding: 15px;
  margin: 15px;
}

.userBlogTagsTitle {
  color: var(--light-background);
  font-size: 20px;
  font-weight: bold;
}


.userBlogListContainer {
  width: 100%;
  height: auto;
  padding: 15px;
}

.userBlogList {
  width: 100%;
  height: auto;
  min-height: 60vh;
  background-color: var(--dark-background);
  border-radius: 5px;
  padding: 15px;
}

.userBlogListTitle {
  color: var(--light-background);
  font-size: 20px;
  font-weight: bold;
}

.timelineContainer {
  margin: 20px;
}

.blogCard {
  background-color: var(--dark-background2);
  color: var(--light-background);
  width: 35vw;
  height: auto;
  border-radius: 5px;
  padding: 20px;
  margin: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 20px;
}

.blogTitleContainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 25px;
  font-weight: bold;
}

.blogTitleContainer:hover {
  cursor: pointer;
  color: var(--primary-color);
}

.blogSummary {
  font-size: 15px;
  margin: 10px 0;
}

.blogTags {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}
</style>