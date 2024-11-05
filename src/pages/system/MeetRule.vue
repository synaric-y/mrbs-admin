<template>
  <Layout :title="$t('setting.meeting_rule_setting.title')" section-left-padding="0">
    <template #section>
      <div>
        <div class="section-title">终端会议展示</div>
        <div class="section-content">
          <div class="switches">
            <div class="switch-row">
              <div class="label">预定人显示</div>
              <el-switch
                  v-model="form.bookerDisplay"
                  style="--el-switch-on-color: #591bb7;"
              />
              <el-text v-if="form.bookerDisplay" class="mx-1" type="primary">终端将显示预定人姓名</el-text>
              <el-text v-else class="mx-1">终端将显示默认文字：“**预定”</el-text>
            </div>
            <div class="switch-row">
              <div class="label">预定会议名称显示</div>
              <el-switch
                  v-model="form.meetingNameDisplay"
                  style="--el-switch-on-color: #591bb7;"
              />
              <el-text v-if="form.meetingNameDisplay" class="mx-1" type="primary">终端将显示会议名称</el-text>
              <el-text v-else class="mx-1">终端将显示默认文字：“**会议”</el-text>
            </div>
            <div class="switch-row">
              <div class="label">开启临时会议</div>
              <el-switch
                  v-model="form.quickMeetingDisplay"
                  style="--el-switch-on-color: #591bb7;"
              />
              <el-text v-if="form.quickMeetingDisplay" class="mx-1" type="primary">终端将显示临时会议按钮</el-text>
              <el-text v-else class="mx-1">终端将不显示临时会议按钮</el-text>
            </div>
          </div>
          <div class="preview">
            <div class="left">
              <div class="times">
                <div class="time" v-for="item in timeline">{{ item }}</div>
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
                  <el-icon>
                    <Monitor/>
                  </el-icon>
                  <div class="value">{{ form.meetingNameDisplay ? '销售部门会议' : '**会议' }}</div>
                </div>
                <div class="info-row">
                  <el-icon>
                    <Clock/>
                  </el-icon>
                  <div class="value">09:00AM - 11:00AM</div>
                </div>
                <div class="info-row">
                  <el-icon>
                    <User/>
                  </el-icon>
                  <div class="value">{{ form.bookerDisplay ? 'Alvin' : '**预定' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="section-title">会议规则参数</div>

        <div class="section-content">
          <el-form ref="formRef" :model="form" label-width="auto" :rules="rules">
            <!--              <el-form-item label="快速会议开始时间" prop="startTime">-->
            <!--                <el-select style="min-width: 400px" v-model="form.startTime" placeholder="请选择">-->
            <!--                  <el-option label="最近空闲时段马上开始" value="0"/>-->
            <!--                  <el-option label="手动选择" value="1"/>-->
            <!--                </el-select>-->
            <!--              </el-form-item>-->
            <el-form-item label="预定时间最小间隔" prop="minScale">
              <el-select style="min-width: 400px" v-model="form.minScale" placeholder="请选择">
                <el-option v-for="(item,index) in resolutionOptions" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <template #btns>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="back">取消</el-button>
    </template>
  </Layout>
</template>


<script>
import {Api} from "@/network/api.js";
import {PageMixin} from "@/pages/PageMixin.js";
import {STORAGE} from "@/const.js";
import {ElMessage} from "element-plus";
import {Clock, Monitor, User} from "@element-plus/icons-vue";
import {HOST} from "@/config.js";
import Layout from "@/components/Layout.vue";
const SECOND_PER_MINUTE = 60
export default {
  components: {User, Monitor, Clock, Layout},
  mixins: [PageMixin],
  data() {
    return {
      mode: 'add',
      form: {
        bookerDisplay: true,
        meetingNameDisplay: true,
        quickMeetingDisplay: true,
        // startTime: '',
        minScale: '',
      },

      resolutionOptions:[
        {
          label: '15分钟',
          value: 15*SECOND_PER_MINUTE
        },
        {
          label: '30分钟',
          value: 30*SECOND_PER_MINUTE
        }
      ],
      timeline: [
        '10:00am', '10:30am', '11:00am', '11:30am', '12:00am', '12:30am', '01:00pm', '01:30pm',
      ],
      rules: {
        // startTime: [
        //   {required: true, message: '请选择快速会议开始时间', trigger: 'blur'},
        // ],
        minScale: [
          {required: true, message: '请选择预定时间最小间隔', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
    const that = this
    Api.getVariables({
      "show_book": 1,
      "show_meeting_name": 1,
      "temporary_meeting": 1,
      "resolution": 1,
    }).then(({code, data, msg}) => {
      if (code == 0) {
        console.log(data)

        that.form = {
          ...that.form,
          bookerDisplay: data.show_book===1,
          meetingNameDisplay: data.show_meeting_name===1,
          quickMeetingDisplay: data.temporary_meeting===1,
          minScale: data.resolution
        }
      } else {
        ElMessage.error({
          message: '设置获取失败',
        })
      }
    })
    .catch(e => {
      console.log(e)
    })
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    submit() {
      console.log(this.form)
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('submit!')

          Api.setVariables(
              {
                "init_status": 3,
                "show_book": this.form.bookerDisplay?1:0,
                "show_meeting_name": this.form.meetingNameDisplay?1:0,
                "temporary_meeting": this.form.quickMeetingDisplay?1:0,
                "resolution": this.form.minScale
              }
          ).then(({code,data})=>{
            if(code==0){
              ElMessage.success({
                message: '设置成功',
              })
              setTimeout(()=>{
                location.reload() // 刷新页面
              },1000)
            }else{
              ElMessage.error({
                message: '设置失败',
              })
            }
          })
          .catch(e=>{
            ElMessage.error({
              message: '设置失败',
            })
            console.log(e)
          })

        } else {
          console.log('error submit!')
          ElMessage.error({
            message: '表单格式错误',
          })
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


<style lang="scss" scoped>
.section-title {
  color: var(--el-color-primary);
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 700;
  line-height: 2;
  margin-bottom: 20px;
}

.section-content {

  display: flex;
  align-items: center;
  gap: 50px;
  margin-left: 100px;
}

.switches {
  .switch-row {
    display: flex;
    gap: 20px;
    align-items: center;
    font-size: 14px;
    line-height: 3;
    color: #666;
    width: 500px;

    .label {
      min-width: 120px;
      text-align: right;
      color: #4e5969;
    }
  }
}

.preview {
  display: flex;
  height: 300px;
  width: 480px;

  .left {
    width: 40%;
    background-color: #333333;
    padding: 5px;
    position: relative;

    .times {
      width: 100%;
      height: 260px;
      overflow: hidden;

      .time {
        color: #ccc;
        text-align: left;
        font-size: 12px;
        line-height: 3;
      }
    }

    .btn {
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #d8d8d8;
      height: 30px;
      line-height: 30px;
      width: 70%;
      border-radius: 2px;
      text-align: center;
    }
  }

  .right {
    width: 100%;
    background-color: #bd3124;
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: #fff;
    padding: 5px 10px;

    .room {
      border-bottom: 1px solid rgba(255, 255, 255, .3);

      .room-name {
        font-size: 22px;
      }
    }

    .title {
      font-size: 36px;
      line-height: 2;
    }

    .info {
      .title {
        font-size: 14px;
        line-height: 2;
        font-weight: normal;
      }

      .info-row {
        display: flex;
        gap: 5px;
        line-height: 2;
        align-items: center;

        .label {
          min-width: 60px;
        }
      }
    }
  }
}


</style>