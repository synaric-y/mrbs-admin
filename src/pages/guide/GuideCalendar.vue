<template>
  <Layout :title="$t('guide.basics_title')" :section-center="true">
    <template #section>
      <ProgressBar :active-index="3" />
      <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
        <el-form-item :label="$t('guide.select_service')">
          <img class="form-item-img" src="../../../public/imgs/exchange.png" alt="#">
        </el-form-item>
        <el-form-item prop="hosts" :label="$t('guide.service_url')">
          <el-input :disabled="exchangeStatus === 'testing'" @input="exchangeStatus = 'untested'" v-model="form.hosts"
            class="form-item-input" :placeholder="$t('guide.example_service')" />
          <TestButton :status="exchangeStatus" @test="verify" />
        </el-form-item>
        <el-form-item prop="syncMethod" :label="$t('guide.sync_way')">
          <el-select v-model="form.syncMethod" :placeholder="$t('base.plzSelect')" size="large" style="width: 340px">
            <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="syncMinute" :label="$t('guide.sync_interval')">
          <el-select v-model="form.syncMinute" :placeholder="$t('base.plzSelect')" size="large"
            style="width: 200px;margin-right: 10px;">
            <el-option v-for="item in everySecondOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #btns>
      <el-button plain class="btn" @click="jumpGuide">{{ $t('guide.jump_guide') }}</el-button>
      <el-button type="primary" class="btn" @click="switchTab('/guide_user')">{{ $t('guide.pre') }}</el-button>
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
        syncMethod: '',
        syncMinute: '',
      },
      exchangeStatus: 'untested',
      rules: {
        hosts: [{ required: true, message: this.$t('guide.form_empty_url'), trigger: 'blur' }],
        syncMethod: [{ required: true, message: this.$t('guide.form_sync_way'), trigger: 'blur' }],
        syncMinute: [{ required: true, message: this.$t('guide.form_sync_interval'), trigger: 'blur' }]
      },
      groupOptions: [
        {
          value: 1,
          label: this.$t('guide.select_sync_exchange'),
        }],
      everySecondOptions: [
        {
          value: 1,
          label: this.$t('guide.five_seconds'),
        },
        {
          value: 2,
          label: this.$t('guide.ten_seconds'),
        },
        {
          value: 3,
          label: this.$t('guide.thirty_seconds'),
        },
        {
          value: 4,
          label: this.$t('guide.sixty_seconds'),
        }
      ],
    }
  },
  methods: {
    verify() {
      if (!this.form.hosts || this.form.hosts === '') {
        ElMessage.error({
          message: this.$t('guide.alert_empty_request_url'),
        })
        return
      }
      this.exchangeStatus = 'testing'
      Api.testExchange({
        server_address: this.form.hosts,
      }).then(({ code }) => {
        if (code !== 0) {
          throw new Error(this.$t('guide.test_fail'))
        }
        this.exchangeStatus = 'tested'
        ElMessage.success({
          message: this.$t('guide.test_success'),
        })
      }).catch(e => {
        this.exchangeStatus = 'untested'
        ElMessage.error({
          message: this.$t('guide.test_fail'),
        })
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
        { "init_status": 2 }
      ).then(res => {
        this.switchTab('/guide_meet')
      }).catch(e => {
        console.log(e)
      })
    },
    nextStep() {
      if (this.exchangeStatus !== 'tested') {
        ElMessage.error({
          message: this.$t('guide.first_exchange_test'),
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
            }
          ).then(res => {
            console.log(res)
            if (res?.code == 0) {
              ElMessage.success({
                message: this.$t('guide.set_success'),
              })
              this.switchTab('/guide_meet')
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