<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="sub-title-wrapper" style="margin-left: 20px;">
          <!-- <div class="sub-title">{{ $t("base.userManagement") }}</div> -->
          <div class="page-title">用户列表</div>
          <div class="filter-wrapper" style="margin-top: 20px;height: 30px;">
            <el-input v-model="searchName" style="width: 140px" placeholder="请输入用户名称" />
            <el-select class="account-status-select" v-model="accountStatusVal" placeholder="Select" size="large"
              style="width: 140px;margin-left: 25px;min-height: 30px;">
              <el-option style="height: 30px;" v-for="item in accountStatusOptions" :key="item.value"
                :label="item.label" :value="item.value" />
            </el-select>
            <el-button size="large" class="el-button-content">
              <img src="/imgs/button-search.png" alt="Search Icon" class="el-button-img" />
              查询
            </el-button>
            <el-button size="large" class="el-button-content" @click="dialogFormVisible = true">
              <img src="/imgs/button-add.png" alt="Search Icon" class="el-button-img" />
              添加
            </el-button>
            <el-button size="large" class="el-button-content" style="width: 112px;">
              <img src="/imgs/button-reflesh.png" alt="Search Icon" class="el-button-img" />
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
            <el-table-column prop="name" label="用户名" width="130">
            </el-table-column>
            <el-table-column prop="account" label="登录账号" width="130">
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
              <el-switch v-model="accountSwitch" style="--el-switch-on-color: #591BB7; --el-switch-off-color: #A8ABB2"
                active-value="100" inactive-value="0" />
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
                  <span class="operate-item">重置密码</span>
                  <span class="operate-item">查看</span>
                  <span class="operate-item">删除</span>
                </div>

              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="table-pagination-block">
          <div class="table-demonstration">共200条</div>
          <el-pagination layout="prev, pager, next" :total="200" />
        </div>


        <el-dialog v-model="showDeleteUserDialog" title="Tips" width="500">
          <span>{{ $t('user.deleteUserHint') }}</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showDeleteUserDialog = false">{{ $t('base.cancel') }}</el-button>
              <el-button type="primary" @click="deleteUser">
                {{ $t('base.confirm') }}
              </el-button>
            </div>
          </template>
        </el-dialog>


        <el-dialog v-model="dialogFormVisible" title="添加用户" width="550">
          <el-form :model="userForm">
            <el-form-item label="用户名称" label-width="140px" style="margin-right: 50px;">
              <el-input v-model="userForm.name" autocomplete="off" />
            </el-form-item>

            <el-form-item label="账号" label-width="140px" style="margin-right: 50px;">
              <el-input v-model="userForm.account" autocomplete="off" />
            </el-form-item>

            <el-form-item label="密码" label-width="140px" style="margin-right: 50px;">
              <el-input v-model="userForm.password" autocomplete="off" />
            </el-form-item>

            <el-form-item label="邮箱" label-width="140px" style="margin-right: 50px;">
              <el-input v-model="userForm.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="账号权限" label-width="140px" style="margin-right: 50px;">
              <el-select v-model="userForm.region" placeholder="请选择账号权限">
                <el-option label="普通用户" value="普通用户" />
                <el-option label="管理员" value="管理员" />
              </el-select>
            </el-form-item>

            <el-form-item label="备注" label-width="140px" style="margin-right: 50px;">
              <el-input v-model="textarea" maxlength="30" style="width: 310px" placeholder="Please input"
                show-word-limit type="textarea" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogFormVisible = false">Cancel</el-button>
              <el-button style="margin-left: 50px" type="primary" @click="dialogFormVisible = false">
                Confirm
              </el-button>
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
export default {
  mixins: [PageMixin],
  data() {
    return {
      tableData: [
        { "number": 1, "name": 'zhangsan', "account": 'jack.chen', "email": '123@163.com', "display_name": "zs", "status": 1, "level": '2', "id": 2, "permissions": '管理员', "last_login": '2024-10-14 10:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' },
        { "number": 2, "name": 'lisi', "account": 'roce.zhang', "email": '456@163.com', "display_name": "ls", "status": 0, "level": '2', "id": 3, "permissions": '普通用户', "last_login": '2024-10-12 15:30:01' }
      ],
      searchName: '',
      accountStatusVal: '正常',
      accountSwitch: 1,
      accountStatusOptions: [
        {
          value: '正常',
          label: '正常',
        }, {
          value: '禁用',
          label: '禁用',
        }],
      showDeleteUserDialog: false,
      pendingDeleteName: null,
      role: [
        this.$t('user.role.level0'),
        this.$t('user.role.level1'),
        this.$t('user.role.level2'),
      ],
      dialogFormVisible: false,
      userForm: {
        name: '',
        region: '',
        account: '',
        password: '',
        email: '',
      }
    }
  },
  methods: {
    addUser() {

    },
    toUserDetail(mode, id) {
      this.push(`/user_detail/${mode}/${id}`)
    },
    pendingDeleteUser(name) {
      this.showDeleteUserDialog = true
      this.pendingDeleteName = name
    },
    deleteUser() {
      this.showDeleteUserDialog = false
      Api.deleteUser({ name: this.pendingDeleteName }).then(({ data, code, msg }) => {
        if (code == 0) {
          this.getUserList()
        } else {
          ElMessage.error(message)
        }
      })
    },
    getUserList() {
      Api.getUserList({}).then(({ data }) => {
        if (data) {
          data.forEach(it => {
            it["level"] = this.role[it["level"]]
          })
          this.tableData = data
        }
      })
    }
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
  margin: 0;
  padding: 0;
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
</style>