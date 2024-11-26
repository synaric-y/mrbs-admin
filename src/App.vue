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
      // if (path === '/guide_start' && this.init_status !== 0) {
      //   this.switchTab('../single_meet')
      //   return
      // }
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #EFEFEF;
}

/*内容页容器*/
.container-sub-page {
  width: calc(100vw - 189px);
  min-height: calc(100vh - 75px);
  height: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  padding: 0;
  margin: 0;
  background: #EFEFEF;
}

/*内容页main部分*/
.container-sub-page-main {
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: scroll;
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
}

/*隐藏滚动条*/
::-webkit-scrollbar {
  display: none;
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
