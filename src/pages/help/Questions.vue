<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">常见问题</div>
      </div>


      <div class="some-questions">

        <template v-for="(item,index) in questionList">
          {{item.title}}<br>
             {{item.reply}}
        <br>
        <br>
        </template>
        <!-- 1、会议室预约会议问题？<br>
             请参考区域&会议室管理下的添加会议室信息，检查是否操作用户是否正确绑定了预约会议室的权限。
        <br>
        <br>
        2、企业对接问题？<br>
             首次使用，按照引导操作一步步设置，设置号企业需要配置的服务地址等必要的信息。如果还有疑问请详细阅读操作手册说明。
        <br>
        <br>
        3、会议室预约会议问题？<br>
             请参考区域&会议室管理下的添加会议室信息，检查是否操作用户是否正确绑定了预约会议室的权限。
        <br>
        <br>
        4、企业对接问题？<br>
             首次使用，按照引导操作一步步设置，设置号企业需要配置的服务地址等必要的信息。如果还有疑问请详细阅读操作手册说明。 -->
      </div>




      <el-dialog v-model="showDeleteRoomDialog" title="Tips" width="500">
        <span>{{ $t('room.deleteRoomHint') }}</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showDeleteRoomDialog = false">{{ $t('base.cancel') }}</el-button>
            <el-button type="primary" @click="deleteRoom">
              {{ $t('base.confirm') }}
            </el-button>
          </div>
        </template>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import router from "@/router/index.js";
import { ElMessage } from "element-plus/es";

export default {
  mixins: [PageMixin],
  data() {
    return {
      tableData: [],
      showAddRoomDialog: false,
      showDeleteRoomDialog: false,
      form: {
        area: '',
        name: '',
        description: '',
        capacity: '',
        // room_admin_email: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        area: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
      },
      areaList: [],
      areaListNoAll: [],
      areaId: '',
      pendingDeleteId: null,
      questionList:[
        {title: '1、误关闭了引导页怎么办？',reply: '答：您也可以在系统设置中去配置用户和日历同步'},
        {title: '2、首页展示为什么不一样？',reply: '答：权限不同首页展示的功能模块也不同，请先使用管理员账号在用户管理查看当前用户的权限配置'},
        {title: '3、为什么账号突然无法登陆了？',reply: '答：查看登录时的提示是禁用了还是密码错误，并根据情况使用管理员账号在“用户管理”处理'},
        {title: '4、为什么无法创建用户账号？',reply: '答：请先确认输入的用户名称以及账号是否符合规则，以及系统内是否已有相同名称的账号或用户名'},
        {title: '5、删除用户会对系统组织有影响吗？',reply: '答：不会，删除用户只会删除本会议系统的账户，不会影响到本身的AD系统组织，但会无法登录和预定等操作'},
        {title: '6、误删除了用户怎么办？',reply: '答：先确认用户是AD导入还是系统内创建的用户，如果是ad导入的您可以在系统设置里的用户同步手动同步一次或等下次自动同步，如果是系统创建的则需要手动再次创建'},
        {title: '7、为什么会议室不可以预定？',reply: '答：请先使用管理员账号在区域&会议室管理界面查看当前区域或会议室的状态是否正常'},
        {title: '8、为什么会议室状态正常也无法预定？',reply: '答：如果确定会议室状态正常，您可以确认下当前会议室所属区域的状态是否正常，以及您是否存在预定当前会议室的权限'},
        {title: '9、为什么我有当前区域的权限却无法创建区域下的会议室？',reply: '答：当区域下的会议室没有做具体组的权限时，您可以创建该区域下所有的会议室，但是如果会议室创建时配置了组的权限那么已会议室配置优先'},
        {title: '10、创建的循环会议为什么自动停了？',reply: '答：确认下循环会议的结束时间，因为循环日期也需要配置个结束时间，所以在创建时需要确认好会议的结束日期'},
        {title: '11、为什么终端绑定显示的设备不全？',reply: '答：绑定终端只会显示已经激活且处于空闲中的设备，且一个会议室可以绑定多个终端，但一个终端无法绑定多个会议室'},
        {title: '12、怎么把终端和会议室解除绑定？',reply: '答：如果您只是在平板端切换会议室，您可在平板端设置中切换，如果是解绑可以在“终端设备管理”界面解绑，但是注意解绑后平板端会立马处理原始待激活状态'},
        {title: '13、在全局会议规则设置里关闭了会议信息展示为什么还会显示？',reply: '答：这里的展示开关为创建会议室时的默认状态开关，实际会议信息开关需要到会议室编辑里改动'},
        {title: '14、未找到需要的查询问题？',reply: '答：您可以先查看下“用户操作手册”，如果还未解决您的问题可在“问题反馈”中提交您的问题'},
      ]
    }
  },
  methods: {
    getRoomList() {
      Api.getRoomList({ area: this.areaId }).then(({ data }) => {
        if (data) {
          data.forEach(item => {
            if (item["battery_level"]) {
              item["battery_level"] = item["battery_level"] + "%"
            } else {
              item["battery_level"] = "/"
            }
          })
          console.log('MeetList getRoomList areaId: data', this.areaId, data)
          this.tableData = data
        } else {
          this.tableData = []
        }
      })
    },
    getAreaList() {
      Api.getAreaList({}).then(({ data }) => {
        if (data) {
          this.areaListNoAll = JSON.parse(JSON.stringify(data))
          data.unshift({
            id: '',
            area_name: this.$t("area.allArea")
          })
          this.areaList = data
        }
      })
    },
  },
  mounted() {
    this.setTab('/room')
    this.getRoomList()
    this.getAreaList()

  }
}
</script>



<style lang="scss" scoped>
.container-sub-page-main {
  background-color: white;
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.some-questions {
  margin-top: 61px;
  margin-left: 100px;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #4E5969;
}
</style>