
<template>
  <Layout :title="$t('setting.wxwork_setting.title')" section-left-padding="50">
    <template #section>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" style="max-width: 650px">
        <el-form-item label="企微corpId" prop="corpId">
          <div class="form-item-content">
            <el-input class="form-item-input" v-model="form.corpId" />
          </div>
        </el-form-item>
        <el-form-item label="企微secret" prop="secret">
          <div class="form-item-content">
            <el-input v-model="form.secret" class="form-item-input" placeholder="请输入" />
          </div>
        </el-form-item>
        <data value=""></data>
        <el-form-item label="企微agentId" prop="agentId">
          <div class="form-item-content">
            <el-input v-model="form.agentId" class="form-item-input" placeholder="请输入" />
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template #btns>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="back">取消</el-button>
    </template>
  </Layout>
</template>

<script>
import {Api} from "@/network/api.js";
import {PageMixin} from "@/pages/PageMixin.js";
import {STORAGE} from "@/const.js";
import {ElMessage} from "element-plus";
import {Clock, Monitor, User} from "@element-plus/icons-vue";
import {HOST} from "@/config.js";
import Layout from "@/components/Layout.vue";
const SECOND_PER_MINUTE = 60


export default {
  components: {Layout},
  mixins: [PageMixin],
  data() {
    return {
      form: {
        corpId: '',
        secret: '',
        agentId: '',
      },
      rules: {
        corpId: [
          {required: true, message: '请输入corpId', trigger: 'blur'},
        ],
        secret: [
          {required: true, message: '请输入secret', trigger: 'blur'},
        ],
        agentId: [
          {required: true, message: '请输入agentId', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
    const that = this
    Api.getVariables({
      "corpid": 1,
      "secret": 1,
      "agentid": 1,
    }).then(({code, data, msg}) => {
      if (code == 0) {
        console.log(data)

        that.form = {
          ...that.form,
          corpId: data.corpid,
          secret: data.secret,
          agentId: data.agentid,
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
    submit() {
      console.log(this.form)
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('submit!')

          Api.setVariables(
              {
                "init_status": 3,
                "corpid": this.form.corpId,
                "secret": this.form.secret,
                "agentid": this.form.agentId,
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


<style scoped lang="scss">

</style>