<script>
import {PageMixin} from "@/pages/PageMixin.js";
import {Api} from "@/network/api.js";
import {ElMessage} from "element-plus/es";
export default {
  mixins: [PageMixin],
  data() {
    return {
      tableData: [
      ],
      showDeleteUserDialog: false,
      pendingDeleteName: null,
      role: [
        this.$t('user.role.level0'),
        this.$t('user.role.level1'),
        this.$t('user.role.level2'),
      ]
    }
  },
  methods: {
    toUserDetail(mode, id) {
      this.push(`/user_detail/${mode}/${id}`)
    },
    pendingDeleteUser(name) {
      this.showDeleteUserDialog = true
      this.pendingDeleteName = name
    },
    deleteUser() {
      this.showDeleteUserDialog = false
      Api.deleteUser({name: this.pendingDeleteName}).then(({data, code, msg}) => {
        if (code == 0) {
          this.getUserList()
        } else {
          ElMessage.error(msg)
        }
      })
    },
    getUserList() {
      Api.getUserList({}).then(({data}) => {
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

<template>

  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">{{ $t("base.userManagement") }}</div>
        <el-button type="primary" size="default" @click="toUserDetail('add', 0)">{{ $t("base.add") }}</el-button>
      </div>
      <el-table
          :data="tableData"
          style="width: 100%"
          header-cell-class-name="tb-header"
          header-align="center"
          max-height="600">
        <el-table-column
            fixed
            prop="name"
            :label="$t('user.tableUser.name')"
            width="170">
        </el-table-column>
        <el-table-column
            prop="display_name"
            :label="$t('user.tableUser.displayName')"
            width="200">
        </el-table-column>
        <el-table-column
            prop="level"
            :label="$t('user.tableUser.level')"
            width="120">

        </el-table-column>
        <el-table-column
            prop="email"
            :label="$t('user.tableUser.email')"
            width="320">
        </el-table-column>
<!--        <el-table-column-->
<!--            prop="last_login"-->
<!--            :label="$t('user.tableUser.loginTime')"-->
<!--            width="170">-->
<!--        </el-table-column>-->
        <el-table-column
            prop="id"
            :label="$t('user.tableUser.operate')"
            width="120">
          <template #default="scope">
            <img class="tb-op-icon tb-op-icon-span" src="/imgs/edit.png" @click="toUserDetail('update', scope.row.id)">
            <img class="tb-op-icon" src="/imgs/delete.png" @click="pendingDeleteUser(scope.row.name)">

          </template>
        </el-table-column>
      </el-table>

      <el-dialog
          v-model="showDeleteUserDialog"
          title="Tips"
          width="500">
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
    </el-main>
  </el-container>
</template>

<style lang="scss" scoped>

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
</style>