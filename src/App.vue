<template>
  <div class="container">
    <NavBar v-if="!isLoginPage" :companyName="companyName" :logo="logo" :originalLogo="originalLogo" :time="time" />
    <div style="height: 75px;" v-if="!isLoginPage"></div>
    <div class="menu-content-wrapper">
      <div class="left-menu" v-if="!isLoginPage">
        <el-scrollbar height="100%">
          <el-col>
            <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen">
              <template v-for="(menu, i) in (userInfo.level == 2 ? adminMenu : memberMenu)" :key="menu.index">
                <el-menu-item v-if="menu.path" :index="menu.index"
                  @click="() => { activeIndex = menu.index; toPath(menu.path) }">
                  <img class="menu_icon" :src="activeIndex === menu.index ? menu.active_icon : menu.icon" alt="#">
                  <el-text :type="activeIndex === menu.index ? 'primary' : ''">{{ menu.title }}</el-text>
                </el-menu-item>
                <el-sub-menu v-else :index="menu.index">
                  <template #title>
                    <img class="menu_icon" :src="activeIndex === menu.index ? menu.active_icon : menu.icon" alt="#">
                    <el-text :type="activeIndex === menu.index ? 'primary' : ''">{{ menu.title }}</el-text>
                  </template>
                  <el-menu-item v-for="submenu in menu.children" :key="submenu.index"
                    :index="menu.index + '-' + submenu.index" @click="() => { activeIndex = menu.index; toPath(submenu.path) }">
                    {{ submenu.title }}
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
  </div>
</template>

<script>
import router from "@/router/index.js"
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { Api } from "@/network/api.js";
import NavBar from "@/components/NavBar.vue";

