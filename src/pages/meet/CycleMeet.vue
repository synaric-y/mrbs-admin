<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-title-wrapper">
        <div class="sub-title">循环会议</div>
      </div>

      <div class="menu-content-wrapper">
        <div class="toolbar" v-if="!showLoading">
          <div class="toolbar-filter">
            <div class="now-time">
              <el-icon class="home-time-icon"></el-icon>
              <span class="now-time-span">{{ nowTime }}</span>
            </div>
            <div class="all-area">
              <el-select v-model="currenAreaName" placeholder="All Areas" @change="choseArea">
                <el-option v-for="(area, index) in areas" :label="area.area_name" :value="area.area_id" :key="index">
                </el-option>
              </el-select>
            </div>
            <div class="group-buttons">
              <el-button v-for="(item, index) in groupButtons" type="primary" size="small"
                :class="['', item.day == dayRrangeVal ? 'day-button-active' : 'day-button']"
                @click="dayRrange(item.day)">{{
                  item.name }}</el-button>
            </div>
            <div class="date-picker">
              <el-date-picker v-model="baseTime" type="daterange" :range-separator="$t('base.to')"
                :start-placeholder="startTime" :end-placeholder="endTime" @change="choseDate" clearable="false" />
            </div>
          </div>
        </div>
        <div class="table-container" v-if="!showLoading">
          <el-scrollbar class="scroll-table-view" always :style="{ height: 'calc(100vh - 150px)' }">
            <div class="calendar-header">
              <div class="time-header">
                <div class="time-slots">
                  <div v-for="(time, timeIndex) in timeSlots" :key="time" class="time-slot">
                    {{ time }}
                  </div>
                </div>
              </div>
              <div v-for="(day, indexday) in days" :key="indexday" class="day-header"
                :style="{ backgroundColor: day.color }">
                {{ day.date }}
                <div class="room-header">
                  <div v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-name"
                    :style="{ height: timeSlots.length * 60 + 70 + 'px', width: itemWidth + 'px' }">
                    {{ room.room_name }}
                    <template v-for="(time, timeIndex) in localTimeSlots">
                      <div v-if="timeIndex != localTimeSlots.length - 1"
                        :class="[getMeetStatusText(day, room, time) == $t('base.roomAbled') ? 'empty-abled-meet-div' : 'empty-meet-div']"
                        :style="{ height: minItemHeight + 'px', width: itemWidth + 'px', top: (timeIndex * minItemHeight + 70) + 'px' }"
                        @click="toMeet(time, room, day)">
                        <!-- <template> -->
                        <text class="empty-meet-duration">{{ time }}</text>
                        <text class="empty-meet-reason">{{ getMeetStatusText(day, room, time) }}</text>
                        <!-- </template> -->

                        <!-- <template v-if="canHoverDiv(day, time, room)">
                    <text class="empty-meet-duration">{{ time }}</text>
                    <text class="empty-meet-reason">{{ getMeetStatusText(day, room, time) }}</text>
                  </template> -->
                        <!-- <template>
                    <text class="empty-meet-duration">测试实施</text>
                    <text class="empty-meet-reason">不可hover</text>
                  </template> -->
                      </div>
                    </template>
                    <template v-for="(event, indexeve) in events">
                      <template v-if="day.date == event.date && room.room_id == event.room_id">
                        <template v-if="event.status == 0 || event.status == 1 || event.status == 2">
                          <div :key="indexeve"
                            :class="[event.status == 0 ? 'room-meet-event' : event.status == 1 ? 'room-meet-in-event' : 'room-meet-timeout-event']"
                            @click="editMeet(event)"
                            :style="{ top: minItemHeight * getTimeSlotIndex(event.startTime) + 70 + 'px', left: ((itemWidth + 20) * roomIndex) + roomIndex * 0.5 + 'px', width: itemWidth + 'px', height: (getTimeSlotIndex(event.endTime) - getTimeSlotIndex(event.startTime)) * minItemHeight + 'px' }">
                            <div class="event-center">
                              <template
                                v-if="(getTimeSlotIndex(event.endTime) - getTimeSlotIndex(event.startTime)) == 3">
                                <div class="event-title" :style="{ margin: 1 + 'px' }">{{ event.entry_name
                                  }}{{ $t('base.minMinuteTitle') }}</div>
                                <div class="event-person" :style="{ margin: 2 + 'px' }">{{ event.book_by }}</div>
                              </template>
                              <template v-else>
                                <div class="event-title">{{ event.entry_name }}</div>
                                <div class="event-time">{{ event.duration }}</div>
                                <div class="event-person">{{ event.book_by }}</div>
                              </template>
                            </div>
                          </div>
                        </template>
                      </template>
                    </template>
                  </div>
                  <div class="room-devide-line"></div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <el-dialog v-model="dialogFormVisible" title="循环会议预定" width="600">
          <el-form :model="meetForm" :rules="rules">
            <div class="request-wrapper">
              <el-form-item prop="area" label="区域" label-width="100px">
                <!-- :disabled="dialogUserDetailForm" -->
                <el-select v-model="meetForm.area" placeholder="请选择区域">
                  <el-option label="上海" value="1" />
                  <el-option label="北京" value="2" />
                </el-select>
              </el-form-item>
            </div>

            <div class="request-wrapper">
              <el-form-item prop="room" label="会议室" label-width="100px">
                <el-select v-model="meetForm.room" placeholder="请选择会议室">
                  <el-option label="Room A" value="1" />
                  <el-option label="Room B" value="2" />
                </el-select>
              </el-form-item>
            </div>
            <div class="request-wrapper">
              <el-form-item prop="title" label="会议室标题" label-width="100px" >
                <el-input v-model="meetForm.title" autocomplete="off" />
              </el-form-item>
            </div>

            <el-form-item prop="start_day" label="开始时间" style="margin-left: 20px" required>
              <el-form-item prop="start_day">
                <el-date-picker v-model="meetForm.start_day" type="date" aria-label="Pick start day"
                  placeholder="Pick start day" style="width: 100%" />
              </el-form-item>
            </el-form-item>

            <el-row style="margin-left: 97px">
              <el-form-item prop="start_hour">
                <el-time-select v-model="start_hour" style="width: 140px;" :start="minStartTime"
                  :step="minStep" :end="maxEndTime" placeholder="会议开始"
                  @change="choseDialogHour(0, start_hour, $event)" :min-time="currentHourMinute" />
              </el-form-item>
              <span style="line-height: 32px;width: 20px;text-align: center;"> - </span>
              <el-form-item prop="end_hour">
                <el-time-select v-model="start_hour" style="width: 140px;" :start="minStartTime"
                  :step="minStep" :end="maxEndTime" placeholder="会议结束"
                  @change="choseDialogHour(0, start_hour, $event)" :min-time="currentHourMinute" />
              </el-form-item>
            </el-row>

            <el-form-item label="重复间隔为" prop="repeat_week" style="margin-left: 7px">
              <el-input-number style="width: 100px;" v-model="meetForm.repeat" :min="1" :max="4" @change="handleWeekChange" />
              <span style="margin-left: 20px;color: #4E5969;font-family: PingFang SC;font-size: 14px;font-weight: normal;">周后的：</span>
            </el-form-item>

            <el-form-item style="margin-left: 40px" prop="check_list">
              <el-checkbox-group v-model="meetForm.check_list" size="small">
                <el-checkbox label="星一" value="1" />
                <el-checkbox label="星二" value="2" />
                <el-checkbox label="星三" value="3" />
                <el-checkbox label="星四" value="4"/>
                <el-checkbox label="星五" value="5"/>
                <el-checkbox label="星六" value="6"/>
                <el-checkbox label="星日" value="7"/>
              </el-checkbox-group>
            </el-form-item>




            <el-form-item prop="end_day" label="结束时间" style="margin-left: 20px;" required>
              <el-form-item prop="end_day">
                <el-date-picker v-model="meetForm.start_day" type="date" aria-label="Pick end day"
                  placeholder="Pick end day" style="width: 100%" />
              </el-form-item>
            </el-form-item>

            <el-form-item label="备注" label-width="100px" >
              <el-input v-model="meetForm.remark" maxlength="100" style="width: 410px;" placeholder="Please input"
                show-word-limit type="textarea" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer" style="text-align: center;">
              <el-button type="primary" @click="commitAddForm">提交</el-button>
              <el-button style="margin-left: 50px" @click="deleteMeet">
                删除
              </el-button>
              <el-button style="margin-left: 50px" @click="dialogFormVisible = false">
                取消
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </el-main>
    <el-skeleton v-if="showLoading" :rows="15" animated />
  </el-container>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { PageMixin } from "@/pages/PageMixin.js";
