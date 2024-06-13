<template>
  <div class="unselectable" draggable="false" oncontextmenu="return false;">
    <router-view></router-view>
  </div>
</template>

<script setup lang='js'>
import { ref, reactive, onMounted } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'
onMounted(() => {
  window.addEventListener('resize', () => {
    window.location.reload()
  })
})

</script>

<style scoped></style>