export default {
  components: { NavBar },
  mixins: [PageMixin],
  data() {
    return {
      showPop: false,
      activeIndex: "1",
      logo: '',
      originalLogo: '', // 未拼接的url，用于判空
      companyName: '',
      init_status: -1,
      time: '',
      adminMenu: [
        {
          index: "1",
          icon: '/admin/imgs/dashboard_manager.png',
          active_icon: '/admin/imgs/dashboard_manager_selected.png',
          title: '仪表盘',//Dashboard
          path: '/guide_start',
          children: []
        },{
          index: "3",
          icon: '/admin/imgs/meet_manager.png',
          active_icon: '/admin/imgs/meet_manager_selected.png',
          title: '会议预定',
          children: [
            {
              index: "1",
              title: '单次会议预定',
              path: '/single_meet'
            },
            {
              index: "2",
              title: '循环会议预定',
              path: '/cycle_meet'
            },
            {
              index: "3",
              title: '历史会议',
              path: '/meet_list'
            }
          ]
        },
        {
          index: "2",
          icon: '/admin/imgs/user_manager.png',
          active_icon: '/admin/imgs/user_manager_selected.png',
          title: '用户管理',
          children: [
            {
              index: "1",
              title: '用户列表',
              path: '/user_list'
            },
            {
              index: "2",
              title: '用户组配置',
              path: '/user_group'
            }
          ]
        },
        {
          index: "4",
          icon: '/admin/imgs/area_manager.png',
          active_icon: '/admin/imgs/area_manager_selected.png',
          title: '区域&会议管理',
          children: [
            {
              index: "1",
              title: '编辑区域',
              path: '/edit_area'
            },
            {
              index: "2",
              title: '编辑会议室',
              path: '/edit_meet'
            },
          ]
        },
        {
          index: "5",
          icon: '/admin/imgs/terminal_manager.png',
          active_icon: '/admin/imgs/terminal_manager_selected.png',
          title: '终端设备管理',
          path: '/terminal_manager',
          children: []
        },
        {
          index: "6",
          icon: '/admin/imgs/check_circle.png',
          active_icon: '/admin/imgs/check_circle_selected.png',
          title: '系统设置',
          children: [
            {
              index: "1",
              title: '应用设置',
              path: '/application_setting'
            },
            {
              index: "2",
              title: '企业微信设置',
              path: '/wxwork_setting'
            },
            {
              index: "3",
              title: '会议规则设置',
              path: '/meet_rule'
            },
            {
              index: "4",
              title: '用户同步',
              path: '/sync_user'
            },
            {
              index: "5",
              title: '日历同步',
              path: '/sync_calendar'
            },
          ]
        },
        {
          index: "7",
          icon: '/admin/imgs/help_manager.png',
          active_icon: '/admin/imgs/help_manager_selected.png',
          title: '帮助中心',
          children: [
            {
              index: "1",
              title: '操作手册下载',
              path: '/manual'
            },
            {
              index: "2",
              title: '常见问题',
              path: '/questions'
            },
            // {
            //   index: 3,
            //   title: '问题反馈',
            //   path: '/feedback'
            // }
          ]
        },

      ],
      memberMenu: [
        {
          index: "1",
          icon: '/admin/imgs/dashboard_manager.png',
          active_icon: '/admin/imgs/dashboard_manager_selected.png',
          title: '仪表盘',//Dashboard
          path: '/guide_start',
          children: []
        },{
          index: "3",
          icon: '/admin/imgs/meet_manager.png',
          active_icon: '/admin/imgs/meet_manager_selected.png',
          title: '会议预定',
          children: [
            {
              index: "1",
              title: '单次会议预定',
              path: '/single_meet'
            },
            {
              index: "2",
              title: '循环会议预定',
              path: '/cycle_meet'
            },
            {
              index: "3",
              title: '历史会议',
              path: '/meet_list'
            }
          ]
        },
        {
          index: "7",
          icon: '/admin/imgs/help_manager.png',
          active_icon: '/admin/imgs/help_manager_selected.png',
          title: '帮助中心',
          children: [
            {
              index: "1",
              title: '操作手册下载',
              path: '/manual'
            },
            {
              index: "2",
              title: '常见问题',
              path: '/questions'
            },
            // {
            //   index: 3,
            //   title: '问题反馈',
            //   path: '/feedback'
            // }
          ]
        },

      ]
    }
  },
  mounted() {
    // import.meta.env.VITE_BASE_PATH
    console.log('App mounted user:', this.userInfo.username)
    this.syncTime()
    this.getSetting()
    this.$forceUpdate()

  },
  methods: {
    syncTime() {
      this.getTime()
      setInterval(() => {
        this.getTime()
      }, 30000)
    },
    getTime() {
      Api.getMeetRooms({})
        .then(({ data }) => {
          console.log(data)
          this.time = data.time
        })
    },
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
        "init_status": 1,
      }).then(({ code, data, msg }) => {
        this.originalLogo = data.logo_dir
        this.logo = data.server_address + data.logo_dir + '?time=' + new Date().getTime() // 强制刷新logo
        this.companyName = data.company_name
        this.init_status = data.init_status
      })
    },
    toPath(path) {
      if (path === '/guide_start' && this.init_status !== 0) {
        this.switchTab('../single_meet')
        return
      }
      this.switchTab(path)
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
  min-height: calc(100vh - 75px);
  height: auto;
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
  width: 100%;

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

.left-menu-placeholder {
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

/*表格外间距*/
.table-wrapper {
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


/* 会议展示公共代码 */
.table-container {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: white;
  height: 620px;
  margin: 0px;
  padding: 0;
  flex: 1;
}

.calendar-scrollbar-wrapper {
  display: flex;
  flex-direction: row;
  height: auto;
  width: auto;
  background-color: white;
}

.placeholder-view {
  min-width: 99px;
  width: 46px !important;
  height: 80px;
  background-color: clear;
}

.day-header-wrapper {
  background-color: white;
  display: flex;
  flex-direction: row;
  height: 80px;
  width: auto;
}

.day-header {
  display: flex;
  flex-direction: column;
  text-align: center;
  color: #FFFFFF;
  font-size: 12px;
  padding: 9px 0;
  font-weight: 600;
  border-bottom: 2px solid #9A9A9A;
  /* // -webkit-line-clamp: 2; */
}

.day-header-wrapper:last-child {
  border-right: 1px solid #9A9A9A;
}

.room-header-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: 3px;
}

.room-header {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 12px;
  text-align: center;
  padding: 5px 0px;
  padding-bottom: 0px;
  font-weight: bold;
  width: 100%;
  line-height: 45px;
  height: 45px;
  text-align: center;
  background-color: white;
  border-left: 1px solid #9A9A9A;
  border-bottom: 1px solid #9A9A9A;
  position: relative;
}

.slots-time-scrollbar {
  margin-top: 25px;
  width: 90px;
}

.time-slots-wrapper {
  display: flex;
  flex-direction: column;
  width: 80px;
}

.time-slot {
  height: 40px;
  color: #000;
  font-size: 12px;
  color: #000000;
  font-weight: normal;
  font-family: PingFangSC-regular;
  text-align: right;
  width: 80px;
}

.content-meet-scrollbar {
  height: 550px;
  width: 100%;
  margin-left: 15.5px;
  padding: 0px;
  background-color: white;
  position: relative;
}

.calendar-header {
  display: flex;
  flex-direction: row;
  background-color: #f0f0f0;
  text-align: center;
  border-right: 1px solid #9A9A9A;
  font-weight: bold;
  color: white;
  position: relative;
}

.room-wrapper:first-child {
  /* // border-left: 1px solid #9A9A9A; */
}

.room-wrapper:last-child {
  border-right: 1px solid #9A9A9A;
}

.room-wrapper {
  width: 229px;
  margin: 0px;
  padding: 0px;
  background-color: white;
}

.empty-abled-meet-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 100px;
  width: 60px;
  height: 40px;
  transition: all 0.3s ease;
  padding: 0px 10px;
  z-index: 100;
}

.empty-meet-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 100px;
  width: 60px;
  height: 40px;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 0px 10px;
  z-index: 100;
  pointer-events: auto;
}

