<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title">应用设置</div>

        <div class="section">
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
                  <el-input v-model="form.requestUrl" class="form-item-input"  placeholder="示例:172.16.88.180"/>
                  <el-button type="primary" style="margin-left: 10px">测试</el-button>
                </div>
              </el-form-item>

              <el-form-item label="管理后台Logo" prop="webLogo">
                <div class="form-item-content">
                  <img v-if="originalWebLogoURL!==''" class="form-item-logo" :src="originalWebLogoURL" alt="图片未加载">
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
                  <span class="form-item-tip">推荐尺寸300x300，白色Logo透明底</span>
                </div>
              </el-form-item>

              <el-form-item label="平板端首页Logo" prop="appLogo">
                <div class="form-item-content">
                  <img v-if="originalAppLogoURL!==''" class="form-item-logo" :src="originalAppLogoURL" alt="图片未加载">
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
                  <el-option label="12小时制" value="0"/>
                  <el-option label="24小时制" value="1"/>
                </el-select>
              </el-form-item>
              <el-form-item label="主题" prop="theme">
                <el-radio-group v-model="form.theme">
                  <el-radio value="0">
                    <div class="theme theme-0"></div>
                  </el-radio>
                  <el-radio value="1">
                    <div class="theme theme-1"></div>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="section">
          <div class="section-title">平板端升级</div>

          <div class="section-content">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="history" label="历史安装版本" width="180">
                <template #default="scope">
                  <span>{{scope.row.history +  (scope.row.isCurrent?'（当前版本）':'')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="release" label="发布时间" width="180"/>
              <el-table-column prop="update" label="更新时间"/>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button v-if="scope.row.isCurrent" type="primary">升级</el-button>
                  <el-button color="#b31e1e" v-else type="primary" :dark="true">回退</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="btns">
          <el-button type="default">取消</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>


<script>
import {HOST} from "@/config.js";
import {Api} from "@/network/api.js";
import {PageMixin} from "@/pages/PageMixin.js";
import {STORAGE} from "@/const.js";
import {ElMessage} from "element-plus";
import {Minus, SemiSelect} from "@element-plus/icons-vue";

export default {
  components: {SemiSelect, Minus},
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
      originalWebLogoURL: '',
      originalAppLogoURL: '',
      tableData: [
        {
          id: 1,
          history: '2.0.0',
          release: '2024-08-15',
          update: '2024-08-15',
          isCurrent: true
        },
        {
          id: 2,
          history: '1.0.0',
          release: '2024-08-10',
          update: '2024-08-10',
          isCurrent: false
        }
      ],
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
          { type: 'array', required: true, message: '请上传管理后台Logo图片', trigger: 'blur' },
        ],
        appLogo: [
          { type: 'array', required: true, message: '请上传平板端Logo图片', trigger: 'blur' },
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

        that.originalWebLogoURL = data.logo_dir!=='' ? HOST + data.logo_dir : ''
        that.originalAppLogoURL = data.app_logo_dir!=='' ? HOST + data.app_logo_dir : ''

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
  },
  methods: {
    HOST() {
      return HOST
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

              const formData = new FormData(); // 图片上传
              formData.append('logo',this.form.webLogo[0])

              // Api.uploadAppLogo(
              //     formData
              // ).then(res1=>{
              //   console.log(res1)
              // }).catch(e=>{
              //   console.log(e)
              // })

              Api.setVariables(
                  {
                    "logo_dir": "",
                    "app_logo_dir": "",
                    "time_type": this.form.timeFormat,
                    "company_name": this.form.companyName,
                    "server_address": this.form.requestUrl,
                    "theme_type": this.form.theme,
                  }
              ).then(res => {
                console.log(res)
                if (res?.code == 0) {
                  ElMessage.success({
                    message: '设置成功',
                  })
                  // this.switchTab('/guide_five')
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


<style scoped>


::v-deep .hide .el-upload--picture-card {
  display: none;
}

::v-deep .el-table thead th{
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 500;
  color:#737980;
}

.logo {
  width: 207px;
  height: 51px;
  margin-top: 80px;
  margin-bottom: 50px;
}

.sub-page-content {
  width: 100%;
  height: auto;
  padding: 20px;
  box-sizing: border-box;
  margin: 0;
  position: relative;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background-color: #fff;

  .title {
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 500;
  }

  .section {

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

    .form-item-content{

      display: flex;
      align-items: center;
      gap: 20px;


      .form-item-input {
        width: 350px;
        height: 33px;
      }

      .form-item-logo{
        height: 90px;
      }

      ::v-deep .el-upload-list--picture-card{
        --el-upload-list-picture-card-size: 90px;
      }

      ::v-deep .el-upload--picture-card{
        --el-upload-picture-card-size: 90px;
      }

      .form-item-tip {
        font-family: PingFang SC;
        font-size: 13px;
        letter-spacing: 0px;
        color: #4E5969;
        /* background-color: red; */
      }
    }

    .image-wrapper{
      position: relative;
      width: 100%;
      height: 100%;

      .remove-btn{
        position: absolute;
        top:0;
        right:0;
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

      .remove-btn:hover{
        background-color: #e40707;
      }
    }

  }



  .form-item {
    display: flex;
    flex-direction: row;
    height: 50px;
    align-items: center;
    gap: 10px;
  }

  .form-ad {
    display: flex;
    flex-direction: row;
    height: 50px;
    align-items: center;
  }



  .form-item-img {
    width: 153px;
    height: 53px;
  }



  .form-item-btn {
    border-radius: 2px;
    opacity: 1;
    background: #591BB7;
    box-sizing: border-box;
    padding: 0 15px;
    border: 1px solid #000000;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    height: 33px;
    line-height: 33px;
    text-align: right;
    display: flex;
    align-items: center;
    letter-spacing: 0px;
    font-variation-settings: "opsz" auto;
    color: #FFFFFF;
    margin-left: 20px;
  }

  .theme {
    width: 20px;
    height: 20px;
    background-color: #591bb7;
  }

  .theme-1 {
    background-color: #f53f3f;
  }

  .btns {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
    padding-bottom: 15px;
  }
}

.el-table {
  --el-table-header-bg-color: #f5f6f7;
  --el-table-border: 1px solid #E1E1E1;
  --el-table-tr-bg-color: #fff;
}
</style>