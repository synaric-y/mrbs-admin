<template>
  <div class="bg">
    <div class="left">
      <div class="svg-container">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" version="1.1"
             width="539.9041137695312" height="389.1199951171875" viewBox="0 0 539.9041137695312 389.1199951171875">
          <g>
            <path d="M43.776,0C43.776,0,160.512,0,160.512,0C160.512,0,116.736,389.12,116.736,389.12C116.736,389.12,0,389.12,0,389.12C0,389.12,43.776,0,43.776,0C43.776,0,43.776,0,43.776,0ZM233.472,0C233.472,0,350.208,0,350.208,0C350.208,0,306.432,389.12,306.432,389.12C306.432,389.12,189.696,389.12,189.696,389.12C189.696,389.12,233.472,0,233.472,0C233.472,0,233.472,0,233.472,0ZM423.168,0C423.168,0,539.904,0,539.904,0C539.904,0,496.128,389.12,496.128,389.12C496.128,389.12,379.392,389.12,379.392,389.12C379.392,389.12,423.168,0,423.168,0C423.168,0,423.168,0,423.168,0Z"
                  fill="#7a49c5" fill-opacity="1"/>
          </g>
          <g transform="translate(48.64,0)">
            <path d="M0,0C0,0,228.608,0,228.608,0C228.608,0,228.608,116.736,228.608,116.736C228.608,116.736,0,116.736,0,116.736C0,116.736,0,0,0,0C0,0,0,0,0,0ZM184.832,272.384C184.832,272.384,413.44,272.384,413.44,272.384C413.44,272.384,413.44,389.12,413.44,389.12C413.44,389.12,184.832,389.12,184.832,389.12C184.832,389.12,184.832,272.384,184.832,272.384C184.832,272.384,184.832,272.384,184.832,272.384Z"
                  fill="#7a49c5" fill-opacity="1"/>
          </g>
        </svg>
      </div>

    </div>
    <div class="right">
      <div class="login-form">
        <div class="title">欢迎使用会议预约系统</div>

        <el-form :model="form" label-width="auto" style="max-width: 530px">

          <div class="label">用户名</div>
          <el-form-item>
            <el-input class="form-item-input" v-model="form.username" :placeholder="$t('login.accountPH')" />
          </el-form-item>

          <div class="label">密码</div>
          <el-form-item>
            <el-input class="form-item-input" show-password :placeholder="'请输入密码'" v-model="form.password" />
          </el-form-item>

          <el-button class="login-btn" type="primary" size="default" @click="submit">{{ $t("base.login") }}</el-button>
          <div class="footer">
            <el-checkbox v-model="form.rememberPassword" label="记住密码" size="large" />
            <el-link class="forget-password" type="primary" @click="forgetPassword">忘记密码？</el-link>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {Api} from "@/network/api.js";
import {PageMixin} from "@/pages/PageMixin.js";
import {STORAGE} from "@/const.js";
import {ElMessage} from "element-plus";

export default {
  mixins: [PageMixin],
  data() {
    return {
      mode: 'add',
      form: {
        username: '',
        password: '',
        rememberPassword: false
      },
    }
  },
  methods: {
    submit() {
      Api.login(this.form).then(({data, code, msg}) => {
        if (code == 0) {
          this.login(data)
          this.switchTab('../single_meet')
        } else {
          ElMessage.error('登录失败！')
        }
      })
    },
    forgetPassword(){
      console.log(76)
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

<style lang="scss" scoped>

  .logo {
    width: 207px;
    height: 51px;
    margin-top: 80px;
    margin-bottom: 50px;
  }


  .bg{
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    display: flex;
    
    .left{
      background-color: #591bb7;
      width: 30%;
      flex-shrink: 0;
      display: flex;
      align-items: center;

      overflow: hidden;
    }
    
    .right{
      flex: 1;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }


    .title{
      font-family: PingFang SC;
      font-size: 22px;
      font-weight: 600;
      color: #591bb7;
      margin-bottom: 40px;
      text-align: center;
    }

    .label{
      font-family: PingFang SC;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      line-height: 2;
    }

    .login-btn{
      height: 40px;
      line-height: 40px;
      width: 64px;
      margin-top: 30px;
      font-size: 13px;
    }

    .footer{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;

      .forget-password{
        font-size: 13px;
      }
    }


    .section{
      padding-left: 50px;
    }

    .form-item {
      display: flex;
      flex-direction: row;
      height: 50px;
      align-items: center;
      gap: 10px;
    }
    .form-ad {
      display: flex;
      flex-direction: row;
      height: 50px;
      align-items: center;
    }
    .form-item-tip {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      text-align: right;
      letter-spacing: 0px;
      color: #4E5969;
      margin-right: 28px;
      width: 400px;
      /* background-color: red; */
    }
    .form-item-img {
      width: 153px;
      height: 53px;
    }
    .form-item-input {
      width: 400px;
      height: 40px;
    }
    .form-item-btn {
      border-radius: 2px;
      opacity: 1;
      background: #591BB7;
      box-sizing: border-box;
      padding: 0 15px;
      border: 1px solid #000000;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: normal;
      height: 33px;
      line-height: 33px;
      text-align: right;
      display: flex;
      align-items: center;
      letter-spacing: 0px;
      font-variation-settings: "opsz" auto;
      color: #FFFFFF;
      margin-left: 20px;
    }

    .btns{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin-top: 15px;
      padding-bottom: 15px;
    }
  }


</style>