<template>
  <div class="mask">
    <div class="content">
      <div class="title">{{ mode == 1 ? '编辑会议' : '新增会议' }}</div>
      <el-form ref="meetForm" :model="meetForm" :rules="rules">

        <el-form-item prop="area_id" label="区域" label-width="100px" required>
          <el-select v-model="meetForm.area_id" placeholder="请选择区域" @change="OnAreaChange">
            <el-option v-for="item in areas" :key="item.area_id" :label="item.area_name" :value="item.area_id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="room_id" label="会议室" label-width="100px" required>
          <el-select v-model="meetForm.room_id" placeholder="请选择会议室">
            <el-option v-for="item in roomOptions" :key="item.room_id" :label="item.title" :value="item.room_id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="会议室标题" label-width="100px" required>
          <el-input v-model="meetForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="start_date" label="开始时间" style="margin-left: 20px" required>
          <el-col :span="11">
            <el-form-item prop="start_date">
              <el-date-picker v-model="meetForm.start_date" type="date" value-format="YYYY-MM-DD"
                aria-label="Pick start day" placeholder="Pick start day" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500"></span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="start_hour">
              <el-time-select v-model="meetForm.start_hour" style="width: 140px;margin-left: 20px" :start="minStartTime"
                :step="minStep" :end="maxEndTime" :placeholder="$t('base.plzSelect')"
                @change="choseDialogHour(0, meetForm.start_hour, $event)" :min-time="currentHourMinute" />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item prop="end_date" label="结束时间" style="margin-left: 20px" required>
          <el-col :span="11">
            <el-form-item prop="end_date">
              <el-date-picker v-model="meetForm.end_date" type="date" value-format="YYYY-MM-DD"
                aria-label="Pick end day" placeholder="Pick end day" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500"></span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="end_hour">
              <el-time-select v-model="meetForm.end_hour" style="width: 140px;margin-left: 20px" :start="minStartTime"
                :step="minStep" :end="maxEndTime" :placeholder="$t('base.plzSelect')"
                @change="choseDialogHour(1, meetForm.end_hour, $event)" :min-time="currentHourMinute" />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="备注" label-width="100px">
          <el-input v-model="meetForm.description" maxlength="100" style="width: 410px;" placeholder="Please input"
            show-word-limit type="textarea" />
        </el-form-item>
      </el-form>

      <div class="dialog-footer">
        <el-button type="primary" @click="commitForm">提交</el-button>
        <el-button style="margin-left: 50px" @click="deleteMeet" v-if="mode == 1">删除</el-button>
        <el-button style="margin-left: 50px" @click="$emit('close')">关闭</el-button>
        <!-- <el-button type="primary" @click="$emit('close')">关闭</el-button> -->
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
  props: ['entry_id', 'mode', 'areas'],
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
        room_id: '',
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
        rep_type: 2,
        rep_day: [],
        rep_interval: 1,
        month_type: 0,
        month_absolute: 2,
        month_relative_ord: "",
        month_relative_day: "",
        skip: 0,
        no_mail: 1,
        private: ""
      },
      currentHourMinute: '',
      minStep: '00:30',
      minStartTime: '06:00',
      maxEndTime: '21:00',
      rules: {
        area_id: [
          { required: true, message: '请选择区域', trigger: 'blur' }
        ],
        room_id: [
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
        ],
        end_hour: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
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
      select_area_id: -1,
      select_room_id: -1,
      currentTimeZone: 'Asia/Shanghai',
      roomOptions: [],
    }
  },
  methods: {

    OnAreaChange(e) {
      this.select_area_id = e
      console.log('SingleMeetCMP OnAreaChange e', e)
      if (this.select_area_id != -1) {
        const area_rooms = this.areas.filter((item) =>
          item.area_id === e
        )
        console.log('MeetList onAreaChange area_rooms', area_rooms[0])
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
          this.start_hour = ''
          return
        }
        this.meetForm.start_seconds = nextTimeStamp;
        return
      }
      this.meetForm.end_seconds = nextTimeStamp;
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
        this.meetForm.remark = data.description
        this.meetForm.room_id = data.room_id
        this.meetForm.area_id = data.area_id
        this.meetForm.start_date = moment.tz(data.start_time * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
        this.meetForm.start_hour = moment.tz(data.start_time * 1000, 'Asia/Shanghai').format('HH:mm')
        this.meetForm.end_date = moment.tz(data.end_time * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
        this.meetForm.end_hour = this.start_hour = moment.tz(data.end_time * 1000, 'Asia/Shanghai').format('HH:mm')
      })
    },

    commitForm() {
      console.log('SingleMeetCMP commitForm this.meetForm', this.meetForm)
      this.$refs.meetForm.validate((pass) => {
        if (!pass) {
          console.log('SingleMeetCMP commitForm !pass')
          return
        }
      })
      this.meetForm.original_room_id = this.meetForm.room_id
      this.meetForm.rooms = []
      // this.meetForm.id = this.meetForm.room_id
      this.meetForm.rooms.push(this.meetForm.room_id)
      Api.editMeet(this.meetForm).then(({ data, code, msg }) => {
        if (code == 0) {
          $emit('close')
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
    },

    deleteMeet() {
      Api.deleteMeet({ entry_id: Number(this.entry_id) }).then(({ data, code, msg }) => {
        if (code == 0) {
          ElMessage({
            message: this.$t('base.deleteSuccess'),
            type: 'success',
          })
          $emit('close')
        } else {
          ElMessage.error(msg)
        }
      }).catch(() => {
        ElMessage.error(this.$t('deleteError'))
      })
    },
  },
  created() {
    console.log('SingleMeetCMP created:', this.entry_id)
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