.empty-meet-duration {
  color: white;
  font-size: 12px;
}

.empty-meet-reason {
  color: white;
  font-size: 12px;
}

#content-scrollbar .empty-meet-div:hover {
  color: white;
  background-color: #CECECE;
  z-index: 100;
}

#content-scrollbar .empty-abled-meet-div:hover {
  color: white;
  background-color: #6a1b9a;
  z-index: 100;
}

.room-name {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  height: 800px;
  padding: 10px;
  padding-bottom: 0px;
  border-right: 1px solid #9A9A9A;
  background-color: #FFFFFF;
}

.room-meet-event {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 5px;
  right: 5px;
  background-color: #e1f5fe;
  width: 218px;
  padding: 0px 5px;
  margin: 2px 0;
  color: #000;
  font-size: 12px;
  /* // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); */
  border-left: 10px solid #54BCBD;
  opacity: 1;
  z-index: 101;
}

.room-meet-in-event {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 5px;
  right: 5px;
  background-color: rgba(189, 49, 36, 0.11);
  width: 218px;
  padding: 0px 5px;
  margin: 2px 0;
  color: #000;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-left: 10px solid #BD3124;
  z-index: 101;
}

.room-meet-timeout-event {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 5px;
  right: 5px;
  background-color: rgba(206, 206, 206, 0.14);
  width: 218px;
  margin: 2px 0;
  padding: 0px 5px;
  color: #000;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-left: 10px solid #9A9A9A;
  z-index: 101;
}

.event-title {
  font-weight: bold;
  margin-bottom: 2px;
  width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 101;
}

.event-time,
.event-person {
  font-size: 10px;
  color: #555;
  z-index: 101;
}

.slider-container-horizontal {
  position: fixed;
  z-index: 999;
  width: calc(100vw - 189px - 40px);
  bottom: 20px;
  right: 20px;
}
</style>
