<template>
  <div class="mask">
    <div class="content">
      <div class="title">{{ mode == 1 ? '编辑会议' : '新增会议' }}</div>
      <el-form ref="meetForm" :model="meetForm" :rules="rules">
        <el-form-item prop="area_name" label="区域" label-width="100px" required>
          <el-select v-model="meetForm.area_name" placeholder="请选择区域" :disabled="mode == 1" @change="OnAreaChange">
            <el-option v-for="item in areas" :key="item.area_id" :label="item.area_name" :value="item.area_id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="room_name" label="会议室" label-width="100px" required>
          <el-select v-model="meetForm.room_name" placeholder="请选择会议室" :disabled="mode == 1" @change="onRoomChange">
            <el-option v-for="item in roomOptions" :key="item.room_id" :label="item.title" :value="item.room_id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="会议室标题" label-width="100px" required>
          <el-input v-model="meetForm.name" autocomplete="off" show-word-limit maxlength="20" />
        </el-form-item>
        <el-form-item prop="start_date" label="开始时间" style="margin-left: 20px" required>
          <el-col :span="11">
            <el-form-item prop="start_date">
              <el-date-picker v-model="meetForm.start_date" type="date" :disabled-date="disabledDate"
                value-format="YYYY-MM-DD" aria-label="请选择" placeholder="请选择" style="width: 100%"
                @change="choseDate(0, $event)" />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500"></span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="start_hour">
              <!-- <template v-if="mode == 0">
                <el-time-select v-model="meetForm.start_hour" style="width: 300px" :start="minStartTime"
                :step="minStep" :end="maxEndTime" :placeholder="$t('base.plzSelect')"
                @change="choseDialogHour(0, meetForm.start_hour, $event)" :min-time="currentHourMinute" />
              </template>
              <template v-else>
                <el-time-picker format="HH:mm" value-format="HH:mm" v-model="meetForm.start_hour" :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes" :placeholder="$t('base.plzSelect')" @change="choseDialogHour(0, meetForm.start_hour, $event)"/>
              </template> -->
              <el-time-picker format="HH:mm" value-format="HH:mm" v-model="meetForm.start_hour" :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes" :placeholder="$t('base.plzSelect')" @change="choseDialogHour(0, meetForm.start_hour, $event)"/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="end_date" label="结束时间" style="margin-left: 20px" required>
          <el-col :span="11">
            <el-form-item prop="end_date">
              <el-date-picker v-model="meetForm.end_date" type="date" :disabled-date="disabledDate"
                value-format="YYYY-MM-DD" aria-label="请选择" placeholder="请选择" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500"></span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="end_hour">
              <!-- <template v-if="mode == 0">
                <el-time-select v-model="meetForm.end_hour" style="width: 300px" :start="minStartTime" :step="minStep"
                :end="maxEndTime" :placeholder="$t('base.plzSelect')"
                @change="choseDialogHour(1, meetForm.end_hour, $event)" :min-time="currentHourMinute" />
              </template>
              <template v-else>
                <el-time-picker format="HH:mm" value-format="HH:mm" v-model="meetForm.end_hour" :disabled-hours="disabledHours" :disabled-minutes="disabledMinutes"
                :placeholder="$t('base.plzSelect')" @change="choseDialogHour(1, meetForm.end_hour, $event)"/>
              </template> -->
              <el-time-picker format="HH:mm" value-format="HH:mm" v-model="meetForm.end_hour" :disabled-hours="disabledHours" :disabled-minutes="disabledMinutes"
                :placeholder="$t('base.plzSelect')" @change="choseDialogHour(1, meetForm.end_hour, $event)"/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input v-model="meetForm.description" maxlength="100" style="width: 410px;" placeholder="请输入"
            show-word-limit type="textarea" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="commitForm">提交</el-button>
        <el-button style="margin-left: 50px" @click="deleteMeet" v-if="mode == 1">删除</el-button>
        <el-button style="margin-left: 50px" @click="$emit('close')">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import moment from "moment";
import { Common } from "@/common/common";
import { now } from "moment/moment";

