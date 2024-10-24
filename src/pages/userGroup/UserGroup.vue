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
            :tree-props="{ children: 'children', hasChildren: 'has_child' }" :load="loadSubGroup" max-height="550">
            <el-table-column prop="group" label="用户组/用户" label-width="400px">
              <template #default="scope">
                <!-- <div class="group-title-wrapper"> -->
                <span class="group-title" :style="{ 'font-weight': scope.row.children ? 'bold' : 'normal' }">{{
                  scope.row.name }}</span>
                <template v-if="scope.row.source !== 'system'">
                <span class="group-more" @click="moreGroupMember(scope.row)">查看更多</span>
                </template>
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
                    <span class="group-btn" @click="editGroupBtn(1, scope.row)">组编辑</span>
                    <span class="group-btn" @click="editGroupBtn(0, scope.row)">新增组</span>
                    <span class="group-btn" @click="deleteGroupDialog(scope.row)">删除</span>
                  </template>
                  <template v-else>
                    <span class="group-btn" @click="editGroupBtn(1, scope.row)">组编辑</span>
                    <!-- <span class="group-btn" @click="editGroupBtn(0, scope.row)">新增组</span> -->
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
          :is-edit="isEdit" :ad-more="ad_more_member" @close="dialogGroupMember = false" />
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
          <el-form :model="addGroupForm" :rules="rules">
            <div class="request-wrapper">
              <el-form-item label="用户组名称" label-width="140px" required>
                <el-input v-model="addGroupForm.name" autocomplete="off" />
              </el-form-item>
            </div>
            <el-form-item label="同步用户组" label-width="140px" style="margin-right: 50px;">
              <el-tree-select lazy v-model="addGroupForm.sync_group_name" :load="loadGroup" :props="groupProps" :disabled="mode"  @change="handleTreeSelect"/>
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
      dialogAddGroup: false,
      addGroupForm: {
        name: '',
        sync_group_name: '',
      },
      userRow: null,
      deleteRow: null,
      selectedGroupId: -1,
      selectedGroupName: '',
      isEdit: false,
      groupVal: '请选择',
      groupProps:
      {
        value: 'id',
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf',
        disabled: 'disabled',
      },
      treeData:[],
      rules: {
        name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ]
      },
      // mode=0为新增 1为编辑
      mode:0,
      selectedItem: null,
      ad_more_member: false,
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
      console.log('loadGroup sync node', node)
      if (node.level === 0) {
        console.log('loadGroup sync level0', node.level)
        resolve([
          { name: 'AD组', id: '-1', isLeaf: false, third_id: 0, disabled: 0, user_count: 0, sync_state: 0, has_child: 1 },
        ]);
      } else if (node.level === 1) {
        console.log('loadGroup sync level1', node.level)
        this.getAdTreeWithId(-1).then(childrenData => {
          console.log('getAdTreeWithId 1 groups',childrenData)
          // this.treeData = childrenData
          resolve(childrenData);
        }).catch(() => {
          resolve([]);
        });
      } else {
        console.log('loadGroup sync level2', node.level)
        this.getAdTreeWithId(node.data.id).then(childrenData => {
          console.log('getAdTreeWithId 3 childrenData',childrenData)
          resolve(childrenData);
        }).catch(() => {
          resolve([]);
        });
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
    sureDeleteUser() {
      let params = {}
      params['group_id'] = this.deleteRow.id
      this.dialogDeleteVisible = false
      this.deleteUser(params)
    },

    handleTreeSelect(id) {
      console.log('UserGroup handleTreeSelect',id)
      const selectedItem = this.findNodeById(this.treeData, id);
      console.log('选中的 item 数据:', selectedItem);
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
      console.log('editGroupBtn row',row)
      this.dialogAddGroup = true
      this.selectedGroupId = row.third_id
      this.mode = mode
      if (mode == 1) {
        this.selectedGroupId = row.id
        this.addGroupForm.name = row.name
        const selectedItem = this.findNodeById(this.treeData, row.third_id);
        console.log('editGroupBtn selectedItem',selectedItem,this.treeData)
        this.addGroupForm.sync_group_name = selectedItem.name
        this.selectedItem = selectedItem
      } else {
        this.addGroupForm.name = ''
        this.addGroupForm.sync_group_name = ''
      }
    },

    deleteGroupDialog(row) {
      this.dialogDeleteVisible = true
      this.deleteRow = row
    },
    editGroupMember(row) {
      this.dialogGroupMember = true
      this.isEdit = true
      this.selectedGroupId = row.id
    },
    moreGroupMember(row) {
      console.log(430)
      this.selectedGroupId = row.id
      this.selectedGroupName = row.name
      this.dialogGroupMember = true
      this.isEdit = false
      this.ad_more_member = true
      console.log(435)
    },

    closeGroupMember() {
      this.dialogGroupMember = false
    },

    commitGroupForm() {
      console.log('commitGroupForm mode',this.mode)
      if (this.mode == 1) {
        this.editGroup(this.selectedItem.third_id)
        return
      }
      this.addGroup(this.selectedItem.third_id)
    },

    addGroup(third_id) {
      let params = {}
      params['name'] = this.addGroupForm.name
      params['parent_id'] = -1
      params['third_id'] = third_id
      console.log('UserGroup updateUserStatus params', params)
      Api.addGroup(params ).then(({ data, code, msg }) => {
        if (code == 0) {
          this.dialogAddGroup = false
          this.getTableData()
        } else {
          ElMessage.error(msg)
        }
      })
    },

    editGroup(third_id) {
      let params = {}
      params['name'] = this.addGroupForm.name
      params['group_id'] = this.selectedGroupId
      params['third_id'] = third_id
      console.log('UserGroup updateUserStatus params', params)
      Api.editGroup(params ).then(({ data, code, msg }) => {
        if (code == 0) {
          this.dialogAddGroup = false
          this.getTableData()
        } else {
          ElMessage.error(msg)
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
                id: -1,
                date: '2016-05-04',
                name: '我的分组',
                source: 'system',
                children: groups,
                top_level: true,
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
              item['isLeaf'] = item['has_child'] == 1?false:true
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
          // "search": ""
        }).then(({ data, code, msg }) => {
          if (code == 0) {
            let groups = data.group.child_groups
            groups.forEach(item => {
              item['source'] = 'AD'
            })
            if (group_id == -1) {
              this.treeData = groups
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
  margin-left: 90px;
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