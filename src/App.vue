<template>
  <div class="container">
    <div class="nav_wrapper" v-if="!isLoginPage">
      <div class="nav" >
        <div class="nav-inner">
          <img class="nav-left-logo" :src="logo">
          <div class="nav-left">{{companyName}}</div>
          <div style="flex: 1"></div>
          <div class="nav-right">
            <div class="nav-time">2024年9月10日 12:23</div>
            <div class="nav-alert" style="margin-left: 20px;margin-top: 5px;">
              <img style="width: 20px; height: 20px" src="../public/imgs/notification.png" />
            </div>
            <div class="nav-setting" style="margin-left: 20px;margin-top: 5px;">
              <img style="width: 20px; height: 20px" src="../public/imgs/setting.png" />
            </div>
            <template v-if="userInfo && userInfo.display_name">
              <!-- <div class="nav-user" style="margin-left: 20px;margin-top: 0px;" @click="toProfile">
                {{userInfo.username}}
              </div> -->
            </template>
            <template v-else>
              <!-- <div class="nav-user" style="margin-left: 20px;margin-top: 0px;" @click="toLogout">
                login
              </div> -->
            </template>

            <el-popover :visible="showPop" placement="bottom" :width="160">
              <el-button style="width: 135px" size="small" type="primary" @click="toLogout">
                {{ $t('base.logout') }}
              </el-button>
              <template #reference>
                <div class="username-wrapper" @click="toProfile">
                  <img style="width: 30px; height: 30px" src="/imgs/profile.png"
                    v-if="!userInfo || !userInfo.display_name" />
                  <div class="username">{{ userInfo ? userInfo.display_name : '' }}</div>
                </div>
              </template>
            </el-popover>

          </div>
        </div>
      </div>
    </div>
    <div class="nav-placeholder" v-if="!isLoginPage"></div>
    <div class="menu-content-wrapper" >
      <div class="left-menu" v-if="!isLoginPage">
        <el-scrollbar height="100%">
          <el-col>
            <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen">

              <template v-for="(menu,i) in adminMenu" :key="menu.index">
                <el-menu-item
                    v-if="menu.path"
                    :index="menu.index"
                    @click="()=>{activeIndex=menu.index;switchTab(menu.path)}">
                  <img class="menu_icon" :src="activeIndex===menu.index?menu.active_icon:menu.icon" alt="#">
                  <el-text :type="activeIndex===menu.index?'primary':''">{{menu.title}}</el-text>
                </el-menu-item>
                <el-sub-menu v-else :index="menu.index">
                  <template #title>
                    <img class="menu_icon" :src="activeIndex===menu.index?menu.active_icon:menu.icon" alt="#">
                    <el-text :type="activeIndex===menu.index?'primary':''">{{menu.title}}</el-text>
                  </template>
                  <el-menu-item
                      v-for="submenu in menu.children"
                      :key="submenu.index"
                      :index="menu.index+'-'+submenu.index"
                      @click="()=>{activeIndex=menu.index;switchTab(submenu.path)}">
                    {{submenu.title}}
                  </el-menu-item>
                </el-sub-menu>
              </template>

            </el-menu>

          </el-col>
        </el-scrollbar>
      </div>
      <div class="left-menu-placeholder" v-if="!isLoginPage"></div>
      <div class="menu-content">
        <!-- <el-main> -->
        <router-view v-slot="{ Component, route }">
          <transition name="el-fade-in" mode="out-in">
            <keep-alive>
              <div :key="route.path">
                <component :is="Component"></component>
              </div>
            </keep-alive>
          </transition>
        </router-view>
        <!-- </el-main> -->
      </div>
    </div>
    <!-- <div class="nav-block"></div> -->
    <!--    <transition name="el-fade-in" mode="out-in">-->
    <!--      <keep-alive>-->
    <!--        <router-view></router-view>-->
    <!--      </keep-alive>-->
    <!--    </transition>-->
  </div>
</template>

<script>
import router from "@/router/index.js"
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import {Api} from "@/network/api.js";