import { Common } from "@/common/common";
import { ElMessage } from "element-plus/es";
import { Api } from '@/network/api';
import { MEETING_STATUS, STORAGE } from "@/const";
import { SELECT_DAY, ROOM_STATUS, USER_TYPE } from '@/const';
import moment from 'moment';
import { FilterDateStore } from '@/stores/filterDateStore';
import { areaData, homeData, testAreas } from '.././home';

export default defineComponent({
  mixins: [PageMixin],
  data() {
    return {
      currenArea: '',
      currenAreaName: this.$t('base.all'),
      customDate: null,
      hoursNumber: 24,
      dayRrangeVal: SELECT_DAY.THREE,
      baseTime: '',
      startTime: this.$t('base.startDate'),
      endTime: this.$t('base.endDate'),
      currentTimeZone: 'Asia/Shanghai',
      areas: [],
      meetRooms: [],
      screenSize: {},
      itemWidth: 228,
      scrollY: 0,
      startStamp: 0,
      endStamp: 0,
      nowTime: '',
      screenHeight: 700,
      localLangFormat: 'dddd, MMMM Do YYYY',
      interval: null,
      currenTimestamp: 0,
      showLoading: true,
      filterDateStore: null,
      minDuration: 1800,
      minItemHeight: 60,
      groupButtons: [
        {
          name: this.$t('base.today'),
          day: 1
        },
        {
          name: this.$t('base.threeDays'),
          day: 3
        },
        {
          name: this.$t('base.week'),
          day: 7
        },
      ],
      days: [],
      rooms: ["A", "B", "C", "D"],
      events: [],
      timeSlots: [
        "08:00AM", "ㆍ",
        "09:00AM", "ㆍ", "10:00AM", "ㆍ", "11:00AM", "ㆍ", "12:00PM", "ㆍ",
        "01:00PM", "ㆍ", "02:00PM", "ㆍ", "03:00PM", "ㆍ", "04:00PM", "ㆍ",
        "05:00PM", "ㆍ", "06:00PM", "ㆍ", "07:00PM", "ㆍ", "08:00PM", "ㆍ", "09:00PM"
      ],
      localTimeSlots: [
        "08:00AM", "08:30AM",
        "09:00AM", "09:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM", "12:00PM", "12:30PM",
        "01:00PM", "01:30PM", "02:00PM", "02:30PM", "03:00PM", "03:30PM", "04:00PM", "04:30PM",
        "05:00PM", "05:30PM", "06:00PM", "06:30PM", "07:00PM", "07:30PM", "08:00PM", "08:30PM", "09:00PM"
      ],
      meetForm: {
        area: '',
        room: '',
        title: '',
        start_day: '',
        start_hour: '',
        end_day: '',
        end_hour: '',
        repeat_week: '1',
        check_list: [],
        remark: '',
      },
      rules: {
        area: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        room: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        title: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        start_day: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        start_hour: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        end_day: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        end_hour: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        repeat_week: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        check_list: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
        remark: [
          { required: true, message: this.$t('base.noDataHint'), trigger: 'blur' }
        ],
      },

      dialogFormVisible: false,
      currentHourMinute: '',
      minStartTime: '06:00',
      maxEndTime: '21:00',
      currentTimeZone: 'Asia/Shanghai'
    };
  },

  mounted() {
    this.setTab('/')
    console.log('Home getBrowserLanguege:', Common.getBrowserLanguege())
    this.localLangFormat = Common.getBrowserLanguege()
    const screenWidth = window.screen.width
    this.screenSize['width'] = screenWidth
    const screenHeight = window.screen.height
    this.screenSize['height'] = screenHeight
    this.screenHeight = screenHeight
    console.log('Home screenSize:', this.screenSize)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.currentTimeZone = timeZone
    console.log('Home 获取当前设备的时区', timeZone)
    this.startSync()
    this.getAllAreas()
  },

  methods: {
    commitAddForm() {
      this.$refs.meetForm.validate((pass) => {
        if (!pass) {
          return
        }
      })
    },
    disabledDate(time) {
      return time.getTime() < Date.now() - 86400000;
    },
    choseDialogDate(mode, e) {
      console.log('Meet Detail Dialog e', e)
      const date = moment.tz(e, this.currentTimeZone).format('YYYY-MM-DD')
      const newDate = moment.tz(this.form.start_day, this.currentTimeZone).format('YYYY-MM-DD')
      console.log('Meet Detail choseDate date', date, newDate)
      if (date != newDate) {
        this.currentHourMinute = '03:00'
      } else {
        this.currentHourMinute = this.getNearestHalfHour()
      }
      if (mode == 0) {
        this.form.start_date = date
        this.form.end_date = date
        return
      }
      this.form.start_date = date
      this.form.end_date = date
    },

    choseDialogHour(mode, str, e) {
      console.log('Meet Detail choseHour str e', str, e)
      const ymd = this.form.start_date
      const lang = Common.getLocalLang()
      const appeedStr = ymd + ' ' + str
      const formatStr = Common.getAssignFormat(appeedStr, lang)
      console.log('Meet choseHour this.currentTimeZone lang appeedStr', this.currentTimeZone, lang, appeedStr)
      const nextTimeStamp = moment.tz(formatStr, this.currentTimeZone).unix();
      console.log('Meet choseHour formatStr nextTimeStamp ', formatStr, nextTimeStamp)
      if (mode == 0) {
        const currenDay = Common.getYearToDay()
        const currenStamp = Common.getCurrenTimeZoneStamp(this.currentTimeZone)
        if (currenDay == ymd && currenStamp > nextTimeStamp) {
          ElMessage({
            message: this.$t('base.passTimeError'),
            type: 'warning',
          })
          this.form.start_seconds = 0
          this.start_hour = ''
          return
        }
        this.form.start_seconds = nextTimeStamp;
        return
      }
      this.form.end_seconds = nextTimeStamp;
    },
    startSync() {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
      this.getSyncInterval()
      this.interval = setInterval(() => {
        this.getSyncInterval()
      }, 20000)
    },
    getSyncInterval() {
      this.filterDateStore = FilterDateStore()
      console.log('Home getSyncInterval this.filterDateStore', this.filterDateStore.area)
      const selectDays = this.filterDateStore.days
      const selectStartDate = this.filterDateStore.startDate
      const selectEndDate = this.filterDateStore.endDate
      const selectArea = this.filterDateStore.area
      const selectAreaName = this.filterDateStore.areaName
      // this.getAllAreas()
      this.dayRrangeVal = selectDays
      if (selectStartDate && selectEndDate) {
        this.startTime = selectStartDate
        this.endTime = selectEndDate
        const days = this.getDaysBetween(selectStartDate, selectEndDate)
        const tempdays = this.formatDays(days)
        this.days = tempdays
      } else {
        this.startStamp = Common.getThreeDaysTimestamps().start
        this.endStamp = Common.getThreeDaysTimestamps().end
        if (selectDays) {
          this.dayRrangeVal = selectDays
          this.dayRrange(selectDays)
        } else {
          this.dayRrange(SELECT_DAY.THREE);
        }
      }
      if (selectArea && selectAreaName) {
        console.log('Home selectAreaName:', selectAreaName)
        this.currenAreaName = selectAreaName
        this.currenArea = selectArea
      }
      this.getCurrentAreaRooms(this.currenArea)
      console.log('Home selectArea', selectArea)
      console.log('Home selectStartDate', selectStartDate, selectEndDate)
      console.log('Home selectDays', selectDays)
    },

    getAllRoom(data) {
      const allRoom = [];
      data.areas.forEach(area => {
        const areaId = area.area_id
        const areaName = area.area_name
        area.rooms.forEach(room => {
          const roomId = room.room_id;
          const roomName = room.room_name;
          allRoom.push({
            area_id: areaId,
            area_name: areaName,
            resolution: area.resolution,
            start_time: area.start_time,
            end_time: area.end_time,
            disabled: room.disabled,
            room_id: roomId,
            room_name: `${areaName} ${roomName}`,
          });
        });
      });
      console.log('Home allRoom:', allRoom)
      return allRoom
    },

    getAllAreas() {
      const areas = testAreas.data.areas
      console.log('home getAllAreas local areas', areas)
      // 获取最小的值
      if (areas) {
        const minResolution = areas.reduce((min, area) => {
          const resolution = parseInt(area.resolution, 10)
          return resolution < min ? resolution : min
        }, 900);
        this.minDuration = minResolution
        const firstArea = {
          "area_id": "",
          "area_name": this.$t('base.all'),
          "resolution": '1800',
          "rooms": []
        }
        this.minItemHeight = 60 / (1800 / parseInt(minResolution))
        console.log('Home Minimum resolution: this.minItemHeight', minResolution, this.minItemHeight)
        // 获取开始、结束时间
        const { minStart, maxEnd } = this.getMaxAreaDuration()
        console.log('Home Minimum minStart  maxEnd', minStart, maxEnd)
        const { timeSlots, localTimeSlots } = Common.generateTimeSlots(minStart, maxEnd)
        console.log('Home timeSlots localTimeSlots', timeSlots, localTimeSlots)
        this.timeSlots = timeSlots
        this.localTimeSlots = localTimeSlots
        if (areas) {
          areas.splice(0, 0, firstArea)
        }
        this.areas = areas
      }

      return


      Api.getAreaRooms({}).then(({ data, code }) => {
        if (code != 0) {
          ElMessage({
            message: this.$t('base.getAreaError'),
            type: 'error'
          })
          return
        }
        // 网络数据
        // let areas = data.areas
        // 本地测试数据
        let areas = areaData.data.areas
        // 获取最小的值
        const minResolution = areas.reduce((min, area) => {
          const resolution = parseInt(area.resolution, 10)
          return resolution < min ? resolution : min
        }, 900);
        this.minDuration = minResolution
        const firstArea = {
          "area_id": "",
          "area_name": this.$t('base.all'),
          "resolution": '1800',
          "rooms": []
        }
        this.minItemHeight = 60 / (1800 / parseInt(minResolution))
        console.log('Home Minimum resolution: this.minItemHeight', minResolution, this.minItemHeight)

        // 获取开始、结束时间
        const { minStart, maxEnd } = this.getMaxAreaDuration()
        console.log('Home Minimum minStart  maxEnd', minStart, maxEnd)
        const { timeSlots, localTimeSlots } = Common.generateTimeSlots(minStart, maxEnd)
        console.log('Home timeSlots localTimeSlots', timeSlots, localTimeSlots)
        this.timeSlots = timeSlots
        this.localTimeSlots = localTimeSlots
        if (areas) {
          areas.splice(0, 0, firstArea)
        }
        this.areas = areas
      })
    },

    getCurrentAreaRooms(area_id) {
      this.rooms = areaData.data.areas[0].rooms
      return

      Api.getAreaRooms({ id: area_id }).then(({ data, code }) => {
        if (code != 0) {
          ElMessage({
            message: this.$t('base.getAreaError'),
            type: 'error'
          })
          return
        }
        if (this.dayRrangeVal != 0) {
          this.dayRrange(this.dayRrangeVal)
        }
        console.log('Home getCurrentAreaRooms data', data)
        this.rooms = this.getAllRoom(data)
        // this.getMeetRooms()
      })
    },

    getMaxAreaDuration() {
      if (testAreas && testAreas.data && testAreas.data.areas) {
        const localAreas = testAreas.data.areas
        let minStart = localAreas[0].start_time
        let [startTime, amstr] = minStart.split(' ')
        let maxEnd = localAreas[0].end_time
        let [endTime, pmstr] = maxEnd.split(' ')
        console.log('Home getMaxAreaDuration startTime amstr', startTime, amstr)
        console.log('Home getMaxAreaDuration endTime pmstr', endTime, pmstr)
        for (let i = 1; i < localAreas.length; i++) {
          const otherStart = localAreas[i].start_time
          const [otherStartTime, otherAMstr] = otherStart.split(' ');
          const otherEnd = localAreas[i].end_time
          const [otherEndTime, otherPMstr] = otherEnd.split(' ');
          if (parseInt(otherStartTime) < parseInt(startTime)) {
            minStart = otherStart
            startTime = otherStartTime
            amstr = otherAMstr
          }
          if (parseInt(otherEndTime) > parseInt(endTime)) {
            maxEnd = otherEnd
            endTime = otherEndTime
            pmstr = otherPMstr
          }
        }
        return { minStart, maxEnd }
      }
      return {}
    },

    getTimeSlotIndex(time) {
      const [hour, minutePeriod] = time.split(":")
      const [minute, period] = [minutePeriod.slice(0, -2), minutePeriod.slice(-2)]
      const baseTime = `${hour.padStart(2, '0')}:00${period.toUpperCase()}`
      const multiple = (1800 / this.minDuration)
      let baseIndex = this.timeSlots.indexOf(baseTime) * multiple
      if (baseIndex === -1) {
        // console.log('getTimeSlotIndex time baseTime',time,baseTime)
        return -1
      }
      // 适配5、10、15、20、25、30分钟
      const divideItems = 60 / (multiple * 2)
      for (let i = 0; i < (multiple * 2); i++) {
        if (minute == divideItems * i) {
          baseIndex = baseIndex + i
          break
        }
      }
      // console.log('getTimeSlotIndex time baseTime baseIndex',time,baseTime,baseIndex,minute)
      return baseIndex
    },

    dayRrange(day) {
      let days = []
      let tempTime = {}
      if (day == SELECT_DAY.TODAY) {
        console.log('Home One Days:', this.getCurrenDay(this.currentTimeZone))
        days = this.getCurrenDay(this.currentTimeZone)
        tempTime = Common.getTodayTimestamps(this.currentTimeZone)
        console.log(tempTime)
      } else if (day == SELECT_DAY.THREE) {
        console.log('Home Next Three Days:', this.getThreeDays(this.currentTimeZone))
        days = this.getThreeDays(this.currentTimeZone)
        tempTime = Common.getThreeDaysTimestamps(this.currentTimeZone)
        console.log(tempTime)
      } else if (day == SELECT_DAY.WEEK) {
        console.log('Home Week Days:', this.getCurrenWeek(this.currentTimeZone))
        days = this.getCurrenWeek(this.currentTimeZone)
        tempTime = Common.getThisWeekTimestamps(this.currentTimeZone)
        console.log(tempTime)
      } else {
        console.log('Home Next Three Days:', this.getThreeDays(this.currentTimeZone))
        days = this.getThreeDays(this.currentTimeZone)
        tempTime = Common.getThreeDaysTimestamps(this.currentTimeZone)
        console.log(tempTime)
      }
      this.filterDateStore.setDays(day)
      this.startStamp = tempTime.start
      this.endStamp = tempTime.end
      this.startTime = moment.tz(tempTime.start * 1000, this.currentTimeZone).format('YYYY-MM-DD')
      this.endTime = moment.tz(tempTime.end * 1000, this.currentTimeZone).format('YYYY-MM-DD')
      this.filterDateStore.setStartDate(this.startTime)
      this.filterDateStore.setEndDate(this.endTime)
      console.log('Home dayRrange tempTime', this.startTime, this.endTime)
      this.dayRrangeVal = day
      this.days = this.formatDays(days)
      this.getMeetRooms()
    },

    getCurrenDay(timeZone) {
      const today = moment().tz(timeZone)
      console.log('Home getCurrenDay timeZone', timeZone, today.format(this.localLangFormat))
      const oneDays = [
        Common.translateWeekDay(today.format(this.localLangFormat)),
      ];
      return oneDays
    },

    getThreeDays(timeZone) {
      const today = moment().tz(timeZone);
      console.log('Home getThreeDays timeZone', timeZone, today.format(this.localLangFormat))
      const nextThreeDays = [
        Common.translateWeekDay(today.format(this.localLangFormat)),
        Common.translateWeekDay(today.add(1, 'days').format(this.localLangFormat)),
        Common.translateWeekDay(today.add(1, 'days').format(this.localLangFormat))
      ];
      return nextThreeDays
    },

    getCurrenWeek(timeZone) {
      const startDay = moment().tz(timeZone);
      console.log('Home getCurrenWeek timeZone', timeZone);
      const startOfWeek = startDay.clone().startOf('week');
      const endOfWeek = startDay.clone().endOf('week');
      const weekDays = [];
      let day = startOfWeek;
      while (day <= endOfWeek) {
        weekDays.push(Common.translateWeekDay(day.format(this.localLangFormat)));
        day = day.add(1, 'days');
      }
      return weekDays;
    },

    getDaysBetween(startDate, endDate) {
      console.log('Home getDaysBetween startDate endDate', startDate, endDate)
      const start = moment(startDate)
      const end = moment(endDate)
      const days = []
      while (start <= end) {
        days.push(Common.translateWeekDay(start.format(this.localLangFormat)))
        start.add(1, 'days')
      }
      console.log('Home getDaysBetween days', days)
      return days
    },

    formatDays(days) {
      const formattedDates = days.map((day, index) => {
        return {
          date: day,
          color: (index + 1) % 2 == 0 ? "#0288d1" : "#6a1b9a"
        };
      });
      return formattedDates;
    },

    canHoverDiv(day, hoverTime, room) {
      let canHover = true
      for (let i = 0; i < this.events.length; i++) {
        const event = this.events[i]
        if (day.date === event.date && event.startTime === hoverTime && room.room_id === event.room_id) {
          console.log('Home canHoverDiv hoverTime event.startTime', hoverTime, event.startTime)
          console.log('Home canHoverDiv event', event.room_id, event.room_name)
          console.log('Home canHoverDiv room', room.room_id, room.room_name)
          canHover = false
          break
        }
      }
      return canHover
    },

    getMeetStatusText(dayTime, roomStatus, minuteTime) {
      const userinfo = JSON.parse(localStorage.getItem(STORAGE.USER_INFO))
      if (!userinfo || userinfo.level == 0) {
        return this.$t('base.loginoutUser')
      }
      if (this.normalUser()) {
        return this.$t('base.normalUser')
      }
      if (roomStatus.disabled == ROOM_STATUS.DISABLED) {
        return this.$t('base.roomDisabled')
      }
      const lang = Common.getLocalLang()
      const appeedStr = dayTime.date + ' ' + minuteTime
      const formatStr = Common.getAssignFormatWithAM(appeedStr, lang)
      const nextTimeStamp = moment.tz(formatStr, this.currentTimeZone).unix();
      if (nextTimeStamp < this.currenTimestamp) {
        return this.$t('base.passTime')
      }
      return this.$t('base.roomAbled')
    },

    toMeet(time, room, day) {
      this.dialogFormVisible = true
      return
      console.log("Home toMeet room", room)
      const lang = Common.getLocalLang()
      console.log("Home toMeet day.date timeZone lang", day.date, this.currentTimeZone, this.localLangFormat)
      console.log("Home toMeet formatTime date", day.date)
      const appeedStr = day.date + ' ' + time
      console.log('Home toMeet appeedStr', appeedStr)
      const formatStr = Common.getAssignFormatWithAM(appeedStr, lang)
      console.log('Home toMeet formatStr', formatStr)
      const nextTimeStamp = moment.tz(formatStr, this.currentTimeZone).unix();
      console.log('Home toMeet nextTimeStamp currenTimestamp', nextTimeStamp, this.currenTimestamp)
      if (nextTimeStamp < this.currenTimestamp) {
        return
      }
      if (this.normalUser()) {
        return
      }
      if (room.disabled == ROOM_STATUS.DISABLED) {
        console.log('Home toMeet disabled', room.disabled)
        return
      }
      this.push(`/meet_detail/0/${room.room_id}/${room.area_id}/${nextTimeStamp}`)
    },

    editMeet(event) {
      if (this.normalUser()) {
        return
      }
      if (event.status == MEETING_STATUS.END) {
        return
      }
      if (event.disabled == ROOM_STATUS.DISABLED) {
        console.log('Home editMeet disabled', event.disabled)
        return
      }
      this.push(`/meet_detail/${event.entry_id}/${event.room_id}/${event.area_id}/0`)
    },

    normalUser() {
      const userinfo = JSON.parse(localStorage.getItem(STORAGE.USER_INFO))
      const level = {}
      if (userinfo && userinfo.level == USER_TYPE.ADMIN) {
        return false
      }
      return true
    },

    choseArea(e) {
      this.currenArea = e;
      console.log('Home choseArea e')
      const area = this.areas.filter(area => area.area_id == e)
      console.log('Home choseArea areaName', area)
      const areaName = area[0].area_name
      this.currenAreaName = areaName
      this.filterDateStore.setArea(e)
      this.filterDateStore.setAreaName(areaName)
      this.getCurrentAreaRooms(this.currenArea)
      this.getAreaRooms()
      this.getMeetRooms()
    },

    getAreaRooms() {
      console.log('Home getAreaRooms this.currenArea', this.currenArea)
      if (this.currenArea == 'All' || this.currenArea == '') {
        const temprooms = this.areas.flatMap(area => area.rooms)
        this.rooms = temprooms.flatMap(room => room.room_name)
        console.log('Home getAreaRooms all rooms:', this.rooms)
      } else {
        const temprooms = this.areas.find(area => area.area_id == this.currenArea)
        this.rooms = temprooms.rooms.flatMap(room => room.room_name)
        console.log('Home getAreaRooms currenArea rooms:', this.rooms)
      }
    },

    choseDate(e) {
      if (e.length > 0) {
        const start_date = moment(e[0]).format('YYYY-MM-DD')
        const end_date = moment(e[1]).format('YYYY-MM-DD')
        const start = moment(start_date)
        const end = moment(end_date)
        const diffDay = (end - start) / (24 * 60 * 60 * 1000)
        if (diffDay > 30) {
          ElMessage({
            message: this.$t('base.selectDateError'),
            type: 'warning'
          })
          this.startTime = ''
          this.endTime = ''
          return
        }
        this.startTime = start_date
        this.endTime = end_date

        this.filterDateStore.setStartDate(start_date)
        this.filterDateStore.setEndDate(end_date)
        this.getMeetRooms()
        const days = this.getDaysBetween(start_date, end_date)
        const tempdays = this.formatDays(days)
        console.log('Home tempdays:', tempdays)
        this.days = tempdays
      }
    },

    formatTime(timestr) {
      if (!timestr) {
        return 0;
      }
      const date = new Date(timestr);
      const timestamp = date.getTime();
      return timestamp;
    },

    getMeetRooms() {
      if (this.startStamp && this.endStamp) {
      } else {
        const temp = Common.getThreeDaysTimestamps()
        this.startStamp = temp.start
        this.endStamp = temp.end
      }
      const itemNumber = this.rooms.length * this.days.length
      this.itemWidth = 229
      if (itemNumber <= 2) {
        this.itemWidth = 229
      } else if (itemNumber <= 4) {
        this.itemWidth = (this.screenSize['width'] - 130) / itemNumber
      } else if (itemNumber <= 6) {
        this.itemWidth = (this.screenSize['width'] - 130) / itemNumber
      } else {
        this.itemWidth = 229
      }


      // 本地测试数据
      this.currenTimestamp = homeData.data.timestamp
      this.nowTime = homeData.data.time
      this.getInMeeting(homeData.data)
      this.$nextTick(() => {
        this.showLoading = false
      })
      return

      console.log('Home getMeetRooms currenArea:  start: end: ', this.currenArea, this.startStamp, this.endStamp);
      Api.getMeetRooms({ id: this.currenArea, start_time: this.startStamp, end_time: this.endStamp, timezone: this.currentTimeZone }).then(({ data, code }) => {
        if (!data) {
          ElMessage({
            message: this.$t('base.getMeetRoomError'),
            type: 'error'
          })
          return
        }
        console.log('Home getMeetRooms api data:', data)
        if (this.lang == 'en') {

        }
        this.currenTimestamp = data.timestamp
        this.nowTime = data.time
        this.getInMeeting(data)

        this.$nextTick(() => {
          this.showLoading = false
        })
      })
    },

    getInMeeting(data) {
      console.log('Home getInMeeting areas', data.areas)
      if (!data || data.areas == null || data.areas.length == 0) {
        return
      }
      const entriesRoom = [];
      data.areas.forEach(area => {
        const areaId = area.area_id
        const areaName = area.area_name
        area.rooms.forEach(room => {
          const roomId = room.room_id
          const roomName = room.room_name
          room.entries.forEach(entry => {
            entriesRoom.push({
              area_id: areaId,
              area_name: areaName,
              room_id: roomId,
              room_name: roomName,
              disabled: room.disabled,
              date: Common.translateWeekDay(moment(Number(entry.start_time * 1000)).format(this.localLangFormat)),
              startTime: entry.duration.split('-')[0].trim(),
              endTime: entry.duration.split('-')[1].trim(),
              ...entry
            });
          });
        });
      });
      this.events = entriesRoom
      console.log('Home getMeetRooms entriesRoom:', entriesRoom)
    },
  },

  unmounted() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    if (this.batteryInterval) {
      clearInterval(this.batteryInterval)
      this.batteryInterval = null
    }
  }
});
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
  --el-table-header-bg-color: white;
}

