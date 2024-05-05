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