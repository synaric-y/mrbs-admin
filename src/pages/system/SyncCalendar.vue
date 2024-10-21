<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title">日历同步</div>

        <div class="form-item">
          <span class="form-item-tip">选择服务</span>
          <img class="form-item-img" src="../../../public/imgs/exchange.png" alt="#">
        </div>

        <div class="form-item" style="margin-top: 46px;">
          <span class="form-item-tip">服务器地址</span>
          <el-input v-model="input" class="form-item-input" placeholder="示例:172.16.88.180" />
<!--          <input class="form-item-input" placeholder="示例:172.16.88.180" />-->
          <el-button type="primary">测试</el-button>
        </div>
        <div class="form-ad" style="margin-top: 46px;">
          <span class="form-item-tip">同步方式</span>
          <el-select v-model="groupVal" placeholder="Select" size="large" style="width: 340px">
            <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="form-ad" style="margin-top: 46px;">
          <span class="form-item-tip">同步间隔</span>
          <el-select v-model="everySecondVal" placeholder="Select" size="large"
                     style="width: 200px;margin-right: 10px;">
            <el-option v-for="item in everySecondOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
      groupVal: '双向，Exchange与系统产生日历相互同步',
      groupOptions: [
        {
          value: '双向，Exchange与系统产生日历相互同步',
          label: '双向，Exchange与系统产生日历相互同步',
        }],
      switchVal: true,
      radioval: 1,
      everySecondVal: '15分钟',
      everySecondOptions: [{
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