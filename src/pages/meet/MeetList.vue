<template>
  <Layout :title="$t('meet.meet_title')">
    <template #filter>
      <el-input v-model="keyword" style="width: 140px;height: 32px;" :placeholder="$t('meet.search_create_by')" />
      <el-select class="account-status-select" v-model="statusVal" :placeholder="$t('base.plzSelect')" size="default"
        style="width: 140px;min-height: 30px;">
        <el-option style="height: 30px;" v-for="item in statusOptions" :key="item.value" :label="item.label"
          :value="item.value" />
      </el-select>
      <el-select class="account-status-select" v-model="areaStatusVal" :placeholder="$t('base.plzSelect')" size="default"
        style="width: 140px;min-height: 30px;" @change="onAreaChange">
        <el-option style="height: 30px;" v-for="item in page_cache_areas" :key="item.area_id" :label="item.area_name"
          :value="item.area_id" />
      </el-select>
      <el-select class="account-status-select" v-model="roomVal" :placeholder="$t('base.plzSelect')" size="default"
        style="width: 140px;min-height: 30px;" @change="onRoomChange">
        <el-option style="height: 30px;" v-for="item in roomOptions" :key="item.room_id" :label="item.room_name"
          :value="item.room_id" />
      </el-select>
      <el-button type="primary" @click="searchMeet" :icon="Search">
        {{ $t('base.search') }}
      </el-button>
    </template>
    <template #table>
      <el-table class="table-wrapper" style="height: auto;" :data="meetListData" header-cell-class-name="tb-header" max-height="450">
        <el-table-column prop="number" :label="$t('meet.table.id')">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="area_name" :label="$t('meet.table.area')" ></el-table-column>
        <el-table-column prop="room_name" :label="$t('meet.table.room')"></el-table-column>
        <el-table-column prop="name" :label="$t('meet.table.room_title')"></el-table-column>
        <el-table-column prop="startTime" :label="$t('meet.table.start_meet')"></el-table-column>
        <el-table-column prop="endTime" :label="$t('meet.table.end_meet')"></el-table-column>
        <el-table-column prop="is_repeat_text" :label="$t('meet.table.is_repeat')"></el-table-column>
        <el-table-column prop="status_text" :label="$t('meet.table.meet_status')"></el-table-column>
        <el-table-column prop="create_by" :label="$t('meet.table.creat_by')">
        </el-table-column>
      </el-table>
    </template>
    <template #pagination>
      <el-text>{{ $t('base.tableBottomCount', total_num) }}</el-text>
      <el-pagination v-model:current-page="page_number" @current-change="handleCurrentChange" layout="prev, pager, next"
        :default-page-size="20" :total="total_num" />
    </template>
  </Layout>
  <SingleMeetCMP v-if="dialogMeetForm" :mode="form_mode" :add_params="addParams" :areas="page_cache_areas"
    :entry_id="entry_id" @close="closeDialogMeetForm" />
  <CycleMeetCMP v-if="dialogCycleMeetForm" :mode="form_mode" :add_params="addParams" :areas="page_cache_areas"
    :repeat_id="repeat_id" :entry_id="entry_id" @close="closeDialogCycleMeetForm" />
</template>

