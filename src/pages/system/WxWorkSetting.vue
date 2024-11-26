<template>
  <Layout :title="$t('setting.wxwork_setting.title')" section-left-padding="50">
    <template #section>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" style="max-width: 650px">
        <el-form-item :label="$t('system.wx_corpId')" prop="corpId">
          <div class="form-item-content">
            <el-input class="form-item-input" v-model="form.corpId" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('system.wx_secret')" prop="secret">
          <div class="form-item-content">
            <el-input v-model="form.secret" class="form-item-input" :placeholder="$t('base.input')" />
            <TestButton :status="urlStatus" @test="verify" />
          </div>
        </el-form-item>
        <data value=""></data>
        <el-form-item :label="$t('system.wx_agentId')" prop="agentId">
          <div class="form-item-content">
            <el-input v-model="form.agentId" class="form-item-input" :placeholder="$t('base.input')" />
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template #btns>
      <el-button type="primary" @click="submit">{{ $t('base.save') }}</el-button>
      <el-button @click="back">{{ $t('base.cancle') }}</el-button>
    </template>
  </Layout>
</template>

<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import { Clock, Monitor, User } from "@element-plus/icons-vue";
import { HOST } from "@/config.js";
import Layout from "@/components/Layout.vue";
import TestButton from "@/components/TestButton.vue";
import axios from "axios";
const SECOND_PER_MINUTE = 60
export default {
  components: { Layout, TestButton },
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
          { required: true, message: this.$t('system.form_corpId'), trigger: 'blur' },
        ],
        secret: [
          { required: true, message: this.$t('system.form_secret'), trigger: 'blur' },
        ],
        agentId: [
          { required: true, message: this.$t('system.form_agentId'), trigger: 'blur' },
        ],
      },
      urlStatus: 'untested',
    }
  },
  created() {
    const that = this
    Api.getVariables({
      "corpid": 1,
      "secret": 1,
      "agentid": 1,
    }).then(({ code, data, msg }) => {
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
    },

    verify() {
      if (this.form.corpId.trim() === '' || this.form.secret.trim() === '') {
        ElMessage.error({
          message: this.$t('system.verify_form')
        })
        return
      }
      this.urlStatus = 'testing'
      axios({
        url: `${HOST}/web/call.php?act=test%2Ftest_wxwork`,
        method: 'POST',
        data: { corpid: this.form.corpId, secret: this.form.secret },
      }).then(({ data }) => {
        if (data.code !== 0) {
          ElMessage.error({
            message: this.$t('system.invalid_url')
          })
          this.urlStatus = 'untested'
          return
        }
        this.urlStatus = 'tested'
        ElMessage.success({
          message: this.$t('base.test_url_success')
        })
      }).catch(e => {

      })
    },
  },
  mounted() {

  },
  unmounted() {

  }
}
</script>


<style scoped lang="scss"></style>