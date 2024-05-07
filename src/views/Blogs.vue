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
  <BackTop></BackTop>
</template>

<script setup lang='ts'>
import BackTop from '../components/BackTop.vue';
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const backTopRef = ref()

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

const onBlogTitleClick = (blogId) => {
  router.push({ name: 'blogDetail', params: { id: blogId } })
}

onMounted(() => {

});
</script>

<style scoped>
.blogContainer {
  /* background-color: var(--primary-color); */
  height: auto;
  width: 65vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px;
}

.allTitleContainer {
  margin-bottom: 80px;
  width: 100%;
}

.allTitle {
  position: absolute;
  left: 25vw;
  font-size: 30px;
  font-weight: bold;
  border-bottom: 4px solid var(--primary-color);
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
</style>