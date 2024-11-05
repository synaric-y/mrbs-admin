<template>
  <Layout :title="$t('setting.application_setting.title')" section-left-padding="50">
    <template #section>
      <div>
        <div class="section-title">基本</div>

        <div class="section-content">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="auto" style="max-width: 650px">
            <el-form-item label="公司/组织名称" prop="companyName">
              <div class="form-item-content">
                <el-input class="form-item-input" v-model="form.companyName"/>
              </div>
            </el-form-item>
            <el-form-item label="服务器地址" prop="requestUrl">
              <div class="form-item-content">
                <el-input :disabled="urlStatus==='testing'" @input="urlStatus='untested'" v-model="form.requestUrl" class="form-item-input"  placeholder="示例:172.16.88.180"/>
                <TestButton :status="urlStatus" @test="verify"/>
                <div style="width: 20px;height: 20px" id="qrcode"></div>
              </div>
            </el-form-item>

            <el-form-item label="管理后台Logo" prop="webLogo">
              <div class="form-item-content">
                <div class="img-bg">
                  <img v-if="originalWebLogoURL!==''" class="form-item-logo" :src="originalWebLogoURL" alt="图片未加载">
                </div>

                <el-upload
                    :class="{ hide: form.webLogo && form.webLogo.length===1 }"
                    v-model:file-list="form.webLogo"
                    ref="webLogo"
                    action="#"
                    list-type="picture-card"
                    :auto-upload="false"
                    :limit="1"
                    :max-size="1024"
                    :accept="'image/*'"
                >
                  <el-icon class="el-icon--upload">
                    <Plus/>
                  </el-icon>

                  <template #file="{ file }">
                    <div class="image-wrapper">
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                      <div class="remove-btn" @click="removeImage('web',file)">
                        <el-icon><SemiSelect /></el-icon>
                      </div>
                    </div>
                  </template>
                </el-upload>
                <span class="form-item-tip">推荐尺寸300x300，彩色Logo透明底</span>
              </div>
            </el-form-item>

            <el-form-item label="平板端首页Logo" prop="appLogo">
              <div class="form-item-content">
                <div class="img-bg">
                  <img v-if="originalAppLogoURL!==''" class="form-item-logo" :src="originalAppLogoURL" alt="图片未加载">
                </div>

                <el-upload
                    :class="{ hide: form.appLogo && form.appLogo.length===1 }"
                    v-model:file-list="form.appLogo"
                    ref="appLogo"
                    action="#"
                    list-type="picture-card"
                    :auto-upload="false"
                    :limit="1"
                    :max-size="1024"
                    :accept="'image/*'"
                >
                  <el-icon class="el-icon--upload">
                    <Plus/>
                  </el-icon>

                  <template #file="{ file }">
                    <div class="image-wrapper">
                      <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
                      <div class="remove-btn" @click="removeImage('app',file)">
                        <el-icon><SemiSelect /></el-icon>
                      </div>
                    </div>
                  </template>
                </el-upload>
                <span class="form-item-tip">推荐尺寸450x50，白色Logo透明底</span>
              </div>
            </el-form-item>
            <el-form-item label="时间格式" prop="timeFormat">
              <el-select v-model="form.timeFormat" style="width: 200px" placeholder="请选择">
                <el-option label="12小时制" :value="12"/>
                <el-option label="24小时制" :value="24"/>
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
      <div>
        <div class="section-title">平板端升级</div>

        <div class="section-content">
          <el-table :data="versionData" style="width: 100%">
            <el-table-column prop="version" label="历史安装版本" width="180">
              <template #default="scope">
                <span>{{scope.row.version +  (scope.row.isCurrent?'（当前版本）':'')}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="publish_time" label="发布时间" width="180"/>
            <el-table-column prop="update_time" label="更新时间"/>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button v-if="scope.row.isCurrent" type="primary">升级</el-button>
                <el-button color="#b31e1e" v-else type="primary" :dark="true">回退</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>


    </template>
    <template #btns>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="default">取消</el-button>
    </template>
  </Layout>
</template>


<script>
import {HOST} from "@/config.js";
import {Api} from "@/network/api.js";
import {PageMixin} from "@/pages/PageMixin.js";
import {STORAGE} from "@/const.js";
import {ElMessage} from "element-plus";
import {Minus, SemiSelect} from "@element-plus/icons-vue";
import AraleQRCode from 'arale-qrcode'
import axios from "@/network/axios.js";
import * as dayjs from 'dayjs'
import TestButton from "@/components/TestButton.vue";
import Layout from "@/components/Layout.vue";

export default {
  components: {TestButton, SemiSelect, Minus, Layout},
  mixins: [PageMixin],
  data() {
    return {
      form: {
        companyName: '',
        requestUrl: '',
        webLogo:[],
        appLogo:[],
        timeFormat:'',
        theme:''
      },
      urlStatus: 'untested', //枚举值untested testing tested
      originalWebLogoURL: '',
      originalAppLogoURL: '',
      versionData: [],
      rules:{
        companyName: [
          { required: true, message: '请输入公司或组织名称', trigger: 'blur' },
          { max: 100, message: '公司名长度必须小于100字符', trigger: 'blur' },
        ],
        requestUrl: [
          { required: true, message: '请输入服务器地址', trigger: 'blur' },
          { max: 300, message: '服务器地址长度必须小于300字符', trigger: 'blur' },
        ],
        webLogo: [
          { type: 'array', validator:(rule, value, callback)=>{
            if(this.originalWebLogoURL==='') callback(new Error('请上传管理后台Logo图片'))
            else callback()
            },message: '请上传管理后台Logo图片', trigger: 'blur' },
        ],
        appLogo: [
          { type: 'array', validator:(rule, value, callback)=>{
              if(this.originalAppLogoURL==='') callback(new Error('请上传平板端Logo图片'))
              else callback()
            }, message: '请上传平板端Logo图片', trigger: 'blur' },
        ],
        timeFormat: [
          { required: true, message: '请选择一个时间格式', trigger: 'blur'},
        ],
        theme: [
          { required: true, message: '请选择一个主题', trigger: 'blur'},
        ],
      }

    }
  },
  created() {
    const that = this
    Api.getVariables({
      "logo_dir": 1,
      "app_logo_dir": 1,
      "time_type": 1,
      "company_name": 1,
      "server_address": 1,
      "theme_type": 1
    }).then(({code,data,msg})=>{
      if(code==0){
        console.log(data)
        // that.form.timeFormat = data.timeFormat
        // that.form.companyName = data.companyName
        // that.form.requestUrl = data.requestUrl
        // that.form.theme = data.theme

        that.form={
          companyName: data.company_name,
          requestUrl: data.server_address,
          webLogo:[],
          appLogo:[],
          timeFormat:data.time_type,
          theme:data.theme_type
        }

        if(that.form.requestUrl && that.form.requestUrl!==''){
          const codeFigure = new AraleQRCode({
            "render": "svg", // 生成的类型 'svg' or 'table'
            "text": that.form.requestUrl, // 需要生成二维码的链接
            "size": 100 // 生成二维码大小
          });
          document.querySelector('#qrcode').appendChild(codeFigure);
        }



        that.originalWebLogoURL = data.logo_dir!=='' ? (HOST + data.logo_dir + '?time=' + new Date().getTime()) : ''
        that.originalAppLogoURL = data.app_logo_dir!=='' ? (HOST + data.app_logo_dir + '?time=' + new Date().getTime()) : ''

        console.log(that.originalWebLogoURL,that.originalWebLogoURL)
      }else{
        ElMessage.error({
          message: '设置获取失败',
        })
      }
    })
    .catch(e=>{
      console.log(e)
    })

    Api.getVersions({})
    .then(({code,data})=>{
      data.forEach((item, index, arr)=>{
        arr[index].publish_time = dayjs.unix(item.publish_time).format('YYYY-MM-DD HH:mm:ss')
      })
      this.versionData = data

    })
  },
  methods: {
    verify(){

      if(!this.form.requestUrl || this.form.requestUrl===''){
        ElMessage.error({
          message: '请求地址不能为空！'
        })
        return
      }

      // 测试联通
      this.urlStatus='testing'
      axios({
        url: `${this.form.requestUrl}/web/call.php?act=get_info%2Fadmin`,
        method: 'POST',
        data: {type:'area'},
      }).then(({data})=>{
        if(data.code!==0){
          ElMessage.error({
            message: '无效的请求地址'
          })
          this.urlStatus='untested'
          return
        }

        this.urlStatus='tested'
        ElMessage.success({
          message: '请求地址验证成功！'
        })

        const codeFigure = new AraleQRCode({
          "render": "svg", // 生成的类型 'svg' or 'table'
          "text": this.form.requestUrl, // 需要生成二维码的链接
          "size": 100 // 生成二维码大小
        });
        const qrcodeContainer = document.querySelector('#qrcode')
        while (qrcodeContainer.firstChild) { // 移除所有子元素
          qrcodeContainer.removeChild(qrcodeContainer.firstChild);
        }
        qrcodeContainer.appendChild(codeFigure); // 增加新的子元素

      }).catch(e=>{
        ElMessage.error({
          message: '无效的请求地址'
        })
        this.urlStatus='untested'
      })


    },
    removeImage(type,file){
      switch (type){
        case 'web':{
          this.$refs.webLogo.handleRemove(file)
        }break;
        case 'app':{
          this.$refs.appLogo.handleRemove(file)
        }break;
      }
    },
    submit(){
      console.log(this.form)
      this.$refs.formRef.validate((valid) => {
            if (valid) {
              console.log('submit!')

              const requests = []

              // 管理端图片上传
              if(this.form.webLogo.length!==0){
                const webLogoData = new FormData();
                webLogoData.append('logo',this.form.webLogo[0].raw)


                requests.push(
                    Api.uploadWebLogo(webLogoData)
                    .then(res=>{
                      if(res?.data?.code!==0) throw new Error('图片上传失败')
                    })
                )
              }

              // 平板端图片上传
              if(this.form.appLogo.length!==0){
                const appLogoData = new FormData();
                appLogoData.append('logo',this.form.appLogo[0].raw)

                requests.push(
                    Api.uploadAppLogo(appLogoData)
                        .then(res=>{
                          if(res?.data?.code!==0) throw new Error('图片上传失败')
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

                    // setTimeout(()=>{
                    //   location.reload() // 刷新页面
                    // },1000)
                  })
                  .catch((error) => {
                    ElMessage.error({
                      message: '设置失败! '+ (error.message?('原因：'+error.message):''),
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

.section-content{
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

.form-item-content{

  display: flex;
  //align-items: center;
  gap: 20px;
}

/* copy: https://juejin.cn/post/7102784102637502478 */
.img-bg{
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


  .form-item-logo{
    width:100%;
    height: 100%;
    object-fit: contain;
  }
}


::v-deep .el-upload-list--picture-card{
  --el-upload-list-picture-card-size: 90px;
}

::v-deep .el-upload--picture-card{
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