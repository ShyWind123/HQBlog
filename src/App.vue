<template>
  <div class="unselectable" draggable="false" oncontextmenu="return false;">
    <router-view></router-view>
  </div>
</template>

<script setup lang='js'>
import { ref, reactive } from 'vue'
import Home from './views/Home.vue';
</script>

<style scoped></style>
