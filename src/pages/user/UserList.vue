<template>
  <Layout :title="$t('user.userList')">
    <template #filter>
      <el-input v-model="keyword" style="width: 140px" :placeholder="$t('user.plzEnterUsernameHint')" />
      <el-select class="account-status-select" v-model="accountStatusVal" :placeholder="$t('base.plzSelect')" size="large"
        style="width: 140px;min-height: 30px;">
        <el-option style="height: 30px;" v-for="item in accountStatusOptions" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
      <el-button type="primary" class="btn" :icon="Search" @click="searchUser">
        {{ $t('base.search') }}
      </el-button>
      <el-button type="primary" class="btn" :icon="Plus" @click="addUser(0, null)">
        {{ $t('base.add2') }}
      </el-button>
    </template>
    <template #table>
      <div class="table-wrapper" style="height: auto;">
        <el-table :data="userListData" header-cell-class-name="tb-header" max-height="450" table-layout="auto">
          <el-table-column prop="number" :label="$t('user.tableUser.id')" width="120">
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="display_name" :label="$t('user.tableUser.displayName')" width="130">
          </el-table-column>
          <el-table-column prop="name" :label="$t('user.tableUser.name')" width="130">
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
                <span class="operate-item" @click="addUser(1, scope.row)">{{ $t('base.edit') }}</span>
                <span class="operate-item" @click="deleteUserPop(scope.row)">{{ $t('base.delete') }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template #pagination>
      <el-text>{{ $t('base.tableBottomCount', total_num) }}</el-text>
      <el-pagination v-model:current-page="page_number" @current-change="handleCurrentChange" layout="prev, pager, next"
        :default-page-size="20" :total="total_num" />
    </template>
  </Layout>

  <el-dialog v-model="dialogFormVisible" :title="userDetailTitle" width="550">
    <el-form ref="userForm" :model="userForm" :rules="rules">
      <el-form-item prop="name" :label="$t('user.tableUser.name')" label-width="140px" style="margin-right: 50px;">
        <el-input v-model="userForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="display_name" :label="$t('user.tableUser.displayName')" label-width="140px"
        style="margin-right: 50px;">
        <el-input v-model="userForm.display_name" autocomplete="off" />
      </el-form-item>
      <template v-if="mode==0">
        <el-form-item prop="password" :label="$t('user.formUser.password0')" label-width="140px"
          style="margin-right: 50px;">
          <el-input v-model="userForm.password" autocomplete="off" />
        </el-form-item>
      </template>
      <el-form-item :label="$t('user.tableUser.email')" label-width="140px" style="margin-right: 50px;">
        <el-input v-model="userForm.email" autocomplete="off" />
      </el-form-item>
      <el-form-item :label="$t('user.tableUser.level')" prop="level" label-width="140px" style="margin-right: 50px;">
        <el-select v-model="userForm.levelName" :placeholder="$t('user.plzSelectLevel')" @change="onLevelChange">
          <el-option v-for="(item, index) in levels" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.tableUser.remark')" label-width="140px" style="margin-right: 50px;">
        <el-input v-model="userForm.remark" maxlength="100" style="width: 310px" show-word-limit type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer" style="text-align: center">
        <el-button @click="commitAddForm" type="primary">{{ $t('base.submit') }}</el-button>
        <el-button @click="closedAlert">{{ $t('base.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="dialogResetPasswordForm" :title="$t('base.resetPassword')" width="550">
    <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" label-width="auto">
      <el-form-item :label="$t('user.tableUser.name')">
        <el-input class="form-item-input" v-model="passwordForm.name" autocomplete="off" readonly />
      </el-form-item>
      <el-form-item prop="password0" :label="$t('user.formUser.password0')">
        <div class="form-item">
          <el-input class="form-item-input" v-model="passwordForm.password0" autocomplete="off" />
          <el-button type="primary" @click="createPassword">{{ $t('base.generate') }}</el-button>
          <el-button style="margin-left: 0" @click="copyPassword">{{ $t('base.copy') }}</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="password1" :label="$t('user.formUser.password1')">
        <el-input class="form-item-input" v-model="passwordForm.password1" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="commitNewPassword">
          {{ $t('base.confirm') }}
        </el-button>
        <el-button style="margin-left: 50px" @click="dialogResetPasswordForm = false">{{ $t('base.cancel')
          }}</el-button>
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
        <el-button style="margin-left: 50px" @click="dialogDeleteVisible = false">{{ $t('base.cancel') }}</el-button>
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
import { Search, Plus, Refresh } from '@element-plus/icons-vue'
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
  components: { Layout },
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
      levels: [
        { label: this.$t('user.role.level1'), value: 1 },
        { label: this.$t('user.role.level2'), value: 2 }
      ],
      rules: [],
      rulesAdd: {
        name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        display_name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('user.form_verify_email'), trigger: 'blur' },
          { validator: this.validateEmail, trigger: 'blur' }
        ],
      },
      rulesUpdate: {
        name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        display_name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('user.form_verify_email'), trigger: 'blur' },
          { validator: this.validateEmail, trigger: 'blur' }
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
        id: 0,
        name: '',
        password0: '',
        password1: ''
      },
      passwordRules: {
        password0: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}],
        password1: [{ required: true, message: this.$t('base.noDataHint'), trigger: 'blur'},
        { validator: this.validatePassword1, message: this.$t('user.password1Hint'), trigger: 'blur' }],
      },
      keyword: '',
      page_number: 1,
      total_num: 0,
      resetPasswordRow: null,
      userRow: null,
      deleteRow: null,
      isLoading: true,
      mode: 0,
    }
  },
  methods: {
    validatePassword1(rule, value, callback) {
      if (value === '') {
        callback(new Error(this.$t('base.noDataHint')));
      } else if (this.passwordForm.password0 !== this.passwordForm.password1) {
        callback(new Error(this.$t('user.password1Hint')));
      } else {
        callback();
      }
    },
    validateEmail(rule, value, callback) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        callback(new Error(this.$t('user.form_verify_email')));
      } else if (!emailRegex.test(value)) {
        callback(new Error(this.$t('user.form_valid_email')));
      } else {
        callback();
      }
    },

    onLevelChange(e) {
      this.userForm.level = e
      console.log('UserList onLevelChange - e', e)
    },
    addUser(val, row) {
      this.dialogFormVisible = true
      this.mode = val
      if (val === 1) {
        this.dialogUserDetailForm = true
        this.rules = this.rulesUpdate
        this.userDetailTitle = this.$t('user.editUser')
        this.userForm.name = row.name
        this.userForm.display_name = row.display_name
        this.userForm.password = ''
        this.userForm.email = row.email
        this.userForm.remark = row.remark
        this.userForm.permissions = row.permissions
        this.userForm.password = row.password
        this.userForm.level = row.level
        this.userForm.levelName = row.levelName
        this.userRow = row
      } else {
        this.dialogUserDetailForm = false
        this.rules = this.rulesAdd
        this.userDetailTitle = this.$t('user.addUser')
        this.userForm.name = ''
        this.userForm.display_name = ''
        this.userForm.password = ''
        this.userForm.email = ''
        this.userForm.remark = ''
      }
      console.log('UserList val - row', val, row)
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
      delete params['levelName']
      params['name'] = this.userForm.name
      params['display_name'] = this.userForm.display_name
      params['email'] = this.userForm.email
      params['password'] = this.userForm.password
      params['remark'] = this.userForm.remark
      this.$refs.userForm.validate((pass) => {
        if (!pass) {
          console.log('UserList commitForm !pass')
          return
        }
        this.editUser(params)
      })
    },
    resetPassword(row) {
      this.dialogResetPasswordForm = true
      this.passwordForm.name = row.name
      this.passwordForm.id = row.id
      this.passwordForm.password0 = ''
      this.passwordForm.password1 = ''
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
      this.getUserList()
    },
    handleSwitchChange(row) {
      if (this.isLoading) {
        return
      }
      console.log('UserList handleCurrentChange id: status', row)
      this.updateUserDisabled(row)
    },

    createPassword() {
      this.passwordForm.password0 = Common.generateRandomString(20)
      console.log('UserList createPassword', this.passwordForm.password0)
    },
    copyPassword() {
      console.log('UserList copyPassword:', this.passwordForm.password0)
      if (this.passwordForm.password0) {
        navigator.clipboard.writeText(this.passwordForm.password0).then(() => {
          ElMessage(this.$t('base.copiedToClipboard'));
        }).catch((error) => {
          console.error('Failed to copy text to clipboard:', error);
        });
      }
    },

    commitNewPassword() {
      this.$refs.passwordForm.validate((pass) => {
        if (!pass) {
          console.log('UserList commitNewPassword !pass')
          return
        }
        Api.resetPassword(this.passwordForm).then(({ data, code, msg }) => {
          ElMessage.success({
            message: msg,
          })
          if (code == 0) {
            this.dialogResetPasswordForm = false
            this.getUserList()
          } else {

          }
        })
      })
    },

    updateUserDisabled(row) {
      let params = {}
      params['userid'] = row.id
      params['disabled'] = row.status ? 0 : 1
      console.log('UserList updateUserStatus params', params)
      Api.updateAccount(params).then(({ data, code, msg }) => {
        ElMessage.success({
          message: msg,
        })
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
        ElMessage.success({
          message: msg,
        })
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
              it["email"] = ''
            }
            it['create_time'] = it['timestamp']
            it['levelName'] = (it['level'] == '1' || it['level'] == '0' ? this.$t('user.role.level1') : this.$t('user.role.level2'))
            it["permissions"] = (it['level'] == '1' || it['level'] == '0' ? this.$t('user.role.level1') : this.$t('user.role.level2'))
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
.form-item {
  height: auto;
}

.form-item-input {
  width: 300px;
}
</style>