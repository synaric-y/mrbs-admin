<template>
  <div class="nav_wrapper">
    <div class="logo-container">
      <img class="logo" :src="logo" alt="logo">
    </div>
    <div class="nav-left">{{companyName}}</div>
    <div style="flex: 1"></div>
    <div class="nav-right">
      <div class="nav-time">{{time}}</div>
      <div class="icon-container">
        <el-icon color="#4e5969"><BellFilled /></el-icon>
      </div>
      <div class="icon-container">
        <el-icon color="#4e5969"><Tools /></el-icon>
      </div>

      <el-dropdown placement="bottom" @command="handleCommand">
        <div class="username-wrapper" @click="toProfile">
          <img style="width: 30px; height: 30px" src="/imgs/profile.png"
               v-if="!userInfo || !userInfo.display_name" />
          <div class="username" style="color: #4E5969;font-size: 14px;">{{ userInfo ? userInfo.display_name : '' }}</div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">{{ $t('base.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { PageMixin } from "@/pages/PageMixin.js";
import router from "@/router/index.js";
import {Api} from "@/network/api.js";
import {BellFilled, Tools} from "@element-plus/icons-vue";

export default {
  components: {Tools, BellFilled},
  mixins: [PageMixin],
  props: ['companyName','logo','time'],
  data() {
    return {
      showPop: false,
    }
  },
  methods: {
    handleCommand(command){
      if(command==='logout') this.toLogout()
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
  }
}

</script>

<style scoped lang="scss">

/*去除dropdown的黑框*/
::v-deep .el-tooltip__trigger:focus-visible {
  outline: unset
}

.nav_wrapper {
  height: 75px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: fixed;
  top: 0;
  z-index: 2003;
  border-bottom: 0.06rem solid rgba(187, 187, 187, 0.5);
  box-shadow: 0 3px 12px 0 rgba(187, 187, 187, 0.5);
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
}

.logo-container{
  width: 55px;
  height: 55px;

  .logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}



.nav-left {
  font-size: 20px;
}

.nav-time {
  font-size: 14px;
  font-weight: 500;
  color: #4E5969;
}

.nav-right {
  /* width: 400px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.icon-container{
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  border-radius: 50%;
  border: 1px solid #ccc;
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

</style>