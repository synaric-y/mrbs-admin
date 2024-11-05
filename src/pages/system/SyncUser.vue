<template>
  <Layout :title="$t('setting.user_synchronize_setting.title')" section-left-padding="50">
    <template #section>
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

        <el-form-item prop="autoSync" label="开启定时同步">
          <el-switch v-model="form.autoSync" />
        </el-form-item>

        <!--            <el-form-item prop="syncDay" label="同步时间">-->
        <!--              <el-select :disabled="!form.autoSync" v-model="form.syncDay" placeholder="Select" size="large" style="width: 100px;margin-right: 10px;">-->
        <!--                <el-option v-for="item in everyDayOptions" :key="item.value" :label="item.label" :value="item.value" />-->
        <!--              </el-select>-->
        <!--            </el-form-item>-->

      </el-form>
    </template>
    <template #btns>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="back">取消</el-button>
    </template>
  </Layout>
</template>



<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import Layout from "@/components/Layout.vue";

export default {
  components: {Layout},
  mixins: [PageMixin],
  data() {
    return {

      form:{
        hosts:'',
        port:'',
        base_dn:'',
        username:'',
        password:'',
        autoSync:true,
        syncDay:'06:00'
      },
      rules:{
        hosts: [{ required:true, message: '服务器地址不能为空', trigger: 'blur' }],
        port: [{ required:true, message: '端口号不能为空', trigger: 'blur' },
                { validator: this.portValidator, message: '端口号必须是大于0且小于65536的整数', trigger: 'blur' }],
        base_dn: [{ required:true, message: '请填写基础地址',trigger: 'blur' }],
        username: [
            { required:true, message: '用户名不能为空', trigger: 'blur' },
            { min: 2, max: 200, message: '用户名的字符个数必须在2到30之间', trigger: 'blur' },
        ],
        password: [{ required:true, message:'请输入密码', trigger: 'blur' },
                  // {validator: this.pwdValidator, message:'密码强度过低！请输入包含数字、字母、特殊符号最低8位密码', trigger: 'blur' }
        ],
        // syncDay: [{required:true, message:'请选择同步时间', trigger: 'blur'}]
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
  created() {
    const that = this
    Api.getVariables({
      "AD_server": 1,
      "AD_port": 1,
      "AD_base_dn": 1,
      "AD_username": 1,
      "AD_password": 1,
      "AD_interval_date": 1,
    }).then(({code, data, msg}) => {
      if (code == 0) {
        console.log(data)

        that.form = {
          ...that.form,
          hosts:data.AD_server,
          port:data.AD_port,
          base_dn:data.AD_base_dn,
          username:data.AD_username,
          password:data.AD_password,
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
    back() {
      this.$router.go(-1)
    },
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
          Api.setVariables(
              {
                "init_status": 3,
                "AD_server": this.form.hosts,
                "AD_port": this.form.port,
                "AD_base_dn": this.form.base_dn,
                "AD_username": this.form.username,
                "AD_password": this.form.password,
                // "AD_interval_date": 12345,
              }
          ).then(res => {
            console.log(res)
            if(res?.code==0){
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
          }).catch(e=>{
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