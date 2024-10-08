import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useUserStore } from './UserStore'
import LZString from 'lz-string'

export const useCreateBlogStore = defineStore('createBlog', () => {
  const id = ref(0)
  const title = ref("")
  const summary = ref("")
  const content = ref("")
  const tags = ref([])
  const state = ref("草稿")

  const isChanged = ref(false)

  const getIsChanged = () => {
    return isChanged.value;
  }

  const getBlogId = () => {
    return id.value;
  }

  const clear = () => {
    id.value = 0;
    title.value = "";
    summary.value = "";
    content.value = "";
    tags.value = [];
    state.value = "";
    isChanged.value = false;
  }

  const init = async (id_) => {
    if (id_!=0) {
      // 获取该id的博客信息
      await axios.request({
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://8.134.215.31:2002/blog/create-blog?id='+id_,
        headers: { 
          "token": localStorage.getItem("JWT_TOKEN")
        }
      })
      .then((response) => {
        id.value = response.data.data.id;
        title.value = response.data.data.title;
        summary.value = response.data.data.summary;
        //content.value = LZString.decompress(response.data.data.content);
        content.value = response.data.data.content;
        tags.value = response.data.data.tags;
        state.value = response.data.data.state;
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
        url: 'http://8.134.215.31:2002/blog/new-id?uid=' + userStore.getUid(),
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

  const saveBlog = async (state_) => {
    // //压缩效果测试
    // console.log("压缩前长度：", content.value.length);
    // const compressedContent = LZString.compress(content.value)
    // console.log("压缩后长度：", compressedContent.length);
    // console.log("压缩率：", compressedContent.length / content.value.length * 100, "%");
    // console.log("解缩后长度：", LZString.decompress(compressedContent).length);

    state.value = state_
    const userStore = useUserStore()
    let res = ''
    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://8.134.215.31:2002/blog',
      headers: { 
        'Content-Type': 'application/json',
        'token': localStorage.getItem("JWT_TOKEN")
      },
      data : {
        "id": id.value,
        "uid": userStore.getUid(),
        "title": title.value,
        "summary": summary.value,
        //"content": LZString.compress(content.value),
        "content": content.value,
        "tags": tags.value,
        "state": state_
      }
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.code == 1) {
        res = response.data.msg;
        isChanged.value = false;
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

  const deleteBlog = async (state_) => {
    let res = ''
    await axios.request({
      method: 'delete',
      maxBodyLength: Infinity,
      url: `http://8.134.215.31:2002/blog?id=${id.value}&deleteState=${state_}`,
      headers: {
        "token": localStorage.getItem("JWT_TOKEN")
       }
    })
    .then((response) => {
      if (response.data.code == 1) {
        res = response.data.msg;
      } else {
        return "error: "+response.data.msg;
      }
      return response.data.msg;
    })
    .catch((error) => {
      console.log(error);
    });
    return res
  }

  const generateSummary = async () => {
    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://8.134.215.31:2001/blogs/generate_conclusion',
      headers: { 
        'Content-Type': 'application/json',
        'token': localStorage.getItem("JWT_TOKEN")
      },
      data : {
        "content": content.value
      }
    })
    .then((response) => {
      summary.value = response.data.conclusion;
      console.log(response.data.conclusion);
      return response.data.message;
    })
    .catch((error) => {
      console.log(error);
    });
    
  }
  
  const generateTags = async () => {
    await axios.request({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://8.134.215.31:2001/blogs/generate_tags',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem("JWT_TOKEN")
      },
      data: {
        "content":content.value
      }
    })
      .then((response) => {
        const res = response.data.tags;
        console.log(res);
        for (let i = 0; i < res.length; i++) {
          let isContinue = false;
          for (let j = 0; j < tags.value.length; j++) {
            if (res[i] === tags.value[j]){
              isContinue = true;
              break;
            }
          }
          if (isContinue) {
            continue;
          }
          tags.value.push(res[i]);
        }
        return response.data.message;
      })
      .catch((error) => {
        console.log(error);
      });
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
  const getState = () => {
    return state.value;
  }
  

  const setTitle=(newTitle)=>{
      title.value = newTitle;
      isChanged.value = true;
  }
  const setSummary=(newSummary)=>{
      summary.value = newSummary;
      isChanged.value = true;
  }
  const setContent=(newContent)=>{
      content.value = newContent;
      isChanged.value = true;
  }

  const addTag = (newTag) => {
    for (let j = 0; j < tags.value.length; j++) {
      if (newTag === tags.value[j]){
        return;
      }
    }
    tags.value.push(newTag);
    isChanged.value = true;
  }
  const deleteTag = (index) => {
    tags.value.splice(index, 1);
    isChanged.value = true;
  }

  return {
    id, title, summary, content, tags,
    init,clear,getIsChanged,deleteBlog,generateSummary, generateTags,
    getBlogId, getTitle, getSummary, getContent, getTags,getState,
    setTitle, setSummary, setContent, addTag, deleteTag,
    saveBlog
  }
},{
  persist: true,
})