<template>
  <v-snackbar v-model="snackBar.show" :timeout="2000" location="top" :color="snackBar.color">
    <div style="justify-content: center; display: flex; align-items: center; color:aliceblue; font-size: 16px;">
      {{ snackBar.msg }}
    </div>
  </v-snackbar>
  <loading v-if="isLoading"></loading>
  <div class="createContainer">
    <div class="settingContainner">
      <div class="infoContainer">
        <div class="titleSumContainer">
          <div class="titleContainer">
            <v-text-field v-model="blogStore.title" label="标题" placeholder="请输入标题" variant="outlined"
              density="comfortable"></v-text-field>
            <!-- 移动端标签按钮 -->
            <div class="mobileTagsContainer">
              <v-menu :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" size="large" class="mobileShowTagsBtnContainer">
                    <i class="iconfont icon-biaoqian"></i>
                    标签
                  </v-btn>
                </template>
                <div class="tagsContainer2 boxshadow">
                  <div class="tagsTitleContainer">
                    <div class="tagsTitle">
                      标签
                    </div>
                    <div class="tagsOpContainer">
                      <!-- <v-btn variant="text" class="tagsOpBtn" @click="generateTags()">一键生成(测试)</v-btn> -->
                      <v-btn variant="text" class="tagsOpBtn" @click="showTagsAddDialog = true">添加标签</v-btn>
                    </div>
                  </div>
                  <v-chip-group column>
                    <v-chip v-for="(tag, index) in blogStore.getTags()" class="chip" :text="tag" closable
                      @click:close="blogStore.deleteTag(index); chipsKey++;" :key="chipsKey"></v-chip>
                  </v-chip-group>
                </div>
              </v-menu>
            </div>
          </div>
          <div class="summaryContainer">
            <v-textarea v-model="blogStore.summary" label="概要" placeholder="请输入概要" variant="outlined" no-resize>
              <!-- <template v-slot:append-inner>
                <i class="iconfont icon-yijianshengcheng generateSummaryBtn" @click="generateSummary()">一键生成</i>
              </template> -->
            </v-textarea>
          </div>
        </div>
        <div class="optionContainer" :key="optionContainerKey">
          <v-btn v-for="opBtn in opBtns" :size="buttonSize()" class="optionBtn" :color="opBtn.color"
            @click="opBtn.click">
            <i class="iconfont" :class="opBtn.icon"></i>
            {{ opBtn.name }}
          </v-btn>
        </div>
      </div>

      <div class="tagsContainer boxshadow">
        <div class="tagsTitleContainer">
          <div class="tagsTitle">
            标签
          </div>
          <div class="tagsOpContainer">
            <!-- <v-btn variant="text" class="tagsOpBtn" @click="generateTags()">一键生成(测试)</v-btn> -->
            <v-btn variant="text" class="tagsOpBtn" @click="showTagsAddDialog = true">添加标签</v-btn>
          </div>
        </div>
        <v-chip-group column>
          <v-chip v-for="(tag, index) in blogStore.getTags()" class="chip" :text="tag" closable
            @click:close="blogStore.deleteTag(index); chipsKey++;" :key="chipsKey"></v-chip>
        </v-chip-group>
      </div>
    </div>
    <div id="vditor"></div>
  </div>

  <v-dialog v-model="showTagsAddDialog" width="auto">
    <v-card width="400" title="添加标签">
      <template v-slot:actions>
        <div
          style="display: flex;flex-direction: column;; justify-content: space-between; align-items: center;width: 100%;">
          <v-text-field width="300" label="标签" placeholder="请输入标签" v-model="newTag"></v-text-field>
          <v-btn @click="addTag">添加</v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>

  <v-dialog v-model="showConfirmDeleteDialog" width="auto">
    <v-card width="250" title="确认删除？" text="您确定要删除当前博客吗？">
      <template v-slot:actions>
        <div style="display: flex;flex-direction: row; justify-content: space-around; align-items: center;width: 100%;">
          <v-btn @click="clickDelete()">确定</v-btn>
          <v-btn @click="showConfirmDeleteDialog = false">取消</v-btn>
        </div>
      </template>
    </v-card>
  </v-dialog>
  <BackTop></BackTop>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import Vditor from 'vditor';
import Loading from '../components/Loading.vue';
import BackTop from '../components/BackTop.vue';
import { useCreateBlogStore } from '../store/CreateBlogStore';
import { useSnackBarStore } from '../store/SnackBarStore';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const blogStore = useCreateBlogStore();
const snackBarStore = useSnackBarStore();

const vditor = ref<Vditor | null>(null);

const showTagsAddDialog = ref(false)
const showConfirmDeleteDialog = ref(false)

const isLoading = ref(true)

const newTag = ref("")

const optionContainerKey = ref(0)
const chipsKey = ref(0)

const snackBar = ref({
  show: false,
  msg: '',
  color: ''
})

const canRelease = () => {
  if (blogStore.getTitle() === "") {
    snackBar.value.msg = "标题不能为空"
  } else if (blogStore.getSummary() === "") {
    snackBar.value.msg = "概要不能为空"
  } else if (blogStore.getTags().length === 0) {
    snackBar.value.msg = "标签不能为空"
  } else if (blogStore.getContent() === "") {
    snackBar.value.msg = "内容不能为空"
  } else {
    return true
  }
  snackBar.value.show = true
  snackBar.value.color = "red-accent-4"
  return false
}

