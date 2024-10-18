<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">终端绑定-伦敦会议室</div>
      </div>
      <el-form-item>
        <el-select
            v-model="areaId"
            style="width: 240px;margin-top: 30px;"
            :empty-values="[null, undefined]"
            @change="getRoomList"
        >
          <el-option
              v-for="item in areaList"
              :key="item.id"
              :label="item.area_name"
              :value="item.id"
          />
        </el-select>
        <!-- <div style="flex: 1"></div> -->
        <el-button style="margin-top: 30px;margin-left: 30px;" type="primary" size="default" @click="pendingAddRoom">{{ $t("base.add") }}</el-button>
      </el-form-item>
      

      <el-dialog v-model="showAddRoomDialog" :title="$t('area.addArea')" width="500">
        <el-form :model="form"
                 :rules="rules"
                 ref="roomForm"
                 label-width="auto">
          <el-form-item prop="name" :label="$t('room.formRoom.name')" label-position="right">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item prop="area" :label="$t('room.formRoom.area')" label-position="right">
            <el-select
                v-model="form.area"
                :empty-values="[null, undefined]"
            >
              <el-option
                  v-for="item in areaListNoAll"
                  :key="item.id"
                  :label="item.area_name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="description" :label="$t('room.formRoom.description')" label-position="right">
            <el-input v-model="form.description" autocomplete="off"/>
          </el-form-item>
          <el-form-item prop="capacity" :label="$t('room.formRoom.capacity')" label-position="right">
            <el-input v-model="form.capacity" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showAddRoomDialog = false">{{ $t('base.cancel') }}</el-button>
            <el-button type="primary" @click="addRoom">
              {{ $t('base.confirm') }}
            </el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog
          v-model="showDeleteRoomDialog"
          title="Tips"
          width="500">
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
import {PageMixin} from "@/pages/PageMixin.js";
import {Api} from "@/network/api.js";
import router from "@/router/index.js";
import {ElMessage} from "element-plus/es";

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
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        area: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
        ],
        capacity: [
          {required: true, message: this.$t('base.noDataHint'), trigger: 'blur'}
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
      Api.getRoomList({area: this.areaId}).then(({data}) => {
        if (data) {
          data.forEach(item => {
            if (item["battery_level"]) {
              item["battery_level"] = item["battery_level"] + "%"
            } else {
              item["battery_level"] = "/"
            }
          })
          console.log('MeetList getRoomList areaId: data',this.areaId,data)
          this.tableData = data
        } else {
          this.tableData = []
        }
      })
    },
    getAreaList() {
      Api.getAreaList({}).then(({data}) => {
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

.el-table {
  --el-table-tr-bg-color: white;
  --el-table-header-bg-color:white;
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
</style>