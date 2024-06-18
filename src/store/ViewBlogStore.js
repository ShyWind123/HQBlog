import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import {useUserStore} from '../store/UserStore.js'

export const useViewBlogStore = defineStore('viewBlog',()=> {
  const id = ref(0);
  const uid = ref('');
  const author = ref('');
  const title = ref('');
  const content = ref('');
  const date = ref('');
  const tags = ref([]);
  const likes = ref(0);
  const views = ref(0);
  const isILike = ref(false);

  const init = async (id_)=>{
    const userStore = useUserStore();

    id.value = id_;
    
    await axios.request({
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://8.134.215.31:2002/blog/get_view_blog?id=${id_}&uid=${userStore.getUid()}`,
      headers: {
        'token': localStorage.getItem('JWT_TOKEN')
       }
    })
    .then((response) => {
      uid.value = response.data.data.uid;
      author.value = response.data.data.author;
      title.value = response.data.data.title;
      content.value = response.data.data.content;
      date.value = response.data.data.date;
      tags.value = response.data.data.tags;
      likes.value = response.data.data.likes;
      views.value = response.data.data.views;
      isILike.value = response.data.data.isILike;
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const getId = ()=>{
    return id.value;
  }
  const getUid = ()=>{
    return uid.value;
  }
  const getAuthor = ()=>{
    return author.value;
  }
  const getTitle = ()=>{
    return title.value;
  }
  const getContent = ()=>{
    return content.value;
  }
  const getDate = ()=>{
    return date.value;
  }
  const getTags = ()=>{
    return tags.value;
  }
  const getLikes = ()=>{
    return likes.value;
  }
  const getViews = ()=>{
    return views.value;
  }
  const getILike = ()=>{
    return isILike.value;
  }

  const toggleILike = async ()=>{
    isILike.value = !isILike.value;

    const userStore = useUserStore();

    axios.request({
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://8.134.215.31:2002/blog/toggle_like?id=${id.value}&uid=${userStore.getUid()}`,
      headers: { 
        'token':localStorage.getItem('JWT_TOKEN')
      }
    })
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return {
    init,
    getId,
    getTitle,
    getContent,
    getAuthor,
    getUid,
    getDate,
    getTags,
    getLikes,
    getViews,
    getILike,
    toggleILike
  }
})