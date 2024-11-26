<template>
  <Layout :title="$t('guide.basics_title')" :section-center="true">
    <template #section>
      <ProgressBar :active-index="4" />
      <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item :label="$t('guide.meet_name')" prop="room_name">
          <el-input maxlength="30" class="form-item-input" v-model="form.room_name"
            :placeholder="$t('guide.meet_name_placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('guide.capacity_count')" prop="capacity">
          <el-input maxlength="5" class="form-item-input" v-model="form.capacity"
            :placeholder="$t('guide.capacity_count_placeholder')" />
        </el-form-item>
        <el-divider />
        <el-form-item :label="$t('guide.associated_calendar')">
          <img class="form-item-img" src="../../../public/imgs/exchange.png" alt="#">
        </el-form-item>
        <el-form-item :label="$t('guide.account')" prop="exchange_username">
          <el-input :disabled="exchangeStatus === 'testing'" @input="exchangeStatus = 'untested'"
            class="form-item-input" v-model="form.exchange_username" :placeholder="$t('guide.account_placeholder')" />
        </el-form-item>
        <el-form-item :label="$t('guide.password')" prop="exchange_password">
          <el-input :disabled="exchangeStatus === 'testing'" class="form-item-input" v-model="form.exchange_password"
            :placeholder="$t('guide.password_placeholder')" />
          <TestButton :status="exchangeStatus" @test="verify" />
        </el-form-item>
      </el-form>
    </template>
    <template #btns>
      <el-button plain class="btn" @click="jumpGuide">{{ $t('guide.jump_guide') }}</el-button>
      <el-button type="primary" class="btn" @click="switchTab('/guide_calendar')">{{ $t('guide.pre') }}</el-button>
      <el-button plain class="btn" @click="skipCurrentGuide">{{ $t('guide.no_guide') }}</el-button>
      <el-button type="primary" class="btn" @click="nextStep">{{ $t('guide.next') }}</el-button>
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
  components: { Layout, TestButton, ProgressBar },
  mixins: [PageMixin],
  data() {
    return {
      form: {
        room_name: '',
        capacity: '',
        exchange_username: '',
        exchange_password: ''
      },
      exchangeStatus: 'untested',
      rules: {
        room_name: [
          { required: true, message: this.$t('guide.form_empty_room'), trigger: 'blur' },
          { min: 1, max: 30, message: this.$t('guide.form_limit_room'), trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: this.$t('guide.form_empty_capacity_count'), trigger: 'blur' },
          { validator: this.capacityValidator, message: this.$t('guide.form_limit_capacity'), trigger: 'blur' }
        ],
        exchange_username: [{ required: true, message: this.$t('guide.form_empty_username'), trigger: 'blur' },],
        exchange_password: [{ required: true, message: this.$t('guide.form_empty_exchange'), trigger: 'blur' },]
      },
    }
  },
  methods: {
    verify() {
      if (!this.form.exchange_username || this.form.exchange_username === '') {
        ElMessage.error({
          message: this.$t('guide.form_empty_username')
        })
        return
      }
      if (!this.form.exchange_password || this.form.exchange_password === '') {
        ElMessage.error({
          message: this.$t('guide.form_empty_exchange')
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
    capacityValidator(rule, value, callback) {
      let reg = /^[1-9][0-9]*$/;
      if (reg.test(value) === false) callback(new Error(this.$t('guide.form_limit_capacity')))
      else {
        const res = parseInt(value)
        if (!res || res <= 0 || res > 100) callback(new Error(this.$t('guide.form_limit_capacity')))
        else callback()
      }
    },
    jumpGuide() {
      Api.setVariables(
        { "init_status": 3 }
      ).then(res => {
        this.switchTab('../single_meet')
      }).catch(e => {
        console.log(e)
      })
    },
    skipCurrentGuide() {
      Api.setVariables(
        { "init_status": 3 }
      ).then(res => {
        this.switchTab('/guide_complete')
      }).catch(e => {
        console.log(e)
      })
    },
    nextStep() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          Api.setVariables(
            {
              "init_status": 3,
            }
          ).then(res => {
            console.log(res)
            if (res?.code == 0) {
              ElMessage.success({
                message: this.$t('guide.set_success'),
              })
              this.switchTab('/guide_complete')
            } else {
              ElMessage.error({
                message: this.$t('guide.set_fail'),
              })
            }
          }).catch(e => {
            ElMessage.error({
              message: this.$t('guide.set_fail'),
            })
            console.log(e)
          })
        } else {
          ElMessage.error({
            message: this.$t('guide.form_format_error'),
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

<style lang="scss" scoped></style>