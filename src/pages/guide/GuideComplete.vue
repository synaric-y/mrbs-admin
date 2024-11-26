<template>
  <Layout :title="$t('guide.basics_title')" :section-center="true">
    <template #section>
      <ProgressBar :active-index="5"/>
      <div class="guide-success">
        <img class="guide-img" src="../../../public/imgs/guide_success.png" alt="">
        <div class="guide-success-text">{{ $t('guide.finished_guide_set')}}<br>
          {{ $t('guide.try_create_meet')}}</div>
      </div>
    </template>
    <template #btns>
      <el-button class="btn" @click="finishedGuide">{{ $t('guide.finished_guide') }}</el-button>
      <el-button class="btn" type="primary" @click="switchTab('../single_meet')">{{ $t('guide.schedule_meet') }}</el-button>
      <el-button class="btn">{{ $t('guide.add_meet') }}</el-button>
    </template>
  </Layout>
</template>

<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import { Text } from "vue";
import ProgressBar from "@/pages/guide/ProgressBar.vue";
import Layout from "@/components/Layout.vue";
export default {
  components: {Layout, ProgressBar},
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
    finishedGuide() {
      this.switchTab('../single_meet')
    },
  },
  mounted() {

  },
  unmounted() {

  }
}
</script>

<style  lang="scss" scoped>
.sub-page-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  background-color: white;
  padding: 20px;
}

.page-title {
  font-size: 20px;
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
  gap: 20px;
  width: 100%;
  height: 200px;
  justify-content: center;
  align-items: center;
}

.guide-img {
  width: 48px;
  height: 48px;
}

.guide-success-text {
  text-align: center;
  line-height: 1.5;
  font-size: 14px;
}

.sub-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 30px;
  width: 100%;
  margin-top: 95px;
  padding-bottom: 15px;
}

.btn {
  padding: 0 15px;
  height: 36px;
  line-height: 36px;
}

</style>