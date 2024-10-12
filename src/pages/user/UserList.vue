<template>
  <el-container class="container-sub-page">

      <div class="main-wrapper">
        <h2>用户列表</h2>
        <p>欢迎来到用户列表！</p>
      </div>
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
.main-wrapper {
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 0;
  margin: 0;
}
</style>