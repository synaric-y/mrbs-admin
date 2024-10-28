<template>
  <div class="mask">
    <div class="content">
      <div class="title">编辑会议</div>
      <el-form :model="meetForm" :rules="rules">
        <div class="request-wrapper">
          <el-form-item prop="area" label="区域" label-width="100px">
            <!-- :disabled="dialogUserDetailForm" -->
            <el-select v-model="meetForm.area" placeholder="请选择区域">
              <el-option label="上海" value="1" />
              <el-option label="北京" value="2" />
            </el-select>
          </el-form-item>
        </div>

        <div class="request-wrapper">
          <el-form-item prop="room" label="会议室" label-width="100px">
            <el-select v-model="meetForm.room" placeholder="请选择会议室">
              <el-option label="Room A" value="1" />
              <el-option label="Room B" value="2" />
            </el-select>
          </el-form-item>
        </div>
        <div class="request-wrapper">
          <el-form-item prop="title" label="会议室标题" label-width="100px">
            <el-input v-model="meetForm.title" autocomplete="off" />
          </el-form-item>
        </div>
        <el-form-item prop="start_day" label="开始时间" style="margin-left: 20px" required>
          <el-form-item prop="start_day">
            <el-date-picker v-model="meetForm.start_day" type="date" aria-label="Pick start day"
              placeholder="Pick start day" style="width: 100%" />
          </el-form-item>
        </el-form-item>
        <el-row style="margin-left: 97px">
          <el-form-item prop="start_hour">
            <el-time-select v-model="start_hour" style="width: 140px;" :start="minStartTime" :step="minStep"
              :end="maxEndTime" placeholder="会议开始" @change="choseDialogHour(0, start_hour, $event)"
              :min-time="currentHourMinute" />
          </el-form-item>
          <span style="line-height: 32px;width: 20px;text-align: center;"> - </span>
          <el-form-item prop="end_hour">
            <el-time-select v-model="start_hour" style="width: 140px;" :start="minStartTime" :step="minStep"
              :end="maxEndTime" placeholder="会议结束" @change="choseDialogHour(0, start_hour, $event)"
              :min-time="currentHourMinute" />
          </el-form-item>
        </el-row>
        <el-form-item label="重复间隔为" prop="repeat_week" style="margin-left: 7px">
          <el-input-number style="width: 100px;" v-model="meetForm.repeat" :min="1" :max="4"
            @change="handleWeekChange" />
          <span
            style="margin-left: 20px;color: #4E5969;font-family: PingFang SC;font-size: 14px;font-weight: normal;">周后的：</span>
        </el-form-item>
        <el-form-item style="margin-left: 40px" prop="check_list">
          <el-checkbox-group v-model="meetForm.check_list" size="small">
            <el-checkbox label="星一" value="1" />
            <el-checkbox label="星二" value="2" />
            <el-checkbox label="星三" value="3" />
            <el-checkbox label="星四" value="4" />
            <el-checkbox label="星五" value="5" />
            <el-checkbox label="星六" value="6" />
            <el-checkbox label="星日" value="7" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="end_day" label="结束时间" style="margin-left: 20px;" required>
          <el-form-item prop="end_day">
            <el-date-picker v-model="meetForm.start_day" type="date" aria-label="Pick end day"
              placeholder="Pick end day" style="width: 100%" />
          </el-form-item>
        </el-form-item>
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

export default {
  computed: {
    Search() {
      return Search
    }
  },
  mixins: [PageMixin],
  props: ['groupId', 'groupName', 'isEdit', 'adMore'],
  emits: ['close'],
  name: 'CycleMeetCMP',
  data() {
    return {
      groupMembers: [],
      keyword: '',
      pageNumber: 1,
      total_num: 0,
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
      rules: {
        area: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        room: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        title: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        start_day: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        start_hour: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        end_day: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        end_hour: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        repeat_week: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        check_list: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        remark: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
      },

    }
  },
  methods: {

    handleCurrentChange(num) {
      console.log('UserList handleCurrentChange num:', num)
      this.pageNumber = num
      this.getGroupMember() // 查询新页
    },

    searchGroupMember() {
      this.pageNumber = 1
      this.getGroupMember()
    },

    handleSwitchChange(row) {
      if (this.isLoading) {
        return
      }
      this.selectRow = row
      console.log('UserList handleCurrentChange id: status', row)
      if (row.status) {
        this.bindUserToGroup()
        return
      }
      this.unbindUserToGroup()
    },
    bindUserToGroup() {
      let params = {}
      const user_ids = []
      user_ids.push(parseInt(this.selectRow.id))
      params['user_ids'] = user_ids
      params['group_id'] = parseInt(this.groupId)
      Api.bindUserToGoup(params).then(({ data, code, msg }) => {
        if (code == 0) {
          this.getGroupMember()
        } else {
          this.getGroupMember()
          ElMessage.error(msg)
        }
      })
    },

    unbindUserToGroup() {
      let params = {}
      const user_ids = []
      user_ids.push(parseInt(this.selectRow.id))
      params['user_ids'] = user_ids
      params['group_id'] = parseInt(this.groupId)
      Api.unbindUserToGoup(params).then(({ data, code, msg }) => {
        if (code == 0) {
          this.getGroupMember()
        } else {
          ElMessage.error(msg)
        }
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
          console.log('UserList getUserList data.users:', data.users)
          this.groupMembers = data.users
          this.total_num = data.total_num
        }
      })
    },
  },
  created() {
    console.log('created:', this.groupId)
    // this.getGroupMember()
  },

  mounted() {
    console.log('mounted:', this.groupId)
    this.getGroupMember()
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
  z-index: 9999;
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