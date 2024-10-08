<template>
  <div class="allContainer">
    <div class="searchResultContainer">
      <div class="seatchTitleContainer">
        查询&nbsp;<span style="color: var(--primary-color)">{{ searchContent }}</span>&nbsp;的结果为:
      </div>
      <div v-if="blogs.length > 0" class="searchBlogsContainer">
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
      <div v-else class="noSearchBlogsContainer">
        没有相关内容的博客！
      </div>
    </div>
  </div>
</template>

<script setup lang='js'>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter()

const blogs = ref([])
const searchContent = ref('')

const onBlogTitleClick = (id) => {
  router.push({ 'name': 'create', params: { id: id } })
}


const searchBlogs = async () => {
  await axios.request({
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://8.134.215.31:2002/global/search-by-text?text=${searchContent.value}`,
    headers: {
      'token': localStorage.getItem('JWT_TOKEN')
    }
  })
    .then((response) => {
      blogs.value = response.data.data.reverse()
    })
    .catch((error) => {
      console.log(error);
    });
}

watch(
  () => route.params,
  (newParams, oldParams) => {
    searchContent.value = newParams.searchContent
  }
);

onMounted(() => {
  searchContent.value = route.params.searchContent
  searchBlogs();

})


</script>

<style scoped>
.allContainer {
  /* background-color: var(--primary-color); */
  min-height: 100vh;
  overflow: auto;
}

.searchResultContainer {
  width: 60vw;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 50px;
}

.seatchTitleContainer {
  font-size: 25px;
  font-weight: bold;
  border-bottom: 3px solid var(--primary-color);
}

.searchBlogsContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
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
  min-height: 30vh;
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