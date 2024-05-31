<template>
  <Loading v-if="loading"></Loading>
  <div class="blogDeatilContainer">
    <div ref="catagoryRef" class="blogCatagoryContainer boxshadow">
      <span class="blogCatagoryTitle">目录</span>
      <div class="blogCatagoryContent">

      </div>
    </div>
    <div class="blogDataContainer">
      <div class="blogInfo1Container">
        <div class="blogTitle">{{ blogData.title }}</div>
        <div>
          <div class="optionContainer">
            <div class="editBtn" v-if="uid === blogData.authorId" @click="onEditBlog">编辑</div>
            <div class="deleteBtn" v-if="uid === blogData.authorId" @click="onDeleteBlog">删除</div>
          </div>
          <div class="blogBasicInfo">
            <div class="blogBasicInfoItem">
              <i class="iconfont icon-zuozhe"></i>
              <div>&nbsp;{{ blogData.author }} </div>
            </div>
            <span>&nbsp; &nbsp;| &nbsp;&nbsp;</span>
            <div class="blogBasicInfoItem">
              <i class="iconfont icon-rili"></i>
              <div>&nbsp;{{ blogData.date }} </div>
            </div>
            <span>&nbsp; &nbsp;| &nbsp;&nbsp;</span>
            <div class="blogBasicInfoItem">
              <i class="iconfont icon-xihuan"></i>
              <div>&nbsp;{{ blogData.likes }} </div>
            </div>
            <span>&nbsp; &nbsp;| &nbsp;&nbsp;</span>
            <div class="blogBasicInfoItem">
              <i class="iconfont icon-guankan"></i>
              <div>&nbsp;{{ blogData.views }} </div>
            </div>
          </div>
        </div>
      </div>
      <div class="blogContentContainer boxshadow">
        <div v-if="!loading">
          {{ blogData.content }}
        </div>
      </div>
    </div>
  </div>
  <v-dialog v-model="showDialog" max-width="220" persistent>
    <v-card prepend-icon="mdi-map-marker" text="是否确定删除该文章？">
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn @click="onRealDeleteBlog">
          确定
        </v-btn>
        <v-btn @click="onCancelDeleteBlog">
          取消
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang='js'>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import Loading from '../components/Loading.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)

const blogId = ref < string > ('0')

const catagoryRef = ref()

const showDialog = ref(false)

const blogData = {
  title: 'Hello Vue3',
  content: '',
  author: 'HQ',
  authorId: 1,
  date: '2022-01-01',
  tags: ['Vue3', 'TypeScript'],

  category: 'Technology',
  subCategory: 'Front-end',
  subSubCategory: 'Vue3',

  likes: 100,
  views: 1000
}

const catagoryData = [
  {
    id: 1,
    title: 'Applications :',
    children: [
      { id: 2, title: 'Calendar : app' },
      { id: 3, title: 'Chrome : app' },
      { id: 4, title: 'Webstorm : app' },
    ],
  },
  {
    id: 5,
    title: 'Documents :',
    children: [
      {
        id: 6,
        title: 'vuetify :',
        children: [
          {
            id: 7,
            title: 'src :',
            children: [
              { id: 8, title: 'index : ts' },
              { id: 9, title: 'bootstrap : ts' },
            ],
          },
        ],
      },
      {
        id: 10,
        title: 'material2 :',
        children: [
          {
            id: 11,
            title: 'src :',
            children: [
              { id: 12, title: 'v-btn : ts' },
              { id: 13, title: 'v-card : ts' },
              { id: 14, title: 'v-window : ts' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 15,
    title: 'Downloads :',
    children: [
      { id: 16, title: 'October : pdf' },
      { id: 17, title: 'November : pdf' },
      { id: 18, title: 'Tutorial : html' },
    ],
  },
  {
    id: 19,
    title: 'Videos :',
    children: [
      {
        id: 20,
        title: 'Tutorials :',
        children: [
          { id: 21, title: 'Basic layouts : mp4' },
          { id: 22, title: 'Advanced techniques : mp4' },
          { id: 23, title: 'All about app : dir' },
        ],
      },
      { id: 24, title: 'Intro : mov' },
      { id: 25, title: 'Conference introduction : avi' },
    ],
  },
]

const uid = 1

const onEditBlog = () => {
  router.push({ name: 'edit', params: { id: blogId.value } })
}

const onDeleteBlog = () => {
  showDialog.value = true
}

const onRealDeleteBlog = () => {
  showDialog.value = false
  // TODO: delete blog api
  router.push('/')
}

const onCancelDeleteBlog = () => {
  showDialog.value = false
}

onMounted(() => {
  blogId.value = route.params.id;
  document.documentElement.scrollTop = 0
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      catagoryRef.value.style.top = '0'
    } else {
      catagoryRef.value.style.top = '10vh'
    }
  });
  loading.value = false
})
</script>

<style scoped>
.blogDeatilContainer {
  height: auto;
  /* min-height: 150vh; */
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
  justify-content: flex-start;
  border-radius: 5px;
  margin: 50px 20px;
  padding: 20px;
  left: 10vw;
}

.blogCatagoryTitle {
  font-size: 20px;
  font-weight: bold;
  color: var(--light-background);
}

.blogCatagoryContent {
  height: auto;
  width: 100%;
  margin: 15px 0;
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

.blogInfo1Container {
  height: auto;
  width: 100%;
  margin: 50px 10px 20px 10px;
  border-bottom: 3px solid var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.blogTitle {
  margin-left: 10px;
  font-size: 40px;
  font-weight: bold;
}

.blogBasicInfo {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 15px;
  color: #777;
  margin: 0 10px 5px 0;
}

.optionContainer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 20px;
  margin-right: 10px;
}

.editBtn {
  color: #333;
  margin: 5px 15px;
}

.editBtn:hover {
  cursor: pointer;
  text-decoration: underline;
}

.deleteBtn {
  color: red;
  margin: 5px 0 5px 15px;
}

.deleteBtn:hover {
  cursor: pointer;
  text-decoration: underline;
}

.blogBasicInfoItem {
  display: flex;
  align-items: center;
  justify-content: center;
}

.blogContentContainer {
  width: 100%;
  height: 100%;
  min-height: 150vh;
  border-radius: 5px;
  /* border: 2px solid var(--dark-background2); */
  padding: 20px;
  margin: 20px 10px 50px 10px;
  background-color: var(--dark-background);
}
</style>