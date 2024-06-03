<template>
  <div style="height: 800px;">
    <div id="searchContainer">
      {{ searchInput }}
    </div>
  </div>
</template>

<script setup lang='js'>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSearchStore } from '@/store/SearchStore'

const searchStore = useSearchStore()
const { searchText } = storeToRefs(searchStore)

const route = useRoute()
const searchInput = ref("")

onMounted(() => {
  searchInput.value = searchText.value

  watch(searchText, (newVal) => {
    searchInput.value = newVal
  })
})


</script>

<style scoped>
#searchContainer {
  /* background-color: var(--primary-color); */
  height: 800px;
  overflow: auto;
}
</style>