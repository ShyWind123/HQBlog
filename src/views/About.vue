<template>
  <div class="blogContainer">
    <div class="aboutTitle">About Me</div>
    <div class="allInfoContainer">
      <div class="basicInfoContainer">
        <div v-for="info in myInfo" :key="info.title">
          <span>{{ info.title }}&nbsp;:&nbsp;</span>
          <span style="font-weight: bold;">{{ info.content }}</span>
        </div>
      </div>

      <div class="contactInfoContainer">
        <div class="contactTitle">联系我</div>
        <div class="contactInfo">
          <div class="contactItem" v-for="info in contactInfo">
            <a :href="info.url" target="_blank">
              <i class="iconfont" :class="info.icon" style="font-size: 30px;">
              </i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="otherWebsContainer">
      <div class="otherWebsTitle">Webs</div>
      <div class="otherWebs">
        <a class="otherWebItem" v-for="web in otherWebs" :href="web.url">
          <span>{{ web.title }}</span>
        </a>
      </div>
    </div>
    <div class="picContainer">
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'

const myInfo = [
  {
    "title": "姓名",
    "content": "黄钦"
  },
  {
    "title": "年龄",
    "content": "22"
  },
  {
    "title": "学校",
    "content": "华南理工大学"
  },
  {
    "title": "职业",
    "content": "本科在读"
  },
  {
    "title": "邮箱",
    "content": "2513561399@proton.me"
  },
]

const contactInfo = [
  {
    "title": "Github",
    "icon": "icon-github",
    "url": "https://github.com/ShyWind123"
  },
  {
    "title": "LeetCode",
    "icon": "icon-leetcode",
    "url": "https://leetcode.cn/u/shywind/"
  },
  {
    "title": "BiliBili",
    "icon": "icon-bilibili",
    "url": "https://space.bilibili.com/507266172"
  }
]

const otherWebs = [
  {
    "title": "HQHome",
    "url": "http://8.134.215.31:1000"
  },
  {
    "title": "AreaChartRevisited",
    "url": "http://8.134.215.31:9999"
  },
  {
    "title": "RoamTouring",
    "url": "http://8.134.215.31:11111"
  },
]

</script>

<style scoped>
.blogContainer {
  /* background-color: var(--primary-color); */
  height: auto;
  min-height: 100vh;
  width: 80vw;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.aboutTitle {
  font-size: 40px;
  font-weight: bold;
  margin: 50px;
  border-bottom: 5px solid var(--primary-color);
}

.allInfoContainer {
  margin: 15px;
  width: auto;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.basicInfoContainer {
  width: auto;
  margin: 0 80px;
}

.contactInfoContainer {
  width: auto;
  margin: 0 80px;
}

.contactTitle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 25px;
  font-weight: bold;
  margin: 0 0 10px 20px;
}

.contactInfo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.contactItem {
  margin: 0 20px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: white;
  cursor: pointer;
}

.otherWebsContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 30px 0;
}

.otherWebsTitle {
  font-size: 40px;
  font-weight: bold;
  margin: 50px;
  border-bottom: 5px solid var(--primary-color);
}

.otherWebs {
  font-size: 25px;
  font-weight: bold;
}

.otherWebItem {
  margin: 0 20px;
  /* border-left: 3px solid var(--primary-color);
  border-right: 3px solid var(--primary-color); */
}

.otherWebItem:hover {
  cursor: pointer;
  text-decoration: underline;
}

@media screen and (max-width: 768px) {
  .blogContainer {
    width: 90vw;
  }

  .aboutTitle {
    font-size: 40px;
    margin: 30px;
  }

  .allInfoContainer {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .basicInfoContainer {
    margin: 0 30px;
  }

  .contactInfoContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 30px 0 20px 15px;
  }

  .contactTitle {
    margin: 0;
  }

  .otherWebsContainer {
    margin: 20px 0;
  }

  .otherWebsTitle {
    margin: 30px;
  }

  .otherWebs {
    display: flex;
    flex-direction: column;
  }

  .otherWebItem {
    margin: 5px 0;
  }
}
</style>