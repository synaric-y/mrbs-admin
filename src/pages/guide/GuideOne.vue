<template>
  <Layout :title="'会议系统配置向导'" :section-center="true">
    <template #section>
      <div class="sub-text">
        欢迎使用XXX会议系统。<br>
        接下来，我们诚挚地邀请您为系统做初始化配置，<br>
        仅需数分钟，您将迅速熟悉系统，并完成配置。</div>
    </template>
    <template #btns>
      <el-button class="btn" type="primary" @click="switchTab('/guide_two')">开始</el-button>
      <el-button class="btn" @click="switchTab('../single_meet')">下次再说</el-button>
    </template>
  </Layout>
</template>

<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import { Text } from "vue";
import Layout from "@/components/Layout.vue";

export default {
  components: {Layout},
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

<style lang="scss" scoped>
.sub-text {
  width: 456px;
  margin-top: 100px;
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
</style>