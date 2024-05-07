<template>
  <div class="blogDeatilContainer">BlogDetail {{ blogId }}</div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router';
const route = useRoute()

const blogId = ref<string>('0')

onMounted(() => {
  blogId.value = route.params.id as string;
  document.documentElement.scrollTop = 0
})
</script>

<style scoped>
.blogDeatilContainer {
  height: 800px;
  overflow: auto;
}
</style>