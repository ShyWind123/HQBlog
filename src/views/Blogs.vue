<template>
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
            <span>{{ blog.author }}</span>
          </div>
          <div class="blogDate">
            <i class="iconfont icon-rili"></i>
            <span>发布于: </span>
            <span>{{ blog.date }}</span>
          </div>
        </div>
      </div>

      <div class="blogContent">{{ blog.content }}</div>

      <div class="blogTags">
        <i class="iconfont icon-biaoqian"></i>
        <span>标签：</span>
        <v-chip-group>
          <v-chip v-for="tag in blog.tags" label>{{ tag }}</v-chip>
        </v-chip-group>
      </div>
    </div>
  </div>
  <div class="heatmapContainer boxshadow" ref="heatmapRef">
    <div id="heatmap" class="heatmap"></div>
  </div>
  <BackTop></BackTop>
</template>

<script setup lang='ts'>
import BackTop from '../components/BackTop.vue';
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts';

const router = useRouter()

const backTopRef = ref()
const heatmapRef = ref()

let calendarData = {
  startDate: null,
  endDate: null,
  monthBlogCnt: 10,
}

const blogs = [
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
    top: 20,
    left: 'center',
    text: '本月共发表博客' + calendarData.monthBlogCnt + '篇',
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
    bottom: 15,
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

const initHeatmap = () => {
  getDate()
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
  option.series.data = getVirtualData();
}

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

onMounted(() => {
  initHeatmap()
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      heatmapRef.value.style.top = '5vh'
    } else {
      heatmapRef.value.style.top = '27vh'
    }
  });
});
</script>

<style scoped>
.blogContainer {
  position: relative;
  left: 0;
  /* background-color: var(--primary-color); */
  height: auto;
  width: 70vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 50px 0;
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
  padding: 40px;
  margin: 30px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.blogTitleContainer {
  width: 100%;
  display: flex;
  margin: 0 30px 10px 30px;
  justify-content: flex-start;
  font-size: 30px;
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
  margin: 0 20px;
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

.heatmapContainer {
  height: 300px;
  width: 250px;
  margin: 20px;
  position: fixed;
  top: 27vh;
  right: 15vw;
  border-radius: 5px;
  background-color: var(--dark-background);
}

.heatmap {
  width: 100%;
  height: 100%;
}
</style>