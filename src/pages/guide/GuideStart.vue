<template>
  <Layout :title="$t('guide.basics_title')" :section-center="true">
    <template #section>
      <div class="sub-text">
        {{ $t('guide.guide_start_sub1') }}<br>
        {{ $t('guide.guide_start_sub2') }}<br>
        {{ $t('guide.guide_start_sub3') }}</div>
    </template>s
    <template #btns>
      <el-button class="btn" type="primary" @click="switchTab('/guide_basics')">{{ $t('guide.guide_start') }}</el-button>
      <el-button class="btn" @click="switchTab('../single_meet')">{{ $t('guide.guide_jump') }}</el-button>
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
  components: { Layout },
  mixins: [PageMixin],
  data() {
    return {}
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
}
</style>