export default {
  mixins: [PageMixin],
  data() {
    return {
      showPop: false,
      activeIndex: 1,
      logo: '',
      companyName: '',
      adminMenu:[
        {
          index: 1,
          icon: '/imgs/dashboard_manager.png',
          active_icon: '/imgs/dashboard_manager_selected.png',
          title: 'Dashboard',
          path: '/guide_one',
          children:[]
        },
        {
          index: 2,
          icon: '/imgs/user_manager.png',
          active_icon: '/imgs/user_manager_selected.png',
          title: '用户管理',
          children:[
            {
              index: 1,
              title: '用户列表',
              path: '/user_list'
            },
            {
              index: 2,
              title: '用户组配置',
              path: '/user_group'
            }
          ]
        },
        {
          index: 3,
          icon: '/imgs/meet_manager.png',
          active_icon: '/imgs/meet_manager_selected.png',
          title: '会议预定',
          children:[
            {
              index: 1,
              title: '单次会议预定',
              path: '/single_meet'
            },
            {
              index: 2,
              title: '循环会议预定',
              path: '/cycle_meet'
            },
            {
              index: 3,
              title: '历史会议',
              path: '/meet_list'
            }
          ]
        },
        {
          index: 4,
          icon: '/imgs/area_manager.png',
          active_icon: '/imgs/area_manager_selected.png',
          title: '区域&会议管理',
          children:[
            {
              index: 1,
              title: '编辑区域',
              path: '/edit_area'
            },
            {
              index: 2,
              title: '编辑会议室',
              path: '/edit_meet'
            },
          ]
        },
        {
          index: 5,
          icon: '/imgs/terminal_manager.png',
          active_icon: '/imgs/terminal_manager_selected.png',
          title: '终端设备管理',
          path: '/terminal_manager',
          children:[]
        },
        {
          index: 6,
          icon: '/imgs/check_circle.png',
          active_icon: '/imgs/check_circle_selected.png',
          title: '系统设置',
          children:[
            {
              index: 1,
              title: '会议规则设置',
              path: '/meet_rule'
            },
            {
              index: 2,
              title: '应用设置',
              path: '/application_setting'
            },
            {
              index: 3,
              title: '用户同步',
              path: '/sync_user'
            },
            {
              index: 4,
              title: '日历同步',
              path: '/sync_calendar'
            },
          ]
        },
        {
          index: 7,
          icon: '/imgs/help_manager.png',
          active_icon: '/imgs/help_manager_selected.png',
          title: '帮助中心',
          children:[
            {
              index: 1,
              title: '操作手册下载',
              path: '/manual'
            },
            {
              index: 2,
              title: '常见问题',
              path: '/questions'
            },
            {
              index: 3,
              title: '问题反馈',
              path: '/feedback'
            }
          ]
        },
      ]
    }
  },
  methods: {
    handleOpen(val) {
      console.log(val)
      this.activeIndex = val
    },
    toProfile() {
      console.log('App toProfile Enter')
      let user = this.userInfo
      console.log('App toProfile Enter:user', user)
      if (!user.display_name) {
        router.replace("/login")
      } else {
        this.showPop = !this.showPop
      }
    },
    getSetting() {
      Api.getVariables({
        "logo_dir": 1,
        "company_name": 1,
        "server_address": 1,
      }).then(({code,data,msg})=>{
        this.logo = data.server_address + data.logo_dir
        this.companyName = data.company_name
      })
    },
    toLogout() {
      this.showPop = false
      this.logout(() => {
        // router.replace("/login")
      })
      router.replace("/login")
    },
    handleVisibleChange(visible) {
      const handleDocumentClick = (event) => {
        // 判断点击事件是否发生在 Popover 外部
        if (!elPopover.value.$el.contains(event.target)) {
          this.showPop = false;
          document.removeEventListener('mousedown', handleDocumentClick);
        }
      }

      if (visible) {
        this.showPop = true;
        document.addEventListener('mousedown', handleDocumentClick);
      }
    },
  },
  mounted() {
    console.log('App mounted user:', this.userInfo.username)
    this.getSetting()
    this.$forceUpdate()
  }
}
</script>

