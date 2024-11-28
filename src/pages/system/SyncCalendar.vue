<template>
  <Layout :title="$t('setting.calendar_synchronize_setting.title')" section-left-padding="50">
    <template #section>
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
      <el-button type="primary" @click="submit">{{ $t('base.save') }}</el-button>
      <el-button @click="back">{{ $t('base.cancel') }}</el-button>
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
  components: { Layout, TestButton },
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
  created() {
    const that = this
    Api.getVariables({
      "Exchange_server": 1,
      "Exchange_sync_type": 1,
      "Exchange_sync_interval": 1,
    }).then(({ code, data, msg }) => {
      if (code == 0) {
        console.log(data)

        that.form = {
          hosts: data.Exchange_server || '',
          syncMethod: data.Exchange_sync_type || '',
          syncMinute: data.Exchange_sync_interval || '',
        }
      } else {
        ElMessage.error({
          message: this.$t('guide.set_get_fail'),
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
    submit() {
      console.log(this.form)
      if (this.exchangeStatus !== 'tested') {
        ElMessage.error({
          message: this.$t('guide.first_exchange_test'),
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
          ).then(({ code, data }) => {
            if (code == 0) {
              ElMessage.success({
                message: this.$t('guide.set_success'),
              })
              setTimeout(() => {
                location.reload()
              }, 1000)
            } else {
              ElMessage.error({
                message: this.$t('guide.set_fail'),
              })
            }
          })
            .catch(e => {
              ElMessage.error({
                message: this.$t('guide.set_fail'),
              })
              console.log(e)
            })

        } else {
          console.log('error submit!')
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