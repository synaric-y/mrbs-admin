<template>
  <div class="container">
    <div class="nav_wrapper" v-if="!isLoginPage">
      <div class="nav" >
        <div class="nav-inner">
          <div class="nav-left">XX公司 会议预约平台管理</div>
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
            <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
              <el-menu-item index="1">
                <img class="menu_icon" :src="activeIndex.startsWith(1)?'/imgs/dashboard_manager_selected.png':'/imgs/dashboard_manager.png'" alt="#">
                <span @click="switchTab('/guide_one')">Dashboard</span>
              </el-menu-item>
              <el-sub-menu index="2">
                <template #title>
                  <!-- <el-icon>
                    <location  />
                  </el-icon> -->
                  <img class="menu_icon" :src="activeIndex.startsWith(2)?'/imgs/user_manager_selected.png':'/imgs/user_manager.png'" alt="#">
                  <span>用户管理</span>
                </template>
                <el-menu-item index="2-1" @click="switchTab('/user_list')">用户列表</el-menu-item>
                <el-menu-item index="2-2" @click="switchTab('/user_group')">用户组配置</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="3">
                <template #title>
                  <!-- <el-icon>
                    <location />
                  </el-icon> -->
                  <img class="menu_icon" :src="activeIndex.startsWith(3)?'imgs/meet_manager_selected.png':'imgs/meet_manager.png'" alt="#">
                  <span>会议预定</span>
                </template>
                <el-menu-item index="3-1" @click="switchTab('/single_meet')">单次会议预定</el-menu-item>
                <el-menu-item index="3-2" @click="switchTab('/cycle_meet')">循环会议预定</el-menu-item>
                <el-menu-item index="3-3" @click="switchTab('/meet_list')">历史会议</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="4">
                <template #title>
                  <!-- <el-icon>
                    <location />
                  </el-icon> -->
                  <img class="menu_icon" :src="activeIndex.startsWith(4)?'/imgs/area_manager_selected.png':'/imgs/area_manager.png'" alt="#">
                  <span>区域&会议管理</span>
                </template>
                <el-menu-item index="4-1" @click="switchTab('/edit_area')">编辑区域</el-menu-item>
                <el-menu-item index="4-2" @click="switchTab('/edit_meet')">编辑会议室</el-menu-item>
              </el-sub-menu>

              <el-menu-item index="5">
                <!-- <el-icon><icon-menu /></el-icon> -->
                <img class="menu_icon" :src="activeIndex.startsWith(5)?'/imgs/terminal_manager_selected.png':'/imgs/terminal_manager.png'" alt="#">
                <span @click="switchTab('/terminal_manager')">终端设备管理</span>
              </el-menu-item>

              <el-sub-menu index="6">
                <template #title>
                  <!-- <el-icon>
                    <location />
                  </el-icon> -->
                  <img class="menu_icon" :src="activeIndex.startsWith(6)?'/imgs/check_circle_selected.png':'/imgs/check_circle.png'" alt="#">
                  <span>系统设置</span>
                </template>
                <el-menu-item index="6-1" @click="switchTab('/meet_rule')">会议规则设置</el-menu-item>
                <el-menu-item index="6-2" @click="switchTab('/application_seeting')">应用设置</el-menu-item>
                <el-menu-item index="6-3" @click="switchTab('/sync_user')">用户同步</el-menu-item>
                <el-menu-item index="6-4" @click="switchTab('/sync_calendar')">日历同步</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="7">
                <template #title>
                  <!-- <el-icon>
                    <location />
                  </el-icon> -->
                  <img class="menu_icon" :src="activeIndex.startsWith(7)?'/imgs/help_manager_selected.png':'/imgs/help_manager.png'" alt="#">
                  <span>帮助中心</span>
                </template>
                <el-menu-item index="7-1" @click="switchTab('/manual')">操作手册下载</el-menu-item>
                <el-menu-item index="7-2" @click="switchTab('/questions')">常见问题</el-menu-item>
                <el-menu-item index="7-3" @click="switchTab('/feedback')">问题反馈</el-menu-item>
              </el-sub-menu>
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

export default {
  mixins: [PageMixin],
  data() {
    return {
      showPop: false,
      activeIndex: "1",
    }
  },
  methods: {
    handleOpen(key, path) {
      console.log('App handleOpen', key, path)
      this.activeIndex = String(key)
    },
    handleClose(key, path) {
      console.log('App handleClose', key, path)
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
  justify-content: space-between;
  /* align-items: center; */
}

.nav-left {
  margin-left: -60px;
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
