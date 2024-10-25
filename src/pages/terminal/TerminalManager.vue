<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="sub-title-wrapper" style="margin-left: 20px;">
          <!-- <div class="sub-title">{{ $t("base.userManagement") }}</div> -->
          <div class="page-title">终端设备管理</div>
          <div class="filter-wrapper" style="margin-top: 20px;height: 30px;">
            <el-input v-model="keyword" style="width: 140px;height: 30px" placeholder="请输入设备ID" />
            <el-select class="account-status-select" v-model="statusVal" placeholder="Select" size="default"
              style="width: 140px;margin-left: 25px;min-height: 30px;">
              <el-option style="height: 30px;" v-for="item in statusOptions" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>

            <el-select class="account-status-select" v-model="roomVal" placeholder="Select" size="default"
              style="width: 140px;margin-left: 25px;min-height: 30px;">
              <el-option style="height: 30px;" v-for="item in roomOptions" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>

            <el-button size="large" class="el-button-content" @click="searchUser">
              <img src="/imgs/button_search.png" alt="Search Icon" class="el-button-img" />
              查询
            </el-button>
          </div>
        </div>

        <div class="table-wrapper" style="height: auto;">
          <el-table :data="terminals" style="margin-top: 56px;" header-cell-class-name="tb-header" max-height="450">
            <el-table-column prop="number" label="序号" width="60">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="device_id" label="设备ID" width="80"></el-table-column>
            <el-table-column prop="version" label="当前版本" width="80"></el-table-column>
            <el-table-column prop="description" label="设备信息" width="150"></el-table-column>
            <el-table-column prop="resolution" label="屏幕分辨率" width="150"></el-table-column>
            <el-table-column prop="battery_level" label="剩余电量" width="130"></el-table-column>
            <el-table-column prop="status" label="设备实时状态" width="130"></el-table-column>
            <el-table-column prop="is_set" label="绑定状态" width="80"></el-table-column>
            <el-table-column prop="room_name" label="绑定会议室" width="100"></el-table-column>
            <el-table-column prop="set_time" label="接入时间" width="100"></el-table-column>
            <el-table-column prop="id" :label="$t('user.tableUser.operate')" width="200">
              <template #default="scope">
                <div class="operate-wrapper">
                  <span class="operate-item" @click="unbindDevice(scope.row)">解绑</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination-block">
          <div class="table-demonstration">共{{ total_num }}条</div>
          <el-pagination v-model:current-page="page_number" @current-change="handleCurrentChange"
            layout="prev, pager, next" :default-page-size="20" :total="total_num" />
        </div>

        <el-dialog v-model="dialogDeleteVisible" title="解绑设备" width="550">
          <div class="">
            是否解绑当前设备？
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button style="margin-left: 50px" type="primary" @click="deleteUser">
                确定
              </el-button>
              <el-button @click="dialogDeleteVisible = false">取消</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import { ElMessage } from "element-plus/es";
import { Common } from "@/common/common";
export default {
  mixins: [PageMixin],
  data() {
    return {
      userListData: [
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
        { "number": 1, "area": 'shanghai', "room": '会议室A', "meet_start": '2024-10-12', "meet_end": '2024-12-30', "meet_time": '13:00-14:00', "is_cycle": '是', "meet_status": '未开始', "display_name": 'joy', "is_edit": '1' },
       
       ],
      statusVal: 0,
      accountSwitch: 1,
      statusOptions: [
        {
          value: 0,
          label: '已结束',
        }, {
          value: 1,
          label: '进行中',
        }, {
          value: 2,
          label: '未开始',
        }],
      roomVal: 0,
      roomOptions: [
        {
          value: 0,
          label: 'A',
        }, {
          value: 1,
          label: 'B',
        }],
      pendingDeleteName: null,
      role: [
        this.$t('user.role.level0'),
        this.$t('user.role.level1'),
        this.$t('user.role.level2'),
      ],
      page_number: 1,
      total_num: 0,
      initialized: false,
      baseTime: '',
      startTime: this.$t('base.startDate'),
      endTime: this.$t('base.endDate'),
      dialogDeleteVisible: false,
      terminals: [],
      total_num: 0,
    }
  },
  methods: {

    deleteUser() {
      // 解绑当前设备
    },
    unbindDevice(row) {
      this.dialogDeleteVisible = true
    },

    searchUser() {
      this.getTerminalList()
    },
    handleCurrentChange(newPage) {
      console.log('TerminalManager handleCurrentChange newPage:', newPage, this.page_number)
      this.page_number = newPage
    },

    unbindDevice() {
      console.log('TerminalManager unbindDevice')
      Api.editUser(params).then(({ data, code, msg }) => {
        this.closedAlert()
        if (code == 0) {
          this.getUserList()
        } else {
          ElMessage.error(msg)
        }
      })
    },
    
    getTerminalList() {
      Api.getTerminalList({}).then(({ data, code, msg }) => {
        if (code == 0 && data) {
          data.users.forEach(it => {
            // if (!it['email']) {
            //   it["email"] = '无邮箱'
            // }
          })
          this.terminals = data
          this.total_num = data.total_num
        }
      })
    },
  },
  mounted() {
    this.getTerminalList()
  }
}
</script>

<style lang="scss" scoped>
.sub-page-content {
  display: flex;
  // justify-content: center;
  align-items: center;
  flex-direction: column;
  width: calc(100vw - 169px);
  // height: calc(100vh - 95px);
  height: auto;
  min-height: calc(100vh - 95px);
  background-color: white;
  padding: 0;
  margin: 0;
  // margin-top: 20px;
  position: relative;
}

.sub-title-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 20px;
}

.page-title {
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: 0px;
  color: #1D2129;
  margin-top: 20px;
  margin-left: 20px;
}

.filter-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 20px;
  padding: 0 5px;
}

.el-main {
  margin: 0;
}

.table-wrapper {
  margin-left: -100px;
  padding: 0;
  width: auto;
}

.tb-header {
  font-size: 14px !important;
}

.el-table {
  --el-table-tr-bg-color: white;
  padding: 0;
  margin: 0;
}

::v-deep .el-input {
  height: 40px;
  line-height: 40px;
}

::v-deep .el-input__inner {
  height: 40px;
  line-height: 40px;
}

.el-button-content {
  width: 84px;
  height: 30px;
  background: #591BB7;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: 30px;
  letter-spacing: 0px;
  color: #FFFFFF;
  margin-left: 20px;
  padding: 4px 0;
}

.operate-wrapper {
  display: flex;
  flex-direction: row;
}

.operate-item {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  display: flex;
  align-items: center;
  letter-spacing: -0.07px;
  color: #591BB7;
  padding: 10px;
}

.el-button-img {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  margin-top: 2px;
}

.tb-op-icon {
  width: 25px;
  height: 25px;
}

.tb-op-icon-span {
  margin-right: 10px;
}

.tb-state {
  width: 18px;
  height: 18px;
  border-radius: 20px;
  background: #08D50A;
  margin-left: 15px;
}

.tb-state-disable {
  background: red;
}

.table-pagination-block {
  display: flex;
  flex-direction: row;
  justify-content: center;
  // background-color: rebeccapurple;
}

.table-demonstration {
  line-height: 50px;
  margin-right: 30px;
}

.dialog-footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.reset-password {
  display: flex;
  flex-direction: row;
}
</style>