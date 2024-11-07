<template>
  <Layout :title="$t('terminal.terminalManage')">
    <template #filter>
      <el-input v-model="keyword" style="width: 140px;height: 30px" :placeholder="$t('terminal.plzInputDeviceId')" />
      <el-select class="account-status-select" v-model="statusVal" placeholder="Select" size="default"
        style="width: 140px;min-height: 30px;" @change="onStatusChange">
        <el-option style="height: 30px;" v-for="item in statusOptions" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
      <el-select class="account-status-select" v-model="roomVal" placeholder="Select" size="default"
        style="width: 140px;min-height: 30px;" @change="onRoomChange">
        <el-option style="height: 30px;" v-for="item in roomOptions" :key="item.room_id" :label="item.title"
          :value="item.room_id" />
      </el-select>
      <el-button type="primary" class="el-button-content" :icon="Search" @click="searchUser">
        {{ $t('base.search') }}
      </el-button>
    </template>
    <template #table>
      <el-table class="table-wrapper" style="height: auto;"  :data="terminals" header-cell-class-name="tb-header" max-height="450">
        <el-table-column prop="number" :label="$t('terminal.tableTerminal.id')">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="device_id" :label="$t('terminal.tableTerminal.deviceId')"></el-table-column>
        <el-table-column prop="version" :label="$t('terminal.tableTerminal.version')"></el-table-column>
        <!-- <el-table-column prop="description" :label="$t('terminal.tableTerminal.deviceInfo')"></el-table-column> -->
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
            </div>
            <div v-else>{{ $t('base.none')}}</div>
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

export default {
  computed: {
    Search() {
      return Search
    }
  },
  components: { Layout },
  mixins: [PageMixin],
  data() {
    return {
      keyword: '',
      statusVal: -1,
      accountSwitch: 1,
      statusOptions: [
        {
          value: -1,
          label: this.$t('terminal.bind.all'),
        },
        {
          value: 0,
          label: this.$t('terminal.bind.offline'),
        }, {
          value: 1,
          label: this.$t('terminal.bind.online'),
        }],
      roomVal: '全部',
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
    }
  },
  methods: {

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
        select_rooms.unshift({ title: '全部', room_id: -1, room_name: '全部' })
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
          ElMessage.success('解绑操作成功')
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
          data.devices.forEach(it => {
            it["version"] = !it["version"] ? '无' : it["version"]
            it['description'] = !it['description'] ? '无' : it['description']
            it['status'] = !it['status'] ? '下线' : '上线'
            it['battry_text'] = it['is_charging'] ? `充电中${it['battery_level']}` : it['battery_level']
            it['bind_room'] = it['is_set'] ? '已绑定' : '未绑定'
            it['set_time'] = moment(parseInt(it['set_time'] * 1000)).format('YYYY/MM/DD hh:mm:ss')
          })
          console.log(data.devices)
          this.terminals = data.devices
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
//.sub-page-content {
//  display: flex;
//  // justify-content: center;
//  align-items: center;
//  flex-direction: column;
//  // height: calc(100vh - 95px);
//  height: auto;
//  min-height: calc(100vh - 95px);
//  background-color: white;
//  padding: 0;
//  margin: 0;
//  // margin-top: 20px;
//  position: relative;
//}
//
//.sub-title-wrapper {
//  display: flex;
//  flex-direction: column;
//  justify-content: flex-start;
//  align-items: flex-start;
//  margin-left: 20px;
//}
//
//.page-title {
//  font-family: PingFang SC;
//  font-size: 20px;
//  font-weight: 500;
//  line-height: 28px;
//  letter-spacing: 0px;
//  color: #1D2129;
//  margin-top: 20px;
//  margin-left: 20px;
//}
//
//.filter-wrapper {
//  display: flex;
//  flex-direction: row;
//  justify-content: flex-start;
//  align-items: flex-start;
//  margin-left: 20px;
//  padding: 0 5px;
//}
//
//.el-main {
//  margin: 0;
//}
//
//.tb-header {
//  font-size: 14px !important;
//}
//
//.el-table {
//  --el-table-tr-bg-color: white;
//  padding: 0;
//  margin: 0;
//}
//
//::v-deep .el-input {
//  height: 40px;
//  line-height: 40px;
//}
//
//::v-deep .el-input__inner {
//  height: 40px;
//  line-height: 40px;
//}
//
//.el-button-content {
//  width: 84px;
//  height: 30px;
//  background: #591BB7;
//  font-family: PingFang SC;
//  font-size: 14px;
//  font-weight: normal;
//  line-height: 30px;
//  letter-spacing: 0px;
//  color: #FFFFFF;
//  margin-left: 20px;
//  padding: 4px 0;
//}
//
//.el-button-img {
//  width: 16px;
//  height: 16px;
//  margin-right: 6px;
//  margin-top: 2px;
//}
//
//.tb-op-icon {
//  width: 25px;
//  height: 25px;
//}
//
//.tb-op-icon-span {
//  margin-right: 10px;
//}
//
//.tb-state {
//  width: 18px;
//  height: 18px;
//  border-radius: 20px;
//  background: #08D50A;
//  margin-left: 15px;
//}
//
//.tb-state-disable {
//  background: red;
//}
//
//.table-pagination-block {
//  display: flex;
//  flex-direction: row;
//  justify-content: center;
//  // background-color: rebeccapurple;
//}
//
//.table-demonstration {
//  line-height: 50px;
//  margin-right: 30px;
//}
//
//.dialog-footer {
//  display: flex;
//  flex-direction: row;
//  justify-content: center;
//  align-items: center;
//}
//
//.reset-password {
//  display: flex;
//  flex-direction: row;
//}</style>