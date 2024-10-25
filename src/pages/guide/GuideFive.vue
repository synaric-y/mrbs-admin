<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">


      <div class="sub-page-content">

        <div class="page-title">会议系统配置向导</div>
        <div class="guide-progress">
          <div class="guide-item">
            <img src="../../../public/imgs/checked.png" alt="">
            <span class="guide-title" style="margin-left: 12px;">用户同步配置</span>
          </div>
          <div class="guide-item">
            <img src="../../../public/imgs/checked.png" alt="">
            <span class="guide-title" style="margin-left: 12px;">日历同步配置</span>
          </div>
          <div class="guide-item">
            <img src="../../../public/imgs/checked.png" alt="">
            <span class="guide-title" style="margin-left: 12px;">添加会议室</span>
          </div>
          <div class="guide-item">
            <img src="../../../public/imgs/checked.png" alt="">
            <span class="guide-title" style="margin-left: 12px;">完成</span>
          </div>
        </div>
        <div class="guide-success">
          <img class="guide-img" src="../../../public/imgs/guide_success.png" alt="">
          <div class="guide-success-text">您已经完成初始化配置！<br>
            现在，您可以继续添加会议室，或者尝试预约一个会议。</div>
        </div>

        <div class="sub-buttons">
          <div class="buttons-wrapper">
            <span class="jump-btn">结束向导</span>
            <span class="pre-btn" @click="switchTab('/')">预约会议</span>
            <span class="not-btn">继续添加会议室</span>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import { Text } from "vue";
export default {
  mixins: [PageMixin],
  data() {
    return {
      mode: 'add',
      form: {
        username: '',
        password: ''
      },
    }
  },
  methods: {

  },
  mounted() {

  },
  unmounted() {

  }
}
</script>

<style scoped>
.sub-page-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  height: calc(100vh - 95px);
  background-color: white;
  padding: 0;
  margin: 0;
  position: relative;
}

.page-title {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 20px;
}

.guide-progress {
  display: flex;
  flex-direction: row;
  margin-left: 72px;
  margin-top: 75px;
}

.guide-item {
  display: flex;
  flex-direction: row;
  margin-left: 72px;
}

.guide-number-active {
  width: 29px;
  height: 28px;
  border-radius: 14px;
  line-height: 28px;
  text-align: center;
  opacity: 1;
  background: #591BB7;
  color: #FFFFFF;
}

.guide-number {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 14px;
  opacity: 1;
  background: #F2F3F5;
  color: #4E5969;
}

.guide-title-active {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  color: #591BB7;
}

.guide-title {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #4E5969;
}

.guide-tips {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  color: #3D3D3D;
  margin-top: 32px;
  margin-left: -160px;
  align-self: center;
}

.guide-success {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-left: -200px;
  margin-top: 108px;
}

.guide-img {
  width: 48px;
  height: 48px;
}

.guide-success-text {
  text-align: center;
}

.sub-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 95px;
  padding-bottom: 15px;
}

.buttons-wrapper {
  width: 500px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-left: -400px;
}

.jump-btn {
  padding: 0 15px;
  border-radius: 2px;
  opacity: 1;
  color: #1D2129;
  background: #F2F3F5;
  height: 36px;
  line-height: 36px;
}

.pre-btn {
  padding: 0 15px;
  border-radius: 2px;
  opacity: 1;
  background: #591BB7;
  color: white;
  height: 36px;
  line-height: 36px;
}

.next-btn {
  padding: 0 15px;
  border-radius: 2px;
  opacity: 1;
  background: #591BB7;
  color: white;
  height: 36px;
  line-height: 36px;
}

.not-btn {
  padding: 0 15px;
  border-radius: 2px;
  opacity: 1;
  color: #1D2129;
  background: #F2F3F5;
  height: 36px;
  line-height: 36px;
}
</style>