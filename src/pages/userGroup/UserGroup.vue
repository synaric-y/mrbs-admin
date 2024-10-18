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
            <span class="async-last-time">上次同步时间：2024年9月9日 10:00</span>
          </div>
        </div>

        <div class="table-wrapper" style="height: auto;">
          <el-table :data="tableData" style="width: 100%;height: auto; margin-bottom: 20px;" row-key="id"
            default-expand-all>
            <el-table-column prop="group" label="用户组/用户" label-width="400px">
              <template #default="scope">
                <!-- <div class="group-title-wrapper"> -->
                <span class="group-title" :style="{ 'font-weight': scope.row.istop ? 'bold' : 'normal' }">{{
                  scope.row.group }}</span>
                <!-- <template v-if="scope.row.isself"> -->
                <span class="group-more" @click="moreGroupMember(scope.row)">查看更多</span>
                <!-- </template> -->
                <!-- </div> -->
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" label-width="200px" />
            <el-table-column prop="name" label="操作" label-width="400px">
              <template #default="scope">
                <div v-if="scope.row.btns.length != 0">
                  <!-- <span class="group-btn" v-for="(item,func) in scope.row.btns" @click="func">{{ item }}</span> -->
                  <template v-if="scope.row.istop">
                    <span class="group-btn" @click="editGroup(1, scope.row)">组编辑</span>
                    <span class="group-btn" @click="editGroup(0, scope.row)">新增组</span>
                    <span class="group-btn" @click="deleteGroup(scope.row)">删除</span>
                  </template>
                  <template v-else>
                    <span class="group-btn" @click="editGroup(1, scope.row)">组编辑</span>
                    <span class="group-btn" @click="editGroup(0, scope.row)">新增组</span>
                    <span class="group-btn" @click="editGroupMember(scope.row)">组成员编辑</span>
                    <span class="group-btn" @click="deleteGroup(scope.row)">删除</span>
                  </template>

                </div>
                <div v-else>
                  <span class="default-group-btn">无</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-dialog v-model="dialogGroupMember" title="查看组成员" width="650">
          <el-form :model="groupMemberForm">
            <div class="search-wrapper" style="margin-top: 20px;height: 30px;">
              <el-input v-model="groupMemberForm.keyword" style="width: 140px" placeholder="请输入用户名称" />
              <el-select class="account-status-select" v-model="sourceVal" placeholder="来源"
                style="width: 140px;margin-left: 25px;max-height: 30px;">
                <el-option style="height: 30px;" v-for="item in sourceOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
              <el-button size="large" class="el-button-content" @click="searchUser">
                <img src="/imgs/button_search.png" alt="Search Icon" class="el-button-img" />
                搜索
              </el-button>
            </div>
          </el-form>
          <div class="group-member-wrapper">
            <el-table :data="groupMembers" max-height="250" style="width: 100%;height: auto; margin-bottom: 20px;"
              row-key="id" default-expand-all>
              <template v-if="dialogEditGroup">
                <el-table-column prop="id" label="序号" label-width="40px" />
                <el-table-column prop="group" label="组名" label-width="80px" />
                <el-table-column prop="name" label="用户名" label-width="200px" />
                <el-table-column prop="source" label="来源" label-width="80px" />
                <el-table-column prop="status" label="操作" label-width="80px">
                  <template #default="scope">
                    <el-switch v-model="scope.row.status"
                      style="--el-switch-on-color: #591BB7; --el-switch-off-color: #A8ABB2" active-value="100"
                      inactive-value="0" @change="handleSwitchChange(scope.row)" />
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="dialogGroupMember">
                <el-table-column prop="id" label="序号" label-width="100px" />
                <el-table-column prop="group" label="组名" label-width="120px" />
                <el-table-column prop="name" label="用户名" label-width="120px" />
                <el-table-column prop="source" label="来源" label-width="100px" />
              </template>
            </el-table>
            <div class="table-pagination-block">
              <div class="table-demonstration">共200条</div>
              <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="200" />
            </div>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="closeGroupMember">关闭</el-button>
            </div>
          </template>
        </el-dialog>

        <el-dialog v-model="dialogDeleteVisible" title="删除用户" width="550">
          <div class="">
            是否删除当前选中的用户/用户组？
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button style="margin-left: 50px" type="primary" @click="deleteUser">
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
              <el-cascader :options="groupOptions" props="false" clearable />
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
export default {
  mixins: [PageMixin],
  data() {
    return {
      tableData: [
        {
          id: 1,
          date: '2016-05-02',
          name: 'wangxiaohu',
          group: '我的分组',
          source: '系统创建',
          istop: true,
          isself: true,
          btns: ['组编辑', '新增组', '删除'],
          children: [
            {
              id: 31,
              date: '2016-05-01',
              name: 'wangxiaohu',
              group: 'IT组(总数1人)',
              source: '系统创建',
              isself: true,
              istop: false,
              btns: ['组编辑', '新增组', '删除', '组成员编辑'],
            },
            {
              id: 32,
              date: '2016-05-04',
              name: 'wangxiaohu',
              group: 'EN组(总数5人)',
              source: '系统创建',
              isself: true,
              istop: false,
              btns: ['组编辑', '新增组', '删除', '组成员编辑'],
            },
            {
              id: 33,
              date: '2016-05-01',
              name: 'wangxiaohu',
              group: '行政组(总数1人)',
              source: '系统创建',
              isself: true,
              istop: false,
              btns: ['组编辑', '新增组', '删除', '组成员编辑'],
            }
          ]
        },
        {
          id: 2,
          date: '2016-05-04',
          name: 'wangxiaohu',
          group: 'AD组',
          source: 'AD',
          istop: true,
          isself: false,
          btns: [],
          children: [
            {
              id: 61,
              date: '2016-05-01',
              name: 'wangxiaohu',
              group: 'IT组(总数1人)',
              source: 'AD',
              istop: false,
              isself: false,
              btns: [],
            },
            {
              id: 62,
              date: '2016-05-02',
              name: 'wangxiaohu',
              group: 'EN组(总数5人)',
              source: 'AD',
              istop: false,
              isself: false,
              btns: [],
            },
            {
              id: 63,
              date: '2016-05-03',
              name: 'wangxiaohu',
              group: 'Sales组(总数5人)',
              source: 'AD',
              istop: false,
              isself: false,
              btns: [],
            },
          ],
        },
        {
          id: 3,
          date: '2016-05-04',
          name: 'wangxiaohu',
          group: 'AD组新',
          source: 'AD',
          istop: true,
          isself: false,
          btns: [],
          children: [
            {
              id: 61,
              date: '2016-05-01',
              name: 'wangxiaohu',
              group: 'IT组(总数1人)',
              source: 'AD',
              istop: false,
              isself: false,
              btns: [],
            },
            {
              id: 62,
              date: '2016-05-02',
              name: 'wangxiaohu',
              group: 'EN组(总数5人)',
              source: 'AD',
              istop: false,
              isself: false,
              btns: [],
            },
            {
              id: 63,
              date: '2016-05-03',
              name: 'wangxiaohu',
              group: 'Sales组(总数5人)',
              source: 'AD',
              istop: false,
              isself: false,
              btns: [],
            },
          ],
        },

      ],

      groupMembers: [
        {
          id: 1,
          group: 'EN组',
          name: '王xx（职位）',
          source: '系统创建',
          status: false,
        },
        {
          id: 2,
          group: 'EN组',
          name: '王xx（职位）',
          source: '系统创建',
          status: true,
        },
        {
          id: 3,
          group: 'IT组',
          name: '张xx（职位）',
          source: '系统创建',
          status: true,
        },
        {
          id: 4,
          group: 'IT组',
          name: '李xx（职位）',
          source: '系统创建',
          status: false,
        }, {
          id: 5,
          group: 'EN组',
          name: '王xx（职位）',
          source: '系统创建',
          status: true,
        },
        {
          id: 6,
          group: 'EN组',
          name: '王xx（职位）',
          source: '系统创建',
          status: false,
        },
        {
          id: 7,
          group: 'IT组',
          name: '张xx（职位）',
          source: '系统创建',
          status: true,
        },
        {
          id: 8,
          group: 'IT组',
          name: '李xx（职位）',
          source: '系统创建',
          status: true,
        }, {
          id: 9,
          group: 'EN组',
          name: '王xx（职位）',
          source: '系统创建',
          status: false,
        },
        {
          id: 10,
          group: 'EN组',
          name: '王xx（职位）',
          source: '系统创建',
          status: true,
        },
        {
          id: 11,
          group: 'IT组',
          name: '张xx（职位）',
          source: '系统创建',
          status: false,
        },
        {
          id: 12,
          group: 'IT组',
          name: '李xx（职位）',
          source: '系统创建',
          status: true,
        }
      ],
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
      groupOptions: [
        {
          value: 1,
          label: 'Asia',
          children: [
            {
              value: 2,
              label: 'China',
              children: [
                { value: 3, label: 'Beijing' },
                { value: 4, label: 'Shanghai' },
                { value: 5, label: 'Hangzhou' },
              ],
            },
            {
              value: 6,
              label: 'Japan',
              children: [
                { value: 7, label: 'Tokyo' },
                { value: 8, label: 'Osaka' },
                { value: 9, label: 'Kyoto' },
              ],
            },
            {
              value: 10,
              label: 'Korea',
              children: [
                { value: 11, label: 'Seoul' },
                { value: 12, label: 'Busan' },
                { value: 13, label: 'Taegu' },
              ],
            },
          ],
        },
        {
          value: 14,
          label: 'Europe',
          children: [
            {
              value: 15,
              label: 'France',
              children: [
                { value: 16, label: 'Paris' },
                { value: 17, label: 'Marseille' },
                { value: 18, label: 'Lyon' },
              ],
            },
            {
              value: 19,
              label: 'UK',
              children: [
                { value: 20, label: 'London' },
                { value: 21, label: 'Birmingham' },
                { value: 22, label: 'Manchester' },
              ],
            },
          ],
        },
        {
          value: 23,
          label: 'North America',
          children: [
            {
              value: 24,
              label: 'US',
              children: [
                { value: 25, label: 'New York' },
                { value: 26, label: 'Los Angeles' },
                { value: 27, label: 'Washington' },
              ],
            },
            {
              value: 28,
              label: 'Canada',
              children: [
                { value: 29, label: 'Toronto' },
                { value: 30, label: 'Montreal' },
                { value: 31, label: 'Ottawa' },
              ],
            },
          ],
        },
      ],

      userRow: null,
      deleteRow: null
    }
  },
  methods: {
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

    editGroup(mode, row) {
      // 0新增、1编辑
      this.dialogAddGroup = true

    },

    deleteGroup(row) {
      this.dialogDeleteVisible = true
    },
    editGroupMember(row) {
      this.dialogEditGroup = true
      this.dialogGroupMember = true
    },
    moreGroupMember(row) {
      this.dialogEditGroup = false
      this.dialogGroupMember = true
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
      const selectedItem = this.sourceOptions.filter(item => item.value === this.sourceVal)
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
  margin-left: -130px;
  margin-top: 50px;
  padding: 0;
  width: 1200px;
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