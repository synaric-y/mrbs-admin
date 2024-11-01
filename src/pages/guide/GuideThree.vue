<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">

        <div class="page-title">会议系统配置向导</div>
        <ProgressBar :active-index="2"/>

        <div class="section">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">

            <el-form-item label="选择服务">
              <img class="form-item-img" src="../../../public/imgs/exchange.png" alt="#">
            </el-form-item>

            <el-form-item prop="hosts" label="服务器地址(hosts)">
              <el-input :disabled="exchangeStatus==='testing'" @input="exchangeStatus='untested'" v-model="form.hosts" class="form-item-input" placeholder="示例:172.16.88.180" />
              <TestButton :status="exchangeStatus" @test="verify"/>
            </el-form-item>

            <el-form-item prop="syncMethod" label="同步方式">
              <el-select v-model="form.syncMethod" placeholder="Select" size="large" style="width: 340px">
                <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item prop="syncMinute" label="同步间隔">
              <el-select v-model="form.syncMinute" placeholder="Select" size="large" style="width: 200px;margin-right: 10px;">
                <el-option v-for="item in everySecondOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

          </el-form>
        </div>

        <div class="sub-buttons">
          <el-button plain class="btn" @click="jumpGuide">跳过向导</el-button>
          <el-button type="primary" class="btn" @click="switchTab('/guide_two')">上一步</el-button>
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
import TestButton from "@/components/TestButton.vue";
export default {
  components: {TestButton, ProgressBar},
  mixins: [PageMixin],
  data() {
    return {
      form: {
        hosts: '',
        syncMethod: '',
        syncMinute: '',
      },

      exchangeStatus: 'untested',

      rules:{
        hosts: [{ required:true, message: '服务器地址不能为空', trigger: 'blur' }],
        syncMethod: [{required:true, message:'请选择同步方式', trigger: 'blur'}],
        syncMinute: [{required:true, message:'请选择同步间隔', trigger: 'blur'}]
      },

      groupOptions: [
        {
          value: 1,
          label: '双向，Exchange与系统产生日历相互同步',
        }],
      everySecondOptions: [
        {
          value: 1,
          label: '5秒',
        },
        {
          value: 2,
          label: '10秒',
        },
        {
          value: 3,
          label: '30秒',
        },
        {
          value: 4,
          label: '60秒',
        }
      ],
    }
  },
  methods: {
    verify(){

      if(!this.form.hosts || this.form.hosts===''){
        ElMessage.error({
          message: '服务器地址不能为空',
        })
        return
      }

      this.exchangeStatus = 'testing'
      Api.testExchange({
        server_address: this.form.hosts,
      }).then(({code}) => {
        if(code!==0){
          throw new Error('测试失败')
        }

        this.exchangeStatus = 'tested'
        ElMessage.success({
          message: '测试成功',
        })

      }).catch(e=>{
        this.exchangeStatus = 'untested'
        ElMessage.error({
          message: '测试失败',
        })
      })

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
          {"init_status": 2}
      ).then(res => {
        this.switchTab('/guide_four')
      }).catch(e=>{
        console.log(e)
      })
    },
    nextStep() {
      if(this.exchangeStatus!=='tested'){
        ElMessage.error({
          message: 'Exchange连通性未测试，请先测试',
        })
        return
      }

      this.$refs.formRef.validate((valid) => {
        if (valid) {
          Api.setVariables(
              {
                "init_status": 2,
                "exchange_server": this.form.hosts,
                "exchange_sync_type": this.form.syncMethod,
                "exchange_sync_interval": this.form.syncMinute,
                // "AD_interval_date": 12345,
              }
          ).then(res => {
            console.log(res)
            if (res?.code == 0) {
              ElMessage.success({
                message: '设置成功',
              })
              this.switchTab('/guide_four')
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