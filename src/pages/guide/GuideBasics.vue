<template>
  <Layout :title="$t('guide.basics_title')" :section-center="true">
    <template #section>
      <ProgressBar :active-index="1" />
      <div>
        <div class="section-content">
          <el-form ref="guideFormRef" :model="basicsform" :rules="rules" label-width="auto" style="max-width: 750px">
            <el-form-item :label="$t('guide.company_name')" prop="companyName">
              <div class="form-item-content">
                <el-input class="form-item-input" v-model="basicsform.companyName" />
              </div>
            </el-form-item>
            <el-form-item :label="$t('guide.service_url')" prop="requestUrl">
              <div class="form-item-content">
                <el-input :disabled="urlStatus === 'testing'" @input="urlStatus = 'untested'"
                  v-model="basicsform.requestUrl" class="form-item-input" :placeholder="$t('guide.example_service')" />
                <TestButton :status="urlStatus" @test="verify" />
                <el-button type="primary" @click="pendingShowQRCode">{{ $t('guide.look_qrcode') }}</el-button>
              </div>
            </el-form-item>
            <el-form-item :label="$t('guide.web_logo_label')" prop="webLogo">
              <div class="form-item-content">
                <el-upload :class="{ hide: false }" v-model:file-list="basicsform.webLogo" ref="guideWebLogo" action="#"
                  list-type="picture-card" :auto-upload="false" :limit="1" :accept="'image/png'">
                  <el-icon class="el-icon--upload">
                    <Plus />
                  </el-icon>
                  <template #file="{ file }">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="#" />
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                          <el-icon><zoom-in /></el-icon>
                        </span>
                        <span class="el-upload-list__item-delete" @click="removeImage('web', file)">
                          <el-icon>
                            <Delete />
                          </el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
                <span class="form-item-tip">{{ $t('guide.logo_tips') }}</span>
              </div>
            </el-form-item>
            <el-form-item :label="$t('guide.pad_logo_label')" prop="appLogo">
              <div class="form-item-content">
                <el-upload :class="{ hide: false }" v-model:file-list="basicsform.appLogo" ref="guideAppLogo" action="#"
                  list-type="picture-card" :auto-upload="false" :limit="1" :accept="'image/png'">
                  <el-icon class="el-icon--upload">
                    <Plus />
                  </el-icon>
                  <template #file="{ file }">
                    <div>
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                          <el-icon><zoom-in /></el-icon>
                        </span>
                        <span class="el-upload-list__item-delete" @click="removeImage('app', file)">
                          <el-icon>
                            <Delete />
                          </el-icon>
                        </span>
                      </span>
                    </div>
                  </template>
                </el-upload>
                <span class="form-item-tip">{{ $t('guide.pad_logp_tips') }}</span>
              </div>
            </el-form-item>
            <el-form-item :label="$t('guide.time_format')" prop="timeFormat">
              <el-select v-model="basicsform.timeFormat" style="width: 200px" :placeholder="$t('base.plzSelect')">
                <el-option :label="$t('guide.hour_format_12')" :value="12" />
                <el-option :label="$t('guide.hour_format_24')" :value="24" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('guide.theme')" prop="theme">
              <el-radio-group v-model="basicsform.theme">
                <el-radio :value="0">
                  <div class="theme theme-0"></div>
                </el-radio>
                <el-radio :value="1">
                  <div class="theme theme-1"></div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-dialog v-model="showQRCode" width="800" center align-center>
        <div style="width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center">
          <div style="width: 200px;height: 200px" id="qrcode"></div>
          <div style="margin-top: 10px">{{ $t('system.qrcode_tip') }}</div>
        </div>
      </el-dialog>
    </template>

    <template #btns>
      <el-button plain class="btn" @click="jumpGuide">{{ $t('guide.jump_guide') }}</el-button>
      <el-button type="primary" class="btn" @click="switchTab('/guide_start')"> {{ $t('guide.pre') }}</el-button>
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
import { HOST } from "@/config.js";
import { Minus, SemiSelect } from "@element-plus/icons-vue";
import AraleQRCode from 'arale-qrcode'
import axios from "@/network/axios.js";
import * as dayjs from 'dayjs'

