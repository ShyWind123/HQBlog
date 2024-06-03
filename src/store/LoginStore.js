import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useLoginStore = defineStore('login', () => {
  const isLogin = ref(false)
  const isNowLogin = ref(false)
  const isNowLogout = ref(false)

  function login() {
    isLogin.value = true
  }
  function logout() {
    isLogin.value = false
  }
  function getIsLogin() {
    return isLogin.value;
  }

  function setIsNowLogin(state) {
    isNowLogin.value = state
  }
  function setIsNowLogout(state) {
    isNowLogout.value = state
  }


  return {
    isLogin, isNowLogin,isNowLogout,login, logout, getIsLogin, setIsNowLogin, setIsNowLogout
  }
})