<script>
import { PageMixin } from "@/pages/PageMixin.js";
import { Api } from "@/network/api.js";
import { ElMessage } from "element-plus/es";
import { Common } from "@/common/common";
import moment from "moment";
import CycleMeetCMP from "@/components/CycleMeetCMP.vue";
import SingleMeetCMP from "@/components/SingleMeetCMP.vue";
import Layout from "@/components/Layout.vue";
import { Search } from "@element-plus/icons-vue";
export default {
  computed: {
    Search() {
      return Search
    }
  },
  components: { Layout, CycleMeetCMP, SingleMeetCMP },
  mixins: [PageMixin],
  data() {
    return {
      meetListData: [],
      statusVal: -1,
      accountSwitch: 1,
      statusOptions: [
        {
          value: -1,
          label: this.$t('base.all'),
        },
        {
          value: 0,
          label: this.$t('meet.not_started_meet'),
        }, {
          value: 1,
          label: this.$t('meet.in_progress_meet'),
        }, {
          value: 2,
          label: this.$t('meet.ended_meet'),
        }],

      areaStatusVal: this.$t('base.all'),
      areaOptions: [],
      roomVal: this.$t('base.all'),
      roomOptions: [],
      pendingDeleteName: null,
      role: [
        this.$t('user.role.level0'),
        this.$t('user.role.level1'),
        this.$t('user.role.level2'),
      ],
      page_number: 1,
      total_num: 0,
      initialized: false,
      baseTime: '',
      startTime: this.$t('base.startDate'),
      endTime: this.$t('base.endDate'),
      dialogCycleMeet: false,
      entry_id: -1,
      dialogSingleMeet: false,
      select_area_id: -1,
      select_room_id: -1,
      form_mode: 0,
      page_cache_areas: [],
      addParams:{
        area_id: '',
        area_name: '',
        room_id: '',
        room_name: '',
        timeStamp: 0,
        resolution: 1800,
      },
      repeat_id: 0,
      keyword: '',
    }
  },
  methods: {

    editMeetDislog(row) {
      this.dialogSingleMeet = true
      this.entry_id = row.id
      console.log('MeetList editMeetDislog row',row)
    },
    searchMeet() {
      this.getMeetList()
    },
    onAreaChange(e) {
      console.log('MeetList onAreaChange e', e, this.page_cache_areas)
      this.select_area_id = e
      if (this.select_area_id != -1) {
        const area_rooms = this.page_cache_areas.filter((item) =>
          item.area_id === e
        )
        console.log('MeetList onAreaChange area_rooms', area_rooms)
        const select_rooms = [];
        area_rooms.forEach(room => {
          select_rooms.push({
            room_id: room.room_id,
            room_name: room.room_name,
            title: room.room_name,
            disabled: room.disabled,
          });
        });
        this.roomOptions = area_rooms[0].rooms
      } else {
        const select_rooms = [];
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
        this.roomOptions = select_rooms
      }
      console.log('MeetList onAreaChange roomOptions', this.roomOptions)
    },
    onRoomChange(e) {
      this.select_room_id = e
    },
    handleCurrentChange(newPage) {
      console.log('MeetList handleCurrentChange newPage:', newPage, this.page_number)
      this.page_number = newPage
      this.getMeetList()
    },

    getAllAreas() {
      if (this.page_cache_areas.length > 0) {
        console.log('MeetList getAllAreas page_cache_areas', this.page_cache_areas)
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
        console.log('MeetList getAllAreas data', data.areas)
        this.page_cache_areas = data.areas
        this.getAreaRooms()
      })
    },

    getAreaRooms() {
      if (this.page_cache_areas.length > 0) {
        const select_rooms = [];
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
        this.roomOptions = select_rooms
      } else {
        this.getAllAreas()
      }
    },

    editMeet(params) {
      console.log('MeetList editMeet params', params)
      Api.editMeet(params).then(({ data, code, msg }) => {
        if (code == 0) {
          this.getMeetList()
        } else {
          ElMessage.error(msg)
        }
      })
    },
    getMeetList() {
      let params = {}
      if (this.statusVal != -1) {
        params['status'] = this.statusVal
      }
      if (this.select_area_id != -1) {
        params['area_id'] = this.select_area_id
      }
      if (this.select_room_id != -1) {
        params['room_id'] = this.select_room_id
      }
      if (this.keyword) {
        params['create_by'] = this.keyword
      }
      params['pagesize'] = 20
      params['pagenum'] = this.page_number
      console.log('MeetList getMeetList params:', params)
      Api.getMeetList(params).then(({ code, msg, data }) => {
        this.initialized = true
        if (code == 0 && data) {
          data.entries.forEach(it => {
            it["startTime"] = moment.tz(it['start_time'] * 1000, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
            it['endTime'] = moment.tz(it['end_time'] * 1000, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
            it['is_repeat_text'] = it['is_repeat'] == 0 ? this.$t('meet.no') : this.$t('meet.yes')
            it['status_text'] = it['status'] == 0 ? this.$t('meet.not_started_meet') : it['status'] == 1 ? this.$t('meet.in_progress_meet') : this.$t('meet.ended_meet')
          })
          console.log('MeetList getMeetList data:', data)
          this.meetListData = data.entries
          this.total_num = data.total
        }
      })
    },
    toUserDetail(mode, id) {
      this.push(`/user_detail/${mode}/${id}`)
    },
  },
  mounted() {
    this.getMeetList()
    this.getAllAreas()
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

.filter-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 20px;
  padding: 0 5px;
}

.el-main {
  margin: 0;
}

.tb-header {
  font-size: 14px !important;
}

.el-table {
  --el-table-tr-bg-color: white;
  padding: 0;
  margin: 0;
}

::v-deep .el-input {
  height: 40px;
  line-height: 40px;
}

::v-deep .el-input__inner {
  height: 40px;
  line-height: 40px;
}

.el-button-content {
  width: 84px;
  height: 30px;
  background: #591BB7;
  font-family: PingFang SC;
  font-size: 14px;
  font-weight: normal;
  line-height: 30px;
  letter-spacing: 0px;
  color: #FFFFFF;
  margin-left: 20px;
  padding: 4px 0;
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