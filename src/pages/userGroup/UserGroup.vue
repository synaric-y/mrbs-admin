<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content-main">
        <div class="sub-title-wrapper" style="margin-left: 20px;">
          <div class="page-title">{{ $t('userGroup.userGroupSettings') }}</div>
          <div class="async-wrapper" style="margin-top: 20px;">
            <el-button :disabled="!enable_sync" size="large" type="primary" style="width: 112px;" @click="OnSyncUsers">
              <img src="../../../public/imgs/button_reflesh.png" alt="Search Icon" class="el-button-img" />
              {{ $t('base.userSync') }}
            </el-button>
            <span class="async-last-time">{{ syncTime }}</span>
          </div>
        </div>
        <div class="table-wrapper" style="height: auto;margin-top: 20px;">
          <el-table :v-loading="true" :data="tableData" lazy style="width: 100%;height: auto; margin-bottom: 20px;"
            :tree-props="{ children: 'children', hasChildren: 'has_child' }" :load="loadSubGroup" max-height="550"
            :row-key="getRowKeys" :expand-row-keys="expandedKeys" type='expand' @expand-change="handleExpandChange">
            <el-table-column prop="group" :label="$t('userGroup.userGroup')" label-width="400px">
              <template #default="scope">
                <span class="group-title" :style="{ 'font-weight': scope.row.children ? 'bold' : 'normal' }">{{
                  scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="source" :label="$t('userGroup.tableUserGroup.source')" label-width="200px">
              <template #default="scope">
                <div v-if="scope.row.source === 'system'">
                  {{ $t('userGroup.local') }}
                </div>
                <div v-else>
                  {{ $t('userGroup.fromAD') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name" :label="$t('userGroup.operate')" label-width="400px">
              <template #default="scope">
                <div v-if="scope.row.source === 'system'">
                  <template v-if="scope.row.children">
                    <div class="operate-wrapper">
                      <span class="operate-item" @click="editGroupBtn(0, scope.row)">{{ $t('base.new') }}</span>
                      <!-- <span class="operate-item" @click="editGroupBtn(1, scope.row)">{{ $t('base.edit') }}</span>
                      <span class="operate-item" @click="deleteGroupDialog(scope.row)">{{ $t('base.delete') }}</span> -->
                    </div>
                  </template>
                  <template v-else>
                    <div class="operate-wrapper">
                      <span class="operate-item" @click="editGroupBtn(0, scope.row)">{{ $t('base.new') }}</span>
                      <span class="operate-item" @click="editGroupBtn(1, scope.row)">{{ $t('base.edit') }}</span>
                      <span class="operate-item" @click="deleteGroupDialog(scope.row)">{{ $t('base.delete') }}</span>
                      <span class="operate-item" @click="editGroupMember(scope.row)">{{ $t('userGroup.editMember')
                        }}</span>
                    </div>
                  </template>
                </div>
                <div v-else>
                  <template v-if="!scope.row.children">
                    <div class="operate-wrapper">
                      <span class="operate-item" @click="moreGroupMember(scope.row)">{{ $t('userGroup.viewMember')
                        }}</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="operate-wrapper">
                      <span class="operate-item" style="visibility: hidden">{{ $t('userGroup.viewMember') }}</span>
                    </div>
                  </template>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <GroupDetail v-if="dialogGroupMember" :groupId="selectedGroupId" :groupName="selectedGroupName"
          :is-edit="isEdit" :ad-more="ad_more_member" @close="dialogGroupMember = false" />
        <el-dialog v-model="dialogDeleteVisible" :title="$t('user.deleteUser')" width="550">
          <div class="">
            {{ $t('userGroup.confirmDeleteUserGroup') }}
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button style="margin-left: 50px" type="primary" @click="sureDeleteUser">
                {{ $t('base.confirm') }}
              </el-button>
              <el-button @click="dialogDeleteVisible = false">{{ $t('base.cancel') }}</el-button>
            </div>
          </template>
        </el-dialog>
        <el-dialog v-model="dialogAddGroup" :title="$t('userGroup.editUserGroup')" width="550">
          <el-form :model="addGroupForm" :rules="rules">
            <div class="request-wrapper">
              <el-form-item :label="$t('userGroup.tableUserGroup.name')" label-width="140px" required>
                <el-input v-model="addGroupForm.name" autocomplete="off" />
              </el-form-item>
            </div>
            <el-form-item :label="$t('userGroup.tableUserGroup.syncFromAD')" label-width="140px"
              style="margin-right: 50px;">
              <el-tree-select lazy v-model="addGroupForm.sync_group_name" :load="loadGroup" :props="groupProps"
                :disabled="mode || show_sync_group" @change="handleTreeSelect" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button style="margin-left: 50px" type="primary" @click="commitGroupForm">
                {{ $t('base.confirm') }}
              </el-button>
              <el-button @click="dialogAddGroup = false">{{ $t('base.cancel') }}</el-button>
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
      syncTime: this.$t('userGroup.lastSyncTime'),
      sourceVal: '0',
      accountSwitch: 1,
      sourceOptions: [
        {
          value: '0',
          label: this.$t('userGroup.local'),
        }, {
          value: '1',
          label: this.$t('userGroup.fromAD'),
        }],
      pendingDeleteName: null,
      role: [
        this.$t('user.role.level0'),
        this.$t('user.role.level1'),
        this.$t('user.role.level2'),
      ],
      dialogFormVisible: false,
      dialogUserDetailForm: false,
      userDetailTitle: this.$t('user.addUser'),
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
      dialogAddGroup: false,
      addGroupForm: {
        name: '',
        sync_group_name: '',
        parent_id: -1,
      },
      userRow: null,
      deleteRow: null,
      selectedGroupId: -1,
      selectedGroupName: '',
      isEdit: false,
      groupVal: this.$t('base.plzSelect'),
      groupProps:
      {
        value: 'id',
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf',
        disabled: 'disabled',
      },
      treeData: [],
      rules: {
        name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ]
      },
      // mode=0为新增 1为编辑 3为新增不可编辑
      mode: 0,
      show_sync_group: false,
      selectedItem: null,
      ad_more_member: false,
      enable_sync: true,
      is_loading: false,
      expandedKeys: [],
    }
  },
  methods: {

    OnSyncUsers() {
      this.getADStatus(false)
    },

    startSyncUser() {
      this.is_loading = true
      this.enable_sync = false
      Api.syncAD().then(({ data, code, msg }) => {
        if (code == 0) {
          ElMessage.success({
            message: this.$t('userGroup.startSyncBack')
          })
        } else {
          ElMessage.error(msg)
        }
      })
    },

    loadSubGroup(row, treeNode, resolve) {
      let childrenData = []
      if (row.source === "system") {
        this.getSystemGroupTreeWithId(row.id).then(childrenData => {
          resolve(childrenData)
          console.log('loadSubGroup sys table_data',this.tableData)
        }).catch(() => {
          resolve([]);
        });
        return
      }
      console.log('Loading children ad for:', row, treeNode);
      this.getAdGroupTreeWithId(row.id).then(childrenData => {
        resolve(childrenData);
        console.log('loadSubGroup ad table_data',this.tableData);
      }).catch(() => {
        resolve([]);
      });
    },

    loadGroup(node, resolve) {
      console.log('loadGroup sync node', node)
      if (node.level === 0) {
        console.log('loadGroup sync level0', node.level)
        resolve([
          { name: this.$t('userGroup.groupAD'), id: '-1', isLeaf: false, third_id: 0, disabled: 0, user_count: 0, sync_state: 0, has_child: 1 },
        ]);
      } else if (node.level === 1) {
        console.log('loadGroup sync level1', node.level)
        this.getAdTreeWithId(-1).then(childrenData => {
          console.log('getAdTreeWithId 1 groups', childrenData)
          resolve(childrenData);
        }).catch(() => {
          resolve([]);
        });
      } else {
        console.log('loadGroup sync level2', node.level)
        this.getAdTreeWithId(node.data.id).then(childrenData => {
          console.log('getAdTreeWithId 3 childrenData', childrenData)
          resolve(childrenData);
        }).catch(() => {
          resolve([]);
        });
      }
    },
    addUser(val, row) {
      this.dialogFormVisible = true
      if (val === 1) {
        this.dialogUserDetailForm = false
        this.userDetailTitle = this.$t('user.addUser')
        this.userForm.name = ''
        this.userForm.region = ''
        this.userForm.account = ''
        this.userForm.password = ''
        this.userForm.email = ''
        this.userForm.remark = ''
      } else {
        this.dialogUserDetailForm = true
        this.userDetailTitle = this.$t('user.viewUser')
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
    sureDeleteUser() {
      let params = {}
      params['group_id'] = this.deleteRow.id
      this.dialogDeleteVisible = false
      this.deleteUser(params)
    },

    handleTreeSelect(id) {
      console.log('UserGroup handleTreeSelect', id)
      const selectedItem = this.findNodeById(this.treeData, id);
      this.selectedItem = selectedItem
    },

    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.third_id === id) {
          return node
        }
        if (node.children && node.children.length > 0) {
          const found = this.findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    },

    editGroupBtn(mode, row) {
      // 0新增、1编辑
      console.log('editGroupBtn row', row)
      this.dialogAddGroup = true
      this.selectedGroupId = row.third_id
      this.mode = mode
      if (mode == 1) {
        this.selectedGroupId = row.id
        this.addGroupForm.name = row.name
        console.log('editGroupBtn row',row.id,row.name)
        this.addGroupForm.sync_group_name = ''
      } else {
        this.addGroupForm.name = ''
        this.addGroupForm.sync_group_name = ''
        this.addGroupForm.parent_id = row.id
      }
      if (row.id === -1) {
        this.show_sync_group = false
        return
      }
      this.show_sync_group = true
    },

    deleteGroupDialog(row) {
      this.dialogDeleteVisible = true
      this.deleteRow = row
    },
    editGroupMember(row) {
      this.dialogGroupMember = true
      this.isEdit = true
      this.ad_more_member = false
      this.selectedGroupId = row.id
    },
    moreGroupMember(row) {
      this.selectedGroupId = row.id
      this.selectedGroupName = row.name
      this.dialogGroupMember = true
      this.isEdit = false
      this.ad_more_member = true
    },

    closeGroupMember() {
      this.dialogGroupMember = false
    },

    commitGroupForm() {
      console.log('commitGroupForm mode', this.mode, this.selectedItem)
      if (this.mode == 1) {
        if (this.selectedItem) {
          this.editGroup(this.selectedItem.third_id)
          return
        }
        this.editGroup(0)
        return
      }
      console.log('commitGroupForm selectedItem', this.selectedItem)
      this.addGroup(this.selectedItem ? this.selectedItem.third_id : -1)
    },

    addGroup(third_id) {
      let params = {}
      params['name'] = this.addGroupForm.name
      params['parent_id'] = this.addGroupForm.parent_id
      if (third_id != -1) {
        params['third_id'] = third_id
      }
      console.log('UserGroup updateUserStatus params', params)
      Api.addGroup(params).then(({ data, code, msg }) => {
        if (code == 0) {
          this.dialogAddGroup = false
          ElMessage.success(msg)
          this.getTableData()
        } else {
          ElMessage.error(msg)
        }
      })
    },

    editNodeByID(list,id,name) {
      for (let node of list) {
        if (node.id === id) {
          node.name = name
          console.log('editNodeByID node',node)
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = this.editNodeByID(node.children, id, name)
          if (found) return found
        }
      }
      return null
    },

    editGroup(third_id) {
      let params = {}
      params['name'] = this.addGroupForm.name
      params['group_id'] = this.selectedGroupId
      if (third_id) {
        params['third_id'] = third_id
      }
      console.log('UserGroup updateUserStatus params', params)
      Api.editGroup(params).then(({ data, code, msg }) => {
        if (code == 0) {
          ElMessage.success(msg)
          this.dialogAddGroup = false
          const selectedItem = this.editNodeByID(this.getSystemList(), this.selectedGroupId,this.addGroupForm.name)
          // this.getTableData()
        } else {
          ElMessage.error(msg)
        }
      })
    },

    deleteUser(params) {
      console.log('UserList editUser params', params)
      Api.deleteGroup(params).then(({ data, code, msg }) => {
        if (code == 0) {
          ElMessage.success(msg)
          this.getTableData()
        } else {
          ElMessage.error(msg)
        }
      })
    },

    getADStatus(is_initalize) {
      this.enable_sync = false
      Api.getADSyncStatus().then(({ data, code, msg }) => {
        if (code == 0) {
          console.log('UserGroup getADStatus:', data)
          if (data.sync_time == 0) {
            this.syncTime = this.$t('userGroup.lastSyncTime', { time: '/' })
          } else {
            const time = moment(parseInt(data.sync_time * 1000)).format('YYYY/MM/DD hh:mm:ss')
            this.syncTime = this.$t('userGroup.lastSyncTime', { time })
          }
          console.log('UserGroup getADStatus data:', data)
          if (data.task === undefined || data.task === null) {
            this.enable_sync = true
            this.is_loading = false
            console.log('UserGroup getADStatus data.task:null')
            if (!is_initalize) {
              this.startSyncUser()
            }
            return
          }
          else if (data.task && data.task.complete === 1) {
            this.enable_sync = true
            this.is_loading = false
            console.log('UserGroup getADStatus complete:1')
            if (!is_initalize) {
              this.startSyncUser()
            }
            return
          }
          else if (data.task && data.task.complete === 0) {
            this.enable_sync = false
            this.is_loading = true
            return
            console.log('UserGroup getADStatus complete:0')
            if (!is_initalize) {
              this.startSyncUser()
            }
          } else {
            ElMessage.error(msg)
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
                id: -1,
                date: '2016-05-04',
                name: this.$t('userGroup.groupMy'),
                source: 'system',
                children: groups,
                top_level: true,
              }
              this.tableData.push(res)
              resolve(res)
              return
            }
            this.addSystemChildrenProp(this.getSystemList(), group_id, groups)
            resolve(groups)
          } else {
            ElMessage.error(msg)
            reject(msg)
          }
        })
      })
    },

    getSystemList() {
      let list = []
      if (this.tableData.length === 2) {
        if (this.tableData[0].source === 'system') {
          list = this.tableData[0].children
        } else if (this.tableData[1].source === 'ad') {
          list = []
        }
      }
      return list
    },

    addSystemChildrenProp(list, id, groups) {
      for (let node of list) {
        if (node.id === id) {
          node.children = groups.length > 0? groups:[]
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = this.addSystemChildrenProp(node.children, id, groups)
          if (found) return found
        }
      }
      return null
    },

    getAdTreeWithId(group_id) {
      return new Promise((resolve, reject) => {
        Api.getAdGroupTree({
          "group_id": group_id,
          "page": 1,
        }).then(({ data, code, msg }) => {
          if (code == 0) {
            let groups = data.group.child_groups
            groups.forEach(item => {
              item['source'] = 'ad'
              item['isLeaf'] = item['has_child'] == 1 ? false : true
              item['lable'] = item['name']
              item['children'] = []
            })
            resolve(groups)
            console.log('getAdTreeWithId groups', groups)
          } else {
            ElMessage.error(msg)
            reject(msg)
          }
        })
      })
    },

    getAdGroupTreeWithId(group_id) {
      return new Promise((resolve, reject) => {
        Api.getAdGroupTree({
          "group_id": group_id,
          "page": 1,
        }).then(({ data, code, msg }) => {
          if (code == 0) {
            let groups = data.group.child_groups
            groups.forEach(item => {
              item['source'] = 'AD'
            })
            if (group_id == -1) {
              this.treeData = groups
              const res = {
                id: -100,
                date: '2016-05-04',
                name: this.$t('userGroup.groupAD'),
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
    async getTableData() {
      this.tableData = []
      await this.getSystemGroupTreeWithId(-1)
      this.getAdGroupTreeWithId(-1)
      console.log('UserGroup getTableData this.expandedKeys', this.expandedKeys)
    },

    handleExpandChange(row, expanded) {
      console.log('UserGroup handleExpandChange: row', row.id, expanded);
      // if (row.id == -1 || row.id == -100) {
      //   return
      // }
      if (expanded) {
        if (!this.expandedKeys.includes(row.id)) {
          this.expandedKeys.push(row.id);
        }
      } else {
        const index = this.expandedKeys.indexOf(row.id);
        if (index !== -1) {
          this.expandedKeys.splice(index, 1);
        }
      }
      console.log('UserGroup Updated expandedKeys:', this.expandedKeys);
    },

    getRowKeys(row) {
      return row.id;
    },
  },
  mounted() {
    this.getADStatus(true)
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>
.sub-page-content {
  display: flex;
  align-items: center;
  flex-direction: column;
  height: auto;
  background-color: white;
  padding: 0;
  margin: 0;
  position: relative;
}

.sub-page-content-main {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  margin: 0;
  position: relative;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
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
  align-items: center;
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

.el-table {
  --el-table-header-bg-color: #F9F9F9;
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

.el-table {
  --el-table-tr-bg-color: white;
  padding: 0;
  margin: 0;
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