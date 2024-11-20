<template>
  <Layout :title="'会议系统配置向导'" :section-center="true">
    <template #section>
      <ProgressBar :active-index="1" />
      <div>
        <div class="section-content">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" style="max-width: 750px">
            <el-form-item label="公司/组织名称" prop="companyName">
              <div class="form-item-content">
                <el-input class="form-item-input" v-model="form.companyName" />
              </div>
            </el-form-item>
            <el-form-item label="服务器地址" prop="requestUrl">
              <div class="form-item-content">
                <el-input :disabled="urlStatus === 'testing'" @input="urlStatus = 'untested'" v-model="form.requestUrl"
                  class="form-item-input" placeholder="示例:172.16.88.180" />
                <TestButton :status="urlStatus" @test="verify" />
                <el-button type="primary" @click="pendingShowQRCode">查看二维码</el-button>
              </div>
            </el-form-item>
            <el-form-item label="管理后台Logo" prop="webLogo">
              <div class="form-item-content">
                <div class="img-bg" v-if="originalWebLogoURL">
                  <el-image class="form-item-logo" :src="onlineWebImage(originalWebLogoURL)"
                    :preview-src-list="[onlineWebImage(originalWebLogoURL)]" fit="contain" />
                </div>
                <el-upload :class="{ hide: form.webLogo && form.webLogo.length === 1 }" v-model:file-list="form.webLogo"
                  ref="webLogo" action="#" list-type="picture-card" :auto-upload="false" :limit="1" :max-size="1024"
                  :accept="'image/*'">
                  <el-icon class="el-icon--upload">
                    <Plus />
                  </el-icon>
                  <template #file="{ file }">
                    <div class="image-wrapper">
                      <el-image class="el-upload-list__item-thumbnail" :src="file.url" :preview-src-list="[file.url]"
                        fit="contain" />
                      <div class="remove-btn" @click="removeImage('web', file)">
                        <el-icon>
                          <SemiSelect />
                        </el-icon>
                      </div>
                    </div>
                  </template>
                </el-upload>
                <span class="form-item-tip">推荐尺寸300x300的PNG图片类型，彩色Logo透明底</span>
              </div>
            </el-form-item>
            <el-form-item label="平板端首页Logo" prop="appLogo">
              <div class="form-item-content">
                <div class="img-bg" v-if="originalAppLogoURL">
                  <el-image class="form-item-logo" :src="onlineWebImage(originalAppLogoURL)"
                    :preview-src-list="[onlineWebImage(originalAppLogoURL)]" fit="contain" />
                </div>
                <el-upload :class="{ hide: form.appLogo && form.appLogo.length === 1 }" v-model:file-list="form.appLogo"
                  ref="appLogo" action="#" list-type="picture-card" :auto-upload="false" :limit="1" :max-size="1024"
                  :accept="'image/*'">
                  <el-icon class="el-icon--upload">
                    <Plus />
                  </el-icon>
                  <template #file="{ file }">
                    <div class="image-wrapper">
                      <el-image class="el-upload-list__item-thumbnail" :src="file.url" :preview-src-list="[file.url]"
                        fit="contain" />
                      <div class="remove-btn" @click="removeImage('app', file)">
                        <el-icon>
                          <SemiSelect />
                        </el-icon>
                      </div>
                    </div>
                  </template>
                </el-upload>
                <span class="form-item-tip">推荐尺寸450x50的PNG图片类型，白色Logo透明底</span>
              </div>
            </el-form-item>
            <el-form-item label="时间格式" prop="timeFormat">
              <el-select v-model="form.timeFormat" style="width: 200px" placeholder="请选择">
                <el-option label="12小时制" :value="12" />
                <el-option label="24小时制" :value="24" />
              </el-select>
            </el-form-item>
            <el-form-item label="主题" prop="theme">
              <el-radio-group v-model="form.theme">
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
    </template>
    <template #btns>
      <el-button plain class="btn" @click="jumpGuide">跳过向导</el-button>
      <el-button type="primary" class="btn" @click="switchTab('/guide_start')">上一步</el-button>
      <el-button plain class="btn" @click="skipCurrentGuide">暂不需要</el-button>
      <el-button type="primary" class="btn" @click="nextStep">下一步</el-button>
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
  components: { Layout, TestButton, ProgressBar, SemiSelect, Minus },
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
      urlStatus: 'untested', //枚举值untested testing tested
      originalWebLogoURL: '',
      originalAppLogoURL: '',
      versionData: [],
      showQRCode: false,
      rules: {
        companyName: [
          { required: true, message: '请输入公司或组织名称', trigger: 'blur' },
          { max: 100, message: '公司名长度必须小于100字符', trigger: 'blur' },
        ],
        requestUrl: [
          { required: true, message: '请输入服务器地址', trigger: 'blur' },
          { max: 300, message: '服务器地址长度必须小于300字符', trigger: 'blur' },
        ],
        webLogo: [
          {
            type: 'array', validator: (rule, value, callback) => {
              if (this.originalWebLogoURL === '' && value.length === 0) callback(new Error('请上传管理后台Logo图片'))
              else callback()
            }, message: '请上传管理后台Logo图片', trigger: 'blur'
          },
        ],
        appLogo: [
          {
            type: 'array', validator: (rule, value, callback) => {
              if (this.originalAppLogoURL === '' && value.length === 0) callback(new Error('请上传平板端Logo图片'))
              else callback()
            }, message: '请上传平板端Logo图片', trigger: 'blur'
          },
        ],
        timeFormat: [
          { required: true, message: '请选择一个时间格式', trigger: 'blur' },
        ],
        theme: [
          { required: true, message: '请选择一个主题', trigger: 'blur' },
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
  methods: {
    verify() {
      if (!this.form.requestUrl || this.form.requestUrl === '') {
        ElMessage.error({
          message: '请求地址不能为空！'
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
            message: '无效的请求地址'
          })
          this.urlStatus = 'untested'
          return
        }
        this.urlStatus = 'tested'
        ElMessage.success({
          message: '请求地址验证成功！'
        })
      }).catch(e => {

      })
    },

    pendingShowQRCode() {
      this.showQRCode = true
      this.$nextTick(() => {
        const codeFigure = new AraleQRCode({
          "render": "svg", // 生成的类型 'svg' or 'table'
          "text": this.form.requestUrl, // 需要生成二维码的链接
          "size": 200 // 生成二维码大小
        });
        const qrcodeContainer = document.querySelector('#qrcode')
        while (qrcodeContainer.firstChild) { // 移除所有子元素
          qrcodeContainer.removeChild(qrcodeContainer.firstChild);
        }
        qrcodeContainer.appendChild(codeFigure); // 增加新的子元素
      })
    },
    removeImage(type, file) {
      switch (type) {
        case 'web': {
          this.$refs.webLogo.handleRemove(file)
        } break;
        case 'app': {
          this.$refs.appLogo.handleRemove(file)
        } break;
      }
    },
    back() {
      this.$router.go(-1)
    },
    submit() {
      console.log(this.form)
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('submit!')
          const requests = []
          if (this.form.webLogo.length !== 0) {
            const webLogoData = new FormData();
            webLogoData.append('logo', this.form.webLogo[0].raw)
            requests.push(
              Api.uploadWebLogo(webLogoData)
                .then(res => {
                  if (res?.data?.code !== 0) throw new Error('图片上传失败')
                })
            )
          }
          // 平板端图片上传
          if (this.form.appLogo.length !== 0) {
            const appLogoData = new FormData();
            appLogoData.append('logo', this.form.appLogo[0].raw)
            requests.push(
              Api.uploadAppLogo(appLogoData)
                .then(res => {
                  if (res?.data?.code !== 0) throw new Error('图片上传失败')
                })
            )
          }
          // 其他数据修改
          requests.push(Api.setVariables(
            {
              "init_status": 3,
              "time_type": this.form.timeFormat,
              "company_name": this.form.companyName,
              "server_address": encodeURIComponent(this.form.requestUrl),
              "theme_type": this.form.theme,
            }
          ))
          Promise.all(requests)
            .then((responses) => {
              console.log(responses)
              ElMessage.success({
                message: '设置成功',
              })
              setTimeout(() => {
                location.reload() // 刷新页面
              }, 1000)
            })
            .catch((error) => {
              ElMessage.error({
                message: '设置失败! ' + (error.message ? ('原因：' + error.message) : ''),
              })
              console.log(error)
            });
        } else {
          ElMessage.error({
            message: '表单格式错误',
          })
        }
      }
      )
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
        this.switchTab('/guide_user')
      }).catch(e => {
        console.log(e)
      })
    },
    nextStep() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.adStatus !== 'tested') {
            ElMessage.error({
              message: 'AD连通性未测试，请先测试',
            })
            return
          }

          Api.setVariables(
            {
              "init_status": 1,
              "time_type": this.form.timeFormat,
              "company_name": this.form.companyName,
              "server_address": this.form.requestUrl,
              "theme_type": this.form.theme
            }
          ).then(res => {
            console.log(res)
            if (res?.code == 0) {
              ElMessage.success({
                message: '设置成功',
              })
              this.switchTab('/guide_user')
            } else {
              ElMessage.error({
                message: '设置失败',
              })
            }
          }).catch(e => {
            ElMessage.error({
              message: '设置失败',
            })
            console.log(e)
          })
        } else {
          ElMessage.error({
            message: '表单格式错误',
          })
        }
      })
    }
  },
  mounted() {
    const that = this
    Api.getVariables({
      "logo_dir": 1,
      "app_logo_dir": 1,
      "time_type": 1,
      "company_name": 1,
      "server_address": 1,
      "theme_type": 1
    }).then(({ code, data, msg }) => {
      if (code == 0) {
        console.log(data)
        that.form = {
          companyName: data.company_name,
          requestUrl: data.server_address,
          webLogo: [],
          appLogo: [],
          timeFormat: data.time_type,
          theme: data.theme_type,
        }
        that.originalWebLogoURL = data.logo_dir
        that.originalAppLogoURL = data.app_logo_dir
        console.log(that.originalWebLogoURL, that.originalWebLogoURL)
      } else {
        ElMessage.error({
          message: '设置获取失败',
        })
      }
    }).catch(e => {
      console.log(e)
    })
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