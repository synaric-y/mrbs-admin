<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      
      <div class="sub-page-content">

        <div class="page-title">会议系统配置向导</div>
        <div class="sub-content">
          <div class="sub-text">
                  欢迎使用XXX会议系统。<br>
            接下来，我们诚挚地邀请您为系统做初始化配置，<br>
            仅需数分钟，您将迅速熟悉系统，并完成配置。</div>
          <div class="sub-buttons">
            <el-button class="btn" type="primary" @click="switchTab('/guide_two')">开始</el-button>
            <el-button class="btn" @click="switchTab('/')">下次再说</el-button>
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
  align-items: center;
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
.sub-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* background-color: #591BB7; */
}
.sub-text {
  width: 456px;
  padding: 0 2%;
  font-family: PingFang SC;
  font-size: 18px;
  font-weight: 500;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  color: #3D3D3D;
  /* background-color: red; */
}
.sub-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 48px;
}
.btn {
  padding: 0 15px;
  height: 36px;
  line-height: 36px;
}
</style>