::-webkit-scrollbar {
  display: none;
}

* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.menu-content-wrapper {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  z-index: 2000;
}

.toolbar {
  display: flex;
  width: 100%;
  height: 100px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
}

.toolbar-filter {
  display: flex;
  align-items: center;
  width: auto;
}

.now-time {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.home-time-icon {
  width: 26px;
  height: 26px;
  line-height: 26px;
  align-self: center;
  background-image: url('/imgs/home_time_icon.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.now-time-span {
  align-self: center;
  font-size: 16px;
  color: #333333;
}

.all-area {
  margin-left: 35px;
}

.group-buttons {
  margin-left: 35px;
}

.day-button {
  min-width: 80px;
  height: 30px;
  line-height: 30px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
  margin-right: 22px;
  border-radius: 6px;
  border: 2px solid rgba(89, 27, 183, 1);
  color: rgba(89, 27, 183, 1);
  background-color: white;
  font-size: 14px;
  text-align: center;
}

.day-button-active {
  min-width: 80px;
  height: 30px;
  line-height: 30px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
  margin-right: 22px;
  border-radius: 6px;
  background-color: rgba(89, 27, 183, 1);
  color: rgba(255, 255, 255, 1);
}

.date-picker {
  margin-left: 50px;
}

.el-icon {
  margin-right: 8px;
}

.el-button {
  margin: 10px;
}

.el-select {
  min-width: 150px;
}

.home-calendar {
  margin-left: 20px;
}

.table-container {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: white;
  width: 100%;
  height: 600px;
  margin: 0px;
  padding: 0;
  flex: 1;
}

.scroll-table-view {
  height: 550px;
  width: 100%;
}

.scroll-table-big-view {
  height: 660px;
  width: 100%;
}

.calendar-header {
  display: flex;
  flex-direction: row;
  // background-color: #f0f0f0;
  text-align: center;
  width: 150px;
  // padding: 5px;
  padding-bottom: 0px;
  font-weight: bold;
  color: white;
  position: relative;
}

.time-slots {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  padding-left: 10px;
  z-index: 2000;
  // border-right: 1px solid #9A9A9A;
}

.time-slot {
  height: 60px;
  color: #000;
  font-size: 12px;
  color: #000000;
  font-weight: normal;
  font-family: PingFangSC-regular;
  text-align: right;
}

.empty-abled-meet-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 100px;
  width: 60px;
  height: 60px;
  transition: all 0.3s ease;
  padding: 0px 10px;
}

.empty-meet-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 100px;
  width: 60px;
  height: 60px;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 0px 10px;
}

