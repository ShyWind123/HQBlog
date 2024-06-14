<template>
  <Loading v-if="isLoading"></Loading>
  <div v-else class="blogDeatilContainer">
    <div ref="catagoryRef" class="blogCatagoryContainer boxshadow">
      <span class="blogCatagoryTitle">目录</span>
      <div class="blogCatagoryContent">
        <div id="outline"></div>
      </div>
    </div>
    <div class="blogDataContainer">
      <div class="blogInfo1Container">
        <div class="blogTitleContainer">
          <div class="blogTitle">{{ viewBlogStore.getTitle() }}</div>
          <div class="likeBtn" :class="{ 'like': isLike }" @click="likeBlog()">
            <i class="iconfont icon-dianzan"></i>
          </div>
        </div>
        <div class="infoopContainer">
          <div class="blogBasicInfo" :key="blogBasicInfoKey">
            <div class="blogBasicInfoItem" v-for="(info, index) in blogBasicInfos">
              <span v-if="index != 0">&nbsp; &nbsp;| &nbsp;&nbsp;</span>
              <i class="iconfont" :class="info.icon"></i>
              <div>&nbsp;{{ info.value }} </div>
            </div>

            <!-- <div class="blogBasicInfoItem">
              <i class="iconfont"></i>
              <div>&nbsp;{{ viewBlogStore.getDate() }} </div>
            </div>
            <span>&nbsp; &nbsp;| &nbsp;&nbsp;</span>
            <div class="blogBasicInfoItem">
              <i class="iconfont icon-xihuan"></i>
              <div>&nbsp;{{ viewBlogStore.getLikes() }} </div>
            </div>
            <span>&nbsp; &nbsp;| &nbsp;&nbsp;</span>
            <div class="blogBasicInfoItem">
              <i class="iconfont icon-guankan"></i>
              <div>&nbsp;{{ viewBlogStore.getViews() }} </div>
            </div> -->
          </div>

          <div class="optionContainer">
            <div class="editBtn" v-if="userStore.getUid() === viewBlogStore.getUid()" @click="onEditBlog">编辑</div>
            <div class="deleteBtn" v-if="userStore.getUid() === viewBlogStore.getUid()" @click="onDeleteBlog">删除</div>
          </div>
        </div>
      </div>
      <div class="blogContentContainer boxshadow">
        <!-- {{ viewBlogStore.getContent() }} -->
        <div id="content"></div>
      </div>
    </div>
  </div>

  <v-dialog v-model="showDialog" max-width="220" persistent>
    <v-card text="是否确定删除该文章？">
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
import { useUserStore } from '../store/UserStore';
import { useViewBlogStore } from '../store/ViewBlogStore'
import Vditor from 'vditor';
import VditorPreview from 'vditor/dist/method.min'
import Loading from '../components/Loading.vue'

const route = useRoute()
const router = useRouter()
const viewBlogStore = useViewBlogStore()
const userStore = useUserStore()

const isLoading = ref(true)

const catagoryRef = ref()
const blogBasicInfoKey = ref(0)
const showDialog = ref(false)

const isLike = ref(false)

let blogBasicInfos = []

const onEditBlog = () => {
  router.push({ name: 'create', params: { id: viewBlogStore.getId() } })
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

const likeBlog = () => {
  isLike.value = !isLike.value
  // TODO: like blog api
}

onMounted(async () => {
  const id = route.params.id;
  await viewBlogStore.init(id)

  document.documentElement.scrollTop = 0
  isLoading.value = false

  // VditorPreview.mermaidRender(viewBlogStore.getContent())
  setTimeout(() => {
    Vditor.preview(document.getElementById('content'), viewBlogStore.getContent(), {
      cdn: 'https://unpkg.com/vditor@3.10.4',
      mode: 'light',
      anchor: 2,
      after() {
        Vditor.outlineRender(document.getElementById('content'), document.getElementById('outline'))
        document.getElementById('outline').style.display = 'block'
      }
    })

    blogBasicInfos = [
      {
        "name": "作者",
        "icon": "icon-zuozhe",
        "value": viewBlogStore.getAuthor()
      },
      {
        "name": "日期",
        "icon": "icon-rili",
        "value": viewBlogStore.getDate()
      },
      {
        "name": "观看",
        "icon": "icon-guankan",
        "value": viewBlogStore.getViews()
      },
      {
        "name": "喜欢",
        "icon": "icon-xihuan",
        "value": viewBlogStore.getLikes()
      },
    ]
    blogBasicInfoKey.value++;
  }, 500)

  // vditor.value = new Vditor('vditor2', {
  //   "mode": "ir",
  //   "icon": "material",
  //   "minHeight": 800,
  //   "width": "100%",
  //   "counter": {
  //     "enable": true
  //   },
  //   "outline": {
  //     "enable": true,
  //     "position": "left"
  //   },
  //   // "width": screen.width * 0.96,
  //   after: () => {
  //     if (viewBlogStore.getContent() != null) {
  //       vditor.value.setValue(viewBlogStore.getContent())
  //     }
  //     vditor.value.setTheme('dark', 'dark')
  //   }
  // });
})
</script>

<style scoped>
.blogDeatilContainer {
  height: auto;
  /* min-height: 150vh; */
  overflow: auto;
  width: 85vw;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.blogCatagoryContainer {
  width: 20vw;
  height: auto;
  background-color: var(--light-background);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: 5px;
  margin: 50px 20px;
  left: 10vw;
  padding: 20px 0;
}

.blogCatagoryTitle {
  font-size: 20px;
  font-weight: bold;
  margin: 5px 20px;
  color: var(--dark-background);
}

.blogCatagoryContent {
  height: auto;
  width: 100%;
}

.blogDataContainer {
  width: 65vw;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.blogTitleContainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid var(--primary-color);
}

.blogTitle {
  font-size: 40px;
  font-weight: bold;
  width: 100%;
}

.likeBtn {
  scale: 1.5;
  margin: 0 10px;
}

.likeBtn:hover {
  cursor: pointer;
  scale: 1.6;
}

.like {
  color: var(--primary-color);
}

.infoopContainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding: 20px;
  border-radius: 5px;
  /* color: var(--light-background); */
  /* border: 2px solid var(--dark-background2); */
  padding: 20px;
  margin: 20px 10px 50px 10px;
  background-color: var(--light-background);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
</style>