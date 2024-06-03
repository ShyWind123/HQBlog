import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const searchText = ref('')
  const searchResult = reactive([])


  function search(text) {
    searchText.value = text
  }

  function getSearchContent() {
    return searchText.value
  }

  function setSearchResult(result) {
    searchResult.value = result
  }

  return {
    search, searchText, setSearchResult, searchResult,getSearchContent
  }
})