<template>
  <v-snackbar v-model="isNowLogin" :timeout="2000" location="top" color="green-accent-4">
    <div style="justify-content: center; display: flex; align-items: center; color:aliceblue; font-size: 16px;">
      登录成功！
    </div>
  </v-snackbar>
  <v-snackbar v-model="isNowLogout" :timeout="2000" location="top" color="green-accent-4">
    <div style="justify-content: center; display: flex; align-items: center; color:aliceblue; font-size: 16px;">
      已退出登录！
    </div>
  </v-snackbar>
  <v-snackbar v-model="snackBar.show" :timeout="2000" location="top" :color="snackBar.color">
    <div style="justify-content: center; display: flex; align-items: center; color:aliceblue; font-size: 16px;">
      {{ snackBar.content }}
    </div>
  </v-snackbar>
  <loading v-if="isLoading"></loading>
  <div class="blogContainer">
    <div class="allTitleContainer"><span class="allTitle">所有博客</span></div>
    <div v-for="blog in blogs" class="blogCard boxshadow">
      <div class="blogTitleContainer" @click="onBlogTitleClick(blog.id)">
        <span class="blogTitle">{{ blog.title }}</span>
      </div>
      <div class="blogInfo">
        <div class="blogSubInfo">
          <div class="blogAuthor">
            <i class="iconfont icon-zuozhe"></i>
            <span>作者: </span>
            <span class="blogAuthorName" @click="onAuthorClick(blog.uid)">{{ blog.author }}</span>
          </div>
          <div class="blogDate">
            <i class="iconfont icon-rili"></i>
            <span>发布于: </span>
            <span>{{ blog.date }}</span>&nbsp;
            <span>{{ blog.time }}</span>
          </div>
        </div>
      </div>

      <div class="blogContent">{{ blog.summary }}</div>

      <div class="blogTags">
        <i class="iconfont icon-biaoqian"></i>
        <span>标签：</span>
        <v-chip-group>
          <v-chip v-for="tag in blog.tags" label>
            <router-link :to="{ name: 'tags', query: { tag: tag } }">{{ tag }}</router-link>
          </v-chip>
        </v-chip-group>
      </div>
    </div>
  </div>
  <div class="funContainer">
    <div v-if="loginStore.getIsLogin()" class="heatmapContainer boxshadow" ref="heatmapRef">
      <div id="heatmap" class="heatmap"></div>
    </div>
    <div class="rankContainer boxshadow">
      <div class="rankTitle">推荐作者</div>
      <div class="rank" v-for="rankInfo in ranksInfo">
        <v-divider></v-divider>
        <div class="rankUsername" @click="onUsernameClick(rankInfo.uid)">{{ rankInfo.username }}</div>
        <div class="rankInfosContainer">
          <div class="countContainer">
            <div>{{ rankInfo.blogs }}</div>
            &nbsp;
            <i class="iconfont icon-boke" style="color:wheat;"></i>
          </div>
          <div class="watchContainer">
            <div>{{ rankInfo.views }}</div>
            &nbsp;
            <i class="iconfont icon-guankan" style="color:wheat;"></i>
          </div>
          <div class="likeContainer">
            <div>{{ rankInfo.likes }}</div>
            &nbsp;
            <i class="iconfont icon-xihuan" style="color:red;"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
  <BackTop></BackTop>
</template>

<script setup lang='js'>
import BackTop from '../components/BackTop.vue';
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/store/LoginStore';
import { useUserStore } from '@/store/UserStore';
import { useSnackBarStore } from '@/store/SnackBarStore';
import Loading from '../components/Loading.vue'
import * as echarts from 'echarts';
import axios from 'axios'

const router = useRouter()
const loginStore = useLoginStore()
const userStore = useUserStore()
const snackBarStore = useSnackBarStore()

const { isNowLogin, isNowLogout } = storeToRefs(loginStore)

const heatmapRef = ref()
const isLoading = ref(true)

const snackBar = ref({
  show: false,
  content: '',
  color: ''
})

let calendarData = {
  startDate: null,
  endDate: null,
  monthBlogCnt: 10,
}

const ranksInfo = ref([])

const blogs = ref([])

