<script>
import router from "@/router/index.js"
import {PageMixin} from "@/pages/PageMixin.js";

export default {
  mixins: [PageMixin],
  data() {
    return {
      tabs: [
        {
          path: "/",
          name: "base.home"
        },
        {
          path: "/area",
          name: "base.area"
        },
        {
          path: "/room",
          name: "base.room"
        },
        {
          path: "/user",
          name: "base.user"
        },
      ]
    }
  },
  methods: {
    toProfile() {
      router.replace("/login")
    },
  }
}
</script>

<template>
  <div class="container">
    <div class="nav">
      <div class="nav-inner">

        <el-button :class="['nav-button', currentTab == item.path ? '' : 'nav-button-inactive']" type="primary" round size="large" @click="switchTab(item.path)" v-for="(item, index) in tabs" :index="index">{{ $t(item.name) }}</el-button>
        <div style="flex: 1"></div>
        <img style="width: 30px; height: 30px" src="/profile.png" @click="toProfile" />
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
</style>
