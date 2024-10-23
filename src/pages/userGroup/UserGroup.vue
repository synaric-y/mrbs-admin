<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="sub-title-wrapper" style="margin-left: 20px;">
          <!-- <div class="sub-title">{{ $t("base.userManagement") }}</div> -->
          <div class="page-title">用户组配置</div>
          <div class="async-wrapper" style="margin-top: 20px;height: 30px;">
            <el-button size="large" class="el-button-content" style="width: 112px;">
              <img src="/imgs/button_reflesh.png" alt="Search Icon" class="el-button-img" />
              用户同步
            </el-button>
            <span class="async-last-time">{{ syncTime }}</span>
          </div>
        </div>

        <div class="table-wrapper" style="height: auto">
          <!-- default-expand-all -->
          <el-table :data="tableData" lazy style="width: 100%;height: auto; margin-bottom: 20px;" row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'has_child' }" :load="loadSubGroup">
            <el-table-column prop="group" label="用户组/用户" label-width="400px">
              <template #default="scope">
                <!-- <div class="group-title-wrapper"> -->
                <span class="group-title" :style="{ 'font-weight': scope.row.children ? 'bold' : 'normal' }">{{
                  scope.row.name }}</span>
                <!-- <template v-if="scope.row.isself"> -->
                <span class="group-more" @click="moreGroupMember(scope.row)">查看更多</span>
                <!-- </template> -->
                <!-- </div> -->
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" label-width="200px">
              <template #default="scope">
                <div v-if="scope.row.source === 'system'">
                  系统创建
                </div>
                <div v-else>
                  AD导入
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" label-width="400px">
              <template #default="scope">
                <div v-if="scope.row.source === 'system'">
                  <!-- <span class="group-btn" v-for="(item,func) in scope.row.btns" @click="func">{{ item }}</span> -->
                  <template v-if="scope.row.children">
                    <span class="group-btn" @click="editGroup(1, scope.row)">组编辑</span>
                    <span class="group-btn" @click="editGroup(0, scope.row)">新增组</span>
                    <span class="group-btn" @click="deleteGroupDialog(scope.row)">删除</span>
                  </template>
                  <template v-else>
                    <span class="group-btn" @click="editGroup(1, scope.row)">组编辑</span>
                    <span class="group-btn" @click="editGroup(0, scope.row)">新增组</span>
                    <span class="group-btn" @click="editGroupMember(scope.row)">组成员编辑</span>
                    <span class="group-btn" @click="deleteGroupDialog(scope.row)">删除</span>
                  </template>
                </div>
                <div v-else>
                  <span class="default-group-btn">无</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <GroupDetail v-if="dialogGroupMember" :groupId="selectedGroupId" :groupName="selectedGroupName"
          :is-edit="isEdit" @close="dialogGroupMember = false" />
        <el-dialog v-model="dialogDeleteVisible" title="删除用户" width="550">
          <div class="">
            是否删除当前选中的用户/用户组？
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button style="margin-left: 50px" type="primary" @click="sureDeleteUser">
                确定
              </el-button>
              <el-button @click="dialogDeleteVisible = false">取消</el-button>
            </div>
          </template>
        </el-dialog>

        <el-dialog v-model="dialogAddGroup" title="编辑组" width="550">
          <el-form :model="addGroupForm">
            <div class="request-wrapper">
              <img class="request-tag" style="left: 44px;" src="../../../public/imgs/request_icon.png" alt="">
              <el-form-item label="用户组名称" label-width="140px">
                <el-input v-model="addGroupForm.name" autocomplete="off" />
              </el-form-item>
            </div>
            <el-form-item label="同步用户组" label-width="140px" style="margin-right: 50px;">
              <el-tree-select lazy v-model="groupVal" :load="loadGroup" :props="groupProps" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button style="margin-left: 50px" type="primary" @click="commitGroupForm">
                确定
              </el-button>
              <el-button @click="dialogAddGroup = false">取消</el-button>
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
import { MockApi } from "@/network/mockApi.js";
import { v4 as uuidv4 } from "uuid";
import GroupDetail from "@/pages/userGroup/GroupDetail.vue";
import moment from "moment";

