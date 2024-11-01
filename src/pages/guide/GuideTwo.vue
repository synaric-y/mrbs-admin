<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="page-title">会议系统配置向导</div>

        <ProgressBar :active-index="1"/>


        <div class="section">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">

            <el-form-item label="选择服务">
              <img class="form-item-img" src="../../../public/imgs/ad.png" alt="#">
            </el-form-item>

            <el-form-item prop="hosts" label="服务器地址(hosts)">
              <el-input v-model="form.hosts" class="form-item-input" placeholder="示例:172.16.88.180" />
            </el-form-item>

            <el-form-item prop="port" label="服务器端口(port)">
              <el-input v-model="form.port" class="form-item-input" placeholder="示例:3136" />
            </el-form-item>

            <el-form-item prop="base_dn" label="基础地址(base_dn)">
              <el-input v-model="form.base_dn" class="form-item-input" placeholder="示例:0U=BCC,DC=businessconnectchina,DC=com" />
            </el-form-item>

            <el-form-item prop="username" label="用户名(username)">
              <el-input v-model="form.username" class="form-item-input" placeholder="示例:CN=meet. dap,0U=LDAP,DC=businessconnectchina,DC=com" />
            </el-form-item>

            <el-form-item prop="password" label="密码(password)">
              <el-input type="password" v-model="form.password" class="form-item-input" placeholder="请输入包含数字、字母、特殊符号最低8位密码" />
              <TestButton :status="adStatus" @test="verify"/>
            </el-form-item>

            <el-form-item prop="autoSync" label="开启定时同步">
              <el-switch v-model="form.autoSync" />
            </el-form-item>

            <el-form-item prop="syncDay" label="同步时间">
              <el-select :disabled="!form.autoSync" v-model="form.syncDay" placeholder="Select" size="large" style="width: 100px;margin-right: 10px;">
                <el-option v-for="item in everyDayOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

          </el-form>
        </div>

        <div class="sub-buttons">
          <el-button plain class="btn" @click="jumpGuide">跳过向导</el-button>
          <el-button type="primary" class="btn" @click="switchTab('/guide_one')">上一步</el-button>
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
        port: '',
        base_dn: '',
        username: '',
        password: '',
        syncRange: undefined,
        syncMethod: '用户和用户组',
        autoSync: true,
        syncDay: 1
      },
      adStatus: 'untested',
      rules:{
        hosts: [{ required:true, message: '服务器地址不能为空', trigger: 'blur' }],
        port: [{ required:true, message: '端口号不能为空', trigger: 'blur' },
          { validator: this.portValidator, message: '端口号必须是大于0且小于65536的整数', trigger: 'blur' }],
        base_dn: [{ required:true, message: '请填写基础地址',trigger: 'blur' }],
        username: [
          { required:true, message: '用户名不能为空', trigger: 'blur' },
          { min: 2, max: 200, message: '用户名的字符个数必须在2到200之间', trigger: 'blur' },
        ],
        password: [{ required:true, message:'请输入密码', trigger: 'blur' }]
      },
      adDatasource: [
        {
          value: '1',
          label: 'Level one 1',
          children: [
            {
              value: '1-1',
              label: 'Level two 1-1',
              children: [
                {
                  value: '1-1-1',
                  label: 'Level three 1-1-1',
                },
              ],
            },
          ],
        },
        {
          value: '2',
          label: 'Level one 2',
          children: [
            {
              value: '2-1',
              label: 'Level two 2-1',
              children: [
                {
                  value: '2-1-1',
                  label: 'Level three 2-1-1',
                },
              ],
            },
            {
              value: '2-2',
              label: 'Level two 2-2',
              children: [
                {
                  value: '2-2-1',
                  label: 'Level three 2-2-1',
                },
              ],
            },
          ],
        },
        {
          value: '3',
          label: 'Level one 3',
          children: [
            {
              value: '3-1',
              label: 'Level two 3-1',
              children: [
                {
                  value: '3-1-1',
                  label: 'Level three 3-1-1',
                },
              ],
            },
            {
              value: '3-2',
              label: 'Level two 3-2',
              children: [
                {
                  value: '3-2-1',
                  label: 'Level three 3-2-1',
                },
              ],
            },
          ],
        },
      ],
      groupOptions: [
        {
          value: '用户和用户组',
          label: '用户和用户组',
        }],
      everySecondOptions: [
        {
          value: '5分钟',
          label: '5分钟',
        }, {
          value: '15分钟',
          label: '15分钟',
        }, {
          value: '30分钟',
          label: '30分钟',
        }, {
          value: '1小时',
          label: '1小时',
        }, {
          value: '3小时',
          label: '3小时',
        }, {
          value: '6小时',
          label: '6小时',
        }, {
          value: '12小时',
          label: '12小时',
        }],
      everyDayOptions: [
        {
          value: 1,
          label: '06:00',
        }, {
          value: 2,
          label: '08:00',
        }, {
          value: 3,
          label: '10:00',
        }, {
          value: 4,
          label: '12:00',
        }, {
          value: 5,
          label: '18:00',
        }, {
          value: 6,
          label: '20:00',
        }, {
          value: 7,
          label: '22:00',
        }],
    }
  },
  methods: {
    portValidator(rule, value, callback){

      if(value=='') callback()

      let reg = /^[1-9][0-9]*$/;
      if(reg.test(value) === false) callback(new Error('端口号必须是大于0的整数'))
      else{
        const res = parseInt(value)

        if(!res || res<=0 || res > 65535) callback(new Error('端口号必须是大于0且小于65536的整数'))
        else callback()
      }
    },
    verify(){

      this.$refs.formRef.validate(valid=>{
        if(!valid){
          ElMessage.error({
            message: '表单格式错误',
          })
        }else{
          this.adStatus = 'testing'
          Api.testAD({
            server: this.form.hosts,
            port: this.form.port,
            base_dn: this.form.base_dn,
            username: this.form.username,
            password: this.form.password,
          }).then(({code}) => {
            if(code!==0){
              throw new Error('测试失败')
            }

            this.adStatus = 'tested'
            ElMessage.success({
              message: '测试成功',
            })

          }).catch(e=>{
            this.adStatus = 'untested'
            ElMessage.error({
              message: '测试失败',
            })
          })
        }
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
          {"init_status": 1}
      ).then(res => {
        this.switchTab('/guide_three')
      }).catch(e=>{
        console.log(e)
      })
    },
    nextStep(){
      this.$refs.formRef.validate((valid) => {
        if (valid) {

          if(this.adStatus!=='tested'){
            ElMessage.error({
              message: 'AD连通性未测试，请先测试',
            })
            return
          }

          Api.setVariables(
              {
                "init_status": 1,
                "AD_server": this.form.hosts,
                "AD_port": this.form.port,
                "AD_base_dn": this.form.base_dn,
                "AD_username": this.form.username,
                "AD_password": this.form.password,
                "AD_interval_date": this.form.syncDay,
                "AD_timely_sync": this.form.autoSync?1:0
              }
          ).then(res => {
            console.log(res)
            if(res?.code==0){
              ElMessage.success({
                message: '设置成功',
              })
              this.switchTab('/guide_three')
            }else{
              ElMessage.error({
                message: '设置失败',
              })
            }
          }).catch(e=>{
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

.form-item {
  display: flex;
  flex-direction: row;
  height: 50px;
  align-items: center;
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
  height: 43px;
}

.form-item-input {
  width: 400px;
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
  line-height: 22px;
  text-align: right;
  display: flex;
  align-items: center;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  color: #FFFFFF;
  margin-left: 20px;
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