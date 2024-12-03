<template>
  <Layout :title="$t('terminal.terminalManage')">
    <template #filter>
      <el-input v-model="keyword" style="width: 140px;height: 30px" :placeholder="$t('terminal.plzInputDeviceId')" />
      <el-select class="account-status-select" v-model="statusVal" :placeholder="$t('base.plzSelect')" size="default"
        style="width: 140px;min-height: 30px;" @change="onStatusChange">
        <el-option style="height: 30px;" v-for="item in statusOptions" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
      <el-select class="account-status-select" v-model="roomVal" :placeholder="$t('base.plzSelect')" size="default"
        style="width: 140px;min-height: 30px;" @change="onRoomChange">
        <el-option style="height: 30px;" v-for="item in roomOptions" :key="item.room_id" :label="item.title"
          :value="item.room_id" />
      </el-select>
      <el-button type="primary" class="el-button-content" :icon="Search" @click="searchUser">
        {{ $t('base.search') }}
      </el-button>
    </template>
    <template #table>
      <el-table class="table-wrapper" style="height: auto;" :data="terminals" header-cell-class-name="tb-header"
        max-height="450">
        <el-table-column prop="number" :label="$t('terminal.tableTerminal.id')">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="device_id" :label="$t('terminal.tableTerminal.deviceId')"></el-table-column>
        <el-table-column prop="version" :label="$t('terminal.tableTerminal.version')"></el-table-column>
        <el-table-column prop="resolution" :label="$t('terminal.tableTerminal.resolution')"></el-table-column>
        <el-table-column prop="battry_text" :label="$t('terminal.tableTerminal.battery')"></el-table-column>
        <el-table-column prop="status" :label="$t('terminal.tableTerminal.status')"></el-table-column>
        <el-table-column prop="bind_room" :label="$t('terminal.tableTerminal.bindStatus')"></el-table-column>
        <el-table-column prop="room_name" :label="$t('terminal.tableTerminal.room')"></el-table-column>
        <el-table-column prop="set_time" :label="$t('terminal.tableTerminal.setTime')"></el-table-column>
        <el-table-column prop="id" :label="$t('user.tableUser.operate')">
          <template #default="scope">
            <div class="operate-wrapper" v-if="scope.row.is_set == 1">
              <span class="operate-item" @click="unbindDeviceDialog(scope.row)">{{ $t('base.unbind') }}</span>
              <span v-if="scope.row.is_set != 1" class="operate-item" @click="bindDeviceDialog(scope.row)">{{ $t('meet.bind_terminal') }}</span>
            </div>
            <div v-else>{{ $t('base.none') }}</div>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #pagination>
      <el-text>{{ $t('base.tableBottomCount', total_num) }}</el-text>
      <el-pagination v-model:current-page="page_number" @current-change="handleCurrentChange" layout="prev, pager, next"
        :default-page-size="20" :total="total_num" />
    </template>
  </Layout>
  <BindTerminal v-if="is_bind_terminal" :room_id="bind_room_id" @close="closeBindTerminal" />
  <el-dialog v-model="dialogUnbindVisible" :title="$t('terminal.unbindDevice')" width="550">
    <div class="">
      {{ $t('terminal.confirmUnbindHint') }}
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button style="margin-left: 50px" type="primary" @click="unbindDevice">
          {{ $t('base.confirm') }}
        </el-button>
        <el-button @click="dialogUnbindVisible = false">{{ $t('base.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import { ElMessage } from "element-plus/es";
import { Common } from "@/common/common";
import Layout from "@/components/Layout.vue";
import { Search } from '@element-plus/icons-vue'
import moment from "moment";
import BindTerminal from "@/components/BindTerminal.vue";

export default {
  computed: {
    Search() {
      return Search
    }
  },
  components: { Layout, BindTerminal },
  mixins: [PageMixin],
  data() {
    return {
      keyword: '',
      statusVal: -1,
      accountSwitch: 1,
      statusOptions: [
        {
          value: -1,
          label: this.$t('base.all'),
        },
        {
          value: 0,
          label: this.$t('terminal.bind.offline'),
        }, {
          value: 1,
          label: this.$t('terminal.bind.online'),
        }],
      roomVal: this.$t('base.all'),
      roomOptions: [],
      pendingDeleteName: null,
      page_number: 1,
      dialogUnbindVisible: false,
      selectRow: null,
      terminals: [],
      total_num: 0,
      select_status_id: -1,
      select_room_id: -1,
      page_cache_areas: [],
      is_bind_terminal: false,
      bind_room_id: -1,
    }
  },
  methods: {
    bindDeviceDialog(row) {
      console.log('bindDeviceDialog row:', row);
      this.bind_room_id = row.id
      this.is_bind_terminal = true
    },
    closeBindTerminal() {
      this.is_bind_terminal = false
    },
    onStatusChange(e) {
      console.log('TerminalManager onStatusChange e', e)
      this.select_status_id = e
    },
    onRoomChange(e) {
      console.log('TerminalManager onRoomChange e', e)
      this.select_room_id = e
    },

    getAllAreas() {
      if (this.page_cache_areas.length > 0) {
        console.log('TerminalManager getAllAreas page_cache_areas', this.page_cache_areas)
        return
      }
      Api.getAreaRooms().then(({ data, code, msg }) => {
        if (code != 0) {
          ElMessage({
            message: this.$t('base.getAreaError'),
            type: 'error'
          })
          return
        }
        console.log('TerminalManager getAllAreas data', data.areas)
        this.page_cache_areas = data.areas
        const select_rooms = []
        this.page_cache_areas.forEach(area => {
          area.rooms.forEach(room => {
            select_rooms.push({
              area_id: area.area_id,
              area_name: area.area_name,
              room_id: room.room_id,
              room_name: room.room_name,
              title: `${area.area_name}-${room.room_name}`,
              disabled: room.disabled,
            });
          });
        });
        select_rooms.unshift({ title: this.$t('base.all'), room_id: -1, room_name: this.$t('base.all') })
        this.roomOptions = select_rooms
      })
    },

    unbindDeviceDialog(row) {
      this.dialogUnbindVisible = true
      this.selectRow = row
    },

    unbindDevice() {
      Api.unbindDevice({ device_id: this.selectRow.device_id }).then(({ data, code, msg }) => {
        if (code == 0) {
          this.dialogUnbindVisible = false
          ElMessage.success(msg)
          this.getTerminalList()
        } else {
          ElMessage.error(msg)
        }
      })
    },

    searchUser() {
      this.getTerminalList()
    },
    handleCurrentChange(newPage) {
      console.log('TerminalManager handleCurrentChange newPage:', newPage, this.page_number)
      this.page_number = newPage
    },

    getTerminalList() {
      let params = {}
      if (this.keyword) {
        params['device_id'] = this.keyword
      }
      params['pagenum'] = this.page_number
      params['pagesize'] = 20
      console.log('TerminalManager getTerminalList select_status_id', this.select_status_id)
      if (this.select_status_id != -1) {
        params['status'] = this.select_status_id
      }
      if (this.select_room_id != -1) {
        params['room_id'] = this.select_room_id
      }
      console.log('TerminalManager getTerminalList params', params)
      Api.getTerminalList(params).then(({ data, code, msg }) => {
        if (code == 0) {
          if (data && data.devices) {
            data.devices.forEach(it => {
              it["version"] = !it["version"] ? this.$t('base.none') : it["version"]
              it['description'] = !it['description'] ? this.$t('base.none') : it['description']
              it['status'] = !it['status'] ? this.$t('terminal.bind.offline') : this.$t('terminal.bind.online')
              it['battry_text'] = it['is_charging'] ? `${this.$t('terminal.bind.charging')} ${it['battery_level']}%` : `${it['battery_level']}%`
              it['bind_room'] = it['is_set'] ? this.$t('terminal.bind.binded') : this.$t('terminal.bind.unbind')
              it['set_time'] = moment.tz(it['set_time'] * 1000, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
            })
            console.log(data.devices)
            this.terminals = data.devices
          } else {
            this.terminals = []
          }
          this.total_num = data.total_num
        }
      })
    },
  },
  mounted() {
    this.getTerminalList()
    this.getAllAreas()
  }
}
</script>

<style lang="scss" scoped>
</style>