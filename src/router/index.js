import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
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
      path: '/area_detail/:mode/:area_id',
      name: 'area_detail',
      component: () => import('@/pages/AreaDetailPage.vue')
    }
  ]
})

export default router
