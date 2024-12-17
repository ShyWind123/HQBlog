<template>
  <Loading v-if="isLoading"></Loading>
  <div class="blogDeatilContainer">
    <div class="blogDataContainer">
      <div class="blogInfo1Container">
        <div class="blogTitleContainer">
          <div class="blogTitle">{{ viewBlogStore.getTitle() }}</div>
          <div v-if="loginStore.isLogin" class="likeBtn" :class="{ 'like': viewBlogStore.getILike() }"
            @click="toggleLike()">
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

          <!-- 移动端的标签 -->
          <div class="userBlogTagsContainer2">
            <v-responsive class="overflow-y-auto">
              <v-chip-group column>
                <v-chip v-for="tag in viewBlogStore.getTags()" class="chip" label
                  style="color: var(--light-background);">
                  <router-link :to="{ name: 'tags', query: { tag: tag } }">{{ tag }}</router-link>
                </v-chip>
              </v-chip-group>
            </v-responsive>
          </div>

          <div class="optionContainer" v-if="loginStore.isLogin">
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

    <div class="catagoryTagsContainer">
      <div class="userBlogTagsContainer1 boxshadow">
        <div class="userBlogTagsTitle">博客标签</div>
        <v-responsive class="overflow-y-auto">
          <v-chip-group class="mt-3" column>
            <v-chip v-for="tag in viewBlogStore.getTags()" class="chip" label style="color: var(--light-background);">
              <router-link :to="{ name: 'tags', query: { tag: tag } }">{{ tag }}</router-link>
            </v-chip>
          </v-chip-group>
        </v-responsive>
      </div>

      <div ref="catagoryRef" class="blogCatagoryContainer boxshadow">
        <span class="blogCatagoryTitle">目录</span>
        <div class="blogCatagoryContent">
          <div id="outline"></div>
        </div>
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
  <BackTop></BackTop>
</template>

<script setup lang='js'>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../store/UserStore';
import { useLoginStore } from '../store/LoginStore'
import { useViewBlogStore } from '../store/ViewBlogStore'
import { useCreateBlogStore } from '../store/CreateBlogStore'
import { useSnackBarStore } from '../store/SnackBarStore'
import Vditor from 'vditor';
import Loading from '../components/Loading.vue'
import BackTop from '../components/BackTop.vue'

const route = useRoute()
const router = useRouter()
const viewBlogStore = useViewBlogStore()
const userStore = useUserStore()
const loginStore = useLoginStore()
const snackBarStore = useSnackBarStore()

const isLoading = ref(true)

const catagoryRef = ref()
const blogBasicInfoKey = ref(0)
const showDialog = ref(false)

let blogBasicInfos = []

const toggleLike = () => {
  viewBlogStore.toggleILike()
  router.go(0)
}

const onEditBlog = () => {
  router.push({ name: 'create', params: { id: viewBlogStore.getId() } })
}

const onDeleteBlog = () => {
  showDialog.value = true
}

const onRealDeleteBlog = async () => {
  showDialog.value = false
  // TODO: delete blog api
  const res = await viewBlogStore.deleteBlog("all")
  snackBarStore.setColor("green-accent-4")
  snackBarStore.setMsg(res)
  snackBarStore.setShow(true)
  router.push({ name: "home" })
}

const onCancelDeleteBlog = () => {
  showDialog.value = false
}

onMounted(async () => {
  const id = route.params.id;
  await viewBlogStore.init(id)

  document.documentElement.scrollTop = 0

  // 监听滚轮事件
  document.addEventListener('scroll', () => {
    // 距离顶部大于 目前高度 * 1.2
    if (document.documentElement.scrollTop > catagoryRef.value.offsetTop * 1.2) {
      // 添加类 scrollBlogCatagory
      catagoryRef.value.classList.add('scrollBlogCatagory')
    } else {
      // 移除类 scrollBlogCatagory
      catagoryRef.value.classList.remove('scrollBlogCatagory')
    }
  })


  // VditorPreview.mermaidRender(viewBlogStore.getContent())
  setTimeout(() => {
    Vditor.preview(document.getElementById('content'), viewBlogStore.getContent(), {
      cdn: 'https://unpkg.com/vditor@3.10.4',
      mode: 'light',
      anchor: 2,
      after() {
        Vditor.outlineRender(document.getElementById('content'), document.getElementById('outline'))
        document.getElementById('outline').style.display = 'block'

        isLoading.value = false
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
  min-height: 100vh;
}

.catagoryTagsContainer {
  width: 20vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 40px 20px;
  overflow: visible;
}

.blogCatagoryContainer {
  width: 20vw;
  height: auto;
  max-height: 80vh;
  overflow: auto;
  background-color: var(--light-background);
  border-radius: 5px;
  padding: 20px 0;
}

.scrollBlogCatagory {
  position: fixed;
  top: 6vh;
  right: 7.7vw;
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
  width: 60vw;
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

.userBlogTagsContainer1 {
  height: auto;
  background-color: var(--light-background);
  border-radius: 5px;
  margin: 25px 0;
  padding: 15px;
}

.userBlogTagsContainer2 {
  display: none;
}

.userBlogTagsTitle {
  color: var(--dark-background);
  font-size: 20px;
  font-weight: bold;
}

.chip {
  background-color: #333;
  color: #fff;
}

@media screen and (max-width: 768px) {
  .blogDeatilContainer {
    width: 100vw;
  }

  .catagoryTagsContainer {
    display: none;
  }

  .blogDataContainer {
    width: 90vw;
  }

  .blogInfo1Container {
    margin-top: 20px;
  }

  .likeBtn {
    display: none;
  }

  .infoopContainer {
    flex-direction: column;
  }

  .blogContentContainer {
    margin-top: 0;
    padding: 5px 15px;
  }

  .userBlogTagsContainer2 {
    display: flex;
    flex-direction: column;
    width: 90vw;
    height: auto;
    background-color: var(--light-background);
    justify-content: center;
    align-items: center;
  }

  .blogBasicInfo {
    font-size: 3.5vw;
  }
}
</style>