export default {
  name: 'GuideBasics',
  components: { Layout, TestButton, ProgressBar, SemiSelect, Minus },
  mixins: [PageMixin],
  
  data() {
    return {
      basicsform: {
        companyName: '',
        requestUrl: '',
        webLogo: [],
        appLogo: [],
        timeFormat: '',
        theme: '',
      },
      urlStatus: 'untested',
      originalWebLogoURL: '',
      originalAppLogoURL: '',
      showQRCode: false,
      dialogVisible: false,
      dialogImageUrl: '',
      rules: {
        companyName: [
          { required: true, message: this.$t('guide.company_name_placeholder'), trigger: 'blur' },
        ],
        requestUrl: [
          { required: true, message: this.$t('guide.service_placeholder'), trigger: 'blur' },
        ],
        timeFormat: [
          { required: true, message: this.$t('guide.form_time_format'), trigger: 'blur' },
        ],
        theme: [
          { required: true, message: this.$t('guide.form_theme_format'), trigger: 'blur' },
        ],
      }
    }
  },

  computed: {
    onlineWebImage() {
      return (url) => HOST + url + '?time=' + Date.now()
    }
  },

  methods: {
    // 图片上传前验证
    beforeUpload(file) {
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPNG) {
        ElMessage.error(this.$t('guide.only_png_allowed'))
        return false
      }
      if (!isLt2M) {
        ElMessage.error(this.$t('guide.file_too_large'))
        return false
      }
      return true
    },

    // 验证服务器地址
    async verify() {
      if (!this.basicsform.requestUrl) {
        ElMessage.error({ message: this.$t('guide.alert_empty_request_url') })
        return
      }

      this.urlStatus = 'testing'
      try {
        const { data } = await axios({
          url: `/web/call.php?act=system_setting%2Fget_variables`,
          method: 'POST',
          data: { server_address: this.basicsform.requestUrl },
        })

        if (data.code !== 0) {
          throw new Error(this.$t('guide.alert_invalid_url'))
        }

        this.urlStatus = 'tested'
        ElMessage.success({ message: this.$t('guide.alert_success_url') })
      } catch (error) {
        this.urlStatus = 'untested'
        ElMessage.error({ message: error.message || this.$t('guide.alert_invalid_url') })
      }
    },

    // 显示二维码
    pendingShowQRCode() {
      if (!this.basicsform.requestUrl) {
        ElMessage.warning(this.$t('guide.alert_empty_request_url'))
        return
      }

      this.showQRCode = true
      this.$nextTick(() => {
        const qrcodeContainer = document.querySelector('#qrcode')
        while (qrcodeContainer?.firstChild) {
          qrcodeContainer.removeChild(qrcodeContainer.firstChild)
        }

        const codeFigure = new AraleQRCode({
          render: "svg",
          text: this.basicsform.requestUrl,
          size: 200
        })
        qrcodeContainer?.appendChild(codeFigure)
      })
    },

    // 移除图片
    removeImage(type, file) {
      if (type === 'web') {
        this.$refs.guideWebLogo?.handleRemove(file)
        this.originalWebLogoURL = ''
      } else if (type === 'app') {
        this.$refs.guideAppLogo?.handleRemove(file)
        this.originalAppLogoURL = ''
      }
    },

    // 处理图片预览
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 跳过引导
    async skipCurrentGuide() {
      try {
        await Api.setVariables({ "init_status": 1 })
        this.switchTab('/guide_user')
      } catch (error) {
        ElMessage.error(this.$t('guide.operation_failed'))
        console.error(error)
      }
    },

    // 跳过所有引导
    async jumpGuide() {
      try {
        await Api.setVariables({ "init_status": 3 })
        this.switchTab('../single_meet')
      } catch (error) {
        ElMessage.error(this.$t('guide.operation_failed'))
        console.error(error)
      }
    },

    // 下一步
    async nextStep() {
      try {
        // 表单验证
        const valid = await this.$refs.guideFormRef.validate()
        if (!valid) {
          ElMessage.error({ message: this.$t('guide.form_format_error') })
          return
        }

        // 检查URL测试状态
        if (this.urlStatus !== 'tested') {
          ElMessage.error({ message: this.$t('guide.first_ad_test') })
          return
        }

        // 处理图片上传
        const uploadPromises = []
        if (this.basicsform.webLogo?.[0]?.raw) {
          const webLogoData = new FormData()
          webLogoData.append('logo', this.basicsform.webLogo[0].raw)
          uploadPromises.push(Api.uploadWebLogo(webLogoData))
        }

        if (this.basicsform.appLogo?.[0]?.raw) {
          const appLogoData = new FormData()
          appLogoData.append('logo', this.basicsform.appLogo[0].raw)
          uploadPromises.push(Api.uploadAppLogo(appLogoData))
        }

        // 等待所有图片上传完成
        if (uploadPromises.length > 0) {
          const results = await Promise.all(uploadPromises)
          for (const res of results) {
            if (res?.data?.code !== 0) {
              throw new Error(this.$t('guide.alert_fail_upload_image'))
            }
          }
        }

        // 提交表单数据
        const params = {
          init_status: 3,
          time_type: this.basicsform.timeFormat,
          company_name: this.basicsform.companyName,
          server_address: encodeURIComponent(this.basicsform.requestUrl),
          theme_type: this.basicsform.theme,
          logo_dir: this.basicsform.webLogo?.[0]?.raw ? undefined : this.originalWebLogoURL,
          app_logo_dir: this.basicsform.appLogo?.[0]?.raw ? undefined : this.originalAppLogoURL
        }

        const res = await Api.setVariables(params)
        if (res?.code === 0) {
          ElMessage.success({ message: this.$t('guide.set_success') })
          this.switchTab('/guide_user')
        } else {
          throw new Error(res?.msg || this.$t('guide.set_fail'))
        }
      } catch (error) {
        ElMessage.error({
          message: this.$t('guide.set_fail') +
            (error.message ? ` (${error.message})` : '')
        })
        console.error(error)
      }
    },

    // 初始化页面数据
    async initPage() {
      try {
        const { code, data } = await Api.getVariables({
          logo_dir: 1,
          app_logo_dir: 1,
          time_type: 1,
          company_name: 1,
          server_address: 1,
          theme_type: 1,
          now_version: 1,
        })

        if (code !== 0) {
          throw new Error(this.$t('guide.set_get_fail'))
        }

        // 设置基础表单数据
        this.basicsform = {
          companyName: data.company_name,
          requestUrl: data.server_address,
          webLogo: [],
          appLogo: [],
          timeFormat: data.time_type,
          theme: data.theme_type,
        }

        this.originalWebLogoURL = data.logo_dir
        this.originalAppLogoURL = data.app_logo_dir

        // 处理网页logo
        if (data.logo_dir?.length > 5) {
          this.basicsform.webLogo.push({
            name: data.logo_dir.split('/').pop(),
            url: this.onlineWebImage(data.logo_dir),
            uid: Date.now(),
          })
        }

        // 处理APP logo
        if (data.app_logo_dir?.length > 5) {
          this.basicsform.appLogo.push({
            name: data.app_logo_dir.split('/').pop(),
            url: this.onlineWebImage(data.app_logo_dir),
            uid: Date.now() + 1,
          })
        }
      } catch (error) {
        ElMessage.error(error.message || this.$t('guide.set_get_fail'))
        console.error(error)
      }
    },
  },

  created() {
    this.initPage()
  },
}
</script>

