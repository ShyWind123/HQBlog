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

export const useRuleStore = defineStore('rule', () => {
  const emptyRule = (name, v) => {
    if (v) return true;
    return '请输入' + name
  }
  
  const usernameRule = (v) => {
    if (v.length > 10)
      return '用户名长度不能超过10位';
    return true;
  }
  
  const passwordRule = (v) => {
    if (v.length < 6)
      return '密码长度至少6位'
    else if (v.length > 16)
      return '密码长度不能超过16位'
    else if (!/\d/.test(v))
      return '密码必须包含数字'
    else if (!/[a-zA-Z]/.test(v))
      return '密码必须包含字母'
    return true;
  }
  
  const passwordAgainRule = (v1, v2) => {
    if (v1 !== v2)
      return '两次密码输入不一致'
    return true;
  }
  
  const emailRule = (v) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return true;
    return '请输入正确的邮箱'
  }

  return {
    emptyRule, usernameRule, passwordRule, passwordAgainRule, emailRule
  }
});