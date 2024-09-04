<script>
import {Api} from "@/network/api.js";
import {PageMixin} from "@/pages/PageMixin.js";
import {STORAGE} from "@/config.js";

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
    submit() {
      Api.login(this.form).then((data) => {
        this.login(data)
        this.switchTab('/')
      })
    }
  },
  mounted() {
    this.enterLogin()
  },
  unmounted() {
    this.exitLogin()
  }
}
</script>

<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <img class="logo" src="/imgs/logo-large.png">

      <el-form :model="form" label-width="auto" style="max-width: 530px">

        <el-form-item :label="$t('login.account')">
          <el-input v-model="form.username" :placeholder="$t('login.accountPH')" />
        </el-form-item>

        <el-form-item :label="$t('login.password')">
          <el-input v-model="form.password" />
        </el-form-item>

        <el-button style="margin-top: 30px" type="primary" size="default" @click="submit">{{ $t("base.login") }}</el-button>
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