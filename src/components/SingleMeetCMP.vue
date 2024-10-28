<template>
  <div class="mask">
    <div class="content">
      <div class="title">编辑会议</div>
      <el-form :model="meetForm" :rules="rules">

        <el-form-item prop="area" label="区域" label-width="100px">
          <el-select v-model="meetForm.area" placeholder="请选择区域">
            <el-option label="上海" value="1" />
            <el-option label="北京" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="room" label="会议室" label-width="100px">
          <el-select v-model="meetForm.room" placeholder="请选择会议室">
            <el-option label="Room A" value="1" />
            <el-option label="Room B" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item prop="title" label="会议室标题" label-width="100px">
          <el-input v-model="meetForm.title" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="start_day" label="开始时间" style="margin-left: 20px" required>
          <el-col :span="11">
            <el-form-item prop="start_day">
              <el-date-picker v-model="meetForm.start_day" type="date" aria-label="Pick start day"
                placeholder="Pick start day" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500"></span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="start_hour">
              <el-time-select v-model="meetForm.start_hour" style="width: 140px;margin-left: 20px" :start="minStartTime"
                :step="minStep" :end="maxEndTime" :placeholder="$t('base.plzSelect')"
                @change="choseDialogHour(0, start_hour, $event)" :min-time="currentHourMinute" />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item prop="end_day" label="结束时间" style="margin-left: 20px" required>
          <el-col :span="11">
            <el-form-item prop="end_day">
              <el-date-picker v-model="meetForm.start_day" type="date" aria-label="Pick end day"
                placeholder="Pick end day" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500"></span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="end_hour">
              <el-time-select v-model="meetForm.end_hour" style="width: 140px;margin-left: 20px" :start="minStartTime"
                :step="minStep" :end="maxEndTime" :placeholder="$t('base.plzSelect')"
                @change="choseDialogHour(1, end_hour, $event)" :min-time="currentHourMinute" />
            </el-form-item>
          </el-col>
        </el-form-item>


        <!-- <el-form-item prop="start_day" label="开始时间" style="margin-left: 20px" required>
          <el-form-item prop="start_day">
            <el-date-picker v-model="meetForm.start_day" type="date" aria-label="Pick start day"
              placeholder="Pick start day" style="width: 100%" />
          </el-form-item>
        </el-form-item>
        <el-form-item prop="end_day" label="结束时间" style="margin-left: 20px;" required>
          <el-form-item prop="end_day">
            <el-date-picker v-model="meetForm.end_day" type="date" aria-label="Pick end day"
              placeholder="Pick end day" style="width: 100%" />
          </el-form-item>
        </el-form-item> -->
        <el-form-item label="备注" label-width="100px">
          <el-input v-model="meetForm.remark" maxlength="100" style="width: 410px;" placeholder="Please input"
            show-word-limit type="textarea" />
        </el-form-item>
      </el-form>


      <div class="dialog-footer">
        <el-button type="primary" @click="$emit('close')">关闭</el-button>
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

export default {
  computed: {
    Search() {
      return Search
    }
  },
  mixins: [PageMixin],
  props: ['entry_id'],
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
        area: '',
        room: '',
        title: '',
        start_day: '',
        start_hour: '',
        end_day: '',
        end_hour: '',
        repeat_week: '1',
        check_list: [],
        remark: '',
      },
      currentHourMinute: '',
      minStep: '00:30',
      minStartTime: '06:00',
      maxEndTime: '21:00',
      rules: {
        area: [
          { required: true, message: '请选择区域', trigger: 'blur' }
        ],
        room: [
          { required: true, message: '请选择房间', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入会议标题', trigger: 'blur' }
        ],
        start_day: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        start_hour: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        end_day: [
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
        remark: [
          { required: false, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
      },

    }
  },
  methods: {

    choseDialogHour(mode, str, e) {
      console.log('SingleMeetCMP choseHour str e', str, e)
      const ymd = this.form.start_date
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
          this.form.start_seconds = 0
          this.start_hour = ''
          return
        }
        this.form.start_seconds = nextTimeStamp;
        return
      }
      this.form.end_seconds = nextTimeStamp;
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
        this.meetForm.title = data.name
        this.meetForm.remark = data.description
        this.meetForm.room = data.room_name
        this.meetForm.area = data.area_name
        this.meetForm.start_day = moment.tz(data.start_time * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
        this.start_hour =  moment.tz(data.start_time * 1000, 'Asia/Shanghai').format('HH:mm')
        this.meetForm.end_day = moment.tz(data.end_time * 1000, 'Asia/Shanghai').format('YYYY-MM-DD')
        this.end_hour = this.start_hour =  moment.tz(data.end_time * 1000, 'Asia/Shanghai').format('HH:mm')
      })
    },
    getGroupMember() {
      let params = {}
      params['group_id'] = parseInt(this.groupId)
      params['search'] = this.keyword || '',
        params['page'] = this.pageNumber
      if (this.adMore) {
        params['in_group'] = 1
      }
      Api.getGroupMember(params).then(({ data, code, msg }) => {
        this.isLoading = false
        if (code == 0 && data && data.users) {
          data.users.forEach(it => {
            if (it['is_bind']) {
              it['status'] = true
            } else {
              it['status'] = false
            }
          })
          console.log('SingleMeetCMP getUserList data.users:', data.users)
          this.groupMembers = data.users
          this.total_num = data.total_num
        }
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