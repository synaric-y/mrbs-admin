<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="sub-title-wrapper" style="margin-left: 20px;">
          <!-- <div class="sub-title">{{ $t("base.userManagement") }}</div> -->
          <div class="page-title">历史会议</div>
          <div class="filter-wrapper" style="margin-top: 20px;height: 30px;">
            <!-- <el-input v-model="keyword" style="width: 140px" placeholder="请输入用户名称" /> -->
            <el-select class="account-status-select" v-model="statusVal" placeholder="Select" size="default"
              style="width: 140px;margin-left: 25px;min-height: 30px;">
              <el-option style="height: 30px;" v-for="item in statusOptions" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>

            <el-select class="account-status-select" v-model="areaStatusVal" placeholder="Select" size="default"
              style="width: 140px;margin-left: 25px;min-height: 30px;">
              <el-option style="height: 30px;" v-for="item in areaOptions" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>

            <el-select class="account-status-select" v-model="roomVal" placeholder="Select" size="default"
              style="width: 140px;margin-left: 25px;min-height: 30px;">
              <el-option style="height: 30px;" v-for="item in roomOptions" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>

            <el-date-picker style="margin-left: 20px;" v-model="baseTime" type="daterange" :range-separator="$t('base.to')"
              :start-placeholder="startTime" :end-placeholder="endTime" @change="choseDate" />

            <el-button size="large" class="el-button-content" @click="searchUser">
              <img src="/imgs/button_search.png" alt="Search Icon" class="el-button-img" />
              查询
            </el-button>
          </div>
        </div>

        <div class="table-wrapper" style="height: auto;">
          <el-table :data="userListData" style="margin-top: 56px;" header-cell-class-name="tb-header" max-height="450">
            <el-table-column prop="number" label="序号" width="60">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="area" label="区域" width="100"></el-table-column>
            <el-table-column prop="room" label="会议室" width="100"></el-table-column>
            <el-table-column prop="meet_start" label="预约开始时间" width="150"></el-table-column>
            <el-table-column prop="meet_end" label="预约结束时间" width="150"></el-table-column>
            <el-table-column prop="meet_time" label="会议时间" width="130"></el-table-column>
            <el-table-column prop="is_cycle" label="是否周期会议" width="130"></el-table-column>
            <el-table-column prop="meet_status" label="会议状态" width="80"></el-table-column>
            <el-table-column prop="display_name" label="预约人" width="100">
            </el-table-column>
            <el-table-column prop="id" :label="$t('user.tableUser.operate')" width="200">
              <template #default="scope">
                <div class="operate-wrapper">
                  <span class="operate-item" @click="resetPassword(scope.row)">编辑</span>
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

      areaStatusVal: 0,
      areaOptions: [
        {
          value: 0,
          label: '上海',
        }, {
          value: 1,
          label: '北京',
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
    }
  },
  methods: {
    addUser(val, row) {
      this.dialogFormVisible = true
      if (val === 1) {
        this.dialogUserDetailForm = false// Editable for adding a user
        this.userDetailTitle = '添加用户'
        this.userForm.name = ''
        this.userForm.display_name = ''
        this.userForm.password = ''
        this.userForm.email = ''
        this.userForm.remark = ''
      } else {
        this.dialogUserDetailForm = true // Read-only for viewing user details
        this.userDetailTitle = '查看用户'
        this.userForm.name = row.name
        this.userForm.display_name = row.display_name
        this.userForm.password = ''
        this.userForm.email = row.email
        this.userForm.remark = row.remark
        this.userForm.permissions = row.permissions
        this.userForm.password = row.password
        this.userRow = row
      }
      console.log('addUser val - row', val, row)
    },
    closedAlert() {
      this.dialogFormVisible = false
      this.dialogUserDetailForm = false
    },
    commitAddForm() {
      console.log('UserList commitAddForm', this.userForm)
      let params = {}
      params['action'] = this.dialogUserDetailForm ? 'edit' : 'add'
      if (this.dialogUserDetailForm && this.userRow.id) {
        params['id'] = this.userRow.id
      } else {
        // 接口修复报错
      }
      params['level'] = this.userForm.level
      if (params['levelName'] == '管理员') {
        params['level'] = '2'
      }
      delete params['levelName']
      params['name'] = this.userForm.name
      params['display_name'] = this.userForm.display_name
      params['email'] = this.userForm.email
      params['password'] = this.userForm.password
      params['remark'] = this.userForm.remark
      this.editUser(params)
    },
    resetPassword(row) {
      this.dialogResetPasswordForm = true
      this.passwordForm.name = row.name
      this.passwordForm.newPassword = ''
    },
    deleteUserPop(row) {
      this.dialogDeleteVisible = true
      this.deleteRow = row
    },
    deleteUser() {
      let params = {}
      params['action'] = 'delete'
      params['name'] = this.deleteRow.name
      this.dialogDeleteVisible = false
      this.editUser(params)
    },
    searchUser() {
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      console.log('UserList handleCurrentChange newPage:', newPage, this.page_number)
      // if (newPage != this.page_number) {
      // this.page_number = newPage
      this.getUserList()
      // }
    },
    handleSwitchChange(row) {
      if (!this.initialized) {
        return
      }
      console.log('UserList handleCurrentChange id: status', row)
      this.updateUserDisabled(row)
    },

    creatPassword() {
      this.passwordForm.newPassword = Common.generateRandomString(20)
      console.log('UserList creatPassword', this.passwordForm.newPassword)
    },
    copyPassword() {
      console.log('UserList copyPassword:', this.passwordForm.newPassword)
      if (this.passwordForm.newPassword) {
        navigator.clipboard.writeText(this.passwordForm.newPassword).then(function () {
          ElMessage('复制粘贴板成功')
        }, function (error) {
          ElMessage('复制粘贴板失败')
        })
      }
    },

    commitNewPassword() {
      if (this.passwordForm.newPassword != this.passwordForm.againPassword) {
        ElMessage.error('二次输入密码不一致')
        return
      }
    },

    updateUserDisabled(row) {
      let params = {}
      params['userid'] = row.id
      params['disabled'] = row.disabled == '1' ? 1 : 0
      console.log('UserList updateUserStatus params', params)
      Api.updateAccount(params).then(({ data, code, msg }) => {
        if (code == 0) {
          this.getUserList()
        } else {

        }
      })
    },

    editUser(params) {
      console.log('UserList editUser params', params)
      Api.editUser(params).then(({ data, code, msg }) => {
        this.closedAlert()
        if (code == 0) {
          this.getUserList()
        } else {
          ElMessage.error(msg)
        }
      })
    },
    getUserList() {
      return
      let params = {}
      params['name'] = this.keyword
      params['pagesize'] = 20
      params['pagenum'] = this.page_number
      const selectedItem = this.accountStatusOptions.filter(item => item.value === this.accountStatusVal)
      const disabled = selectedItem[0].value
      params['disabled'] = disabled
      console.log('UserList getUserList params:', params)
      // Api.getAllUsers
      Api.getAllUsers(params).then(({ code, msg, data }) => {
        this.initialized = true
        if (code == 0 && data && data.users) {
          data.users.forEach(it => {
            if (!it['email']) {
              it["email"] = '无邮箱'
            }
            if (!it['create_time']) {
              it["create_time"] = '无'
            }
            it['levelname'] = (it['level'] == '1' ? '普通用户' : '管理员')
            it["permissions"] = (it['level'] == '1' ? '普通用户' : '管理员')
            // it['disabled'] = !parseInt(it['disabled'])
          })
          console.log('UserList getUserList data.users:', data.users)
          this.userListData = data.users
          this.total_num = data.total_num
        }
      })
    },
    toUserDetail(mode, id) {
      this.push(`/user_detail/${mode}/${id}`)
    },
  },
  mounted() {
    this.setTab('/user')
    this.getUserList()
  }
}
</script>

<style lang="scss" scoped>
.sub-page-content {
  display: flex;
  // justify-content: center;
  align-items: center;
  flex-direction: column;
  // height: calc(100vh - 95px);
  height: auto;
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