<script>
import {Api} from "@/network/api.js";

export default {

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
    login() {
      Api.login(this.form)
    }
  },
  mounted() {
  }
}
</script>

<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <img class="logo" src="/logo-large.png">

      <el-form :model="form" label-width="auto" style="max-width: 530px">

        <el-form-item :label="$t('login.account')">
          <el-input v-model="form.username" :placeholder="$t('accountPH')" />
        </el-form-item>

        <el-form-item :label="$t('login.password')">
          <el-input v-model="form.password" />
        </el-form-item>

        <el-button style="margin-top: 30px" type="primary" size="default" @click="login">{{ $t("base.login") }}</el-button>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped>

  .logo {
    width: 207px;
    height: 51px;
    margin-top: 80px;
    margin-bottom: 50px;
  }
</style>