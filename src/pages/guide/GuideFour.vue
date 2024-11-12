<template>

  <Layout :title="'会议系统配置向导'" :section-center="true">
    <template #section>
      <ProgressBar :active-index="3"/>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item label="会议室名称" prop="room_name">
          <el-input maxlength="30" class="form-item-input" v-model="form.room_name" placeholder="请输入会议室名称"/>
        </el-form-item>
        <el-form-item label="容纳人数" prop="capacity">
          <el-input maxlength="5" class="form-item-input" v-model="form.capacity" placeholder="请输入会议室容纳人数"/>
        </el-form-item>

        <el-divider/>

        <el-form-item label="关联第三方日历">
          <img class="form-item-img" src="../../../public/imgs/exchange.png" alt="#">
        </el-form-item>
        <el-form-item label="账号" prop="exchange_username">
          <el-input :disabled="exchangeStatus==='testing'" @input="exchangeStatus='untested'" class="form-item-input" v-model="form.exchange_username" placeholder="请输入三方账号"/>
        </el-form-item>
        <el-form-item label="密码" prop="exchange_password">
          <el-input :disabled="exchangeStatus==='testing'" class="form-item-input" v-model="form.exchange_password" placeholder="请输入三方账号密码" />
          <TestButton :status="exchangeStatus" @test="verify"/>
        </el-form-item>
      </el-form>
    </template>
    <template #btns>
      <el-button plain class="btn" @click="jumpGuide">跳过向导</el-button>
      <el-button type="primary" class="btn" @click="switchTab('/guide_three')">上一步</el-button>
      <el-button plain class="btn" @click="skipCurrentGuide">暂不需要</el-button>
      <el-button type="primary" class="btn" @click="nextStep">下一步</el-button>
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
import TestButton from "@/components/TestButton.vue";
import axios from "@/network/axios.js";
import AraleQRCode from "arale-qrcode";
import Layout from "@/components/Layout.vue";
export default {
  components: {Layout, TestButton, ProgressBar},
  mixins: [PageMixin],
  data() {
    return {
      form: {
        room_name: '',
        capacity: '',
        exchange_username: '',
        exchange_password: ''
      },
      exchangeStatus: 'untested', //枚举值untested testing tested
      rules: {
        room_name: [
            { required:true, message: '房间不能为空', trigger: 'blur' },
            { min: 1, max: 30, message: '房间名的字符个数必须在1到30之间', trigger: 'blur' }
        ],
        capacity: [
            { required:true, message: '房间容纳人数不能为空', trigger: 'blur' },
            { validator: this.capacityValidator, message: '房间容纳人数必须是大于0且小于等于100的整数', trigger: 'blur' }
        ],
        exchange_username:[{ required:true, message: 'exchange用户名不能为空', trigger: 'blur' },],
        exchange_password:[{ required:true, message: 'exchange密码不能为空', trigger: 'blur' },]
      },
    }
  },
  methods: {
    verify(){

      if(!this.form.exchange_username || this.form.exchange_username===''){
        ElMessage.error({
          message: 'exchange用户名不能为空！'
        })
        return
      }

      if(!this.form.exchange_password || this.form.exchange_password===''){
        ElMessage.error({
          message: 'exchange密码不能为空！'
        })
        return
      }

      // 测试联通
      // this.exchangeStatus='testing'
      // axios({
      //   url: `${this.form.requestUrl}/web/call.php?act=get_info%2Fadmin`,
      //   method: 'POST',
      //   data: {type:'area'},
      // }).then(({data})=>{
      //   if(data.code!==0){
      //     ElMessage.error({
      //       message: '无效的请求地址'
      //     })
      //     this.exchangeStatus='untested'
      //     return
      //   }
      //
      //   this.exchangeStatus='tested'
      //   ElMessage.success({
      //     message: '请求地址验证成功！'
      //   })
      //
      // }).catch(e=>{
      //   ElMessage.error({
      //     message: '无效的请求地址'
      //   })
      //   this.exchangeStatus='untested'
      // })


    },
    capacityValidator(rule, value, callback){
      let reg = /^[1-9][0-9]*$/;
      if(reg.test(value) === false) callback(new Error('房间容纳人数必须是大于0的整数'))
      else{
        const res = parseInt(value)

        if(!res || res<=0 || res > 100) callback(new Error('房间容纳人数必须是大于0且小于等于100的整数'))
        else callback()
      }
    },
    jumpGuide(){
      Api.setVariables(
          {"init_status": 3}
      ).then(res => {
        this.switchTab('../single_meet')
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

<style  lang="scss" scoped>

</style>