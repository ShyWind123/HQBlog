import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import Blogs from '../views/Blogs.vue'
import Login from '../views/Login.vue'
import About from '../views/About.vue'
import Drafts from '../views/Drafts.vue'
import User from '../views/User.vue'
import Tags from '../views/Tags.vue'
import Search from '../views/Search.vue'
import BlogDetail from '../views/BlogDetail.vue'
import Create from '../views/Create.vue'


const routerConfig = {
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/HQBlog'
    },
    {
      path: '/HQBlog',
      redirect: '/HQBlog/home',
      component: Home,
      children: [
        {
          name: 'home',
          path: 'home',
          component: Blogs
        },
        {
          name: 'login',
          path: 'login',
          component: Login
        },
        {
          name: 'tags',
          path: 'tags',
          component: Tags
        },
        {
          name: 'about',
          path: 'about',
          component: About
        },
        {
          name: 'drafts',
          path: 'drafts',
          component: Drafts
        },
        {
          name: 'user',
          path: 'user/:uid',
          component: User
        },
        {
          name:'search',
          path:'search/:searchContent',
          component: Search
        },
        {
          name:'blogDetail',
          path:'blogDetail/:id',
          component: BlogDetail
        },
        {
          name:'create',
          path:'create/:id',
          component: Create
        }
      ]
    }
  ]
}

const router = createRouter(routerConfig)

export default router