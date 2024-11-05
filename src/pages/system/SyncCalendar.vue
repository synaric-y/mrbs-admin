<template>
  <Layout :title="$t('setting.calendar_synchronize_setting.title')" section-left-padding="50">
    <template #section>
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
    </template>
    <template #btns>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button >取消</el-button>
    </template>
  </Layout>
</template>



<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import TestButton from "@/components/TestButton.vue";
import Layout from "@/components/Layout.vue";

export default {
  components: {Layout, TestButton},
  mixins: [PageMixin],
  data() {
    return {

      form:{
        hosts:'',
        syncMethod:'',
        syncMinute:'',
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
  created() {
    const that = this
    Api.getVariables({
      "Exchange_server": 1,
      "Exchange_sync_type": 1,
      "Exchange_sync_interval": 1,
    }).then(({code, data, msg}) => {
      if (code == 0) {
        console.log(data)

        that.form = {
          hosts: data.Exchange_server || '',
          syncMethod: data.Exchange_sync_type || '',
          syncMinute: data.Exchange_sync_interval || '',
        }
      } else {
        ElMessage.error({
          message: '设置获取失败',
        })
      }
    })
    .catch(e => {
      console.log(e)
    })
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
    submit(){
      console.log(this.form)

      if(this.exchangeStatus!=='tested'){
        ElMessage.error({
          message: 'Exchange连通性未测试，请先测试',
        })
        return
      }

      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('submit!')

          Api.setVariables(
              {
                "init_status": 3,
                "Exchange_server": this.form.hosts,
                "Exchange_sync_type": this.form.syncMethod,
                "Exchange_sync_interval": this.form.syncMinute,
              }
          ).then(({code,data})=>{
            if(code==0){
              ElMessage.success({
                message: '设置成功',
              })
              setTimeout(()=>{
                location.reload() // 刷新页面
              },1000)
            }else{
              ElMessage.error({
                message: '设置失败',
              })
            }
          })
          .catch(e=>{
            ElMessage.error({
              message: '设置失败',
            })
            console.log(e)
          })

        } else {
          console.log('error submit!')
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



<style lang="scss" scoped>
</style>