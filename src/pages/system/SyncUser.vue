<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title">用户同步</div>

        <div class="form-item" style="margin-top: 20px;">
          <span class="form-item-tip">选择服务</span>
          <img class="form-item-img" src="../../../public/imgs/ad.png" alt="#">
        </div>

        <div class="form-item">
          <span class="form-item-tip">服务器地址(hosts)</span>
          <el-input class="form-item-input" placeholder="示例:172.16.88.180" />
        </div>

        <div class="form-item">
          <span class="form-item-tip">服务器端口(port)</span>
          <el-input class="form-item-input" placeholder="示例:3136" />
        </div>

        <div class="form-item">
          <span class="form-item-tip">基础地址(base_dn)</span>
          <el-input class="form-item-input" placeholder="示例:0U=BCC,DC=businessconnectchina,DC=com" />
        </div>

        <div class="form-item">
          <span class="form-item-tip">用户名(username)</span>
          <el-input class="form-item-input" placeholder="示例:CN=meet. dap,0U=LDAP,DC=businessconnectchina,DC=com" />
        </div>

        <div class="form-item">
          <span class="form-item-tip">密码(password)</span>
          <el-input class="form-item-input" placeholder="请输入包含数字、字母、特殊符号最低8位密码" />
          <el-button type="primary">测试</el-button>
        </div>


        <div class="form-ad">
          <span class="form-item-tip">同步范围</span>
          <el-tree-select v-model="adval" :data="adDatasource" multiple :render-after-expand="false" show-checkbox
                          style="width: 240px" />
        </div>

        <div class="form-ad">
          <span class="form-item-tip">同步方式</span>
          <el-select v-model="groupVal" placeholder="Select" size="large" style="width: 240px">
            <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="form-ad">
          <span class="form-item-tip">开启定时同步</span>
          <el-switch v-model="switchVal" />
        </div>

        <div class="form-ad">
          <span class="form-item-tip">同步间隔</span>
          <el-radio-group v-model="radioval">
            <el-radio value="1" size="large">每隔</el-radio>
            <el-select v-model="everySecondVal" placeholder="Select" size="large"
                       style="width: 100px;margin-right: 10px;">
              <el-option v-for="item in everySecondOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-radio value="2" size="large">每天</el-radio>
            <el-select v-model="everyDayVal" placeholder="Select" size="large" style="width: 100px;margin-right: 10px;">
              <el-option v-for="item in everyDayOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-radio-group>
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
      adval: 'all',
      adDatasource: [
        {
          value: '1',
          label: 'Level one 1',
          children: [
            {
              value: '1-1',
              label: 'Level two 1-1',
              children: [
                {
                  value: '1-1-1',
                  label: 'Level three 1-1-1',
                },
              ],
            },
          ],
        },
        {
          value: '2',
          label: 'Level one 2',
          children: [
            {
              value: '2-1',
              label: 'Level two 2-1',
              children: [
                {
                  value: '2-1-1',
                  label: 'Level three 2-1-1',
                },
              ],
            },
            {
              value: '2-2',
              label: 'Level two 2-2',
              children: [
                {
                  value: '2-2-1',
                  label: 'Level three 2-2-1',
                },
              ],
            },
          ],
        },
        {
          value: '3',
          label: 'Level one 3',
          children: [
            {
              value: '3-1',
              label: 'Level two 3-1',
              children: [
                {
                  value: '3-1-1',
                  label: 'Level three 3-1-1',
                },
              ],
            },
            {
              value: '3-2',
              label: 'Level two 3-2',
              children: [
                {
                  value: '3-2-1',
                  label: 'Level three 3-2-1',
                },
              ],
            },
          ],
        },
      ],

      groupVal: '用户和用户组',
      groupOptions: [
        {
          value: '用户和用户组',
          label: '用户和用户组',
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

      everyDayVal: '06:00',
      everyDayOptions: [{
        value: '06:00',
        label: '06:00',
      }, {
        value: '08:00',
        label: '08:00',
      }, {
        value: '10:00',
        label: '10:00',
      }, {
        value: '12:00',
        label: '12:00',
      }, {
        value: '18:00',
        label: '18:00',
      }, {
        value: '20:00',
        label: '20:00',
      }, {
        value: '22:00',
        label: '22:00',
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