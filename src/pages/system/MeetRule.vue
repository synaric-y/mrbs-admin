<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title">全局会议规则设置</div>

        <div class="section">
          <div class="section-title">终端会议展示</div>
          <div class="section-content">
            <div class="switches">
              <div class="switch-row">
                <div class="label">预定人显示</div>
                <el-switch
                    v-model="form.bookerDisplay"
                    style="--el-switch-on-color: #591bb7;"
                />
                <div class="tip">关闭后，终端将显示默认文字：“xx预定”</div>
              </div>
              <div class="switch-row">
                <div class="label">预定会议名称显示</div>
                <el-switch
                    v-model="form.meetingNameDisplay"
                    style="--el-switch-on-color: #591bb7;"
                />
                <div class="tip">关闭后，终端将显示默认文字：“xx会议”</div>
              </div>
              <div class="switch-row">
                <div class="label">开启临时会议</div>
                <el-switch
                    v-model="form.quickMeetingDisplay"
                    style="--el-switch-on-color: #591bb7;"
                />
                <div class="tip">关闭后，终端将不显示临时会议按钮</div>
              </div>
            </div>
            <div class="preview">
              <div class="left">
                <div class="times">
                  <div class="time" v-for="item in timeline">{{item}}</div>
                </div>
                <div class="btn" v-if="form.quickMeetingDisplay">临时会议</div>
              </div>
              <div class="right">
                <div class="room">
                  会议室
                  <span class="room-name">A</span>
                </div>
                <div class="time">10:35AM 2024年7月19日</div>
                <div class="title">会 议 中</div>

                <div class="info">
                  <div class="title">正在进行的会议:</div>
                  <div class="info-row">
                    <el-icon><Monitor /></el-icon>
                    <div class="value">{{form.meetingNameDisplay?'销售部门会议':'xx会议'}}</div>
                  </div>
                  <div class="info-row">
                    <el-icon><Clock /></el-icon>
                    <div class="value">09:00AM - 11:00AM</div>
                  </div>
                  <div class="info-row">
                    <el-icon><User /></el-icon>
                    <div class="value">{{form.bookerDisplay?'Alvin':'xx预定'}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">会议规则参数</div>

          <div class="section-content">
            <el-form label-width="auto">
              <el-form-item label="快速会议开始时间">
                <el-select  style="min-width: 400px" v-model="form.startTime" placeholder="请选择">
                  <el-option label="最近空闲时段马上开始" value="0" />
                  <el-option label="手动选择" value="1" />
                </el-select>
              </el-form-item>
              <el-form-item label="预定时间最小间隔">
                <el-select style="min-width: 400px" v-model="form.minScale" placeholder="请选择">
                  <el-option label="15分钟" value="0" />
                  <el-option label="30分钟" value="1" />
                </el-select>
              </el-form-item>
            </el-form>
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
import {Clock, Monitor, User} from "@element-plus/icons-vue";

export default {
  components: {User, Monitor, Clock},
  mixins: [PageMixin],
  data() {
    return {
      mode: 'add',
      form: {
        bookerDisplay: true,
        meetingNameDisplay: true,
        quickMeetingDisplay: true,
        startTime: '',
        minScale: '',
      },

      timeline:[
          '10:00am','10:30am','11:00am','11:30am','12:00am','12:30am','01:00pm','01:30pm',
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

.container-sub-page-main{


  .sub-page-content {
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

      .section-content{

        display: flex;
        align-items: center;
        gap:50px;
        margin-left: 100px;
      }

      .switches{
        .switch-row{
          display: flex;
          gap:20px;
          align-items: center;
          font-size: 14px;
          line-height: 3;

          .label{
            min-width: 120px;
            text-align: right;
          }
        }
      }

      .preview{
        display: flex;
        height: 300px;
        width: 480px;
        .left{
          width: 40%;
          background-color: #333333;
          padding: 5px;
          position: relative;

          .times{
            width: 100%;
            height: 260px;
            overflow: hidden;
            .time{
              color: #ccc;
              text-align: left;
              font-size: 12px;
              line-height: 3;
            }
          }

          .btn{
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #d8d8d8;
            height: 30px;
            line-height: 30px;
            width: 95%;
            border-radius: 2px;
            text-align: center;
          }
        }

        .right{
          width: 100%;
          background-color: #bd3124;
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: #fff;
          padding: 5px 10px;

          .room{
            border-bottom: 1px solid rgba(255,255,255,.3);
            .room-name{
              font-size: 22px;
            }
          }

          .title{
            font-size: 36px;
            line-height: 2;
          }

          .info{
            .title{
              font-size: 14px;
              line-height: 2;
              font-weight: normal;
            }

            .info-row{
              display: flex;
              gap:5px;
              line-height: 2;
              align-items: center;

              .label{
                min-width: 60px;
              }
            }
          }
        }
      }
    }

    .btns{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }
  }


}



</style>