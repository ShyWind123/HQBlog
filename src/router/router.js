import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import Blogs from '../views/Blogs.vue'
import Login from '../views/Login.vue'
import About from '../views/About.vue'
import Pigeonhole from '../views/Pigeonhole.vue'
import User from '../views/User.vue'
import Tags from '../views/Tags.vue'
import Search from '../views/Search.vue'
import BlogDetail from '../views/BlogDetail.vue'


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
          name: 'pigeonhole',
          path: 'pigeonhole',
          component: Pigeonhole
        },
        {
          name: 'user',
          path: 'user',
          component: User
        },
        {
          name:'search',
          path:'search',
          component: Search
        },
        {
          name:'blogDetail',
          path:'blogDetail/:id',
          component: BlogDetail
        }
      ]
    }
  ]
}

const router = createRouter(routerConfig)

export default router