export default {
  components: { GroupDetail },
  mixins: [PageMixin],
  data() {
    return {
      tableData: [],
      syncTime: '上次同步时间：',
      sourceVal: '0',
      accountSwitch: 1,
      sourceOptions: [
        {
          value: '0',
          label: '系统创建',
        }, {
          value: '1',
          label: 'AD绑定',
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
      dialogDeleteVisible: false,
      userForm: {
        name: '',
        account: '',
        password: '',
        email: '',
        remark: '',
      },
      dialogGroupDetail: false,
      groupDetailForm: {
        name: '',
        newPassword: '',
        againPassword: ''
      },

      dialogGroupMember: false,
      groupMemberForm: {
        keyword: '',
        page_number: 0,
        pagesize: 20,
      },
      dialogEditGroup: false,

      dialogAddGroup: false,
      addGroupForm: {
        name: '',
        group_info: {},
      },
      groupProps:
      {
        label: 'label',
        children: 'children', // 子节点的字段
        isLeaf: 'isLeaf', // 用于判断是否是叶子节点
      },
      userRow: null,
      deleteRow: null,

      selectedGroupId: -1,
      selectedGroupName: '',
      isEdit: false,
      groupVal: null,
    }
  },
  methods: {

    loadSubGroup(row, treeNode, resolve) {
      let childrenData = []
      if (row.source === "system") {
        this.getSystemGroupTreeWithId(row.id).then(childrenData => {
          resolve(childrenData);
        }).catch(() => {
          resolve([]);
        });
        return
      }
      console.log('Loading children ad for:', row, treeNode);
      this.getAdGroupTreeWithId(row.id).then(childrenData => {
        resolve(childrenData);
      }).catch(() => {
        resolve([]);
      });
    },

    loadGroup(node, resolve) {
      console.log('loadGroup node', node)
      if (node.level === 0) {
        // 根节点，加载顶级数据
        setTimeout(() => {
          resolve([
            { label: '顶级节点1', id: 1, isLeaf: false },
            { label: '顶级节点2', id: 2, isLeaf: false },
          ]);
        }, 500);
      } else if (node.data.id === 1) {
        // 顶级节点1的子节点
        setTimeout(() => {
          resolve([
            { label: '子节点1-1', id: 3, isLeaf: true },
            { label: '子节点1-2', id: 4, isLeaf: true },
          ]);
        }, 500);
      } else if (node.data.id === 2) {
        // 顶级节点2的子节点
        setTimeout(() => {
          resolve([
            { label: '子节点2-1', id: 5, isLeaf: true },
            { label: '子节点2-2', id: 6, isLeaf: true },
          ]);
        }, 500);
      }
    },
    addUser(val, row) {
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
    sureDeleteUser() {
      let params = {}
      params['group_id'] = this.deleteRow.id
      this.dialogDeleteVisible = false
      this.deleteUser(params)
    },

    handleCurrentChange(num) {
      console.log('UserList handleCurrentChange num:', num)
      this.page_number = num
    },

    editGroup(mode, row) {
      // 0新增、1编辑
      this.dialogAddGroup = true

    },

    deleteGroupDialog(row) {
      this.dialogDeleteVisible = true
      this.deleteRow = row
    },
    editGroupMember(row) {
      this.dialogEditGroup = true
      this.dialogGroupMember = true
      this.isEdit = true
    },
    moreGroupMember(row) {

      console.log(430)

      this.selectedGroupId = row.id
      this.selectedGroupName = row.name
      this.dialogGroupMember = true
      this.isEdit = false

      console.log(435)
    },

    closeGroupMember() {
      this.dialogEditGroup = false
      this.dialogGroupMember = false
    },

    commitGroupForm() {

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

    deleteUser(params) {
      console.log('UserList editUser params', params)
      Api.deleteGroup(params).then(({ data, code, msg }) => {
        if (code == 0) {
          this.getTableData()
        } else {
          ElMessage.error(msg)
        }
      })
    },

    getADStatus() {
      Api.getADSyncStatus().then(({ data, code, msg }) => {
        if (code == 0) {
          console.log('UserGroup getADStatus:', data)
          if (data.sync_time == 0) {
            this.syncTime = `上次同步时间：未进行过同步操作`
          } else {
            // 时间戳转化当前时间
            const time = moment(parseInt(data.sync_time)).format('YYYY/MM/DD hh:mm:ss')
            this.syncTime = `上次同步时间：${time}`
          }
        }
      })
    },

    getSystemGroupTreeWithId(group_id) {
      return new Promise((resolve, reject) => {
        Api.getSystemGroupTree({
          "group_id": group_id,
          "page": 1,
        }).then(({ data, code, msg }) => {
          if (code == 0) {
            let groups = data.group.child_groups
            groups.forEach(item => {
              item['source'] = 'system'
            })
            if (group_id == -1) {
              const res = {
                id: uuidv4(),
                date: '2016-05-04',
                name: '我的分组',
                source: 'system',
                children: groups
              }
              this.tableData.push(res)
              resolve(res)
              return
            }
            resolve(groups)
          } else {
            ElMessage.error(msg)
            reject(msg);
          }
        })
      })
    },

    getAdGroupTreeWithId(group_id) {
      return new Promise((resolve, reject) => {
        Api.getAdGroupTree({
          "group_id": group_id,
          "page": 1,
          // "search": ""
        }).then(({ data, code, msg }) => {
          if (code == 0) {
            let groups = data.group.child_groups
            groups.forEach(item => {
              item['source'] = 'AD'
            })
            if (group_id == -1) {
              const res = {
                id: uuidv4(),
                date: '2016-05-04',
                name: 'AD分组',
                source: 'AD',
                children: groups
              }
              this.tableData.push(res)
              resolve(res)
              return
            }
            resolve(groups)
            console.log('UserGroup tableData', this.tableData)
          } else {
            ElMessage.error(msg)
            reject(msg)
          }
        })
      })
    },
    toUserDetail(mode, id) {
      this.push(`/user_detail/${mode}/${id}`)
    },
    async getTableData() {
      this.tableData = []
      await this.getSystemGroupTreeWithId(-1)
      this.getAdGroupTreeWithId(-1)
    }
  },
  mounted() {
    this.setTab('/user')
    this.getADStatus()
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
.sub-page-content {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: calc(100vw - 169px);
  // min-height: calc(100vh - 95px);
  height: auto;
  background-color: white;
  padding: 0;
  margin: 0;
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

.async-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 20px;
  padding: 0 5px;
}

.async-last-time {
  margin-left: 30px;
  line-height: 30px;
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0px;
  color: #1D2129;
}

.table-wrapper {
  margin-top: 50px;
  padding: 0;
  width: 100%;
}

.el-table {
  --el-table-header-bg-color: #F9F9F9;
  // --el-table-border: #E1E1E1;
  --el-table-border: 1px solid #E1E1E1;
  ;
}

.el-button-content {
  width: 84px;
  height: 32px;
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

.group-title-wrapper {
  display: flex;
  flex-direction: row;
  position: relative;
  background-color: rebeccapurple;
  // justify-content: start;
}

.group-more {
  position: absolute;
  right: 20px;
  top: 8px;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  display: flex;
  align-items: center;
  letter-spacing: -0.07px;
  color: #591BB7;
}

.group-more:hover {
  cursor: pointer;
  color: #320b6e;
}

.group-btn {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  padding-right: 40px;
  letter-spacing: -0.07px;
  color: #591BB7;
}

.default-group-btn {
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  padding-right: 40px;
  letter-spacing: -0.07px;
  color: #4E5969;
}

.group-member-wrapper {
  margin-top: 40px;
}

.tb-header {
  font-size: 14px !important;
}

.el-table {
  --el-table-tr-bg-color: white;
  padding: 0;
  margin: 0;
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