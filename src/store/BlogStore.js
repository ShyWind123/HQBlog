import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useUserStore } from './UserStore'

export const useBlogStore = defineStore('blog', () => {
  const id = ref(0)
  const title = ref("")
  const summary = ref("")
  const content = ref("")
  const tags = ref([])

  const getBlogId = () => {
    return id.value;
  }

  const clear = () => {
    id.value = 0;
    title.value = "";
    summary.value = "";
    content.value = "";
    tags.value = [];
  }

  const init = async (id_) => {
    if (id_!=0) {
      // 获取该id的博客信息
      axios.request({
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://8.134.215.31:2002/blog/get_blog?id='+id_,
        headers: { 
          "token": localStorage.getItem("JWT_TOKEN")
        }
      })
      .then((response) => {
        id.value = response.data.data.id;
        title.value = response.data.data.title;
        summary.value = response.data.data.summary;
        content.value = response.data.data.content;
        tags.value = response.data.data.tags;
      })
      .catch((error) => {
        console.log(error);
      });
      return id.value;
    } else {
      const userStore = useUserStore()
      await axios.request({
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://8.134.215.31:2002/blog/get_new_id?uid=' + userStore.getUid(),
        headers: { 
          "token": localStorage.getItem("JWT_TOKEN")
        }
      })
      .then((response) => {
        id.value = response.data.data;
        return id.value;
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  const saveBlog = async (state) => {
    const userStore = useUserStore()
    let res = ''
    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://8.134.215.31:2002/blog/save',
      headers: { 
        'Content-Type': 'application/json',
        'token': localStorage.getItem("JWT_TOKEN")
      },
      data : {
        "id": id.value,
        "uid": userStore.getUid(),
        "title": title.value,
        "summary": summary.value,
        "content": content.value,
        "tags": tags.value,
        "state": state
      }
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.code == 1) {
        res = response.data.msg;
      } else {
        return "error: "+response.data.msg;
      }
    })
    .catch((error) => {
      console.log(error);
      return "error: "+error;
    });
    return res
  }

  const getTitle = () => {
    return title.value;
  }
  const getSummary = () => {
    return summary.value;
  }
  const getContent = () => {
    return content.value;
  }
  const getTags = () => {
    return tags.value;
  }
  

  const setTitle=(newTitle)=>{
      title.value = newTitle;
  }
  const setSummary=(newSummary)=>{
      summary.value = newSummary;
  }
  const setContent=(newContent)=>{
      content.value = newContent;
  }

  const addTag = (newTag) => {
    tags.value = [...tags.value, newTag];
  }
  const deleteTag = (index) => {
    tags.value = tags.value.filter((_, i) => i !== index);
  }

  return {
    id, title, summary, content, tags,
    init,clear,
    getBlogId, getTitle, getSummary, getContent, getTags,
    setTitle, setSummary, setContent, addTag, deleteTag,
    saveBlog
  }
},{
  persist: true,
})