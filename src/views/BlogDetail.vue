<template>
  <div class="blogDeatilContainer">
    <div class="blogCatagoryContainer boxshadow">

    </div>
    <div class="blogDataContainer">
      <div class="blogInfoContainer">
        <h1 class="blogTitle">{{ blogData.title }}</h1>
      </div>
      <div class="blogContentContainer boxshadow"></div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router';
const route = useRoute()

const blogId = ref<string>('0')

const blogData = {
  title: 'Hello Vue3',
  content: 'This is a blog content',
  author: 'HQ',
  date: '2022-01-01',
  tags: ['Vue3', 'TypeScript'],

  category: 'Technology',
  subCategory: 'Front-end',
  subSubCategory: 'Vue3',

  likes: 100,
  views: 1000
}

onMounted(() => {
  blogId.value = route.params.id as string;
  document.documentElement.scrollTop = 0
})
</script>

<style scoped>
.blogDeatilContainer {
  height: auto;
  min-height: 100vh;
  overflow: auto;
  width: 72vw;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.blogCatagoryContainer {
  width: 15vw;
  height: auto;
  min-height: 50vh;
  background-color: var(--dark-background2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 5px;
  margin: 50px 20px;
  padding: 20px;
}

.blogDataContainer {
  width: 55vw;
  height: auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
}

.blogInfoContainer {
  height: auto;
  width: 100%;
  margin: 50px 10px 20px 10px;
}

.blogContentContainer {
  width: 100%;
  height: auto;
  min-height: 80vh;
  border-radius: 5px;
  /* border: 2px solid var(--dark-background2); */
  padding: 20px;
  margin: 20px 10px 50px 10px;
}
</style>