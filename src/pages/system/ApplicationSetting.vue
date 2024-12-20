<template>
  <Layout :title="$t('setting.application_setting.title')" section-left-padding="50">
    <template #section>
      <div>
        <div class="section-title">{{ $t('system.section_basic_title') }}</div>
        <div class="section-content">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" style="max-width: 650px">
            <el-form-item :label="$t('guide.company_name')" prop="companyName">
              <div class="form-item-content">
                <el-input class="form-item-input" v-model="form.companyName" />
              </div>
            </el-form-item>
            <el-form-item :label="$t('guide.service_url')" prop="requestUrl">
              <div class="form-item-content">
                <el-input :disabled="urlStatus === 'testing'" @input="urlStatus = 'untested'" v-model="form.requestUrl"
                  class="form-item-input" :placeholder="$t('guide.example_service')" />
                <TestButton :status="urlStatus" @test="verify" />
                <el-button type="primary" @click="pendingShowQRCode">{{ $t('guide.look_qrcode') }}</el-button>
              </div>
            </el-form-item>
            <el-form-item :label="$t('guide.web_logo_label')" prop="webLogo">
              <div class="form-item-content">
                <el-upload :class="{ hide: false }" v-model:file-list="form.webLogo" ref="webLogo" action="/logo"
                  list-type="picture-card" :auto-upload="false" :limit="1" :accept="'image/png'":on-success="handleUploadSuccess"
                  :on-error="handleUploadError">
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
          </el-form>
        </div>
      </div>
      <div class="section-title">{{ $t('system.section_pad_title') }}</div>
      <div class="section-content">
        <el-form-item :label="$t('guide.pad_logo_label')" prop="appLogo">
          <div class="form-item-content">
            <el-upload :class="{ hide: false }" v-model:file-list="form.appLogo" ref="appLogo" action="/logo"
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
          <el-select v-model="form.timeFormat" style="width: 200px" :placeholder="$t('base.plzSelect')">
            <el-option :label="$t('guide.hour_format_12')" :value="12" />
            <el-option :label="$t('guide.hour_format_24')" :value="24" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('guide.theme')" prop="theme">
          <el-radio-group v-model="form.theme">
            <el-radio :value="0">
              <div class="theme theme-0"></div>
            </el-radio>
            <el-radio :value="1">
              <div class="theme theme-1"></div>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div>
        <div class="section-title">{{ $t('system.section_pad_version') }}</div>
        <div class="section-content">
          <el-table :data="versionData" style="width: 100%">
            <el-table-column prop="version" :label="$t('system.hository_version')" width="180">
              <template #default="scope">
                <span>{{ scope.row.version + (nowVersion == scope.row.version ? $t('system.curren_version') : '')
                  }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="publish_time" :label="$t('system.release_time')" width="180" />
            <el-table-column prop="update_time" :label="$t('system.update_time')" />
            <el-table-column :label="$t('system.btn')">
              <template #default="scope">
                <el-button @click="updateVersion(scope.row.version)" v-if="nowVersion < scope.row.version"
                  type="primary">{{ $t('system.update_btn')
                  }}</el-button>
                <el-button @click="fallbackVersion(scope.row.version)" color="#b31e1e"
                  v-else-if="nowVersion > scope.row.version" type="primary" :dark="true">{{
                    $t('system.fallback_btn') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-dialog v-model="showQRCode" width="800" center align-center>
        <div style="width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center">
          <div style="width: 200px;height: 200px" id="qrcode"></div>
          <div style="margin-top: 10px">{{ $t('system.qrcode_tip') }}</div>
        </div>
      </el-dialog>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="" />
      </el-dialog>
    </template>
    <template #btns>
      <el-button type="primary" @click="submit">{{ $t('system.save_btn') }}</el-button>
      <el-button type="default" @click="back">{{ $t('system.cancel_btn') }}</el-button>
    </template>
  </Layout>
</template>

<script>
import { HOST } from "@/config.js";
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import { Minus, SemiSelect } from "@element-plus/icons-vue";
import AraleQRCode from 'arale-qrcode'
import axios from "@/network/axios.js";
import * as dayjs from 'dayjs'
import TestButton from "@/components/TestButton.vue";
import Layout from "@/components/Layout.vue";

export default {
  components: { TestButton, SemiSelect, Minus, Layout },
  mixins: [PageMixin],
  data() {
    return {
      form: {
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
      versionData: [],
      showQRCode: false,
      nowVersion: 'V0.1',
      dialogVisible: false,
      dialogImageUrl: '',
      rules: {
        companyName: [
          { required: true, message: this.$t('guide.company_name_placeholder'), trigger: 'blur' },
        ],
        requestUrl: [
          { required: true, message: this.$t('guide.service_placeholder'), trigger: 'blur' },
        ],
        webLogo: [
          // {
          //   type: 'array', validator: (rule, value, callback) => {
          //     if (this.originalWebLogoURL === '') callback(new Error(this.$t('guide.alert_web_logo')))
          //     else callback()
          //   }, message: this.$t('guide.alert_web_logo'), trigger: 'blur'
          // },
        ],
        appLogo: [
          // {
          //   type: 'array', validator: (rule, value, callback) => {
          //     if (this.originalAppLogoURL === '') callback(new Error(this.$t('guide.alert_pad_logo')))
          //     else callback()
          //   }, message: this.$t('guide.alert_pad_logo'), trigger: 'blur'
          // },
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
      return (url) => {
        return (HOST + url + '?time=' + new Date().getTime())
      }
    }
  },
  created() {
    this.initPage()
  },
  methods: {

    initPage() {
      Api.getVariables({
        "logo_dir": 1,
        "app_logo_dir": 1,
        "time_type": 1,
        "company_name": 1,
        "server_address": 1,
        "theme_type": 1,
        "now_version": 1,
      }).then(({ code, data, msg }) => {
        if (code == 0) {
          console.log(data)
          this.form = {
            companyName: data.company_name,
            requestUrl: data.server_address,
            webLogo: [],
            appLogo: [],
            timeFormat: data.time_type,
            theme: data.theme_type,
          }
          this.originalWebLogoURL = data.logo_dir
          this.originalAppLogoURL = data.app_logo_dir

          if (data.logo_dir.length > 5) {
            const logoObject = {
              name: data.logo_dir.split('/').pop(),
              url: this.onlineWebImage(data.logo_dir),
              uid: Date.now(),
            }
            this.form.webLogo.push(logoObject)
            console.log('logoObject-applogo',logoObject)
          }
          if (data.app_logo_dir.length > 5) {
            const appObject = {
              name: data.app_logo_dir.split('/').pop(),
              url: this.onlineWebImage(data.app_logo_dir),
              uid: Date.now(),
            }
            this.form.appLogo.push(appObject)
            console.log('appObject-applogo',appObject)
          }
          this.nowVersion = data.now_version
          console.log('weblogo-applogo',this.originalWebLogoURL, this.originalAppLogoURL)
        } else {
          ElMessage.error({
            message: this.$t('guide.set_get_fail'),
          })
        }
      }).catch(e => {
        console.log(e)
      })

      Api.getVersions({})
        .then(({ code, data }) => {
          data.forEach((item, index, arr) => {
            arr[index].publish_time = dayjs.unix(item.publish_time).format('YYYY-MM-DD HH:mm:ss')
          })
          this.versionData = data
        })
    },
    updateVersion(version) {
      this.applyNewVersion(version)
    },
    fallbackVersion(version) {
      this.applyNewVersion(version)
    },
    applyNewVersion(newVersion) {
      Api.applyNewVersion({ version: newVersion })
        .then(({ code, data, msg }) => {
          this.initPage()
          ElMessage.success({
            message: msg
          })
        })
    },
    handlePreview(file) {
      console.log('handlePreview file', file)
      this.dialogVisible = true
      this.dialogImageUrl = file.url
      console.log('handlePreview dialogImageUrl', this.dialogImageUrl)
    },

    // 上传成功
    handleUploadSuccess(response, file, fileList) {
      console.log('上传成功的文件:', response, file, fileList);
    },

    // 上传失败
    handleUploadError(error, file) {
      console.error('上传错误信息:', error, file);
    },
    verify() {
      if (!this.form.requestUrl || this.form.requestUrl === '') {
        ElMessage.error({
          message: this.$t('guide.alert_empty_request_url')
        })
        return
      }
      this.urlStatus = 'testing'
      axios({
        url: `/web/call.php?act=system_setting%2Fget_variables`,
        method: 'POST',
        data: { server_address: this.form.requestUrl },
      }).then(({ data }) => {
        if (data.code !== 0) {
          ElMessage.error({
            message: this.$t('guide.alert_invalid_url')
          })
          this.urlStatus = 'untested'
          return
        }
        this.urlStatus = 'tested'
        ElMessage.success({
          message: this.$t('guide.alert_success_url')
        })
      }).catch(e => {

      })
    },
    pendingShowQRCode() {
      this.showQRCode = true
      this.$nextTick(() => {
        const codeFigure = new AraleQRCode({
          "render": "svg",
          "text": this.form.requestUrl,
          "size": 200
        });
        const qrcodeContainer = document.querySelector('#qrcode')
        while (qrcodeContainer.firstChild) {
          qrcodeContainer.removeChild(qrcodeContainer.firstChild);
        }
        qrcodeContainer.appendChild(codeFigure)
      })
    },
    removeImage(type, file) {
      switch (type) {
        case 'web': {
          this.$refs.webLogo.handleRemove(file)
          this.originalWebLogoURL = ''
        } break;
        case 'app': {
          this.$refs.appLogo.handleRemove(file)
          this.originalAppLogoURL = ''
        } break;
      }
    },
    back() {
      this.$router.go(-1)
    },
    submit() {
      console.log('submit form', this.form)
      console.log('submit originalWebLogoURL', this.originalWebLogoURL)
      console.log('submit originalAppLogoURL', this.originalAppLogoURL)
      // return
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('submit!')
          const requests = []
          if (this.form.webLogo && this.form.webLogo[0] && this.form.webLogo[0].raw) {
            const webLogoData = new FormData()
            console.log('webLogo submit new')
            webLogoData.append('logo', this.form.webLogo[0].raw)
            requests.push(
              Api.uploadWebLogo(webLogoData)
                .then(res => {
                  if (res?.data?.code !== 0) throw new Error(this.$t('guide.alert_fail_upload_image'))
                })
            )
          }
          // 平板端图片上传
          if (this.form.appLogo && this.form.appLogo[0] && this.form.appLogo[0].raw) {
            const appLogoData = new FormData()
            console.log('appLogo submit new')
            appLogoData.append('logo', this.form.appLogo[0].raw)
            requests.push(
              Api.uploadAppLogo(appLogoData)
                .then(res => {
                  if (res?.data?.code !== 0) throw new Error(this.$t('guide.alert_fail_upload_image'))
                })
            )
          }
          // 其他数据修改
          const params = {
            "init_status": 3,
            "time_type": this.form.timeFormat,
            "company_name": this.form.companyName,
            "server_address": encodeURIComponent(this.form.requestUrl),
            "theme_type": this.form.theme,
          };
          if (this.form.webLogo && this.form.webLogo[0] && this.form.webLogo[0].raw) {
            delete params.logo_dir
          } else {
            console.log('submit this.form.webLogo not')
            params['logo_dir'] = this.originalWebLogoURL
          }
          if (this.form.appLogo && this.form.appLogo[0] && this.form.appLogo[0].raw) {
            delete params.app_logo_dir
          } else {
            console.log('submit this.form.appLogo not')
            params['app_logo_dir'] = this.originalAppLogoURL
          }
          console.log('submit params',params)
          requests.push(Api.setVariables(
            params
          ))
          Promise.all(requests)
            .then((responses) => {
              console.log('submit Promise.all',responses)
              ElMessage.success({
                message: this.$t('guide.set_success'),
              })
              setTimeout(() => {
                location.reload() // 刷新页面
              }, 1000)
            })
            .catch((error) => {
              ElMessage.error({
                message: this.$t('guide.set_fail') + (error.message ? (this.$t('guide.set_fail_reason') + error.message) : ''),
              })
              console.log(error)
            });
        } else {
          ElMessage.error({
            message: this.$t('guide.form_format_error'),
          })
        }
      }
      )
    }
  },
  mounted() {

  },
  unmounted() {

  }
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