<style lang="scss" scoped>
::v-deep .hide .el-upload--picture-card {
  display: none;
}

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

.theme {
  width: 20px;
  height: 20px;
  background-color: #591bb7;
}

.theme-1 {
  background-color: #f53f3f;
}

.form-item-content {
  display: flex;
  gap: 20px;
}

.img-bg {
  width: 90px;
  height: 90px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #d2d2d2;
  background-image:
    linear-gradient(45deg, #c9c9c9 25%, transparent 0, transparent 75%, #c9c9c9 0),
    linear-gradient(45deg, #c9c9c9 25%, transparent 0, transparent 75%, #c9c9c9 0);
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;

  .form-item-logo {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

::v-deep .el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 90px;
}

::v-deep .el-upload--picture-card {
  --el-upload-picture-card-size: 90px;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #d2d2d2;
  background-image: linear-gradient(45deg, #c9c9c9 25%, transparent 0, transparent 75%, #c9c9c9 0),
    linear-gradient(45deg, #c9c9c9 25%, transparent 0, transparent 75%, #c9c9c9 0);
  background-position: 0 0, 10px 10px;
  background-size: 20px 20px;

  .remove-btn {
    position: absolute;
    top: 0;
    right: 0;
    background-color: red;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    color: #fff;
    font-size: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .remove-btn:hover {
    background-color: #e40707;
  }
}
</style>