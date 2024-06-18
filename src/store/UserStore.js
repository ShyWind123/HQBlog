import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
  const uid = ref(0);

  const setUid = (id) => {
    uid.value = id;
  }

  const getUid = () => {
    return uid.value;
  }

  const clear = () => {
    uid.value = 0;
  }

  return {
    uid, setUid, getUid,clear
  }
},{
  persist: true,
})