import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import {STORAGE} from "@/const.js";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/single_meet',
      name: 'single_meet',
      component: () => import('@/pages/meet/SingleMeetTest.vue')
    },
    {
      path: '/user_list',
      name: 'user_list',
      component: () => import('@/pages/user/UserList.vue')
    },
    {
      path: '/',
      name: 'home',
      component:  () => import('@/pages/meet/SingleMeetTest.vue')
    },{
      path: '/guide_start',
      name: 'guide_start',
      component: () => import('@/pages/guide/GuideStart.vue')
    },
    {
      path: '/guide_basics',
      name: 'guide_basics',
      component: () => import('@/pages/guide/GuideBasics.vue')
    },
    {
      path: '/guide_user',
      name: 'guide_user',
      component: () => import('@/pages/guide/GuideUser.vue')
    },{
      path: '/guide_calendar',
      name: 'guide_calendar',
      component: () => import('@/pages/guide/GuideCalendar.vue')
    },{
      path: '/guide_meet',
      name: 'guide_meet',
      component: () => import('@/pages/guide/GuideMeet.vue')
    },{
      path: '/guide_complete',
      name: 'guide_complete',
      component: () => import('@/pages/guide/GuideComplete.vue')
    },
    {
      path: '/user_detail',
      name: 'user_detail',
      component: () => import('@/pages/user/UserDetail.vue')
    },
    {
      path: '/user_group',
      name: 'user_group',
      component: () => import('@/pages/userGroup/UserGroup.vue')
    },
    {
      path: '/edit_group',
      name: 'edit_group',
      component: () => import('@/pages/userGroup/EditGroup.vue')
    },
    {
      path: '/edit_user_group',
      name: 'edit_user_group',
      component: () => import('@/pages/userGroup/EditUserGroup.vue')
    },
    {
      path: '/group_detail',
      name: 'group_detail',
      component: () => import('@/pages/userGroup/GroupDetail.vue')
    },{
      path: '/cycle_meet',
      name: 'cycle_meet',
      component: () => import('@/pages/meet/CycleMeet.vue')
    },{
      path: '/meet_list',
      name: 'meet_list',
      component: () => import('@/pages/meet/MeetList.vue')
    },{
      path: '/meet_manager',
      name: 'meet_manager',
      component: () => import('@/pages/area/MeetManager.vue')
    },{
      path: '/edit_area',
      name: 'edit_area',
      component: () => import('@/pages/area/EditArea.vue')
    },{
      path: '/edit_meet',
      name: 'edit_meet',
      component: () => import('@/pages/area/EditMeet.vue')
    },{
      path: '/terminal_manager',
      name: 'terminal_manager',
      component: () => import('@/pages/terminal/TerminalManager.vue')
    },{
      path: '/application_setting',
      name: 'application_setting',
      component: () => import('@/pages/system/ApplicationSetting.vue')
    },{
      path: '/wxwork_setting',
      name: 'wxwork_setting',
      component: () => import('@/pages/system/WxWorkSetting.vue')
    },{
      path: '/meet_rule',
      name: 'meet_rule',
      component: () => import('@/pages/system/MeetRule.vue')
    },{
      path: '/sync_calendar',
      name: 'sync_calendar',
      component: () => import('@/pages/system/SyncCalendar.vue')
    },{
      path: '/sync_user',
      name: 'sync_user',
      component: () => import('@/pages/system/SyncUser.vue')
    },{
      path: '/questions',
      name: 'questions',
      component: () => import('@/pages/help/Questions.vue')
    },{
      path: '/feedback',
      name: 'feedback',
      component: () => import('@/pages/help/Feedback.vue')
    },{
      path: '/manual',
      name: 'manual',
      component: () => import('@/pages/help/Manual.vue')
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
      component: () => import('@/pages/area/AreaDetailPage.vue')
    },
    {
      path: '/room_detail/:id',
      name: 'room_detail',
      component: () => import('@/pages/area/RoomDetailPage.vue')
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
  if (!json && to.name != 'login') {
    localStorage.removeItem(STORAGE.USER_INFO)
    router.push('/login')
    return false
  } else if (!json && to.name == 'login') {
    return true
  } else if (to.name == 'login') {
    return false
  }
  let user = JSON.parse(json)
  // if (user["level"] < 2) {
  //   return false
  // }
  return true
})

export default router