const option = {
  title: {
    top: 20,
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
  visualMap: {
    show: false,
    max: 0,
    min: 0,
    orient: 'horizontal',
    left: 'center',
    inRange: {
      color: ['#ffffff', '#008024']
    },
    // type: 'piecewise'
  },
  calendar: {
    orient: 'vertical',
    top: 100,
    left: 20,
    right: 20,
    cellSize: [25, 25],
    range: null,
    itemStyle: {
      borderWidth: 0.5,
    },
    yearLabel: { show: false },
    monthLabel: { show: false },
    // monthLabel: {
    //   color: "#fff",
    // },
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

const onBlogTitleClick = (blogId) => {
  router.push({ name: 'blogDetail', params: { id: blogId } })
}

const onAuthorClick = (uid) => {
  router.push({ name: 'user', params: { uid: uid } })
}

const onUsernameClick = (uid) => {
  router.push({ name: 'user', params: { uid: uid } })
}

const initHeatmap = async () => {
  getDate()
  await getHeatMapOriginData();
  let chartDom = document.getElementById('heatmap');
  let myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
}

const getDate = () => {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let day = (currentDate.getDate() + 1).toString().padStart(2, '0');

  calendarData.startDate = year + '-' + month + '-01'
  calendarData.endDate = year + '-' + month + '-' + day

  option.calendar.range = [year + '-' + month];
}

const getHeatMapOriginData = async () => {
  await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/user/heatmap?uid=' + userStore.getUid() + '&type=month',
    headers: {
      'token': localStorage.getItem('JWT_TOKEN')
    }
  })
    .then((response) => {
      const userBlogCnt = response.data.data.heatmaps;
      option.series.data = userBlogCnt.map((item) => {
        return [item.date, item.cnt];
      })
      option.title.text = '本月共发表博客' + response.data.data.totalCnt + '篇'
      option.visualMap.max = response.data.data.maxCnt;
    })
    .catch((error) => {
      console.log(error);
    });
}

const getAllBlogs = async () => {
  await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/blog/all-blogs',
    headers: {
      'token': localStorage.getItem('JWT_TOKEN')
    }
  })
    .then((response) => {
      blogs.value = response.data.data.reverse();
    })
    .catch((error) => {
      console.log(error);
    })
}

const getRanks = async () => {
  axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/global/ranks',
    headers: {
      'token': localStorage.getItem('JWT_TOKEN')
    }
  })
    .then((response) => {
      ranksInfo.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    })
}

onMounted(async () => {
  if (snackBarStore.getShow()) {
    snackBar.value.content = snackBarStore.getMsg();
    snackBar.value.color = snackBarStore.getColor();
    snackBar.value.show = true;
    snackBarStore.setShow(false);
  }

  await getAllBlogs()
  await getRanks()
  if (loginStore.getIsLogin()) {
    await initHeatmap()
  }
  isLoading.value = false;
});
</script>

<style scoped>
.blogContainer {
  position: relative;
  left: 0;
  /* background-color: var(--primary-color); */
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 50px 0;
  min-height: 100vh;
  min-width: 40vw;
}

.allTitleContainer {
  margin-bottom: 40px;
  width: 100%;
  /* height: 3vh; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.allTitle {
  margin: 0px 10px;
  font-size: 30px;
  font-weight: bold;
  border-bottom: 4px solid var(--primary-color);
}

.blogCard {
  background-color: var(--dark-background2);
  color: var(--light-background);
  width: 45vw;
  height: auto;
  border-radius: 5px;
  min-height: 40vh;
  padding: 30px;
  margin: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 20px;
}

.blogTitleContainer {
  width: 100%;
  display: flex;
  margin: 0 30px 10px 0;
  justify-content: flex-start;
  font-size: 40px;
  font-weight: bold;
}

.blogTitleContainer:hover {
  cursor: pointer;
  color: var(--primary-color);
}

.blogInfo {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  width: 100%;
}

.blogSubInfo {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.blogAuthor {
  margin: 0 20px 0 5px;
}

.blogAuthorName {
  font-weight: bold;
}

.blogAuthorName:hover {
  cursor: pointer;
  color: var(--primary-color);
}

.blogDate {
  margin: 0 20px;
}


.blogWatch {
  margin: 0 20px;
}


.blogLikes {
  margin: 0 20px;
}

.blogContent {
  margin: 25px 0;
}

.blogTags {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.funContainer {
  width: 20vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 8vh 30px;
}

.heatmapContainer {
  width: 20vw;
  height: 40vh;
  margin: 20px;
  border-radius: 5px;
  background-color: var(--dark-background);
}

.heatmap {
  width: 100%;
  height: 100%;
}

.rankContainer {
  margin: 20px;
  width: 100%;
  /* height: 50vh; */
  background-color: var(--dark-background);
  color: var(--light-background);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 15px;
  border-radius: 5px;
}

.rankTitle {
  font-size: 25px;
  font-weight: bold;
  border-bottom: 3px solid var(--primary-color);
}

.rank {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px;
  margin-left: 0;
  font-size: 20px;
  border-bottom: 2px solid white;
  padding: 3px;
}

.rankUsername:hover {
  cursor: pointer;
  color: var(--primary-color);
}

.rankInfosContainer {
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.countContainer {
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.watchContainer {
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.likeContainer {
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>