export default {
  computed: {
  },
  mixins: [PageMixin],
  props: ['entry_id', 'mode', 'areas', 'add_params'],
  emits: ['close'],
  name: 'SingleMeetCMP',
  data() {
    return {
      groupMembers: [],
      sourceVal: 'ad',
      sourceOptions: [
        {
          value: 'system',
          label: '系统创建',
        }, {
          value: 'ad',
          label: 'AD绑定',
        }],
      isLoading: true,
      selectRow: null,
      meetForm: {
        area_id: '',
        area_name: '',
        room_id: '',
        room_name: '',
        rooms: [],
        name: '',
        start_date: '',
        start_hour: '',
        start_seconds: 0,
        end_date: '',
        end_hour: '',
        end_seconds: 0,
        description: '',
        repeat_week: '0',
        check_list: [],
        rep_end_date: "",
        // 未知参数
        all_day: "",
        type: "E",
        original_room_id: null,
        ical_uid: "1123123",
        ical_sequence: 1,
        ical_recur_id: "asdfa",
        allow_registration: "",
        registrant_limit: 10,
        registrant_limit_enabled: "1",
        registration_opens_value: 1,
        registration_open_units: "w",
        registration_open_enabled: "",
        registration_closes_value: 1,
        registration_closes_units: "w",
        registration_closes_enabled: "",
        rep_id: null,
        edit_series: 0,
        rep_type: 0,
        rep_day: [],
        rep_interval: 1,
        month_type: 0,
        month_absolute: 2,
        month_relative_ord: "",
        month_relative_day: "",
        skip: 0,
        no_mail: 1,
        private: "",
        create_by: '',
        book_by: ''
      },
      currentHourMinute: '',
      minStep: '00:15',
      minStartTime: '06:00',
      maxEndTime: '21:00',
      rules: {
        area_name: [
          { required: true, message: '请选择区域', trigger: 'blur' }
        ],
        room_name: [
          { required: true, message: '请选择房间', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入会议标题', trigger: 'blur' }
        ],
        start_date: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        start_hour: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        end_date: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
          // {
          //   validator: (rule, value, callback) => {
          //     const startDate = this.meetForm.start_date;
          //     if (!value || !startDate) {
          //       callback();
          //       return;
          //     }
          //     const isSameDay = new Date(startDate).toDateString() === new Date(value).toDateString();
          //     if (!isSameDay) {
          //       callback(new Error('结束时间必须与开始时间为同一天'));
          //     } else {
          //       callback();
          //     }
          //   },
          //   trigger: 'blur'
          // }
        ],
        end_hour: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
          // {
          //   validator: (rule, value, callback) => {
          //     const [hourPart, minutePart] = this.meetForm.start_hour.split(':')
          //     const [endHourPart,endMinutePart] = value.split(':')
          //     if (Number(hourPart) > Number(endHourPart)) {
          //       callback(new Error('开始时间段不能大于结束的时间段'))
          //     } else if(Number(hourPart) === Number(endHourPart) && Number(minutePart) >= Number(endMinutePart)) {
          //       callback(new Error('开始时间段不能大于结束的时间段'))
          //     } else {
          //       callback();
          //     }
          //   },
          //   trigger: 'blur'
          // }
        ],
        repeat_week: [
          { required: true, message: '请选择会议重复时间', trigger: 'blur' }
        ],
        check_list: [
          { required: true, message: '请选择会议重复list时间', trigger: 'blur' }
        ],
        description: [
          { required: false, message: '请输入会议信息', trigger: 'blur' }
        ],
      },
      currentTimeZone: 'Asia/Shanghai',
      roomOptions: [],
      start_minute: '',
      end_minute: ''
    }
  },
  methods: {

    makeRange(start, end) {
      const result = []
      for (let i = start; i <= end; i++) {
        result.push(i)
      }
      return result
    },
    disabledHours() {
      return this.makeRange(0, 6).concat(this.makeRange(22,23))
    },
    disabledMinutes(hour) {
      // if (hour === 15) {
      //   return this.makeRange(20, 40)
      // }
      return []
    },

    disabledDate(time) {
      return time.getTime() < Date.now() - 86400000;
    },

    OnAreaChange(e) {
      // this.select_area_id = e
      this.meetForm.area_id = e
      console.log('SingleMeetCMP OnAreaChange e', e)
      if (this.meetForm.area_id != -1) {
        this.roomOptions = this.getSelectedArea(e)
      } else {
        const select_rooms = [];
        this.areas.forEach(area => {
          area.rooms.forEach(room => {
            select_rooms.push({
              area_id: area.area_id,
              area_name: area.area_name,
              room_id: room.room_id,
              room_name: room.room_name,
              title: `${area.area_name}-${room.room_name}`,
              disabled: room.disabled,
            });
          });
        });
        this.meetForm.room_name = ''
        this.meetForm.room_id = -1
        this.roomOptions = select_rooms
      }
      this.meetForm.room_name = ''
      this.meetForm.room_id = -1
    },

    onRoomChange(e) {
      this.meetForm.room_id = e
    },

    choseDialogHour(mode, str, e) {
      console.log('SingleMeetCMP choseHour str e', str, e)
      const ymd = this.meetForm.start_date
      const lang = Common.getLocalLang()
      const appeedStr = ymd + ' ' + str
      const formatStr = Common.getAssignFormat(appeedStr, lang)
      console.log('SingleMeetCMP choseHour this.currentTimeZone lang appeedStr', this.currentTimeZone, lang, appeedStr)
      const nextTimeStamp = moment.tz(formatStr, this.currentTimeZone).unix();
      console.log('SingleMeetCMP choseHour formatStr nextTimeStamp ', formatStr, nextTimeStamp)
      if (mode == 0) {
        const currenDay = Common.getYearToDay()
        const currenStamp = Common.getCurrenTimeZoneStamp(this.currentTimeZone)
        if (currenDay == ymd && currenStamp > nextTimeStamp) {
          ElMessage({
            message: this.$t('base.passTimeError'),
            type: 'warning',
          })
          this.meetForm.start_seconds = 0
          this.meetForm.start_hour = ''
          return
        }
        this.meetForm.start_seconds = nextTimeStamp;
        return
      }
      this.meetForm.end_seconds = nextTimeStamp;
    },

    choseDate(mode, e) {
      const selected_date = moment.tz(e, this.currentTimeZone).format('YYYY-MM-DD')
      if (mode == 0) {
        this.limitSelectHour(selected_date)
        this.meetForm.start_date = selected_date
        return
      }
      this.meetForm.end_date = selected_date
    },

    getSelectedArea(area_id) {
      const area_rooms = this.areas.filter((item) =>
        item.area_id === area_id
      )
      console.log('SingleMeetCMP onAreaChange area_rooms', area_rooms[0])
      const select_rooms = [];
      const duration = area_rooms[0].resolution
      // 为半个小时
      if (duration == 1800) {
        console.log('SingleMeetCMP onAreaChange area_rooms 00:30')
        this.minStep = '00:30'
      } else {
        console.log('SingleMeetCMP onAreaChange area_rooms 00:15')
        this.minStep = '00:15'
      }
      // 设置选择开始结束时间
      // this.minStartTime = Common.convertTo24Hour(area_rooms[0].start_time)
      this.maxEndTime = Common.convertTo24Hour(area_rooms[0].end_time)
      area_rooms[0].rooms.forEach(room => {
        select_rooms.push({
          room_id: room.room_id,
          room_name: room.room_name,
          title: room.room_name,
          disabled: room.disabled,
        });
      });
      return select_rooms
    },
    limitSelectHour(selected_date) {
      const now_date = moment.tz(Date.now(), this.currentTimeZone).format('YYYY-MM-DD')
      console.log('SingleMeetCMP choseDate selected_date', selected_date)
      if (now_date != selected_date) {
        this.minStartTime = '06:00'
      } else {
        this.minStartTime = Common.formatLastMinute(15)
      }
    },
    getMeetDetail() {
      let params = {}
      params['id'] = Number(this.entry_id)
      params['is_series'] = 0
      Api.getMeetDetail(params).then(({ data, code, msg }) => {
        if (code != 0 && !data) {
          return
        }
        console.log('SingleMeetCMP getMeetDetail data', data)
        this.meetForm.name = data.name
        this.meetForm.description = data.description
        this.meetForm.room_name = data.room_name
        this.meetForm.area_name = data.area_name
        this.meetForm.room_id = data.room_id
        this.meetForm.area_id = data.area_id
        this.meetForm.start_date = moment.tz(data.start_time * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
        this.meetForm.start_hour = moment.tz(data.start_time * 1000, 'Asia/Shanghai').format('HH:mm')
        this.meetForm.end_date = moment.tz(data.end_time * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
        this.meetForm.end_hour = moment.tz(data.end_time * 1000, 'Asia/Shanghai').format('HH:mm')
        this.meetForm.start_seconds = data.start_time
        this.meetForm.end_seconds = data.end_time
        this.roomOptions = this.getSelectedArea(data.area_id)
        this.limitSelectHour(data.start_date)
      })
    },

    commitForm() {
      console.log('SingleMeetCMP commitForm this.meetForm', this.meetForm)
      this.$refs.meetForm.validate((pass) => {
        if (!pass) {
          console.log('SingleMeetCMP commitForm !pass')
          return
        }
        this.meetForm.original_room_id = this.meetForm.room_id
        this.meetForm.rooms = []
        if (this.entry_id && this.mode != 0) {
          this.meetForm.id = Number(this.entry_id)
        }
        delete this.meetForm['create_by']
        delete this.meetForm['book_by']
        this.meetForm.rooms.push(this.meetForm.room_id)
        Api.editMeet(this.meetForm).then(({ data, code, msg }) => {
          if (code == 0) {
            this.$emit('close')
            ElMessage({
              message: msg,
              type: 'success',
            })
          } else {
            ElMessage({
              message: msg,
              type: 'error',
            })
          }
        })
      })
    },

    deleteMeet() {
      Api.deleteMeet({ entry_id: Number(this.entry_id) }).then(({ data, code, msg }) => {
        if (code == 0) {
          ElMessage({
            message: this.$t('base.deleteSuccess'),
            type: 'success',
          })
          this.$emit('close')
        } else {
          ElMessage.error(msg)
        }
      }).catch(() => {
        ElMessage.error(this.$t('deleteError'))
      })
    },
  },
  created() {
    // this.minStartTime = Common.formatLastMinute(15)
    console.log('SingleMeetCMP created params:', this.entry_id, this.add_params)
    console.log('SingleMeetCMP created start - end',moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('HH:mm'),moment.tz((this.add_params.timeStamp + 1800) * 1000, 'Asia/Shanghai').format('HH:mm'));
    
    if (this.add_params && this.mode == 0) {
      this.meetForm.room_id = this.add_params.room_id
      this.meetForm.room_name = this.add_params.room_name
      this.meetForm.area_id = this.add_params.area_id
      this.meetForm.area_name = this.add_params.area_name
      this.meetForm.start_date = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
      const now_date = moment.tz(Date.now(), this.currentTimeZone).format('YYYY-MM-DD')
      // if (this.add_params.resolution == 1800) {
      //   const invaild_time = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('HH:mm')
      //   // 处理15、45分钟
      //   if (invaild_time.endsWith('15') || invaild_time.endsWith('45')) {
      //     const time_stamp = this.add_params.timeStamp - 900
      //     this.meetForm.start_date = moment.tz(time_stamp * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
      //     this.meetForm.start_hour = moment.tz(time_stamp * 1000, 'Asia/Shanghai').format('HH:mm')
      //     this.meetForm.end_date = moment.tz((time_stamp + 1800) * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
      //     this.meetForm.end_hour = moment.tz((time_stamp + 1800) * 1000, 'Asia/Shanghai').format('HH:mm')
      //     this.meetForm.start_seconds = time_stamp
      //     this.meetForm.end_seconds = time_stamp + 1800
      //   } else {
      //     this.meetForm.start_date = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
      //     this.meetForm.start_hour = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('HH:mm')
      //     this.meetForm.end_date = moment.tz((this.add_params.timeStamp + 1800) * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
      //     this.meetForm.end_hour = moment.tz((this.add_params.timeStamp + 1800) * 1000, 'Asia/Shanghai').format('HH:mm')
      //     this.meetForm.start_seconds = this.add_params.timeStamp
      //     this.meetForm.end_seconds = this.add_params.timeStamp + 1800
      //   }
      //   this.minStep = '00:30'
      //   if (now_date === this.meetForm.start_date) {
      //     this.minStartTime = Common.formatLastMinute(30)
      //   }
      // } else {
      //   this.meetForm.start_date = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
      //   this.meetForm.start_hour = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('HH:mm')
      //   this.meetForm.end_date = moment.tz((this.add_params.timeStamp + 900) * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
      //   this.meetForm.end_hour = moment.tz((this.add_params.timeStamp + 900) * 1000, 'Asia/Shanghai').format('HH:mm')
      //   this.meetForm.start_seconds = this.add_params.timeStamp
      //   this.meetForm.end_seconds = this.add_params.timeStamp + 900
      //   this.minStep = '00:15'
      //   if (now_date === this.meetForm.start_date) {
      //     this.minStartTime = Common.formatLastMinute(15)
      //   }
      // }

      this.meetForm.start_date = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
      this.meetForm.start_hour = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('HH:mm')
      this.meetForm.end_date = moment.tz((this.add_params.timeStamp + 900) * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
      this.meetForm.end_hour = moment.tz((this.add_params.timeStamp + 900) * 1000, 'Asia/Shanghai').format('HH:mm')
      this.meetForm.start_seconds = this.add_params.timeStamp
      this.meetForm.end_seconds = this.add_params.timeStamp + 900
      this.minStep = '00:15'
      if (now_date === this.meetForm.start_date) {
        this.minStartTime = Common.formatLastMinute(15)
      }
      this.roomOptions = this.getSelectedArea(this.add_params.area_id)
      return
    }
    this.getMeetDetail()
  },

  mounted(params) {
    console.log('SingleMeetCMP mounted params:', this.userInfo.display_name)
  },

  unmounted() {

  }
}
</script>



<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background-color: rgba(0, 0, 0, .3);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);

  .content {
    width: 50%;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 6px 2px rgba(0, 0, 0, .1);
    padding: 20px 30px;

    .title {
      line-height: 2;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .demo-form-inline {
      margin-bottom: 10px;
    }

    .el-table {
      min-height: 300px;
    }

    .table-pagination-block {
      display: flex;
      justify-content: center;
      gap: 10px;
      align-items: center;
      margin-bottom: 20px;

      .table-demonstration {
        font-size: 16px;
        color: #333;
      }
    }

    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  }
}

.el-table {
  --el-table-header-bg-color: #f5f6f7;
  --el-table-border: 1px solid #E1E1E1;
  --el-table-tr-bg-color: #fff;
}
</style>