.empty-meet-duration {
  color: white;
  font-size: 12px;
}

.empty-meet-reason {
  color: white;
  font-size: 12px;
}

.empty-meet-div:hover {
  color: white;
  /* background:
    linear-gradient(to bottom right,
      transparent 0%,
      transparent calc(50% - 1px),
      white 50%,
      transparent calc(50% + 1px),
      transparent 100%);
  background-size: 100% 100%;
  background-blend-mode: normal; */
  background-color: #CECECE;
}

.empty-abled-meet-div:hover {
  color: white;
  /* "#0288d" */
  background-color: #6a1b9a;
}

.day-header {
  padding: 5px 0px;
  padding-bottom: 0px;
  color: #FFFFFF;
  font-size: 12px;
  -webkit-line-clamp: 2;
}

.room-header {
  display: flex;
  color: #000000;
  font-size: 12px;
  text-align: center;
  padding: 5px 0px;
  padding-bottom: 0px;
  font-weight: bold;
  position: relative;
  border-left: 1px solid #9A9A9A;
  // background-color: #29591BB7;
}

.room-name {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  height: 800px;
  padding: 10px;
  padding-bottom: 0px;
  border-right: 1px solid #9A9A9A;
  background-color: #FFFFFF;
}

.room-devide-line {
  position: absolute;
  top: 50px;
  background-color: #333333;
  height: 2px;
  width: 100%;
}

.calendar-body {
  display: flex;
  flex-direction: row;
}

.room-column {
  position: relative;
  border-right: 1px solid #e0e0e0;
  min-height: 600px;
}

.room-meet-event {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 5px;
  right: 5px;
  background-color: #e1f5fe;
  width: 218px;
  padding: 0px 5px;
  margin: 2px 0;
  color: #000;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-left: 10px solid #54BCBD;
}

.room-meet-in-event {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 5px;
  right: 5px;
  background-color: rgba(189, 49, 36, 0.11);
  width: 218px;
  padding: 0px 5px;
  margin: 2px 0;
  color: #000;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-left: 10px solid #BD3124;
}

.room-meet-timeout-event {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 5px;
  right: 5px;
  background-color: rgba(206, 206, 206, 0.14);
  width: 218px;
  margin: 2px 0;
  padding: 0px 5px;
  color: #000;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-left: 10px solid #9A9A9A;
}

.event-title {
  font-weight: bold;
  margin-bottom: 2px;
}

.event-time,
.event-person {
  font-size: 10px;
  color: #555;
}

.empty-bottom {
  height: 10px;
  width: 100%;
}
</style>