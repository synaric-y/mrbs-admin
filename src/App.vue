<template>
  <div class="container">
    <div class="nav_wrapper">
      <div class="nav" v-if="!isLoginPage">
        <div class="nav-inner">

          <div class="nav-left">XX公司 会议预约平台管理</div>
          <div class="nav-right">
            <div class="nav-time">2024年9月10日 12:23</div>
            <div class="nav-alert" style="margin-left: 20px;margin-top: 5px;">
              <img style="width: 20px; height: 20px" src="../public/imgs/setting.png"
                v-if="!userInfo || !userInfo.display_name" />
            </div>
            <div class="nav-setting" style="margin-left: 20px;margin-top: 5px;">
              <img style="width: 20px; height: 20px" src="../public/imgs/setting.png"/>
            </div>
            <div class="nav-user" style="margin-left: 20px;margin-top: 5px;">
              <img style="width: 20px; height: 20px" src="../public/imgs/setting.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="menu-content-wrapper">
      <div class="left-menu">
        <el-col>
          <el-menu default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-menu-item index="1">
              <img class="menu_icon" src="../public/imgs/check-circle.png" alt="#">
              <span @click="switchTab('/guide_one')">Dashboard</span>
            </el-menu-item>

            <el-sub-menu index="2">
              <template #title>
                <!-- <el-icon>
                  <location  />
                </el-icon> -->
                <img class="menu_icon" src="../public/imgs/check-circle.png" alt="#">
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
                <img class="menu_icon" src="../public/imgs/check-circle.png" alt="#">
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
                <img class="menu_icon" src="../public/imgs/check-circle.png" alt="#">
                <span>区域&会议管理</span>
              </template>
              <el-menu-item index="4-1" @click="switchTab('/edit_area')">编辑区域</el-menu-item>
              <el-menu-item index="4-2" @click="switchTab('/edit_meet')">编辑会议室</el-menu-item>
              <el-menu-item index="4-3" @click="switchTab('/bind_terminal')">终端绑定</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="5">
              <!-- <el-icon><icon-menu /></el-icon> -->
              <img class="menu_icon" src="../public/imgs/check-circle.png" alt="#">
              <span @click="switchTab('/terminal_manager')">终端设备管理</span>
            </el-menu-item>

            <el-sub-menu index="6">
              <template #title>
                <!-- <el-icon>
                  <location />
                </el-icon> -->
                <img class="menu_icon" src="../public/imgs/check-circle.png" alt="#">
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
                <img class="menu_icon" src="../public/imgs/check-circle.png" alt="#">
                <span>帮助中心</span>
              </template>
              <el-menu-item index="7-1" @click="switchTab('/manual')">操作手册下载</el-menu-item>
              <el-menu-item index="7-2" @click="switchTab('/questions')">常见问题</el-menu-item>
              <el-menu-item index="7-3" @click="switchTab('/feedback')">问题反馈</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-col>
      </div>
      
      <div class="menu-content">
        <el-main>
        <router-view v-slot="{ Component, route }">
          <transition name="el-fade-in" mode="out-in">
            <keep-alive>
              <div :key="route.path">
                <component :is="Component"></component>
              </div>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
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
      tabs: [
        {
          path: "/",
          name: "base.home",
          level: 0
        },
        {
          path: "/area",
          name: "base.area",
          level: 2
        },
        {
          path: "/room",
          name: "base.room",
          level: 2
        },
        {
          path: "/user",
          name: "base.user",
          level: 2
        },
      ],
      showPop: false
    }
  },
  methods: {
    toProfile() {
      let user = this.userInfo
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
    this.$forceUpdate()
  }
}
</script>

<style>
body {
  display: block;
  margin: 0 !important;
}


/*总容器*/
.container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #EFEFEF;
  background-color: white;
  box-sizing: border-box;
}

/*内容页容器*/
.container-sub-page {
  width: calc(100vw - 200px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  padding: 0;
  margin: 0;
}

/*内容页main部分*/
.container-sub-page-main {
  min-width: 930px;
  max-width: calc(100vw - 200px);
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
  background: red;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 2003;
  top: 0;
  border-bottom: 0.06rem solid rgba(187, 187, 187, 1);
}

.nav-block {
  height: 75px;
  padding: 0 75px 0 75px;
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
  width: 100%;
  padding: 10px;
  margin: 0px;
}

.menu-content-wrapper {
  display: flex;
  margin-top: 70px;
  width: calc(100vw - 200px);
  height: calc(100vh - 145px);
  background-color: white
}

.left-menu {
  width: 200px;
  height: calc(100vh - 100px);
  background-color: white
}

.menu_icon {
  width: 18px;
  height: 18px;
  padding-right: 10px;
}

.menu-content {
  display: flex;
  /* flex: 1; */
  width: calc(100vw - 200px);
  height: calc(100vh - 100px);
  /* background-color: rebeccapurple; */
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

/*表头*/
.tb-header {
  color: #333333;
  font-size: 18px;
}

/*内容页标题的容器*/
.sub-title-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 40px;
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
</style>
