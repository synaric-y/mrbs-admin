<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="page-title">会议系统配置向导</div>
        <div class="guide-progress">
          <div class="guide-item">
            <span class="guide-number-active">1</span>
            <span class="guide-title-active" style="margin-left: 12px;">用户同步配置</span>
          </div>

          <div class="guide-item">
            <span class="guide-number">2</span>
            <span class="guide-title" style="margin-left: 12px;">日历同步配置</span>
          </div>

          <div class="guide-item">
            <span class="guide-number">3</span>
            <span class="guide-title" style="margin-left: 12px;">添加会议室</span>
          </div>

          <div class="guide-item">
            <span class="guide-number">4</span>
            <span class="guide-title" style="margin-left: 12px;">完成</span>
          </div>
        </div>
        <div class="guide-tips">此配置允许您正在使用的第三方服务同步用户数据到本系统，您可以自定义同步行为与同步的范围。</div>



        <div class="form-item" style="margin-top: 20px;">
          <span class="form-item-tip">选择服务</span>
          <img class="form-item-img" src="../../../public/imgs/ad.png" alt="#">
        </div>

        <div class="form-item">
          <span class="form-item-tip">服务器地址(hosts)</span>
          <input class="form-item-input" placeholder="示例:172.16.88.180" />
        </div>

        <div class="form-item">
          <span class="form-item-tip">服务器端口(port)</span>
          <input class="form-item-input" placeholder="示例:3136" />
        </div>

        <div class="form-item">
          <span class="form-item-tip">基础地址(base_dn)</span>
          <input class="form-item-input" placeholder="示例:0U=BCC,DC=businessconnectchina,DC=com" />
        </div>

        <div class="form-item">
          <span class="form-item-tip">用户名(username)</span>
          <input class="form-item-input" placeholder="示例:CN=meet. dap,0U=LDAP,DC=businessconnectchina,DC=com" />
        </div>

        <div class="form-item">
          <span class="form-item-tip">密码(password)</span>
          <input class="form-item-input" placeholder="请输入包含数字、字母、特殊符号最低8位密码" />
          <span class="form-item-btn">测试</span>
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

        <div class="sub-buttons">
          <div class="buttons-wrapper">
            <span class="jump-btn">跳过向导</span>
            <span class="pre-btn" @click="switchTab('/guide_one')">上一步</span>
            <span class="not-btn">暂不需要</span>
            <span class="next-btn" @click="switchTab('/guide_three')">下一步</span>
          </div>
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
import { Text } from "vue";

export default {
  mixins: [PageMixin],
  data() {
    return {
      mode: 'add',
      form: {
        username: '',
        password: ''
      },
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
.sub-page-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  height: calc(100vh - 15px);
  background-color: white;
  padding: 0;
  margin: 0;
}

.page-title {
  font-size: 20px;
  margin-top: 20px;
  margin-left: 20px;
}

.guide-progress {
  display: flex;
  flex-direction: row;
  margin-left: 72px;
  margin-top: 25px;
}

.guide-item {
  display: flex;
  flex-direction: row;
  margin-left: 72px;
}

.guide-number-active {
  width: 29px;
  height: 28px;
  border-radius: 14px;
  line-height: 28px;
  text-align: center;
  opacity: 1;
  background: #591BB7;
  color: #FFFFFF;
}

.guide-number {
  width: 28px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 14px;
  opacity: 1;
  background: #F2F3F5;
  color: #4E5969;
}

.guide-title-active {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  color: #591BB7;
}

.guide-title {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #4E5969;
}

.guide-tips {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  color: #3D3D3D;
  margin-top: 50px;
  margin-bottom: 10px;
  align-self: center;
}

.form-item {
  display: flex;
  flex-direction: row;
  height: 50px;
  align-items: center;
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
  height: 43px;
}

.form-item-input {
  width: 400px;
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
  line-height: 22px;
  text-align: right;
  display: flex;
  align-items: center;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  color: #FFFFFF;
  margin-left: 20px;
}

.sub-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 15px;
  padding-bottom: 15px;
}

.buttons-wrapper {
  width: 500px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-left: -280px;
}

.jump-btn {
  padding: 0 15px;
  border-radius: 2px;
  opacity: 1;
  color: #1D2129;
  background: #F2F3F5;
  height: 36px;
  line-height: 36px;
}

.pre-btn {
  padding: 0 15px;
  border-radius: 2px;
  opacity: 1;
  background: #591BB7;
  color: white;
  height: 36px;
  line-height: 36px;
}

.next-btn {
  padding: 0 15px;
  border-radius: 2px;
  opacity: 1;
  background: #591BB7;
  color: white;
  height: 36px;
  line-height: 36px;
}

.not-btn {
  padding: 0 15px;
  border-radius: 2px;
  opacity: 1;
  color: #1D2129;
  background: #F2F3F5;
  height: 36px;
  line-height: 36px;
}
</style>