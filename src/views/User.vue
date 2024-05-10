<template>
  <div class="userContainer">
    <div class="subContainer1">
      <div class="userInfoContainer">
        <div class="userAvatarContainer">
          <div class="userAvatar">
            <v-avatar :image="userBasicInfo.avatar.value" size="70" @click="openFilePicker"></v-avatar>
            <input type="file" id="avatarInput" ref="fileInput" accept="image/*" style="display: none"
              @change="handleFileChange" />
          </div>
          <div class="userEmail">{{ userBasicInfo.email }}</div>
        </div>

        <div class="userBasicInfo">
          <div class="userNameSetting">
            <div class="userNameInputContainer" id="userNameInputContainer">
              <v-text-field class="userNameInput" id="userNameInput" label="修改用户名" :placeholder="userBasicInfo.userName"
                variant="outlined" @keyup.enter="updateUserName" hint="每天只能修改一次"></v-text-field>
            </div>
            <div v-if="!showChangeUserNameInput" class="userName" @click="onUserNameClick()">{{ userBasicInfo.userName
              }}
            </div>
          </div>
          <div class="userOtherInfoContainer">
            <span class="userOtherInfo" style="margin-left: 0;"><i class="iconfont icon-xihuan" style="color:red;"></i>
              点赞量: {{
              userBasicInfo.totalLikes }}</span>
            <span class="userOtherInfo"><i class="iconfont icon-guankan" style="color:green;"></i> 阅读量: {{
              userBasicInfo.totalViews }}</span>
            <span class="userOtherInfo" style="margin-right: 0;"><i class="iconfont icon-boke" style="color:blue;"></i>
              博客数量: {{
              userBasicInfo.totalBlogs }}</span>
          </div>
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
                <span style="color: #fff;">{{ blog.date }}</span>
              </template>
              <div class="blogCard boxshadow">
                <div class="blogTitleContainer" @click="onBlogTitleClick(blog.id)">
                  <span class="blogTitle">{{ blog.title }}</span>
                </div>

                <div class="blogContent">{{ blog.content }}</div>

                <div class="blogTags">
                  <v-chip-group>
                    <v-chip v-for="tag in blog.tags" label>{{ tag }}</v-chip>
                  </v-chip-group>
                </div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </div>
      </div>

      <div class="userBlogTagsContainer boxshadow">
        <div class="userBlogTagsTitle">博客标签</div>
        <v-responsive class="overflow-y-auto">
          <v-chip-group class="mt-3" column>
            <v-chip v-for="tag in userTagsList" label style="color: var(--light-background);">
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </v-responsive>
      </div>
    </div>
  </div>
  <BackTop></BackTop>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts';
import { useRouter } from 'vue-router'
import BackTop from '../components/BackTop.vue';

const router = useRouter()

let calendarData = {
  startDate: null,
  endDate: null,
}

const showChangeUserNameInput = ref(false)

const fileInput = ref(null)

const userBasicInfo = {
  userName: 'user',
  email: 'mail@mail.com',
  avatar: ref('../../public/default.jpg'),
  totalLikes: 1000,
  totalViews: 10000,
  totalBlogs: 100,
}

const userBlogCnt = [
  {
    date: '2024-01-01',
    cnt: 4
  },
  {
    date: '2024-02-02',
    cnt: 3
  },
  {
    date: '2024-03-03',
    cnt: 2
  },
  {
    date: '2024-04-04',
    cnt: 1
  },
  {
    date: '2024-05-05',
    cnt: 10
  }
]
const blogCnt = 100;

const userTagsList = [
  "Python",
  "Java",
  "JavaScript",
  "Vue",
  "React",
  "Node.js",
  "TypeScript",
  "MySQL",
  "MongoDB",
  "Redis",
  "GraphQL"
]

