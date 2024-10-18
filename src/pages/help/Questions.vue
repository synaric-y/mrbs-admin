<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">常见问题</div>
      </div>


      <div class="some-questions">
        1、会议室预约会议问题？<br>
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
             首次使用，按照引导操作一步步设置，设置号企业需要配置的服务地址等必要的信息。如果还有疑问请详细阅读操作手册说明。
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
      pendingDeleteId: null
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