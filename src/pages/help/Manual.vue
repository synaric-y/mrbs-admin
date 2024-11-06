<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">操作手册下载</div>
      </div>
      <div class="manual-wrapper">
        <div class="manual-pdf">
          <!-- <div class="preview-pdf-placeholder"></div> -->
          <iframe  class="preview-pdf-name"
          src='https://meeting-manage-test.businessconnectchina.com:12443/mrbs_help_cn.pdf'
          width='100%' height='100%' frameborder='1'>
          操作手册</iframe>
          <!-- <div class="preview-pdf-name">操作手册</div> -->
        </div>
        <!-- <div class="preview-pdf">在线浏览</div> -->
        <!-- <div class="download-pdf">PDF下载</div> -->
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

.manual-wrapper {
  display: flex;
  flex-direction: row;
  position: relative;
}

.manual-pdf {
  display: flex;
  flex-direction: column;
  margin-top: 61px;
  margin-left: 57px;
}

.preview-pdf-placeholder {
  width: auto;
  height: 100%;
  background-color: #D8D8D8;
}

.preview-pdf-name {
  margin-top: 22px;
  min-width: 1000px;
  height: 800px;
  text-align: center;
}

.preview-pdf {
  position: absolute;
  bottom: 36px;
  left: 250px;
  border-radius: 2px;
  opacity: 1;
  background: #591BB7;
  height: 36px;
  line-height: 36px;
  width: 96px;
  text-align: center;
  color: white;
}

.download-pdf {
  position: absolute;
  bottom: 36px;
  left: 380px;
  border-radius: 2px;
  opacity: 1;
  background: #591BB7;
  height: 36px;
  line-height: 36px;
  width: 96px;
  text-align: center;
  color: white;
}
</style>