const userBlogList = [
  {
    "id": 1,
    "title": "如何用Python爬取网页数据",
    "author": "shywind",
    "date": "2022-01-10",
    "content": "Python爬虫是一种自动化的程序，它可以从互联网上抓取数据并将其存储到本地。本文将介绍如何用Python爬取网页数据，并用BeautifulSoup库解析网页内容。",
    "tags": ["Python", "爬虫", "BeautifulSoup"],
  },
  {
    "id": 2,
    "title": "如何用Python爬取网页数据",
    "author": "shywind",
    "date": "2022-01-11",
    "content": "Python爬虫是一种自动化的程序，它可以从互联网上抓取数据并将其存储到本地。本文将介绍如何用Python爬取网页数据，并用BeautifulSoup库解析网页内容。",
    "tags": ["Python", "爬虫", "BeautifulSoup"],
  },
  {
    "id": 3,
    "title": "如何用Python爬取网页数据",
    "author": "shywind",
    "date": "2022-01-11",
    "content": "Python爬虫是一种自动化的程序，它可以从互联网上抓取数据并将其存储到本地。本文将介绍如何用Python爬取网页数据，并用BeautifulSoup库解析网页内容。",
    "tags": ["Python", "爬虫", "BeautifulSoup"],
  },
  {
    "id": 4,
    "title": "如何用Python爬取网页数据",
    "author": "shywind",
    "date": "2022-01-11",
    "content": "Python爬虫是一种自动化的程序，它可以从互联网上抓取数据并将其存储到本地。本文将介绍如何用Python爬取网页数据，并用BeautifulSoup库解析网页内容。",
    "tags": ["Python", "爬虫", "BeautifulSoup"],
  }
]

const option = {
  title: {
    top: 10,
    left: 'center',
    text: '过去一年共发表博客' + blogCnt + '篇',
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
    show: true,
    max: 10,
    min: 0,
    orient: 'horizontal',
    bottom: 5,
    left: 'center',
    inRange: {
      color: ['#ffffff', '#008024']
    },
    // type: 'piecewise'
  },
  calendar: {
    top: 80,
    left: 20,
    right: 20,
    cellSize: [15, 18],
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

const getVirtualData = () => {
  const start = +echarts.time.parse(calendarData.startDate);
  const end = +echarts.time.parse(calendarData.endDate);
  const dayTime = 3600 * 24 * 1000;
  const data = [];
  for (let time = start; time < end; time += dayTime) {
    data.push([
      echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
      Math.floor(Math.random() * 10)
    ]);
  }
  return data;
}

const getDate = () => {
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  let day = currentDate.getDate().toString().padStart(2, '0');
  calendarData.startDate = (year - 1) + '-' + month + '-' + day
  calendarData.endDate = year + '-' + month + '-' + day

  option.calendar.range = [calendarData.startDate, calendarData.endDate];
  option.series.data = getVirtualData();
}

const onBlogTitleClick = (blogId) => {
  router.push({ name: 'blogDetail', params: { id: blogId } })
}

const updateUserName = (event) => {
  userBasicInfo.userName = event.target.value
  showChangeUserNameInput.value = false
  document.getElementById('userNameInputContainer').style.display = 'none';
}

const onUserNameClick = () => {
  showChangeUserNameInput.value = true;
  const userNameInputContainer = document.getElementById('userNameInputContainer');
  userNameInputContainer.style.display = 'block';
  const userNameInput = document.getElementById('userNameInput');
  console.log(userNameInput);
  userNameInput.focus();
  userNameInput.addEventListener('blur', () => {
    showChangeUserNameInput.value = false
    userNameInputContainer.style.display = 'none';
  })
}

const openFilePicker = (event) => {
  event.stopPropagation(); // 阻止事件冒泡
  fileInput.value.click();
}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('avatar', file.value);

    // 发送formData到后端服务器
    // axios.post('/upload', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // }).then(response => {
    //   // 处理服务器返回的响应
    // }).catch(error => {
    //   // 处理错误
    // });
  } else {
    // 提示用户选择文件
    alert('请选择要上传的文件');
  }
}

onMounted(() => {
  getDate();
  var chartDom = document.getElementById('heatmapContainer');
  var myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
})

</script>

<style scoped lang="scss">
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
  height: 35vh;
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
  width: auto;
  height: auto;
  border-radius: 5px;
  padding: 20px;
  margin: 15px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.blogTitleContainer {
  width: 100%;
  display: flex;
  margin: 0 20px 10px 20px;
  justify-content: flex-start;
  font-size: 25px;
  font-weight: bold;
}

.blogTitleContainer:hover {
  cursor: pointer;
  color: var(--primary-color);
}

.blogContent {
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