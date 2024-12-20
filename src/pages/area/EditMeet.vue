<template>
  <Layout :title="$t('base.roomManagement')">
    <template #filter>
      <el-select v-model="areaId" :empty-values="[null, undefined]" style="max-width: 180px;" @change="getRoomList">
        <el-option v-for="item in areaList" :key="item.id" :label="item.area_name" :value="item.id" />
      </el-select>
      <el-button type="primary" @click="pendingAddRoom">{{ $t("base.add") }}</el-button>
    </template>
    <template #table>
      <el-table class="table-wrapper" style="height: auto"  :data="tableData" header-cell-class-name="tb-header" header-align="center"
        max-height="600">
        <el-table-column fixed prop="room_name" :label="$t('room.tableRoom.name')">
        </el-table-column>
        <el-table-column prop="disabled" :label="$t('room.tableRoom.state')">
          <template #default="scope">
            <el-switch v-model="scope.row.disabled" disabled :active-value="0" :inactive-value="1"
              @change="handleSwitchChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="id" :label="$t('room.tableRoom.id')">
        </el-table-column>
        <el-table-column prop="capacity" :label="$t('room.tableRoom.capacity')">
        </el-table-column>
        <el-table-column prop="id" :label="$t('room.tableRoom.operate')">
          <template #default="scope">
            <div class="operate-wrapper">
              <span class="operate-item" @click="toRoomDetail(scope.row.id)">{{$t('base.edit')}}</span>
              <span class="operate-item" @click="pendingDeleteRoom(scope.row.id)">{{$t('base.delete')}}</span>
              <span class="operate-item" @click="pendingBindTerminal(scope.row)">{{$t('meet.bind_terminal')}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </Layout>
  <el-dialog v-model="showAddRoomDialog" :title="$t('area.addArea')" width="500">
    <el-form :model="form" :rules="rules" ref="form" label-width="auto">
      <el-form-item prop="name" :label="$t('room.formRoom.name')" label-position="right">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item prop="area_id" :label="$t('room.formRoom.area')" label-position="right">
        <el-select v-model="form.area_id" :empty-values="[null, undefined]">
          <el-option v-for="item in areaListNoAll" :key="item.id" :label="item.area_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="description" :label="$t('room.formRoom.description')" label-position="right">
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="capacity" :label="$t('room.formRoom.capacity')" label-position="right">
        <el-input v-model="form.capacity" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="addRoom">
          {{ $t('base.confirm') }}
        </el-button>
        <el-button @click="showAddRoomDialog = false">{{ $t('base.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="showDeleteRoomDialog" title="Tips" width="500">
    <span>{{ $t('room.deleteRoomHint') }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="deleteRoom">
          {{ $t('base.confirm') }}
        </el-button>
        <el-button @click="showDeleteRoomDialog = false">{{ $t('base.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="showTerminalDialog" :title="$t('meet.bind_terminal')" width="550">
    <el-form :model="terminalForm" :rules="terminal_rules">
      <el-form-item :label="$t('meet.terminal')" prop="device_id" required>
        <el-select style="min-width: 120px" v-model="terminalForm.device_id" :placeholder="$t('meet.terminal')">
          <el-option v-for="item in avaliableDevices" style="min-width: 120px;z-index: 99999" :key="item.device_id"
            :label="item.device_name" :value="item.device_id" />
        </el-select></el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button style="margin-left: 50px" type="primary" @click="sureBindTerminal">
          {{$t('base.confirm')}}
        </el-button>
        <el-button @click="showTerminalDialog = false">{{$t('base.cancel')}}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import router from "@/router/index.js";
import { ElMessage } from "element-plus/es";
import Layout from "@/components/Layout.vue";

export default {
  components: { Layout },
  mixins: [PageMixin],
  data() {
    return {
      tableData: [],
      showAddRoomDialog: false,
      showDeleteRoomDialog: false,
      showTerminalDialog: false,
      form: {
        area_id: '',
        area: '',
        name: '',
        description: '',
        capacity: '',
        group_ids: [-1],
      },
      rules: {
        name: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        area_id: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
      },
      terminalForm: {
        terminal: '',
        device_id: '',
      },
      terminal_rules: {
        terminal: [
          { required: true, message: this.$t('meet.select_device'), trigger: 'blur' }
        ],
      },
      select_terminal: this.$t('base.plzSelect'),
      select_row: null,
      avaliableDevices: [],
      areaList: [],
      areaListNoAll: [],
      areaId: '',
      pendingDeleteId: null
    }
  },
  methods: {
    toRoomDetail(id) {
      this.push(`/room_detail/${id}`)
    },
    pendingDeleteRoom(id) {
      this.showDeleteRoomDialog = true
      this.pendingDeleteId = id
    },
    deleteRoom() {
      this.showDeleteRoomDialog = false
      Api.deleteRoom({ room: Number(this.pendingDeleteId) }).then(({ data, code, msg }) => {
        if (code == 0) {
          this.getRoomList()
        } else {
          ElMessage.error(msg)
        }

      })
    },
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
    getAvaliableDevices() {
      Api.getAvailableDevices().then(({ data, code, msg }) => {
        if (code == 0 && data) {
          this.avaliableDevices = data
        }
      })
    },
    pendingAddRoom() {
      this.showAddRoomDialog = true
      this.form = {
        area: '',
        name: '',
        description: '',
        capacity: '',
      }
    },
    pendingBindTerminal(row) {
      console.log('pendingBindTerminal row', row)
      this.showTerminalDialog = true
      this.select_row = row
    },
    sureBindTerminal() {
      Api.bindDevice({ device_id: this.terminalForm.device_id, room_id: this.select_row.id }).then(({ data, code, msg }) => {
        if (code == 0) {
          this.showTerminalDialog = false
          this.getRoomList()
        } else {
          ElMessage.error(msg)
        }
      })
    },
    addRoom() {
      this.$refs.form.validate((pass) => {
        if (!pass) {
          return
        }
        this.showAddRoomDialog = false
        this.form.area = this.form.area_id
        Api.addRoom(this.form).then(({ data, code, msg }) => {
          if (code == 0) {
            this.getRoomList()
          } else {
            ElMessage.error(msg)
          }
        })
      })
    }
  },
  mounted() {
    this.setTab('/room')
    this.getRoomList()
    this.getAreaList()
    this.getAvaliableDevices()

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