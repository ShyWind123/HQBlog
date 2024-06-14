import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useSnackBarStore = defineStore('snackbar', ()=>{
  const show = ref(false)
  const msg = ref('')
  const color = ref('')

  const setShow = (value) => {
    show.value = value
  }
  const setMsg = (value) => {
    msg.value = value
  }
  const setColor = (value) => {
    color.value = value
  }

  const getShow = () => { 
    return show.value
  }
  const getMsg = () => {
    return msg.value
  }
  const getColor = () => {
    return color.value
  }

  return {
    setShow,setMsg,setColor,
    getShow,getMsg,getColor
  }
})  