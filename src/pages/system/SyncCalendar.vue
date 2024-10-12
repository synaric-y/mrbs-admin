<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div>
        <h2>同步日历</h2>
        <p>欢迎来到同步日历！</p>
      </div>
    </el-main>
  </el-container>
</template>



<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";

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
.logo {
  width: 207px;
  height: 51px;
  margin-top: 80px;
  margin-bottom: 50px;
}
</style>