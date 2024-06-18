<template>
  <div class="allContainer">
    <div class="chartContainer">
      <div id="chart"></div>
    </div>
    <div class="tagTitleContainer" :key="tagKey">
      <span>现在共有<span style="color:var(--primary-color)">{{ seriesData.length }}</span>个标签</span>
    </div>
    <div class="tagsContainer">
      <div v-for="(tag, idx) in seriesData"
        :style="{ opacity: getOpacity(tag.value, maxValue, 0), scale: getScale(tag.value, maxValue, 0) }" :key="tag.id"
        class="tagContainer" @click="toggleTagActive(tag, idx)">
        {{ tag.name }}
      </div>
    </div>
    <div v-if="activeTags.length > 0" class="searchTagContainer">
      <div class="searchTagTitleContainer">包含&nbsp;
        <span style="color:var(--primary-color)" v-for="(activeTag, idx) in activeTags">
          {{ activeTag.name }}
          <span v-if="idx < activeTags.length - 1">、</span>
        </span>
        &nbsp;标签的博客：
      </div>
      <div class="searchBlogsContainer" v-if="searchBlogs.length > 0">
        <div v-for="blog in searchBlogs" class="blogCard boxshadow">
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
              <v-chip v-for="tag in blog.tags" label>{{ tag }}</v-chip>
            </v-chip-group>
          </div>
        </div>
      </div>
      <div v-else class="noSearchBlogsContainer">
        没有含有以上类型的博客！
      </div>
    </div>
  </div>
</template>

<script setup lang='js'>
import { ref, reactive, onMounted, watch } from 'vue'
import * as echarts from 'echarts';
import axios from 'axios'
import { useRouter } from 'vue-router'

let seriesData = [], legendData = [];
const activeTags = ref([]);
let maxValue = 0;
const searchBlogs = ref([]);

const router = useRouter()
const tagKey = ref(0)

let option = {
  title: {
    text: '标签统计',
    // subtext: '纯属虚构',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} : {b} <br/>{c} ({d}%)'
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: null,
  },
  series: [
    {
      name: '标签',
      type: 'pie',
      radius: '55%',
      center: ['50%', '50%'],
      data: null,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};


const onBlogTitleClick = (blogId) => {
  router.push({ name: 'blogDetail', params: { id: blogId } })
}

const getActiveTagIdx = (tag) => {
  let res = -1;
  activeTags.value.forEach((activeTag, idx) => {
    if (activeTag.id === tag.id) {
      res = idx;
    }
  })
  return res;
}

const getTagIdx = (tag) => {
  let res = -1;
  seriesData.forEach((allTag, idx) => {
    if (allTag.id === tag.id) {
      res = idx;
    }
  })
  return res;
}

const toggleTagActive = (tag, idx) => {
  const tagIdx = getActiveTagIdx(tag);
  if (tagIdx != -1) {
    activeTags.value.splice(tagIdx, 1);
  } else {
    activeTags.value.push(tag);
  }
  toggleCssActive(idx)
}

const toggleCssActive = (idx) => {
  document.querySelectorAll('.tagContainer').forEach((tag, index) => {
    if (index === idx) {
      tag.classList.toggle('tagActive');
    }
  })
}

const onChartClick = (params) => {
  const tag = params.data;
  toggleTagActive(tag, getTagIdx(tag));
}

const getOpacity = (value, max, min) => {
  return (value - min) / (max - min) + 0.4;
}
const getScale = (value, max, min) => {
  return (value - min) / (max - min) * 0.4 + 1;
}

watch(activeTags.value, (newTags, oldTags) => {
  if (newTags.length > 0) {
    let urlPath = 'http://8.134.215.31:2002/global/search_blogs_by_tags'
    for (let i = 0; i < newTags.length; i++) {
      urlPath += (i == 0 ? "?" : "&") + 'tags=' + newTags[i].name;
    }
    console.log(urlPath);

    axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: urlPath,
      headers: {
        'token': localStorage.getItem('JWT_TOKEN')
      },
    })
      .then((response) => {
        searchBlogs.value = response.data.data.reverse();
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

onMounted(async () => {
  await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://8.134.215.31:2002/global/get_tags',
    headers: {
      'token': localStorage.getItem('token')
    }
  })
    .then((response) => {
      const res = response.data.data;
      for (let i = 0; i < res.length; i++) {
        seriesData.push({
          "id": res[i].id,
          "name": res[i].name,
          "value": res[i].cnt
        })
        legendData.push(res[i].name);
        maxValue = Math.max(maxValue, res[i].cnt);
      }
      seriesData = shuffleArray(seriesData);
      option.series[0].data = seriesData;
      option.legend.data = legendData;
    })
    .catch((error) => {
      console.log(error);
    });

  let chartDom = document.getElementById('chart');
  let myChart = echarts.init(chartDom);
  option && myChart.setOption(option);

  myChart.off('click'); //关闭事件
  myChart.on('click', onChartClick);//点击事件

  tagKey.value++;
})

</script>

<style scoped>
.allContainer {
  /* background-color: var(--primary-color); */
  /* height: 800px; */
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 50px;
}

.chartContainer {
  width: 60vw;
  height: 70vh;
  margin: 20px;
}

#chart {
  width: 100%;
  height: 100%;
}

.tagTitleContainer {
  font-size: 32px;
  font-weight: bold;
  margin: 0 40px;
  border-bottom: 3px solid var(--primary-color);
}

.tagsContainer {
  width: 60vw;
  /* height: 70vh; */
  margin: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: row wrap;
}

.tagContainer {
  width: auto;
  font-size: 25px;
  border-bottom: 2px solid #000;
  margin: 20px 40px;
}

.tagContainer:hover {
  cursor: pointer;
  color: var(--primary-color);
  border-bottom: 3px solid var(--primary-color);
}

.searchTagContainer {
  margin: 40px;
}

.searchTagTitleContainer {
  font-size: 25px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-flow: row wrap
}

.tagActive {
  color: var(--primary-color);
  border-bottom: 3px solid var(--primary-color);
}

.tagActive:hover {
  cursor: pointer;
  color: #000;
  border-bottom: 3px solid #000;
}

.searchBlogsContainer {
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.noSearchBlogsContainer {
  font-size: 20px;
  width: 100%;
  height: 5vh;
  margin: 10px;
}


.blogCard {
  background-color: var(--dark-background2);
  color: var(--light-background);
  width: 50vw;
  height: auto;
  border-radius: 5px;
  min-height: 40vh;
  padding: 40px;
  margin: 30px 10px;
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
  font-size: 35px;
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
</style>