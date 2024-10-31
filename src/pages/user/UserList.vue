<template>
  <Layout :title="$t('user.userList')">
    <template #filter>
      <el-input v-model="keyword" style="width: 140px" :placeholder="$t('user.plzEnterUsernameHint')" />
      <el-select class="account-status-select" v-model="accountStatusVal" placeholder="Select" size="large"
                 style="width: 140px;min-height: 30px;">
        <el-option style="height: 30px;" v-for="item in accountStatusOptions" :key="item.value"
                   :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" class="btn" :icon="Search" @click="searchUser">
        {{ $t('base.search') }}
      </el-button>
      <el-button type="primary" class="btn" :icon="Plus" @click="addUser(1, null)">
        {{ $t('base.add2') }}
      </el-button>
      <el-button type="primary" class="btn" :icon="Refresh" style="width: 112px;">
        {{ $t('base.userSync') }}
      </el-button>
    </template>
    <template #table>
      <div class="table-wrapper" style="height: auto;">
        <el-table :data="userListData" header-cell-class-name="tb-header" max-height="450"
                  table-layout="auto">
          <el-table-column prop="number" :label="$t('user.tableUser.id')" width="120">
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
    </template>
    <template #pagination>
      <el-text>{{ $t('base.tableBottomCount', total_num) }}</el-text>
      <el-pagination v-model:current-page="page_number" @current-change="handleCurrentChange"
                     layout="prev, pager, next" :default-page-size="20" :total="total_num" />
    </template>
  </Layout>

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
        <el-button @click="closedAlert">{{ $t('base.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>


  <!--  重置密码  -->
  <el-dialog v-model="dialogResetPasswordForm" :title="$t('base.resetPassword')"  width="550">
    <el-form :model="passwordForm" :rules="passwordRules" label-width="auto">
      <el-form-item :label="$t('user.tableUser.name')" >
        <el-input class="form-item-input" v-model="passwordForm.name" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item prop="newPassword" :label="$t('user.formUser.password0')">
        <div class="form-item">
          <el-input class="form-item-input" v-model="passwordForm.newPassword" autocomplete="off" />
          <el-button type="primary" @click="createPassword">{{ $t('base.generate') }}</el-button>
          <el-button style="margin-left: 0" @click="copyPassword">{{$t('base.copy') }}</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="againPassword" :label="$t('user.formUser.password1')">
        <el-input class="form-item-input" v-model="passwordForm.againPassword" autocomplete="off" />
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

</template>

<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import { ElMessage } from "element-plus/es";
import { Common } from "@/common/common";
import Layout from "@/components/Layout.vue";
import {Search, Plus, Refresh } from '@element-plus/icons-vue'
export default {
  computed: {
    Refresh() {
      return Refresh
    },
    Plus() {
      return Plus
    },
    Search() {
      return Search
    }
  },
  components: {Layout},
  mixins: [PageMixin],
  data() {
    return {
      userListData: [],
      accountStatusVal: 0,
      accountSwitch: 1,
      accountStatusOptions: [
        {
          value: 0,
          label: this.$t('base.enabled'),
        }, {
          value: 1,
          label: this.$t('base.disabled'),
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
      userDetailTitle: this.$t('user.addUser'),
      dialogResetPasswordForm: false,
      dialogDeleteVisible: false,
      userForm: {
        name: '',
        display_name: '',
        password: '',
        email: '',
        remark: '',
        level: '1',
        levelName: this.$t('user.role.level1'),
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
        callback(new Error(this.$t('base.noDataHint')))
      } else {
        callback()
      }
    },
    validateAgainPassword: (rule, value, callback, source, options) => {
      if (value === '') {
        callback(new Error(this.$t('base.noDataHint')))
      } else if(this.passwordForm.newPassword !== value) {
        callback(new Error(this.$t('user.password1Hint')))
      } else {
        callback()
      }
    },
    addUser(val, row) {
      this.dialogFormVisible = true
      if (val === 1) {
        this.dialogUserDetailForm = false// Editable for adding a user
        this.userDetailTitle = this.$t('user.addUser')
        this.userForm.name = ''
        this.userForm.display_name = ''
        this.userForm.password = ''
        this.userForm.email = ''
        this.userForm.remark = ''
      } else {
        this.dialogUserDetailForm = true // Read-only for viewing user details
        this.userDetailTitle = this.$t('user.viewUser')
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

    createPassword() {
      this.passwordForm.newPassword = Common.generateRandomString(20)
      console.log('UserList createPassword', this.passwordForm.newPassword)
    },
    copyPassword() {
      console.log('UserList copyPassword:', this.passwordForm.newPassword)
      if (this.passwordForm.newPassword) {
        navigator.clipboard.writeText(this.passwordForm.newPassword).then(function () {
          ElMessage(this.$t('base.copiedToClipboard'))
        }, function (error) {

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
              it["email"] = this.$t('base.none')
            }
            if (!it['create_time']) {
              it["create_time"] = this.$t('base.none')
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

.form-item{
  height: auto;
}

.form-item-input{
  width: 300px;
}


</style>