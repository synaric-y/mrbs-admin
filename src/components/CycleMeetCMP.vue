<template>
  <div class="mask">
    <div class="content">
      <div class="title">{{ mode == 1 ? $t('meet.editCycleMeet') : $t('meet.addCycleMeet') }}</div>
      <el-form ref="meetForm" :model="meetForm" :rules="rules">
        <el-form-item prop="area_name" :label="$t('base.area')" label-width="100px" required>
          <el-select v-model="meetForm.area_name" :placeholder="$t('meet.plSelectArea')"  :disabled="mode == 1"  @change="OnAreaChange">
            <el-option v-for="item in areas" :key="item.area_id" :label="item.area_name" :value="item.area_id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="room_name" :label="$t('base.room')" label-width="100px" required>
          <el-select v-model="meetForm.room_name" :disabled="mode == 1" :placeholder="$t('meet.plSelectRoom')" @change="onRoomChange">
            <el-option v-for="item in roomOptions" :key="item.room_name" :label="item.title" :value="item.room_id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="name" :label="$t('meet.room_title')" label-width="100px" required>
          <el-input v-model="meetForm.name" autocomplete="off" show-word-limit maxlength="20" />
        </el-form-item>
        <el-form-item prop="start_date" :label="$t('meet.start_time')" style="margin-left: 20px;width: 300px;" required>
          <el-form-item prop="start_date" style="width: 300px">
            <el-date-picker v-model="meetForm.start_date" type="date" :disabled-date="disabledDate"
              value-format="YYYY-MM-DD" :aria-label="$t('base.plzSelect')" :placeholder="$t('base.plzSelect')" 
              @change="choseDate(0, $event)" />
          </el-form-item>
        </el-form-item>
        <el-row style="margin-left: 97px">
          <el-form-item prop="start_hour" required>
            <!-- <el-time-select v-model="meetForm.start_hour" style="width: 300px;" :start="minStartTime" :step="minStep"
              :end="maxEndTime" placeholder="会议开始" @change="choseDialogHour(0, meetForm.start_hour, $event)"
              :min-time="currentHourMinute" /> -->
              <el-time-picker format="HH:mm" value-format="HH:mm" v-model="meetForm.start_hour" :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes" :placeholder="$t('base.plzSelect')" @change="choseDialogHour(0, meetForm.start_hour, $event)"/>
          </el-form-item>
          <span style="line-height: 32px;width: 20px;text-align: center;"> - </span>
          <el-form-item prop="end_hour" required>
            <!-- <el-time-select v-model="meetForm.end_hour" style="width: 300px;" :start="minStartTime" :step="minStep"
              :end="maxEndTime" placeholder="会议结束" @change="choseDialogHour(1, meetForm.end_hour, $event)"
              :min-time="currentHourMinute" /> -->
              <el-time-picker format="HH:mm" value-format="HH:mm" v-model="meetForm.end_hour" :disabled-hours="disabledHours" :disabled-minutes="disabledMinutes"
              :placeholder="$t('base.plzSelect')" @change="choseDialogHour(1, meetForm.end_hour, $event)"/>
          </el-form-item>
        </el-row>
        <el-form-item :label="$t('meet.repeatInterval')" prop="rep_interval" style="margin-left: 7px" required>
          <el-input-number style="width: 100px;" v-model="meetForm.rep_interval" @change="onRepeatIntervalChange" :min="1" :max="4" />
          <span
            style="margin-left: 20px;color: #4E5969;font-family: PingFang SC;font-size: 14px;font-weight: normal;">{{ $t('meet.someWeek') }}</span>
        </el-form-item>
        <el-form-item style="margin-left: 40px" prop="rep_day" required>
          <el-checkbox-group v-model="meetForm.rep_day" size="small">
            <el-checkbox v-for="(item, index) in check_box_list" :label="item.label" :value="item.value" :key="index" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="rep_end_date" :label="$t('meet.end_time')" style="margin-left: 20px;width: 300px;" required>
          <el-form-item prop="rep_end_date" style="width: 300px">
            <el-date-picker v-model="meetForm.rep_end_date" type="date" :disabled-date="disabledDate"
              value-format="YYYY-MM-DD" :aria-label="$t('base.plzSelect')" :placeholder="$t('base.plzSelect')" />
          </el-form-item>
        </el-form-item>
        <el-form-item prop="description" :label="$t('meet.remark')" label-width="100px">
          <el-input v-model="meetForm.description" maxlength="100" style="width: 410px;" :placeholder="$t('base.input')"
            show-word-limit type="textarea" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="commitForm">{{ $t('base.submit') }}</el-button>
        <el-button style="margin-left: 50px" @click="deleteMeet" v-if="mode == 1">{{ $t('base.delete') }}</el-button>
        <el-button style="margin-left: 50px" @click="$emit('close')">{{ $t('base.close') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "@/network/api.js";
import { PageMixin } from "@/pages/PageMixin.js";
import { STORAGE } from "@/const.js";
import { ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import moment from "moment";
import { Common } from "@/common/common";

export default {
  computed: {
    Search() {
      return Search
    }
  },
  mixins: [PageMixin],
  props: ['entry_id', 'repeat_id', 'is_series', 'mode', 'areas', 'add_params'],
  emits: ['close'],
  name: 'CycleMeetCMP',
  data() {
    return {
      groupMembers: [],
      sourceVal: 'ad',
      sourceOptions: [
        {
          value: 'system',
          label: this.$t('userGroup.local'),
        }, {
          value: 'ad',
          label: this.$t('meet.adBind'),
        }],
      isLoading: true,
      selectRow: null,
      currentHourMinute: '',
      minStep: '00:15',
      minStartTime: '06:00',
      maxEndTime: '21:00',
      check_box_list: [
        { label: this.$t('meet.selectMonday'), value: 1 },
        { label: this.$t('meet.selectTuesday'), value: 2 },
        { label: this.$t('meet.selectWednesday'), value: 3 },
        { label: this.$t('meet.selectThursday'), value: 4 },
        { label: this.$t('meet.selectFriday'), value: 5 },
        { label: this.$t('meet.selectSaturday'), value: 6 },
        { label: this.$t('meet.selectSunday'), value: 0 },
      ],
      meetForm: {
        tmp_repeat_id: 0,
        id: 0,
        area_id: '',
        area_name: '',
        room_id: '',
        room_name: '',
        rooms: [],
        name: '',
        start_date: '',
        end_date: '',
        start_hour: '',
        start_seconds: 0,
        rep_end_date: '',
        end_hour: '',
        end_seconds: 0,
        description: '',
        repeat_week: '1',
        check_list: [],
        rep_opt: 0,
        rep_interval: 1,
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
        edit_series: 1,
        rep_type: 2,
        rep_day: [],
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
      rules: {
        area_name: [
          { required: true, message: this.$t('meet.plSelectArea'), trigger: 'blur' }
        ],
        room_name: [
          { required: true, message: this.$t('meet.plSelectRoom'), trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('meet.plSelectMeetTitle'), trigger: 'blur' }
        ],
        start_date: [
          { required: true, message: this.$t('meet.plSelectStartTime'), trigger: 'blur' }
        ],
        start_hour: [
          // { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' },
          {
            validator: (rule, value, callback, source, options) => {
              const errors = [];
              if (!value) {
                errors.push(new Error(this.$t('meet.plSelectStartTime')))
              }
              return errors;
            },
          },
        ],
        rep_end_date: [
          {
            validator: (rule, value, callback) => {
              const startDate = this.meetForm.start_date
              if (!value) {
                callback(new Error(this.$t('meet.plSelectEndTime')))
              } else if (value <= startDate) {
                callback(new Error(this.$t('meet.endGreaterStartTime')))
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        end_hour: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const [hourPart, minutePart] = this.meetForm.start_hour.split(':')
              const [endHourPart,endMinutePart] = value.split(':')
              if ((Number(hourPart) > Number(endHourPart)) || (Number(hourPart) === Number(endHourPart) && Number(minutePart) >= Number(endMinutePart))) {
                callback(new Error(this.$t('meet.verify_end_time')))
              } else if(Number(hourPart) === Number(endHourPart) && Number(endMinutePart) <= (Number(minutePart) + 4)) {
                callback(new Error(this.$t('meet.verify_time_interval')))
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }
        ],
        rep_interval: [
          { required: true, message: this.$t('meet.plSelectRepeatMeet'), trigger: 'blur' }
        ],
        rep_day: [
          { required: true, message: this.$t('meet.plzSelectRepeatList'), trigger: 'blur' }
        ],
        description: [
          { required: false, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
      },
      select_area_id: -1,
      select_room_id: -1,
      currentTimeZone: 'Asia/Shanghai',
      roomOptions: [],
    }
  },
  methods: {
    disabledDate(time) {
      return time.getTime() < Date.now() - 86400000;
    },

    makeRange(start, end) {
      const result = []
      for (let i = start; i <= end; i++) {
        result.push(i)
      }
      return result
    },
    disabledHours() {
      const selectedDate = new Date(this.meetForm.start_date)
      const currentDate = new Date()
      const currentHour = new Date().getHours()
      const min = Common.formatAMPMTo24HM(this.add_params.area_min_time)
      const max = Common.formatAMPMTo24HM(this.add_params.area_max_time)
      // console.log('singleMeetCMP min:',min.format_hour,max.format_hour)
      if (this.mode === 0) {
        if (selectedDate.toDateString() === currentDate.toDateString()) {
          return this.makeRange(0, currentHour - 1).concat(this.makeRange(max.format_hour + 1, 24))
        }
      }
      return this.makeRange(0, min.format_hour).concat(this.makeRange(max.format_hour + 1, 24))
    },

    disabledMinutes(hour) {
      const selectedDate = new Date(this.meetForm.start_date)
      const currentDate = new Date()
      const currentHour = new Date().getHours()
      const currentMinute = new Date().getMinutes()
      const min = Common.formatAMPMTo24HM(this.add_params.area_min_time)
      const max = Common.formatAMPMTo24HM(this.add_params.area_max_time)
      // 09:00 pm  08:00 am format_hour: 8, format_minute: 0
      if (this.mode === 0) {
        if (selectedDate.toDateString() === currentDate.toDateString()) {
          if (hour === currentHour) {
            return this.makeRange(0, currentMinute - 1)
          }
        }
      }
      if (hour === min.format_hour) {
        return this.makeRange(0, min.format_minute - 1)
      }
      if (hour === max.format_hour) {
        return this.makeRange(max.format_minute + 1, 59)
      }
      return []
    },

    OnAreaChange(e) {
      this.select_area_id = e
      console.log('CycleMeetCMP OnAreaChange e', e)
      if (this.select_area_id != -1) {
        const area_rooms = this.areas.filter((item) =>
          item.area_id === e
        )
        console.log('CycleMeetCMP onAreaChange area_rooms', area_rooms[0])
        const select_rooms = [];
        area_rooms[0].rooms.forEach(room => {
          select_rooms.push({
            room_id: room.room_id,
            room_name: room.room_name,
            title: room.room_name,
            disabled: room.disabled,
          });
        });
        this.roomOptions = select_rooms
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
        this.roomOptions = select_rooms
      }
      this.meetForm.room_name = ''
      this.meetForm.room_id = -1
    },
    onRoomChange(e) {
      this.meetForm.room_id = e
    },
    onRepeatIntervalChange(val) {
      this.meetForm.rep_interval = val
      this.addDaysForBaseDay(Number(val) * 7)
    },
    choseDate(mode, e) {
      const selected_date = moment.tz(e, this.currentTimeZone).format('YYYY-MM-DD')
      this.limitSelectHour(selected_date)
      this.meetForm.start_date = selected_date
    },

    choseDialogHour(mode, str, e) {
      console.log('CycleMeetCMP choseHour str e', str, e)
      const ymd = this.meetForm.start_date
      const lang = Common.getLocalLang()
      const appeedStr = ymd + ' ' + str
      const formatStr = Common.getAssignFormat(appeedStr, lang)
      console.log('CycleMeetCMP choseHour this.currentTimeZone lang appeedStr', this.currentTimeZone, lang, appeedStr)
      const nextTimeStamp = moment.tz(formatStr, this.currentTimeZone).unix();
      console.log('CycleMeetCMP choseHour formatStr nextTimeStamp ', formatStr, nextTimeStamp)
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

    getSelectedArea(area_id) {
      const area_rooms = this.areas.filter((item) =>
        item.area_id === area_id
      )
      console.log('CycleMeetCMP onAreaChange area_rooms', area_rooms[0], area_rooms[0].resolution)
      const select_rooms = [];
      const duration = area_rooms[0].resolution
      // 为半个小时
      if (duration == 1800) {
        console.log('CycleMeetCMP onAreaChange area_rooms 00:30')
        this.minStep = '00:30'
      } else {
        console.log('CycleMeetCMP onAreaChange area_rooms 00:15')
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
      console.log('CycleMeetCMP choseDate selected_date', selected_date)
      if (now_date != selected_date) {
        this.minStartTime = '06:00'
      } else {
        if (this.minStep == '00:30') {
          this.minStartTime = Common.formatLastMinute(30)
        } else {
          this.minStartTime = Common.formatLastMinute(15)
        }
      }
    },

    getCheckBoxList(binaryString) {
      const checkList = []
      for (let i = 0; i < binaryString.length; i++) {
        if (binaryString[i] === 1) {
          checkList.push(i.toString())
        }
      }
      console.log(checkList)
      return checkList
    },

    toBinary(checkList) {
      // [1,3,5,0]
      console.log('toBinary checkList', checkList)
      const length = 7;
      let binaryArray = new Array(length).fill('0');
      checkList.forEach(item => {
        binaryArray[parseInt(item)] = 1;
      });
      console.log('toBinary checkList', checkList, binaryArray.join(''))
      return binaryArray.join('');
    },

    addDaysForBaseDay(days) {
      const baseDate = moment.tz(this.meetForm.start_date, this.currentTimeZone);
      const difDaysUnix = baseDate.clone().add(Number(days), 'days').endOf('day').unix()
      const difDays = moment.tz(difDaysUnix * 1000, this.currentTimeZone).format('YYYY-MM-DD')
      this.meetForm.rep_end_date = difDays
    },

    getMeetDetail() {
      let params = {}
      params['id'] = Number(this.repeat_id)
      params['is_series'] = 1
      Api.getMeetDetail(params).then(({ data, code, msg }) => {
        if (code != 0 && !data) {
          return
        }
        console.log('CycleMeetCMP getMeetDetail data', data)
        // 编辑循环会议需要的id的普通会议的id
        this.meetForm.tmp_repeat_id = this.repeat_id
        this.meetForm.id = this.entry_id
        this.meetForm.name = data.name
        this.meetForm.description = data.description
        this.meetForm.room_id = data.room_id
        this.meetForm.room_name = data.room_name
        this.meetForm.area_id = data.area_id
        this.roomOptions = this.getSelectedArea(data.area_id)
        this.meetForm.area_name = data.area_name
        this.meetForm.start_date = moment.tz(data.start_time * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
        this.meetForm.start_hour = moment.tz(data.start_time * 1000, 'Asia/Shanghai').format('HH:mm')
        this.meetForm.start_seconds = data.start_time
        this.meetForm.rep_end_date = data.end_date
        this.meetForm.end_hour = moment.tz(data.end_time * 1000, 'Asia/Shanghai').format('HH:mm')
        this.meetForm.end_seconds = data.end_time
        this.meetForm.rep_day = data.rep_day
        this.meetForm.rep_interval = data.rep_interval
        this.addDaysForBaseDay(data.rep_interval * 7)
        // rep_opt: 1010100
        this.meetForm.rep_day = this.meetForm.rep_day.map(item => item === 7 ? 0 : item);
        if (data.resolution == 1800) {
          this.minStartTime = Common.formatLastMinute(30)
        } else {
          this.minStartTime = Common.formatLastMinute(15)
        }
        this.limitSelectHour(data.start_date)
      })
    },
    commitForm() {
      console.log('CycleMeetCMP commitForm this.meetForm', this.meetForm)
      this.$refs.meetForm.validate((pass) => {
        if (!pass) {
          console.log('CycleMeetCMP commitForm !pass')
          return
        }
        this.meetForm.original_room_id = this.meetForm.room_id
        this.meetForm.rooms = []
        // this.meetForm.id = this.meetForm.room_id
        this.meetForm.end_date = this.meetForm.start_date
        this.meetForm.rooms.push(this.meetForm.room_id)
        this.meetForm.rep_opt = this.toBinary(this.meetForm.rep_day)
        delete this.meetForm['create_by']
        delete this.meetForm['book_by']
        Api.editMeet(this.meetForm).then(({ data, code, msg }) => {
          if (code == 0) {
            this.$emit('close')
            ElMessage({
              message: this.$t('base.editSuccess'),
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
      Api.deleteMeet({ entry_id: Number(this.entry_id), entry_series: 1 }).then(({ data, code, msg }) => {
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
    console.log('CycleMeetCMP created:', this.entry_id, this.add_params)
    if (this.add_params && this.mode == 0) {
      this.meetForm.room_id = this.add_params.room_id
      this.meetForm.room_name = this.add_params.room_name
      this.meetForm.area_id = this.add_params.area_id
      this.meetForm.area_name = this.add_params.area_name
      const now_date = moment.tz(Date.now(), this.currentTimeZone).format('YYYY-MM-DD')
      if (this.add_params.resolution == 1800) {
        const invaild_time = moment.tz(this.add_params.cal_start_time * 1000, 'Asia/Shanghai').format('HH:mm')
        // 处理15、45分钟
        if (invaild_time.endsWith('15') || invaild_time.endsWith('45')) {
          const time_stamp = this.add_params.timeStamp - 900
          this.meetForm.start_date = moment.tz(time_stamp * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
          this.meetForm.start_hour = moment.tz(this.add_params.cal_start_time * 1000, 'Asia/Shanghai').format('HH:mm')
          this.meetForm.rep_end_date = moment.tz((time_stamp + 1800) * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
          this.meetForm.end_hour = moment.tz((this.add_params.cal_end_time) * 1000, 'Asia/Shanghai').format('HH:mm')
          this.meetForm.start_seconds = this.add_params.cal_start_time
          this.meetForm.end_seconds = this.add_params.cal_end_time
        } else {
          this.meetForm.start_date = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
          this.meetForm.start_hour = moment.tz(this.add_params.cal_start_time * 1000, 'Asia/Shanghai').format('HH:mm')
          this.meetForm.rep_end_date = moment.tz((this.add_params.timeStamp + 1800) * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
          this.meetForm.end_hour = moment.tz((this.add_params.cal_end_time) * 1000, 'Asia/Shanghai').format('HH:mm')
          this.meetForm.start_seconds = this.add_params.cal_start_time
          this.meetForm.end_seconds = this.add_params.cal_end_time
        }
        this.minStep = '00:30'
        if (now_date === this.meetForm.start_date) {
          this.minStartTime = Common.formatLastMinute(30)
        }
      } else {
        this.meetForm.start_date = moment.tz(this.add_params.timeStamp * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
        this.meetForm.start_hour = moment.tz(this.add_params.cal_start_time * 1000, 'Asia/Shanghai').format('HH:mm')
        this.meetForm.rep_end_date = moment.tz((this.add_params.timeStamp + 900) * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
        this.meetForm.end_hour = moment.tz((this.add_params.cal_end_time) * 1000, 'Asia/Shanghai').format('HH:mm')
        this.meetForm.start_seconds = this.add_params.cal_start_time
        this.meetForm.end_seconds = this.add_params.cal_end_time
        this.minStep = '00:15'
        if (now_date === this.meetForm.start_date) {
          this.minStartTime = Common.formatLastMinute(15)
        }
      }
      this.addDaysForBaseDay(7)
      this.roomOptions = this.getSelectedArea(this.add_params.area_id)
      return
    }
    this.getMeetDetail()
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