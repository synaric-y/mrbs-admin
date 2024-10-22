<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title">用户同步</div>



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
            </el-form-item>

            <el-form-item prop="syncRange" label="同步范围">
              <el-tree-select v-model="form.syncRange" :data="adDatasource" multiple :render-after-expand="false" show-checkbox style="width: 240px" />
            </el-form-item>

            <el-form-item prop="syncMethod" label="同步方式">
              <el-select v-model="form.syncMethod" placeholder="Select" style="width: 240px;">
                <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item prop="autoSync" label="开启定时同步">
              <el-switch v-model="form.autoSync" />
            </el-form-item>

            <el-form-item prop="syncFrequency" label="同步间隔">
              <el-radio-group v-model="form.syncFrequency">
                <el-radio value="1" size="large">每隔</el-radio>
                <el-select v-model="form.syncMinute" placeholder="Select" size="large"
                           style="width: 100px;margin-right: 10px;">
                  <el-option v-for="item in everySecondOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-radio value="2" size="large">每天</el-radio>
                <el-select v-model="form.syncDay" placeholder="Select" size="large" style="width: 100px;margin-right: 10px;">
                  <el-option v-for="item in everyDayOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-radio-group>
            </el-form-item>

          </el-form>
        </div>


        <div class="btns">
          <el-button>取消</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
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

export default {
  mixins: [PageMixin],
  data() {
    return {

      form:{
        hosts:'',
        port:'',
        base_dn:'',
        username:'',
        password:'',
        syncRange: undefined,
        syncMethod:'',
        autoSync:true,
        syncFrequency:'',
        syncMinute:'15分钟',
        syncDay:'06:00'
      },
      rules:{
        hosts: [{ required:true, message: '服务器地址不能为空', trigger: 'blur' }],
        port: [{ required:true, message: '端口号不能为空', trigger: 'blur' },
                { validator: this.portValidator, message: '端口号必须是大于0且小于65536的整数', trigger: 'blur' }],
        base_dn: [{ required:true, message: '请填写基础地址',trigger: 'blur' }],
        username: [
            { required:true, message: '用户名不能为空', trigger: 'blur' },
            { min: 2, max: 30, message: '用户名的字符个数必须在2到30之间', trigger: 'blur' },
        ],
        password: [{ required:true, message:'请输入密码', trigger: 'blur' },
                  {validator: this.pwdValidator, message:'密码强度过低！请输入包含数字、字母、特殊符号最低8位密码', trigger: 'blur' }
        ],
        syncRange: [{type:'array', required:true, message:'请选择同步范围', trigger: 'blur'}],
        syncMethod: [{required:true, message:'请选择同步方式', trigger: 'blur'}],
        syncFrequency: [{required:true, message:'请选择同步间隔', trigger: 'blur'}]
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
          value: '06:00',
          label: '06:00',
        }, {
          value: '08:00',
          label: '08:00',
        }, {
          value: '10:00',
          label: '10:00',
        }, {
          value: '12:00',
          label: '12:00',
        }, {
          value: '18:00',
          label: '18:00',
        }, {
          value: '20:00',
          label: '20:00',
        }, {
          value: '22:00',
          label: '22:00',
        }],
    }
  },
  methods: {
    pwdValidator(rule, value, callback){
      let reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}/;
      if(reg.test(value) === false) callback(new Error('密码强度过低！请输入包含数字、字母、特殊符号最低8位密码'))
      else callback()
    },
    portValidator(rule, value, callback){
      let reg = /^[1-9][0-9]*$/;
      if(reg.test(value) === false) callback(new Error('端口号必须是大于0的整数'))
      else{
        const res = parseInt(value)

        if(!res || res<=0 || res > 65535) callback(new Error('端口号必须是大于0且小于65536的整数'))
        else callback()
      }
    },
    submit(){
      console.log(this.form)
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!')
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
.logo {
  width: 207px;
  height: 51px;
  margin-top: 80px;
  margin-bottom: 50px;
}

.sub-page-content{
  width: 100%;
  height: auto;
  padding: 20px;
  box-sizing: border-box;
  margin: 0;
  position: relative;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background-color: #fff;

  .title{
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 500;
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
    height: 33px;
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