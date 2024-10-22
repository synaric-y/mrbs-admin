<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title">日历同步</div>

        <div class="section">
          <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">

            <el-form-item label="选择服务">
              <img class="form-item-img" src="../../../public/imgs/exchange.png" alt="#">
            </el-form-item>

            <el-form-item prop="hosts" label="服务器地址(hosts)">
              <el-input v-model="form.hosts" class="form-item-input" placeholder="示例:172.16.88.180" />
              <el-button type="primary" style="margin-left: 10px;" @click="validate">测试</el-button>
            </el-form-item>

            <el-form-item prop="syncMethod" label="同步方式">
              <el-select v-model="form.syncMethod" placeholder="Select" size="large" style="width: 340px">
                <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item prop="syncMinute" label="同步间隔">
              <el-select v-model="form.syncMinute" placeholder="Select" size="large" style="width: 200px;margin-right: 10px;">
                <el-option v-for="item in everySecondOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

          </el-form>
        </div>

        <div class="btns">
          <el-button >取消</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
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

      form:{
        hosts:'',
        syncMethod:'',
        syncMinute:'',
      },

      rules:{
        hosts: [{ required:true, message: '服务器地址不能为空', trigger: 'blur' }],
        syncMethod: [{required:true, message:'请选择同步方式', trigger: 'blur'}],
        syncMinute: [{required:true, message:'请选择同步间隔', trigger: 'blur'}]
      },

      groupOptions: [
        {
          value: '双向，Exchange与系统产生日历相互同步',
          label: '双向，Exchange与系统产生日历相互同步',
        }],
      everySecondOptions: [
          {
        value: '5分钟',
        label: '5分钟',
      }, {
        value: '15分钟',
        label: '15分钟',
      }, {
        value: '30分钟',
        label: '30分钟',
      }, {
        value: '1小时',
        label: '1小时',
      }, {
        value: '3小时',
        label: '3小时',
      }, {
        value: '6小时',
        label: '6小时',
      }, {
        value: '12小时',
        label: '12小时',
      }],
    }
  },
  methods: {
    validate(){
      console.log(100)
    },
    submit(){
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

  .title{
    font-family: PingFang SC;
    font-size: 20px;
    font-weight: 500;
  }


  .section{
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

  .btns{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
    padding-bottom: 15px;
  }
}
</style>