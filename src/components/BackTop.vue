<template>
  <div class="backTop" @click="backTop" ref="backTopRef">
    Top
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const backTop = () => {
  document.documentElement.scrollTop = 0
}

</script>

<style scoped>
.backTop {
  /* 固定定位 */
  position: fixed;
  bottom: 5vh;
  right: 5vw;
  z-index: 999;
  /* 回到顶部样式 */
  width: 35px;
  height: 35px;
  background-color: var(--dark-background);
  /* 字体在元素中水平垂直居中 */
  line-height: 35px;
  text-align: center;
  font-size: 14px;
  color: var(--light-background);
  /* 设置圆角 */
  border-radius: 5px;
  /* 设置过渡效果 */
  transition: all linear 0.5s;
  cursor: pointer;
}
</style>