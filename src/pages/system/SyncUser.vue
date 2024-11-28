<template>
  <Layout :title="$t('setting.user_synchronize_setting.title')" section-left-padding="50">
    <template #section>

      <div class="section-title">{{ $t('system.section_default_title') }}</div>
      <div class="section-content">
        <el-form :model="form">
          <el-form-item style="margin-left: 40px;" prop="default_password_hash" :label="$t('system.default_password')">
            <el-input v-model="form.default_password_hash" class="form-item-input"
              :placeholder="$t('system.default_password_placeholder')" />
          </el-form-item>
        </el-form>
      </div>

      <div class="section-title">{{ $t('system.section_basic_title') }}</div>
      <div class="section-content">
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
        </el-form>
      </div>
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
import Layout from "@/components/Layout.vue";
import TestButton from "@/components/TestButton.vue";
export default {
  components: { TestButton, Layout },
  mixins: [PageMixin],
  data() {
    return {
      adStatus: 'untested',
      form: {
        hosts: '',
        port: '',
        base_dn: '',
        username: '',
        password: '',
        autoSync: true,
        default_password_hash: '',
      },
      rules: {
        hosts: [{ required: true, message: this.$t('guide.form_empty_url'), trigger: 'blur' }],
        port: [{ required: true, message: this.$t('guide.form_service_port'), trigger: 'blur' },
        { validator: this.portValidator, message: this.$t('guide.form_limit_port'), trigger: 'blur' }],
        base_dn: [{ required: true, message: this.$t('guide.form_base_service'), trigger: 'blur' }],
        username: [
          { required: true, message: this.$t('guide.form_username'), trigger: 'blur' },
          { min: 2, max: 200, message: this.$t('guide.form_limit_username'), trigger: 'blur' },
        ],
        password: [{ required: true, message: this.$t('guide.form_password'), trigger: 'blur' }],
        default_password_hash: [{ required: true, message: this.$t('system.form_default_password'), trigger: 'blur' }]
      },
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
      "default_password_hash": 1,
    }).then(({ code, data, msg }) => {
      if (code == 0) {
        console.log(data)

        that.form = {
          ...that.form,
          hosts: data.AD_server,
          port: data.AD_port,
          base_dn: data.AD_base_dn,
          username: data.AD_username,
          password: data.AD_password,
          // default_password_hash: data.default_password_hash,
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
    back() {
      this.$router.go(-1)
    },
    pwdValidator(rule, value, callback) {
      let reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}/;
      if (reg.test(value) === false) callback(new Error('密码强度过低！请输入包含数字、字母、特殊符号最低8位密码'))
      else callback()
    },
    portValidator(rule, value, callback) {
      let reg = /^[1-9][0-9]*$/;
      if (reg.test(value) === false) callback(new Error(this.$t('guide.form_limit_port')))
      else {
        const res = parseInt(value)

        if (!res || res <= 0 || res > 65535) callback(new Error(this.$t('guide.form_limit_port')))
        else callback()
      }
    },
    submit() {
      console.log(this.form)
      if (this.adStatus !== 'tested') {
        ElMessage.error({
          message: this.$t('guide.first_ad_test'),
        })
        return
      }
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
              "default_password_hash": this.form.default_password_hash,
            }
          ).then(res => {
            console.log(res)
            if (res?.code == 0) {
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
          }).catch(e => {
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


<style lang="scss" scoped>
.section-title {
  color: var(--el-color-primary);
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 700;
  line-height: 2;
  margin-bottom: 20px;
}

.section-content {
  padding-left: 30px;
}

</style>