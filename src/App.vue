<script>
import router from "@/router/index.js"
import {PageMixin} from "@/pages/PageMixin.js";
import {STORAGE} from "@/config.js";

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
      if (!user) {
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
    }
  },
  mounted() {
    this.getCacheUserInfo()
    console.log('~~', this.userInfo)
  }
}
</script>

<template>
  <div class="container">
    <div class="nav">
      <div class="nav-inner">

        <template v-for="(item, index) in tabs" :index="index">
          <el-button :class="['nav-button', currentTab == item.path ? '' : 'nav-button-inactive']" type="primary" round
                     size="large" @click="switchTab(item.path)"
                     v-if="item && (item.level == 0 || userInfo && (userInfo.level >= item.level))">{{ $t(item.name) }}</el-button>
        </template>
        <div style="flex: 1"></div>
        <el-popover :visible="showPop" placement="bottom" :width="160">
          <el-button style="width: 135px" size="small" type="primary" @click="toLogout">
            {{$t('base.logout')}}
          </el-button>
          <template #reference>
            <div class="username-wrapper" @click="toProfile">
              <img style="width: 30px; height: 30px" src="/imgs/profile.png" v-if="!userInfo || !userInfo.display_name" />
              <div class="username">{{userInfo ? userInfo.display_name : ''}}</div>
            </div>
          </template>
        </el-popover>
      </div>
    </div>
<!--    <transition name="el-fade-in" mode="out-in">-->
<!--      <keep-alive>-->
<!--        <router-view></router-view>-->
<!--      </keep-alive>-->
<!--    </transition>-->

    <router-view v-slot="{ Component, route }">
      <transition name="el-fade-in" mode="out-in">
        <keep-alive>
          <div :key="route.path">
            <component :is="Component"></component>
          </div>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<style>

/*总容器*/
.container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #EFEFEF;
  box-sizing: border-box;
  position: fixed;
}

/*内容页容器*/
.container-sub-page {
  width: 100vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
}

/*内容页main部分*/
.container-sub-page-main {
  min-width: 930px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/*顶部导航栏*/
.nav {
  min-width: 724px;
  height: 75px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: white;
  border-bottom: 0.06rem solid rgba(187,187,187,1);
  box-sizing: border-box;
  padding: 0 75px 0 75px ;
}

.nav-inner {
  width: 930px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

/*顶部导航按钮*/
.nav-button {
  min-width: 128px;
  height: 32px;
  line-height: 32px;
  box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.4);
  margin-right: 22px;
  font-size: 20px;
  border-radius: 126px;
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
}

.username {
  font-size: 18px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin-left: 10px;
}
</style>
