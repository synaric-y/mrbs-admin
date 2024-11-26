<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title">问题反馈提交</div>
        <div class="section">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="200px">
            <el-form-item prop="question" label="问题">
              <el-input v-model="form.question" class="form-item-input" placeholder="请简要输入你在使用此平台时遇到的问题" />
            </el-form-item>
            <el-form-item prop="desc" label="详细描述" style="height: auto;">
              <el-input :maxlength="200" :autosize="{ minRows: 3, maxRows: 6 }" show-word-limit type="textarea"
                v-model="form.desc" style="width: 400px" placeholder="请输入" />
            </el-form-item>
            <el-form-item prop="email" label="邮箱">
              <el-input v-model="form.email" class="form-item-input" placeholder="请输入您的邮箱" />
            </el-form-item>
            <el-form-item prop="attachment" label="附件（jpg/png）限制2张">
              <el-upload :class="{ hide: (form.attachment && form.attachment.length >= 2) }"
                v-model:file-list="form.attachment" ref="attachment" action="#" list-type="picture-card"
                :auto-upload="false" :limit="2" :max-size="1024" :accept="'.jpg, .jpeg, .png'">
                <el-icon class="el-icon--upload">
                  <Plus />
                </el-icon>
                <template #file="{ file }">
                  <div class="image-wrapper">
                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                    <div class="remove-btn" @click="removeImage(file)">
                      <el-icon>
                        <SemiSelect />
                      </el-icon>
                    </div>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="btns">
          <el-button>取消</el-button>
          <el-button type="primary" @click="submit">提交</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import router from "@/router/index.js";
import { ElMessage } from "element-plus/es";
import { Plus, SemiSelect } from "@element-plus/icons-vue";

export default {
  components: { SemiSelect, Plus },
  mixins: [PageMixin],
  data() {
    return {
      form: {
        question: '',
        desc: '',
        email: '',
        attachment: []
      },
      rules: {
        question: [{ required: true, message: '问题不能为空', trigger: 'blur' },
        { max: 50, message: '问题字符数不能超过50', trigger: 'blur' }],
        desc: [{ required: true, message: '详细描述不能为空', trigger: 'blur' },
        { max: 200, message: '详细描述字符数不能超过200', trigger: 'blur' }],
        email: [{ required: true, type: 'email', message: '请填写有效的邮箱地址', trigger: 'blur' }],
        attachment: [
          { type: 'array', validator: this.attachmentValidator, message: '图片总大小不得超过2M', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    attachmentValidator(rule, value, callback) {
      console.log(value)

      const totalByte = value.reduce(
        (accumulator, currentValue) => accumulator + currentValue.size,
        0,
      );

      console.log(totalByte)

      if ((totalByte / 1024 / 1024) > 2) {
        callback(new Error('图片总大小不得超过2M'))
      } else {
        callback()
      }


    },
    removeImage(file) {
      this.$refs.attachment.handleRemove(file)
    },
    submit() {
      console.log(this.form)
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!')
        }
      })
    }
  },
  mounted() {

  }
}
</script>



<style lang="scss" scoped>
::v-deep .hide .el-upload--picture-card {
  display: none;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

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

::v-deep .el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 90px;
}

::v-deep .el-upload--picture-card {
  --el-upload-picture-card-size: 90px;
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
    padding-left: 50px;
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
    height: 40px;
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

  .btns {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
    padding-bottom: 15px;
  }
}
</style>