<style>
body {
  display: block;
  margin: 0 !important;
  padding: 0 !important;
  background: #EFEFEF;
}

/*总容器*/
.container {
  margin: 0;
  padding: 0;
  width: 100vw;
  /* height: auto; */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #EFEFEF;
  /* background-color: white; */
  /* box-sizing: border-box; */
}

/*内容页容器*/
.container-sub-page {
  width: calc(100vw - 189px);
  /* width: auto; */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  padding: 0;
  margin: 0;
  background: #EFEFEF;
  /* background-color: red; */
}

/*内容页main部分*/
.container-sub-page-main {
  /* min-width: 930px; */
  padding: 20px;
  width:100%;

  /* height: calc(100vh - 95px); */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: scroll;
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
  /* background-color: red; */
}

/*隐藏滚动条*/
::-webkit-scrollbar {
  display: none;
}

/*顶部导航栏*/
.nav {
  min-width: 100vw;
  height: 75px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: white;
  box-sizing: border-box;
  padding: 0 75px 0 75px;
}

.nav_wrapper {
  width: 100%;
  /* background: red; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 2003;
  top: 0;
  border-bottom: 0.06rem solid rgba(187, 187, 187, 1);
}

.nav-placeholder{
  height: 75px;
}

.nav-block {
  /* height: 75px;
  padding: 0 75px 0 75px; */
}

.nav-inner {
  width: 100%;
  display: flex;
  flex-direction: row;
  /* align-items: center; */
}

.nav-left-logo {
  width: 55px;
  height: 55px;
  margin-right: 20px;
  margin-top: 10px;
}

.nav-left {
  font-size: 20px;
  line-height: 75px;
}

.nav-time {
  font-size: 14px;
  font-weight: 500;
  color: #4E5969;
}

.nav-right {
  /* width: 400px; */
  justify-content: space-evenly;
  display: flex;
  flex-direction: row;
  /* background-color: red; */
  height: 75px;
  line-height: 75px;
}

.el-main {
  /* background-color: aqua; */
  /* width: calc(100vw - 200px); */
  /* width: 100%; */
  /* padding: 10px;
  padding: 10px; */
  /* margin: 0px; */
}

.menu-content-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

.left-menu {
  margin: 0;
  padding: 0;
  width: 189px;
  background-color: white;
  height: calc(100vh - 75px);
  position: fixed;
  left: 0;
  top: 75px;
}

.left-menu-placeholder{
  flex-shrink: 0;
  width: 189px;
  height: calc(100vh - 75px);
}

.menu_icon {
  width: 18px;
  height: 18px;
  padding-right: 10px;
}

.menu-content {
  display: flex;
  width: 100%;
  height: 100%;
}

/*顶部导航按钮*/
.nav-button {
  min-width: 128px;
  height: 32px;
  line-height: 32px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
  margin-right: 22px;
  font-size: 20px;
  border-radius: 126px;
  font-weight: bold;
}

.nav-button-inactive {
  border: 1px solid var(--el-color-primary);
  background: white;
  color: var(--el-color-primary);
}

/*表格外间距*/
.table-wrapper {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

/*表头*/
.tb-header {
  /* color: #333333; */
  font-size: 14px;
}

/*表格操作按钮*/
.operate-wrapper {
  display: flex;
  flex-direction: row;
}
.operate-item {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  display: flex;
  align-items: center;
  letter-spacing: -0.07px;
  color: #591BB7;
  padding: 10px 20px 10px 0;
  cursor: pointer;
}

/*公共代码----内容页标题的容器*/
.sub-title-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* margin-top: 40px;
  margin-bottom: 40px; */
}

/*内容页标题*/
.sub-title {
  color: #333333;
  font-size: 22px;
  font-weight: bold;
  flex: 1;
}

.username-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.username {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin-left: 10px;
}

/* .form-wrapper {
  position: relative;
} */

.request-wrapper {
  display: flex;
  flex-direction: row;
  position: relative;
}

.request-tag {
  width: 12px;
  height: 12px;
  position: absolute;
  left: 55px;
  top: 10px;
}
</style>
