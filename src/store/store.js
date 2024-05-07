import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useLoginStore = defineStore('login', () => {
  const isLogin = ref(false)
  function login() {
    isLogin.value = true
  }
  function logout() {
    isLogin.value = false
  }

  return {
    isLogin, login, logout,
  }
})

export const useSearchStore = defineStore('search', () => {
  const searchText = ref('')
  const searchResult = reactive([])


  function search(text) {
    searchText.value = text
  }

  function setSearchResult(result) {
    searchResult.value = result
  }

  return {
    search, searchText, setSearchResult, searchResult,
  }
})