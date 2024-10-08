<template>
  <v-app>
    <div class="layout-container">
      <div class="layout-header">
        <div class="top-left animate__animated animate__bounce">
          <router-link to="/HQBlog/home">
            <div class="logo-container">
              <!-- <span class="logo-content" style="color: var(--primary-color);">HQ</span>
              <span class="logo-content" style="color: var(--light-background);">Blog</span> -->
              <span class="logo-content" style="color: var(--primary-color);">风软</span>
              <span class="logo-content" style="color: var(--light-background);">阁</span>
            </div>
          </router-link>
        </div>

        <div class="top-right">
          <div v-for="link in gotoLinks" class="top-right-item-container">
            <router-link :to="getPath(link)">
              <div class="top-right-icon-container">
                <i class="iconfont top-right-icon" :class="link.icon"></i>
              </div>
              <span>{{ link.name }}</span>
            </router-link>
          </div>

          <div class="top-right-item-container" @click="clickSearchIcon" ref="searchBtn">
            <a>
              <div class="top-right-icon-container">
                <i class="iconfont icon-sousuo top-right-icon"></i>
              </div>
              <span>搜索</span>
            </a>
          </div>

        </div>
        <div class="search-box-container" ref="searchBox">
          <transition name="fade" enter-active-class="animate__animated animate__zoomIn"
            leave-active-class="animate__animated animate__lightSpeedOutRight">
            <v-text-field v-model="searchContent" class="search-box-input" ref="searchBoxInput" @blur="hideSearchBox"
              @keyup.enter="onSearch" @input="changeSearchValue" spellcheck='false' variant="outlined" label="搜索"
              v-if="isSearchBoxShow">
              <template v-slot:append-inner>
                <div class="top-right-icon-container" style="color: #fff;cursor: pointer;" @click="onSearch">
                  <i class="iconfont icon-sousuo top-right-icon" style=" font-size: 30px;"></i>
                </div>
              </template>
            </v-text-field>
          </transition>
        </div>
      </div>

      <div class="layout-content">
        <router-view :key="routerViewKey"></router-view>
      </div>

      <v-footer>
        <div class="px-4 py-2 bg-black text-center w-100">
          <strong class="icpContainer" @click="openICP()">鄂ICP备2024075578号</strong>
          <!-- <strong style="margin:0 20px;">HQBlog</strong> -->
        </div>
      </v-footer>
    </div>
  </v-app>
</template>

<script setup lang='js'>
import { ref, reactive, nextTick, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/store/LoginStore'
import { useUserStore } from '@/store/UserStore'

const router = useRouter()

const loginStore = useLoginStore()
const { isLogin } = storeToRefs(loginStore)

const userStore = useUserStore()

const searchBtn = ref(0)
const searchBox = ref(0)
const searchBoxInput = ref(0)

const isSearchBoxShow = ref(false)
const searchContent = ref('')

const routerViewKey = ref(0)

const gotoLinks = [
  {
    name: '首页',
    path: '/HQBlog/home',
    icon: 'icon-shouye-zhihui'
  },
  {
    name: '写博客',
    path: '/HQBlog/create/0',
    icon: 'icon-chuangjian'
  },
  {
    name: '标签',
    path: '/HQBlog/tags',
    icon: 'icon-biaoqian'
  },
  {
    name: '草稿',
    path: '/HQBlog/drafts',
    icon: 'icon-guidang'
  },
  {
    name: '关于',
    path: '/HQBlog/about',
    icon: 'icon-guanyu'
  },
  {
    name: '用户',
    path: `/HQBlog/user/${userStore.getUid()}`,
    icon: 'icon-yonghu'
  }]

const getPath = (link) => {
  if (link.name === '首页' || link.name === '标签' || link.name === '关于') {
    return link.path;
  }
  else {
    return isLogin.value ? link.path : '/HQBlog/login';
  }
}

const clickSearchIcon = () => {
  if (!isSearchBoxShow.value) {
    showSearchBox()
  } else {
    onSearch()
  }
}
const showSearchBox = () => {
  isSearchBoxShow.value = true
  searchBtn.value.style.visibility = "hidden";
  nextTick(() => {
    searchBoxInput.value.focus()
  })
}
const hideSearchBox = () => {
  isSearchBoxShow.value = false
  setTimeout(() => {
    searchBtn.value.style.visibility = "visible";
  }, 400)
}
const onSearch = () => {
  if (searchContent.value != '') {
    router.push({ name: 'search', params: { searchContent: searchContent.value } })
    routerViewKey.value++
  }
}
const changeSearchValue = (e) => {
  searchContent.value = e.target.value
}

const getCookie = (user) => {
  var cookieArr = document.cookie.split(';');
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split('=');
    if (user == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

const checkCookie = () => {
  const user = getCookie('JWT_TOKEN')
  if (user != null) {
    loginStore.login()
    routerViewKey.value++
  }
}

const openICP = () => {
  window.open('https://beian.miit.gov.cn', '_blank')
}


onMounted(() => {
  checkCookie()
})
</script>

<style scoped>
.layout-container {
  height: auto;
  width: 100vw;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.layout-header {
  display: flex;
  height: 10vh;
  background-color: var(--dark-background);
  width: 100vw;
  position: relative;
  margin: 0;
  justify-content: center;
  align-items: center;
}

.logo-container {
  /* margin: auto;
  margin-left: 100px;
  padding-left: 10px;
  padding-right: 10px; */
  /* display: flex;
  justify-content: center;
  border-radius: 5px; */
  display: flex;
  height: 100%;
}

.logo-content {
  margin: auto;
  font-family: 'STHupo';
  color: var(--light-background);
  font-size: 35px;
}

.top-left {
  position: absolute;
  left: 15vw;
  display: flex;
  height: 100%;
}

.top-right {
  position: absolute;
  right: 25vw;
  display: flex;
  height: 100%;
  color: var(--light-background);
  font-size: 10px;
  transform: translate(-5vw, 5px);
}

.top-right-item-container {
  margin: auto 1.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.top-right-item-container:hover {
  cursor: pointer;
  color: var(--primary-color);
}

.search-box-container {
  position: absolute;
  /* transform: translateY(-50%); */
  top: 12px;
  right: 1vw;
  display: flex;
  justify-content: center;
  height: 30px;
  border-radius: 5px;
  margin: auto;
  margin-right: 0;
}

.search-box-input {
  height: inherit;
  width: 40vw;
  padding: 5px;
  border: none;
  border-radius: 5px;
  outline: none;
  color: var(--light-background);
  background-color: var(--dark-background);
  font-size: 10px;
  transform: scale(0.6);
}

.search-box-input::placeholder {
  color: var(--light-background);
}

.search-box-input::selection {
  background-color: var(--light-background);
}

.top-right-icon-container {
  display: flex;
  justify-content: center;
  margin: auto 5px;
}

.top-right-icon {
  font-size: 10px;
  margin: auto;
}

.layout-content {
  background-color: var(--light-background);
  height: auto;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.v-footer {
  margin: 0;
  padding: 0;
}

.icpContainer {
  margin: 0 20px;
}

.icpContainer:hover {
  cursor: pointer;
  color: var(--primary-color);
}
</style>