const clickRelease = async () => {
  blogStore.setContent(vditor.value.getValue());
  if (canRelease()) {
    const res = await blogStore.saveBlog("发布")

    snackBarStore.setMsg(res)
    if (res.slice(0, 5) === "error") {
      snackBarStore.setColor("red-accent-4")
    } else {
      snackBarStore.setColor("green-accent-4")
    }
    snackBarStore.setShow(true)

    router.push({ name: "home" })
  }
}
const clickSaveDraft = async () => {
  blogStore.setContent(vditor.value.getValue());
  const res = await blogStore.saveBlog("草稿")

  snackBar.value.msg = res;
  if (snackBar.value.msg.slice(0, 5) === "error") {
    snackBar.value.color = "red-accent-4"
  } else {
    snackBar.value.color = "green-accent-4"
  }
  snackBar.value.show = true
}


const generateSummary = async () => {
  blogStore.setContent(vditor.value.getValue());
  if (blogStore.getContent() === "") {
    snackBar.value.msg = "内容不能为空"
    snackBar.value.color = "red-accent-4"
  } else {
    const res = await blogStore.generateSummary()
    snackBar.value.msg = '生成概要成功!';
    snackBar.value.color = "green-accent-4";
  }
  snackBar.value.show = true;
}

const generateTags = async () => {
  blogStore.setContent(vditor.value.getValue());
  if (blogStore.getContent() === "") {
    snackBar.value.msg = "内容不能为空"
    snackBar.value.color = "red-accent-4"
  } else {
    const res = await blogStore.generateTags()
    snackBar.value.msg = '生成标签成功!';
    snackBar.value.color = "green-accent-4";
  }
  snackBar.value.show = true;
}


const clickDelete = async () => {
  const res = await blogStore.deleteBlog("all")

  snackBarStore.setMsg(res)
  if (res.slice(0, 5) === "error") {
    snackBarStore.setColor("red-accent-4")
  } else {
    snackBarStore.setColor("green-accent-4")
  }
  snackBarStore.setShow(true)

  router.push({ name: "home" })
}

const buttonSize = (() => {
  return window.innerWidth > 768 ? 'large' : 'default';
})

let opBtns = [
  {
    "name": "发布",
    "icon": "icon-fabu",
    "color": "#fff",
    "click": clickRelease
  },
  {
    "name": "存为草稿",
    "icon": "icon-caogaoxiang",
    "color": "#fff",
    "click": clickSaveDraft
  },
  {
    "name": "删除",
    "icon": "icon-shanchu",
    "color": "#e90000",
    "click": () => {
      showConfirmDeleteDialog.value = true
    }
  }
]

const addTag = () => {
  if (newTag.value === "") {
    return
  }
  blogStore.addTag(newTag.value)
  showTagsAddDialog.value = false
  newTag.value = ""
}

onMounted(async () => {
  blogStore.clear();
  await blogStore.init(route.params.id)
  router.push({ name: "create", params: { id: blogStore.getBlogId() } })
  if (blogStore.getState() == "发布") {
    opBtns[0].name = "修改发布"
    opBtns.splice(1, 1)
    optionContainerKey.value++;
  }

  vditor.value = new Vditor('vditor', {
    "mode": "ir",
    "icon": "material",
    // "minHeight": 800,
    "height": window.innerHeight * 1.5,
    "width": window.innerWidth > 768 ? window.innerWidth * 0.75 : window.innerWidth * 0.95,
    "counter": {
      "enable": true
    },
    "outline": {
      "enable": true,
      "position": "left"
    },
    // "width": screen.width * 0.96,
    after: () => {
      if (blogStore.getContent() != null) {
        vditor.value.setValue(blogStore.getContent())
      }
      vditor.value.setTheme('dark', 'dark')

      isLoading.value = false
    }
  });

});

window.onbeforeunload = () => {
  // if (blogStore.getIsChanged()) {
  //   showConfirmLeaveDialog.value = true
  // }
  blogStore.setContent(vditor.value.getValue());
  blogStore.saveBlog("草稿")
}

// onBeforeRouteUpdate((to, from, next) => {
//   // 路由变化时执行
//   if (from.name === "create" && from.params.id != '0') {
//     blogStore.setContent(vditor.value.getValue());
//     blogStore.saveBlog("草稿")
//   }
//   next()
// })
</script>

<style scoped>
.createContainer {
  /* background-color: var(--primary-color); */
  height: auto;
  overflow: auto;
  width: auto;
  margin: 50px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.settingContainner {
  width: auto;
  height: auto;
  /* background-color: #ada; */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 70vw;
}

.infoContainer {
  width: 70%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
}

.titleSumContainer {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px;
}

.titleContainer {
  width: 100%;
  display: flex;
}

.summaryContainer {
  width: 100%;
  height: auto;
}

.generateSummaryBtn {
  font-size: 15px;
  border-radius: 5px;
  padding: 5px;
}

.generateSummaryBtn:hover {
  background-color: #ddd;
  cursor: pointer
}

.tagsContainer {
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  /* border: 2px solid #ccc; */
  background-color: var(--light-background);
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}

.tagsContainer2 {
  width: 50vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  /* border: 2px solid #ccc; */
  background-color: var(--light-background);
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}

.mobileShowTagsBtnContainer {
  display: none;
  margin-left: 10px;
  font-size: 18px;
}

.tagsTitleContainer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}

.tagsTitle {
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-weight: bold;
  color: #000;
}

.tagsOpContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tagsOpBtn {
  color: #caa;
  padding: 1px;
  margin-right: 20px;
}

.tagsOpBtn:hover {
  color: var(--primary-color);
}

.chip {
  background-color: #000;
  color: #fff;
}

.optionContainer {
  width: 100%;
  height: auto;
  margin-bottom: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.optionBtn {
  margin-right: 20px;
}

@media screen and (max-width: 768px) {
  .settingContainner {
    flex-direction: column;
    width: 90vw;
  }

  .infoContainer {
    width: 95%;
  }

  .tagsContainer {
    display: none;
  }

  .mobileShowTagsBtnContainer {
    display: flex;
  }
}
</style>