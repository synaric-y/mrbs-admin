<template>
  <Layout :title="$t('guide.basics_title')" :section-center="true">
    <template #section>
      <ProgressBar :active-index="2" />
      <div style="margin-top: 20px;">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
          <el-form-item :label="$t('guide.select_service')">
            <img class="form-item-img" src="../../../public/imgs/ad.png" alt="#">
          </el-form-item>
          <el-form-item prop="hosts" :label="$t('guide.service_url')">
            <el-input v-model="form.hosts" class="form-item-input" :placeholder="$t('guide.example_service')"
              @input="adStatus = 'untested'" />
          </el-form-item>
          <el-form-item prop="port" :label="$t('guide.select_service_port')">
            <el-input v-model="form.port" class="form-item-input" :placeholder="$t('guide.example_port')"
              @input="adStatus = 'untested'" />
          </el-form-item>
          <el-form-item prop="base_dn" :label="$t('guide.select_base_dn')">
            <el-input v-model="form.base_dn" class="form-item-input" :placeholder="$t('guide.example_base_dn')"
              @input="adStatus = 'untested'" />
          </el-form-item>
          <el-form-item prop="username" :label="$t('guide.select_username')">
            <el-input v-model="form.username" class="form-item-input" :placeholder="$t('guide.example_username')"
              @input="adStatus = 'untested'" />
          </el-form-item>
          <el-form-item prop="password" :label="$t('guide.select_password')">
            <el-input type="password" v-model="form.password" class="form-item-input"
              :placeholder="$t('guide.password_placeholder')" @input="adStatus = 'untested'" />
            <TestButton :status="adStatus" @test="verify" />
          </el-form-item>
          <el-form-item prop="autoSync" :label="$t('guide.start_time_sync')">
            <el-switch v-model="form.autoSync" />
          </el-form-item>
          <el-form-item prop="syncDay" :label="$t('guide.sync_time')">
            <el-select :disabled="!form.autoSync" v-model="form.syncDay" :placeholder="$t('base.plzSelect')"
              size="large" style="width: 100px;margin-right: 10px;">
              <el-option v-for="item in everyDayOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #btns>
      <el-button plain class="btn" @click="jumpGuide">{{ $t('guide.jump_guide') }}</el-button>
      <el-button type="primary" class="btn" @click="switchTab('/guide_basics')">{{ $t('guide.pre') }}</el-button>
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
import Layout from "@/components/Layout.vue";

export default {
  components: { Layout, TestButton, ProgressBar },
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
        autoSync: true,
        syncDay: 1
      },
      adStatus: 'untested',
      rules: {
        hosts: [{ required: true, message: this.$t('guide.form_empty_url'), trigger: 'blur' }],
        port: [{ required: true, message: this.$t('guide.form_service_port'), trigger: 'blur' },
        { validator: this.portValidator, message: this.$t('guide.form_limit_port'), trigger: 'blur' }],
        base_dn: [{ required: true, message: this.$t('guide.form_base_service'), trigger: 'blur' }],
        username: [
          { required: true, message: this.$t('guide.form_username'), trigger: 'blur' },
          { min: 2, max: 200, message: this.$t('guide.form_limit_username'), trigger: 'blur' },
        ],
        password: [{ required: true, message: this.$t('guide.form_password'), trigger: 'blur' }]
      },
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
    portValidator(rule, value, callback) {
      if (value == '') callback()
      let reg = /^[1-9][0-9]*$/;
      if (reg.test(value) === false) callback(new Error(this.$t('guide.form_limit_port')))
      else {
        const res = parseInt(value)
        if (!res || res <= 0 || res > 65535) callback(new Error(this.$t('guide.form_limit_port')))
        else callback()
      }
    },
    verify() {
      this.$refs.formRef.validate(valid => {
        if (!valid) {
          ElMessage.error({
            message: this.$t('guide.form_format_error'),
          })
        } else {
          this.adStatus = 'testing'
          Api.testAD({
            server: this.form.hosts,
            port: this.form.port,
            base_dn: this.form.base_dn,
            username: this.form.username,
            password: this.form.password,
          }).then(({ code }) => {
            if (code !== 0) {
              throw new Error(this.$t('guide.test_fail'))
            }
            this.adStatus = 'tested'
            ElMessage.success({
              message: this.$t('guide.test_success'),
            })
          }).catch(e => {
            this.adStatus = 'untested'
            ElMessage.error({
              message: this.$t('guide.test_fail'),
            })
          })
        }
      })
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
        { "init_status": 1 }
      ).then(res => {
        this.switchTab('/guide_calendar')
      }).catch(e => {
        console.log(e)
      })
    },
    nextStep() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {

          if (this.adStatus !== 'tested') {
            ElMessage.error({
              message: this.$t('guide.first_ad_test'),
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
              "AD_timely_sync": this.form.autoSync ? 1 : 0
            }
          ).then(res => {
            console.log(res)
            if (res?.code == 0) {
              ElMessage.success({
                message: this.$t('guide.set_success'),
              })
              this.switchTab('/guide_calendar')
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