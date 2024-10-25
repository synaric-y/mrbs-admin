<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="page-title">会议系统配置向导</div>
        <ProgressBar :active-index="3"/>

        <div class="section">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
            <el-form-item label="会议室名称">
              <el-input class="form-item-input" v-model="form.room_name" placeholder="请输入会议室名称"/>
            </el-form-item>
            <el-form-item label="容纳人数">
              <el-input class="form-item-input" v-model="form.capacity" placeholder="请输入会议室容纳人数"/>
            </el-form-item>

            <el-divider/>

            <el-form-item label="关联第三方日历">
              <img class="form-item-img" src="../../../public/imgs/exchange.png" alt="#">
            </el-form-item>
            <el-form-item label="账号">
              <el-input class="form-item-input" v-model="form.exchange_username" placeholder="请输入三方账号"/>
            </el-form-item>
            <el-form-item label="密码">
              <el-input class="form-item-input" v-model="form.exchange_password" placeholder="请输入三方账号密码" />
            </el-form-item>
          </el-form>
        </div>





        <div class="sub-buttons">
          <el-button plain class="btn" @click="jumpGuide">跳过向导</el-button>
          <el-button type="primary" class="btn" @click="switchTab('/guide_three')">上一步</el-button>
          <el-button plain class="btn" @click="skipCurrentGuide">暂不需要</el-button>
          <el-button type="primary" class="btn" @click="nextStep">下一步</el-button>
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
import ProgressBar from "@/pages/guide/ProgressBar.vue";
export default {
  components: {ProgressBar},
  mixins: [PageMixin],
  data() {
    return {
      form: {
        room_name: '',
        capacity: '',
        exchange_username: '',
        exchange_password: ''
      },
      rules: {
      },
    }
  },
  methods: {
    jumpGuide(){
      Api.setVariables(
          {"init_status": 3}
      ).then(res => {
        this.switchTab('/user_list')
      }).catch(e=>{
        console.log(e)
      })
    },
    skipCurrentGuide(){
      Api.setVariables(
          {"init_status": 3}
      ).then(res => {
        this.switchTab('/guide_five')
      }).catch(e=>{
        console.log(e)
      })
    },
    nextStep() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // Api.addRoom(this.form).then(({data, code, msg}) => {
          //   if (code == 0) {
          //     this.getRoomList()
          //   } else {
          //     ElMessage.error(message)
          //   }
          // })

          Api.setVariables(
              {
                "init_status": 3,
              }
          ).then(res => {
            console.log(res)
            if (res?.code == 0) {
              ElMessage.success({
                message: '设置成功',
              })
              this.switchTab('/guide_five')
            } else {
              ElMessage.error({
                message: '设置失败',
              })
            }
          }).catch(e => {
            ElMessage.error({
              message: '设置失败',
            })
            console.log(e)
          })
        } else {
          ElMessage.error({
            message: '表单格式错误',
          })
        }
      })
    }
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
  background-color: white;
  padding: 20px;
}
.page-title {
  font-size: 20px;
}

.section{
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.form-item-img {
  width: 153px;
  height: 53px;
}

.form-item-input {
  width: 400px;
  height: 33px;
}

.sub-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 30px;
  width: 100%;
  margin-top: 15px;
  padding-bottom: 15px;
}
.btn {
  padding: 0 15px;
  height: 36px;
  line-height: 36px;
}
</style>