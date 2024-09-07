import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import {STORAGE} from "@/config.js";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/meet_detail/:id/:room_id/:area_id/:timestamp',
      name: 'meet_detail',
      component: () => import('@/pages/MeetDetail.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/LoginPage.vue')
    },
    {
      path: '/area',
      name: 'area',
      component: () => import('@/pages/AreaPage.vue')
    },
    {
      path: '/room',
      name: 'room',
      component: () => import('@/pages/RoomPage.vue')
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/pages/UserPage.vue')
    },
    {
      path: '/area_detail/:id',
      name: 'area_detail',
      component: () => import('@/pages/AreaDetailPage.vue')
    },
    {
      path: '/room_detail/:id',
      name: 'room_detail',
      component: () => import('@/pages/RoomDetailPage.vue')
    },
    {
      path: '/user_detail/:mode/:id',
      name: 'user_detail',
      component: () => import('@/pages/UserDetailPage.vue')
    }
  ]
})

router.beforeEach((to, from) => {
  if (to.name == 'home') {
    return true
  }

  let json = localStorage.getItem(STORAGE.USER_INFO)
  if (!json) {
    localStorage.removeItem(STORAGE.USER_INFO)
    router.push('/login')
    return false
  } else if (to.name == 'login') {
    return false
  }
  if (to.name == 'login') {
    return true
  }
  let user = JSON.parse(json)
  if (user["level"] < 2) {
    return false
  }
  return true
})

export default router
