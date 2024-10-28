<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="sub-title-wrapper" style="margin-left: 20px;">
          <!-- <div class="sub-title">{{ $t("base.userManagement") }}</div> -->
          <div class="page-title">{{ $t('user.userList') }}</div>
          <div class="filter-wrapper" style="margin-top: 20px;height: 30px;">
            <el-input v-model="keyword" style="width: 140px" :placeholder="$t('user.plzEnterUsernameHint')" />
            <el-select class="account-status-select" v-model="accountStatusVal" placeholder="Select" size="large"
              style="width: 140px;margin-left: 25px;min-height: 30px;">
              <el-option style="height: 30px;" v-for="item in accountStatusOptions" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
            <el-button class="el-button-content" @click="searchUser">
              <img src="/imgs/button_search.png" alt="Search Icon" class="el-button-img" />
              {{ $t('base.search') }}
            </el-button>
            <el-button class="el-button-content" @click="addUser(1, null)">
              <img src="/imgs/button_add.png" alt="Add Icon" class="el-button-img" />
              {{ $t('base.add2') }}
            </el-button>
            <el-button size="large" class="el-button-content" style="width: 112px;">
              <img src="/imgs/button_reflesh.png" alt="Sync Icon" class="el-button-img" />
              {{ $t('base.userSync') }}
            </el-button>
          </div>
        </div>

        <div class="table-wrapper" style="height: auto;">
          <el-table :data="userListData" style="margin-top: 56px;" header-cell-class-name="tb-header" max-height="450"
            table-layout="auto">
            <el-table-column prop="number" label="序号" width="120">
              <template #default="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('user.tableUser.displayName')" width="130">
            </el-table-column>
            <el-table-column prop="display_name" :label="$t('user.tableUser.name')" width="130">
            </el-table-column>
            <el-table-column prop="email" :label="$t('user.tableUser.email')">
            </el-table-column>
            <el-table-column prop="status" :label="$t('user.tableUser.status')" width="100" v-if="!isLoading">
              <template #default="scope">
                <el-switch v-model="scope.row.status"
                  style="--el-switch-on-color: #591BB7; --el-switch-off-color: #A8ABB2" :active-value="true"
                  :inactive-value="false" @change="handleSwitchChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="permissions" :label="$t('user.tableUser.level')" width="150">
            </el-table-column>
            <el-table-column prop="create_time" :label="$t('user.tableUser.createTime')" width="200">
            </el-table-column>
            <el-table-column prop="id" :label="$t('user.tableUser.operate')" width="300">
              <template #default="scope">
                <div class="operate-wrapper">
                  <span class="operate-item" @click="resetPassword(scope.row)">{{ $t('base.resetPassword') }}</span>
                  <span class="operate-item" @click="addUser(0, scope.row)">{{ $t('base.detail') }}</span>
                  <span class="operate-item" @click="deleteUserPop(scope.row)">{{ $t('base.delete') }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination-block">
          <div class="table-demonstration">{{ $t('base.tableBottomCount', total_num) }}</div>
          <el-pagination v-model:current-page="page_number" @current-change="handleCurrentChange"
            layout="prev, pager, next" :default-page-size="20" :total="total_num" />
        </div>

        <el-dialog v-model="dialogFormVisible" :title="userDetailTitle" width="550">
          <el-form :model="userForm" :rules="rules">
            <el-form-item prop="name" :label="$t('user.tableUser.name')" label-width="140px"
              style="margin-right: 50px;">
              <el-input v-model="userForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="display_name" :label="$t('user.tableUser.displayName')" label-width="140px"
              style="margin-right: 50px;">
              <!-- :readonly="dialogUserDetailForm" -->
              <el-input v-model="userForm.display_name" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="password" :label="$t('user.formUser.password0')" label-width="140px"
              style="margin-right: 50px;">
              <el-input v-model="userForm.password" autocomplete="off" />
            </el-form-item>
            <el-form-item :label="$t('user.tableUser.email')" label-width="140px" style="margin-right: 50px;">
              <el-input v-model="userForm.email" autocomplete="off" />
            </el-form-item>
            <el-form-item :label="$t('user.tableUser.level')" label-width="140px" style="margin-right: 50px;">
              <!-- :disabled="dialogUserDetailForm" -->
              <el-select v-model="userForm.levelName" :placeholder="$t('user.plzSelectLevel')">
                <el-option :label="$t('user.role.level1')" value="1" />
                <el-option :label="$t('user.role.level2')" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('user.tableUser.remark')" label-width="140px" style="margin-right: 50px;">
              <el-input v-model="userForm.remark" maxlength="100" style="width: 310px" show-word-limit
                type="textarea" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="commitAddForm" type="primary">{{ $t('base.submit') }}</el-button>
              <el-button style="margin-left: 50px" @click="closedAlert">
                {{ $t('base.cancel') }}
              </el-button>
            </div>
          </template>
        </el-dialog>


        <el-dialog v-model="dialogResetPasswordForm" :title="$t('base.resetPassword')" width="550">
          <el-form :model="passwordForm" :rules="passwordRules">
            <el-form-item :label="$t('user.tableUser.name')" label-width="90px" style="margin-right: 140px;">
              <el-input v-model="passwordForm.name" autocomplete="off" readonly />
            </el-form-item>
            <el-form-item prop="newPassword" :label="$t('user.formUser.password0')" label-width="90px"
              style="margin-right: 50px;">
              <div class="reset-password">
                <el-input v-model="passwordForm.newPassword" autocomplete="off" />
                <el-button style="margin-left: 20px" @click="creatPassword">{{ $t('base.generate') }}</el-button>
                <el-button @click="copyPassword">{{ $t('base.copy') }}</el-button>
              </div>
            </el-form-item>
            <el-form-item prop="againPassword" :label="$t('user.formUser.password1')" label-width="90px"
              style="margin-right: 140px;">
              <el-input v-model="passwordForm.againPassword" autocomplete="off" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="commitNewPassword">
                {{ $t('base.confirm') }}
              </el-button>
              <el-button style="margin-left: 50px"
                @click="dialogResetPasswordForm = false">{{ $t('base.cancel') }}</el-button>
            </div>
          </template>
        </el-dialog>


        <el-dialog v-model="dialogDeleteVisible" :title="$t('user.deleteUser')" width="550">
          <div class="">
            {{ $t('user.deleteUserHint') }}
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="deleteUser">
                {{ $t('base.confirm') }}
              </el-button>
              <el-button style="margin-left: 50px"
                @click="dialogDeleteVisible = false">{{ $t('base.cancel') }}</el-button>
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
      userListData: [],
      accountStatusVal: 0,
      accountSwitch: 1,
      accountStatusOptions: [
        {
          value: 0,
          label: '正常',
        }, {
          value: 1,
          label: '禁用',
        }],
      pendingDeleteName: null,
      role: [
        this.$t('user.role.level0'),
        this.$t('user.role.level1'),
        this.$t('user.role.level2'),
      ],
      rules: {
        name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        display_name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
      },
      dialogFormVisible: false,
      dialogUserDetailForm: false,
      userDetailTitle: '添加用户',
      dialogResetPasswordForm: false,
      dialogDeleteVisible: false,
      userForm: {
        name: '',
        display_name: '',
        password: '',
        email: '',
        remark: '',
        level: '1',
        levelName: '普通用户',
      },
      passwordForm: {
        name: '',
        newPassword: '',
        againPassword: ''
      },
      passwordRules: {
        newPassword: { required: true, message: this.$t('base.noDataHint'), trigger: 'blur', validator: this.validateNewPassword },
        againPassword: { required: true, message: this.$t('base.noDataHint'), trigger: 'blur', validator: this.validateAgainPassword },
      },
      keyword: '',
      page_number: 1,
      total_num: 0,
      resetPasswordRow: null,
      userRow: null,
      deleteRow: null,
      isLoading: true,
    }
  },
  methods: {
    validateNewPassword: (rule, value, callback, source, options) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    },
    validateAgainPassword: (rule, value, callback, source, options) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if(this.passwordForm.newPassword !== value) {
        callback(new Error('二次输入密码不一致'))
      } else {
        callback()
      }
    },
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
      if (params['levelName'] == this.$t('user.role.level2')) {
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
      if (this.isLoading) {
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
        ElMessage.error(this.$t('user.password1Hint'))
        return
      }
    },

    updateUserDisabled(row) {
      let params = {}
      params['userid'] = row.id
      params['disabled'] = row.status ? 0 : 1
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
        this.isLoading = false
        if (code == 0 && data && data.users) {
          data.users.forEach(it => {
            if (!it['email']) {
              it["email"] = '无邮箱'
            }
            if (!it['create_time']) {
              it["create_time"] = '无'
            }
            it['levelname'] = (it['level'] == '1' ? this.$t('user.role.level1') : this.$t('user.role.level2'))
            it["permissions"] = (it['level'] == '1' ? this.$t('user.role.level1') : this.$t('user.role.level2'))
            it['disabled'] = !parseInt(it['disabled'])
            it['status'] = it['disabled'] == 0 ? false : true
          })
          console.log('UserList getUserList data.users:', data.users)
          this.userListData = data.users
          this.total_num = data.total_num
        } else {
          this.userListData = []
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
  height: 42px;
  background: #591BB7;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: 32px;
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