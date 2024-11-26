<template>
  <Layout :title="$t('setting.meeting_rule_setting.title')" section-left-padding="0">
    <template #section>
      <div>
        <div class="section-title">{{$t('system.terminal_meet_title')}}</div>
        <div class="section-content">
          <div class="switches">
            <div class="switch-row">
              <div class="label">{{ $t('system.show_booker') }}</div>
              <el-switch v-model="form.bookerDisplay" style="--el-switch-on-color: #591bb7;" />
              <el-text v-if="form.bookerDisplay" class="mx-1" type="primary">{{ $t('system.show_booker_tip') }}</el-text>
              <el-text v-else class="mx-1">{{ $t('system.show_booker_text') }}</el-text>
            </div>
            <div class="switch-row">
              <div class="label">{{ $t('system.show_title') }}</div>
              <el-switch v-model="form.meetingNameDisplay" style="--el-switch-on-color: #591bb7;" />
              <el-text v-if="form.meetingNameDisplay" class="mx-1" type="primary">{{ $t('system.show_title_tip') }}</el-text>
              <el-text v-else class="mx-1">{{ $t('system.show_title_text') }}</el-text>
            </div>
            <div class="switch-row">
              <div class="label">{{ $t('system.show_temp_meet') }}</div>
              <el-select style="max-width: 170px" v-model="form.quickMeetingDisplay" :placeholder="$t('base.plzSelect')">
                <el-option :label="$t('system.temp_meet_no')" :value="0" key="0" />
                <el-option :label="$t('system.temp_meet_no_verify')" :value="1" key="1" />
                <el-option :label="$t('system.temp_meet_verify')" :value="2" key="2" />
              </el-select>
              <el-text v-if="form.quickMeetingDisplay != 0" class="mx-1" type="primary">{{ $t('system.show_temp_tip1') }}</el-text>
              <el-text v-else class="mx-1">{{ $t('system.show_temp_tip2') }}</el-text>
            </div>
          </div>
          <div class="preview">
            <div class="left">
              <div class="times">
                <div class="time" v-for="item in timeline">{{ item }}</div>
              </div>
              <div class="btn" v-if="form.quickMeetingDisplay != 0">{{ $t('system.temp_meet') }}</div>
            </div>
            <div class="right">
              <div class="room">{{ $t('system.room_name') }}
                <span class="room-name">A</span>
              </div>
              <div class="time">10:35AM 2024/7/19</div>
              <div class="title">{{$t('system.meet_status')}}</div>
              <div class="info">
                <div class="title">{{ $t('system.in_meet_info') }}</div>
                <div class="info-row">
                  <el-icon>
                    <Monitor />
                  </el-icon>
                  <div class="value">{{ form.meetingNameDisplay ? $t('system.temp_meet_name') : $t('system.hide_meet_name') }}</div>
                </div>
                <div class="info-row">
                  <el-icon>
                    <Clock />
                  </el-icon>
                  <div class="value">09:00AM - 11:00AM</div>
                </div>
                <div class="info-row">
                  <el-icon>
                    <User />
                  </el-icon>
                  <div class="value">{{ form.bookerDisplay ? $t('system.temp_meet_booker'): $t('system.hide_meet_booker') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="section-title">{{ $t('system.meet_rule_title') }}</div>
        <div class="section-content">
          <el-form ref="formRef" :model="form" label-width="auto" :rules="rules">
            <el-form-item :label="$t('system.meet_min_interval')" prop="minScale">
              <el-select style="min-width: 400px" v-model="form.minScale" :placeholder="$t('base.plzSelect')">
                <el-option v-for="(item, index) in resolutionOptions" :key="index" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <template #btns>
      <el-button type="primary" @click="submit">{{ $t('base.save')}}</el-button>
      <el-button @click="back">{{ $t('base.cancle')}}</el-button>
    </template>
  </Layout>
</template>

<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import { Clock, Monitor, User } from "@element-plus/icons-vue";
import { HOST } from "@/config.js";
import Layout from "@/components/Layout.vue";
const SECOND_PER_MINUTE = 60
export default {
  components: { User, Monitor, Clock, Layout },
  mixins: [PageMixin],
  data() {
    return {
      mode: 'add',
      form: {
        bookerDisplay: true,
        meetingNameDisplay: true,
        quickMeetingDisplay: 1,
        minScale: '',
      },

      resolutionOptions: [
        {
          label: this.$t('system.fifteen_minute'),
          value: 15 * SECOND_PER_MINUTE
        },
        {
          label: this.$t('system.thirty_minute'),
          value: 30 * SECOND_PER_MINUTE
        }
      ],
      timeline: [
        '10:00am', '10:30am', '11:00am', '11:30am', '12:00am', '12:30am', '01:00pm', '01:30pm',
      ],
      rules: {
        minScale: [
          { required: true, message: this.$t('system.select_min_interval'), trigger: 'blur' },
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
    }).then(({ code, data, msg }) => {
      if (code == 0) {
        console.log(data)

        that.form = {
          ...that.form,
          bookerDisplay: data.show_book === 1,
          meetingNameDisplay: data.show_meeting_name === 1,
          quickMeetingDisplay: data.temporary_meeting,
          minScale: data.resolution
        }
      } else {
        ElMessage.error({
          message: this.$t('guide.set_get_fail'),
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
              "show_book": this.form.bookerDisplay ? 1 : 0,
              "show_meeting_name": this.form.meetingNameDisplay ? 1 : 0,
              "temporary_meeting": this.form.quickMeetingDisplay,
              "resolution": this.form.minScale
            }
          ).then(({ code, data }) => {
            if (code == 0) {
              ElMessage.success({
                message: this.$t('guide.set_success'),
              })
              setTimeout(() => {
                location.reload()
              }, 1000)
            } else {
              ElMessage.error({
                message: this.$t('guide.set_fail'),
              })
            }
          })
            .catch(e => {
              ElMessage.error({
                message: this.$t('guide.set_fail'),
              })
              console.log(e)
            })

        } else {
          console.log('error submit!')
          ElMessage.error({
            message: this.$t('guide.form_format_error'),
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