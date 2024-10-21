<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title">应用设置</div>

        <div class="section">
          <div class="section-title">基本</div>

          <el-form :model="form" label-width="auto" style="max-width: 600px">
            <el-form-item label="公司/组织名称">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="服务器地址">
              <el-input v-model="input" class="form-item-input" placeholder="示例:172.16.88.180" />
              <el-button type="primary" style="margin-left: 10px">测试</el-button>
            </el-form-item>

            <el-form-item label="管理后台Logo">
              <el-upload action="#" list-type="picture-card" :auto-upload="false">
                <el-icon><Plus /></el-icon>

                <template #file="{ file }">
                  <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
                  </div>
                </template>
              </el-upload>
              <span>推荐尺寸300x300，白色Logo透明底</span>
            </el-form-item>
            <el-form-item label="平板端首页Logo">
              <el-upload action="#" list-type="picture-card" :auto-upload="false">
                <el-icon><Plus /></el-icon>

                <template #file="{ file }">
                  <div>
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="时间格式">
              <el-select v-model="form.region" placeholder="请选择">
                <el-option label="12小时制" value="0" />
                <el-option label="24小时制" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="主题">
              <el-radio-group v-model="form.resource">
                <el-radio value="0"><div class="theme theme-0"></div></el-radio>
                <el-radio value="1"><div class="theme theme-1"></div></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>

        <div class="section">
          <div class="section-title">平板端升级</div>

          <div class="section-content">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="history" label="历史安装版本" width="180" />
              <el-table-column prop="release" label="发布时间" width="180" />
              <el-table-column prop="update" label="更新时间" />
              <el-table-column label="操作">
                <el-button type="primary">升级</el-button>
              </el-table-column>/
            </el-table>
          </div>
        </div>

        <div class="btns">
          <el-button type="default">取消</el-button>
          <el-button type="primary">保存</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>



<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";

export default {
  mixins: [PageMixin],
  data() {
    return {
      mode: 'add',
      form: {
        username: '',
        password: ''
      },
      tableData:[
        {
          id:1,
          history:'2.0.0',
          release: '2024-08-15',
          update:'2024-08-15',

        }
      ]
    }
  },
  methods: {

  },
  mounted() {

  },
  unmounted() {

  }
}
</script>



<style scoped>
.logo {
  width: 207px;
  height: 51px;
  margin-top: 80px;
  margin-bottom: 50px;
}

.sub-page-content{
  width: calc(100vw - 169px);
  height: auto;
  padding: 20px;
  margin: 0;
  position: relative;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  background-color: #fff;

  .title{
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 500;
  }

  .section{
    .section-title{
      color: var(--el-color-primary);
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 700;
      line-height: 2;
      margin-bottom: 20px;
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
  .form-item-tip {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    text-align: right;
    letter-spacing: 0px;
    color: #4E5969;
    margin-right: 28px;
    width: 400px;
    /* background-color: red; */
  }
  .form-item-img {
    width: 153px;
    height: 53px;
  }
  .form-item-input {
    width: 400px;
    height: 33px;
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
  
  .theme{
    width: 20px;
    height: 20px;
    background-color: #591bb7;
  }

  .theme-1{
    background-color: #f53f3f;
  }

  .btns{
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