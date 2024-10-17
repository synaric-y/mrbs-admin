<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="sub-title-wrapper" style="margin-left: 20px;">
          <!-- <div class="sub-title">{{ $t("base.userManagement") }}</div> -->
          <div class="page-title">用户列表</div>
          <div class="filter-wrapper" style="margin-top: 20px;height: 30px;">
            <el-input v-model="keyword" style="width: 140px" placeholder="请输入用户名称" />
            <el-select class="account-status-select" v-model="accountStatusVal" placeholder="Select" size="large"
              style="width: 140px;margin-left: 25px;min-height: 30px;">
              <el-option style="height: 30px;" v-for="item in accountStatusOptions" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
            <el-button size="large" class="el-button-content" @click="searchUser">
              <img src="/imgs/button_search.png" alt="Search Icon" class="el-button-img" />
              查询
            </el-button>
            <el-button size="large" class="el-button-content" @click="addUser(1, null)">
              <img src="/imgs/button_add.png" alt="Search Icon" class="el-button-img" />
              添加
            </el-button>
            <el-button size="large" class="el-button-content" style="width: 112px;">
              <img src="/imgs/button_reflesh.png" alt="Search Icon" class="el-button-img" />
              用户同步
            </el-button>
            <!-- <el-button style="margin-left: 25px;" type="primary" size="default" @click="toUserDetail('add', 0)">{{
            $t("base.add") }}</el-button> -->
            <!-- <el-button :icon="search" style="margin-left: 25px;" type="primary" size="default"
            @click="toUserDetail('add', 0)">search</el-button>
          <el-button style="margin-left: 25px;" type="primary" size="default"
            @click="toUserDetail('add', 0)">search</el-button> -->
          </div>
        </div>

        <div class="table-wrapper" style="height: auto;">
          <el-table :data="tableData" style="margin-top: 56px;" header-cell-class-name="tb-header" max-height="450">
            <el-table-column prop="number" label="序号" width="120">
            </el-table-column>
            <el-table-column prop="name" label="用户名称" width="130">
            </el-table-column>
            <el-table-column prop="account" label="账号" width="130">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="130">
            </el-table-column>

            <!-- <el-table-column
            prop="display_name"
            :label="$t('user.tableUser.displayName')"
            width="160">
        </el-table-column> -->

            <!-- <el-table-column
            prop="level"
            :label="$t('user.tableUser.level')"
            width="100">
        </el-table-column> -->

            <el-table-column prop="status" label="状态" width="100">
              <!-- :v-model="status" -->
              <template #default="scope">
                <el-switch v-model="scope.row.status"
                  style="--el-switch-on-color: #591BB7; --el-switch-off-color: #A8ABB2" active-value="100"
                  inactive-value="0" @change="handleSwitchChange(scope.row)" />
              </template>

            </el-table-column>
            <el-table-column prop="permissions" label="账号权限" width="150">
            </el-table-column>
            <el-table-column prop="last_login" :label="$t('user.tableUser.loginTime')" width="200">
            </el-table-column>
            <el-table-column prop="id" :label="$t('user.tableUser.operate')" width="300">
              <template #default="scope">
                <!-- <img class="tb-op-icon tb-op-icon-span" src="/imgs/edit.png"
                @click="toUserDetail('update', scope.row.id)">
              <img class="tb-op-icon" src="/imgs/delete.png" @click="pendingDeleteUser(scope.row.name)"> -->
                <div class="operate-wrapper">
                  <span class="operate-item" @click="resetPassword(scope.row)">重置密码</span>
                  <span class="operate-item" @click="addUser(0, scope.row)">查看</span>
                  <span class="operate-item" @click="deleteUserPop(scope.row)">删除</span>
                </div>

              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="table-pagination-block">
          <div class="table-demonstration">共200条</div>
          <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="200" />
        </div>
        <!-- <template v-if="dialogFormVisible||dialogUserDetailForm"> -->

        <el-dialog v-model="dialogFormVisible" :title="userDetailTitle" width="550">
          <el-form :model="userForm">

            <div class="request-wrapper">
              <img class="request-tag" src="../../../public/imgs/request_icon.png" alt="">
              <el-form-item label="用户名称" label-width="140px" style="margin-right: 50px;">

                <el-input v-model="userForm.name" autocomplete="off" />
              </el-form-item>
            </div>

            <div class="request-wrapper">
              <img class="request-tag" style="left: 85px;" src="../../../public/imgs/request_icon.png" alt="">
              <el-form-item label="账号" label-width="140px" style="margin-right: 50px;">
                <el-input v-model="userForm.account" autocomplete="off" :readonly="dialogUserDetailForm" />
              </el-form-item>
            </div>

            <div class="request-wrapper">
              <img class="request-tag"  style="left: 85px;" src="../../../public/imgs/request_icon.png" alt="">
              <el-form-item label="密码" label-width="140px" style="margin-right: 50px;">
                <el-input v-model="userForm.password" autocomplete="off" />
              </el-form-item>
            </div>

            <el-form-item label="邮箱" label-width="140px" style="margin-right: 50px;">
              <el-input v-model="userForm.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="账号权限" label-width="140px" style="margin-right: 50px;">
              <el-select v-model="userForm.permissions" placeholder="请选择账号权限" :disabled="dialogUserDetailForm">
                <el-option label="普通用户" value="普通用户" />
                <el-option label="管理员" value="管理员" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" label-width="140px" style="margin-right: 50px;">
              <el-input v-model="userForm.remark" maxlength="100" style="width: 310px" placeholder="Please input"
                show-word-limit type="textarea" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="commitAddForm">提交</el-button>
              <el-button style="margin-left: 50px" type="primary" @click="closedAlert">
                取消
              </el-button>
            </div>
          </template>
        </el-dialog>

        <!-- </template> -->



        <el-dialog v-model="dialogResetPasswordForm" title="重置密码" width="550">
          <el-form :model="passwordForm">
            <el-form-item label="用户名称" label-width="90px" style="margin-right: 140px;">
              <el-input v-model="passwordForm.name" autocomplete="off" readonly />
            </el-form-item>
            <el-form-item label="密码" label-width="90px" style="margin-right: 50px;">
              <div class="reset-password">
                <el-input v-model="passwordForm.newPassword" autocomplete="off" />
                <el-button style="margin-left: 20px" @click="creatPassword">生成</el-button>
                <el-button @click="copyPassword">复制</el-button>
              </div>
            </el-form-item>
            <el-form-item label="确认密码" label-width="90px" style="margin-right: 140px;">
              <el-input v-model="passwordForm.againPassword" autocomplete="off" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button style="margin-left: 50px" type="primary" @click="dialogResetPasswordForm = false">
                Confirm
              </el-button>
              <el-button @click="dialogResetPasswordForm = false">Cancel</el-button>
            </div>
          </template>
        </el-dialog>


        <el-dialog v-model="dialogDeleteVisible" title="删除用户" width="550">
          <div class="">
            是否删除当前用户？
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button style="margin-left: 50px" type="primary" @click="deleteUser">
                Confirm
              </el-button>
              <el-button @click="dialogDeleteVisible = false">Cancel</el-button>
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
      tableData: [
        { "number": 1, "name": 'zhangsan', "account": 'jack.chen', "email": '123@163.com', "display_name": "zs", "status": 1, "level": '2', "id": 2, "permissions": '管理员', "last_login": '2024-10-14 10:30:01', "password": 'zhangsan' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 3, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 1, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 4, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 5, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 6, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 7, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 8, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 9, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 10, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 11, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 12, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 13, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 14, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 15, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 16, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 17, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 18, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 19, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' },
        { "number": 20, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01', "password": 'lisi' }
      ],
      accountStatusVal: '0',
      accountSwitch: 1,
      accountStatusOptions: [
        {
          value: '0',
          label: '正常',
        }, {
          value: '1',
          label: '禁用',
        }],
      pendingDeleteName: null,
      role: [
        this.$t('user.role.level0'),
        this.$t('user.role.level1'),
        this.$t('user.role.level2'),
      ],
      dialogFormVisible: false,
      dialogUserDetailForm: false,
      userDetailTitle: '添加用户',
      dialogResetPasswordForm: false,
      dialogDeleteVisible: false,
      userForm: {
        name: '',
        account: '',
        password: '',
        email: '',
        remark: '',
      },
      passwordForm: {
        name: '',
        newPassword: '',
        againPassword: ''
      },
      keyword: '',
      page_number: 0,
      resetPasswordRow: null,
      userRow: null,
      deleteRow: null
    }
  },
  methods: {
    addUser(val, row) {

      // if (val) {
      //   console.log('addUser add val', val)
      //   this.dialogFormVisible = true
      //   this.userDetailTitle = '添加用户'
      //   return
      // }
      // this.dialogUserDetailForm = true
      // this.userDetailTitle = '查看用户'


      this.dialogFormVisible = true
      if (val === 1) {
        this.dialogUserDetailForm = false// Editable for adding a user
        this.userDetailTitle = '添加用户'
        this.userForm.name = ''
        this.userForm.region = ''
        this.userForm.account = ''
        this.userForm.password = ''
        this.userForm.email = ''
        this.userForm.remark = ''
      } else {
        this.dialogUserDetailForm = true // Read-only for viewing user details
        this.userDetailTitle = '查看用户'
        this.userForm.name = row.name
        this.userForm.account = row.account
        this.userForm.password = ''
        this.userForm.email = row.email
        this.userForm.remark = row.remark
        this.userForm.permissions = row.permissions
        this.userForm.password = row.password
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
      params['id'] = row.number
      params['name'] = row.name
      params['display_name'] = row.account
      params['email'] = row.email
      params['password'] = row.password
      params['remark'] = row.remark
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
    handleCurrentChange(num) {
      console.log('UserList handleCurrentChange num:', num)
      this.page_number = num
    },
    handleSwitchChange(row) {
      console.log('UserList handleCurrentChange id: status', row.number, row.status)
      this.updateUserDisabled(row)
    },

    creatPassword() {
      this.passwordForm.newPassword = Common.generateRandomString(20)
      console.log('UserList creatPassword', this.passwordForm.password)
    },
    copyPassword() {
      if (this.passwordForm.password) {
        navigator.clipboard.writeText(this.passwordForm.password).then(function () {
          ElMessage('复制粘贴板成功')
        }, function (error) {
          ElMessage('复制粘贴板失败')
        })
      }
    },

    updateUserDisabled(row) {
      let params = {}
      params['userid'] = row.number
      params['disabled'] = row.status != '100' ? 1 : 0
      console.log('UserList updateUserStatus params', params)
      return
      Api.updateAccount({ params }).then(({ data, code, msg }) => {
        if (code == 0) {

        } else {

        }
      })
    },

    editUser(params) {
      console.log('UserList editUser params', params)
      return
      Api.editUser({ params }).then(({ data, code, msg }) => {
        if (code == 0) {
          this.getUserList()
        } else {
          ElMessage.error(message)
        }
      })
    },
    getUserList() {
      let params = {}
      params['keyword'] = this.keyword
      params['pagesize'] = 20
      params['pagenum'] = this.page_number
      const selectedItem = this.accountStatusOptions.filter(item => item.value === this.accountStatusVal)
      const disabled = selectedItem[0].value
      params['disabled'] = disabled
      // Api.getAllUsers
      Api.getAllUsers({ params }).then(({ data }) => {
        if (data) {
          data.forEach(it => {
            it["level"] = this.role[it["level"]]
          })
          this.tableData = data
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
  width: calc(100vw - 169px);
  height: calc(100vh - 95px);
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