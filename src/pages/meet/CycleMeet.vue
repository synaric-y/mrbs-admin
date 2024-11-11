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
                <el-option v-for="(area, index) in page_cache_areas" :label="area.area_name" :value="area.area_id"
                  :key="index">
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
                :start-placeholder="startTime" :end-placeholder="endTime" @change="choseDate" />
            </div>
          </div>
        </div>
        <div class="table-container" v-if="!showLoading">

          <el-scrollbar ref="timeCycleScroll" id="time-scrollbar" class="time-table-view" @scroll="syncScroll('timeCycleScroll')"
            :style="{ height: 'calc(100vh - 150px - 65px)' }">
            <div class="time-slots-wrapper">
              <div v-for="(time, timeIndex) in timeSlots" :key="timeIndex" class="time-slot">
                {{ time }}
              </div>
            </div>
          </el-scrollbar>

          <el-scrollbar ref="contentScroll" id="content-scrollbar" class="scroll-table-view" @scroll="syncScroll('contentScroll')" always :style="{ height: 'calc(100vh - 150px + 40px)' }">
            <div class="calendar-header">
              <div class="time-header">
              </div>
              <div v-for="(day, indexday) in days" :key="indexday" class="day-header"
                :style="{ backgroundColor: day.color }">
                {{ day.date }}
                <div class="room-header">
                  <div v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-name"
                    :style="{ height: timeSlots.length * 40 + 70 + 'px', width: itemWidth + 'px' }">
                    {{ room.room_name }}
                    <template v-for="(time, timeIndex) in localTimeSlots">

                        <div v-if="timeIndex != localTimeSlots.length - 1"
                          :class="[getMeetStatusText(day, room, time) == $t('base.roomAbled') ? 'empty-abled-meet-div' : 'empty-meet-div']"
                          :style="{ height: minItemHeight + 'px', width: itemWidth + 'px', top: ((timeIndex) * minItemHeight + 70) + 'px' }"
                          @click="toMeet(time, room, day)">
                          <text class="empty-meet-duration">{{ time }}</text>
                          <text class="empty-meet-reason">{{ getMeetStatusText(day, room, time) }}</text>
                        </div>
                    </template>
                    <template v-for="(event, indexeve) in events">
                      <template v-if="day.date === event.date && room.room_id === event.room_id">
                        <template v-if="event.status == 0 || event.status == 1 || event.status == 2">
                          <div :key="indexeve"
                            :class="[event.status == 0 ? 'room-meet-event' : event.status == 1 ? 'room-meet-in-event' : 'room-meet-timeout-event']"
                            @click="editMeet(event)"
                            :style="{ top: minItemHeight * getTimeSlotIndex(event.startTime) + 70 + 'px', left: ((itemWidth + 20) * roomIndex) + roomIndex * 0.5 + 'px', width: itemWidth + 'px', height: (getTimeSlotIndex(event.endTime) - getTimeSlotIndex(event.startTime)) * minItemHeight + 'px' }">
                            <div class="event-center">
                              <template
                                v-if="(getTimeSlotIndex(event.endTime) - getTimeSlotIndex(event.startTime)) == 1">
                                <div class="event-title" :style="{ margin: 1 + 'px' }">{{ event.entry_name
                                  }}</div>
                                <div class="event-person" :style="{ margin: 2 + 'px' }">{{ event.duration }}{{ event.book_by }}</div>
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
        <!-- <CycleMeetCMP v-if="dialogMeetForm" :mode="form_mode" :add_params="addParams" :areas="page_cache_areas" :repeat_id="repeat_id" :entry_id="entry_id"
          @close="closeDialogMeetForm" /> -->
          <SingleMeetCMP v-if="dialogMeetForm" :mode="form_mode" :add_params="addParams" :areas="page_cache_areas" :entry_id="entry_id"
          @close="closeDialogMeetForm" />
        <CycleMeetCMP v-if="dialogCycleMeetForm" :mode="form_mode" :add_params="addParams" :areas="page_cache_areas" :repeat_id="repeat_id" :entry_id="entry_id"
          @close="closeDialogCycleMeetForm" />
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
import SingleMeetCMP from '@/components/SingleMeetCMP.vue';
import CycleMeetCMP from '@/components/CycleMeetCMP.vue';

export default defineComponent({
  components: { SingleMeetCMP, CycleMeetCMP },
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
      min_start: '06:00',
      max_end: '21:00',
      interval: null,
      currenTimestamp: 0,
      showLoading: true,
      filterDateStore: null,
      minDuration: 1800,
      minItemHeight: 40,
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
      dialogMeetForm: false,
      dialogCycleMeetForm: false,
      form_mode: 0,
      currentHourMinute: '',
      currentTimeZone: 'Asia/Shanghai',
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
      isSyncing: false,
      scrollLeft: 0,
      scrollTop: 100,
    };
  },

  mounted() {
    this.getAllAreas()
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
    this.$nextTick(() => {
      this.showLoading = false
    })
  },

  methods: {

    syncScroll(refName) {
      if (this.isSyncing) return;
      this.isSyncing = true;
      requestAnimationFrame(() => {
        const contentScrollWrap = this.$refs.contentScroll?.$refs.wrapRef;
        const timeScrollWrap = this.$refs.timeCycleScroll?.$refs.wrapRef;
        if (!contentScrollWrap || !timeScrollWrap) {
          this.isSyncing = false;
          return;
        }
        if (refName === 'contentScroll') {
          timeScrollWrap.scrollTop = contentScrollWrap.scrollTop;
        } else if (refName === 'timeCycleScroll') {
          contentScrollWrap.scrollTop = timeScrollWrap.scrollTop;
        }
        this.isSyncing = false;
      });
    },
    disabledDate(time) {
      return time.getTime() < Date.now() - 86400000;
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
      console.log('Home getSyncInterval this.filterDateStore', this.filterDateStore.cycleArea)
      const selectDays = this.filterDateStore.cycleDays
      const selectStartDate = this.filterDateStore.cycleStartDate
      const selectEndDate = this.filterDateStore.cycleEndDate
      const selectArea = this.filterDateStore.cycleArea
      const selectAreaName = this.filterDateStore.cycleAreaName
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
        // console.log('Home selectAreaName:', selectAreaName)
        this.currenAreaName = selectAreaName
        this.currenArea = selectArea
      }
      this.getCurrentAreaRooms(this.currenArea)
      this.getMeetRooms()
      // console.log('Home selectArea', selectArea)
      // console.log('Home selectStartDate', selectStartDate, selectEndDate)
      // console.log('Home selectDays', selectDays)
    },

    closeDialogMeetForm() {
      this.dialogMeetForm = false
      this.getMeetRooms()
    },

    closeDialogCycleMeetForm() {
      this.dialogCycleMeetForm = false
      this.getMeetRooms()
    },

    getAllRoom(areas) {
      console.log('Home getAllRoom areas 1111111', areas)
      const allRoom = [];
      areas.forEach(area => {
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
      if (this.page_cache_areas && this.page_cache_areas.length > 0) {
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
        let temp_areas = data.areas
        const minResolution = temp_areas.reduce((min, area) => {
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
        // this.minItemHeight = 60 / (1800 / parseInt(minResolution))
        this.minItemHeight = 40
        console.log('Home Minimum resolution: this.minItemHeight', minResolution, this.minItemHeight)
        // 获取开始、结束时间
        const { minStart, maxEnd } = this.getMaxAreaDuration()
        console.log('Home Minimum minStart  maxEnd', minStart, maxEnd)
        const { timeSlots, localTimeSlots } = Common.generateTimeSlots(minStart, maxEnd)
        console.log('Home getAllAreas timeSlots', timeSlots)
        console.log('Home getAllAreas localTimeSlots', localTimeSlots)
        this.timeSlots = timeSlots
        this.localTimeSlots = localTimeSlots
        if (temp_areas) {
          temp_areas.splice(0, 0, firstArea)
        }
        this.page_cache_areas = temp_areas
        console.log('Home getAllAreas this.page_cache_areas', this.page_cache_areas)
        this.getCurrentAreaRooms(this.area_id)
      })
    },

    getCurrentAreaRooms(area_id) {
      if (!this.page_cache_areas || this.page_cache_areas.length == 0) {
        console.log('SingleMeet getCurrentAreaRooms this.page_cache_areas', this.page_cache_areas)
        this.getAllAreas()
        return
      }
      console.log('SingleMeet getCurrentAreaRooms area_id', area_id)
      if (area_id == 0 || !area_id) {
        console.log('SingleMeet getCurrentAreaRooms area_id == 0 return')
        this.rooms = this.getAllRoom(this.page_cache_areas)
        this.getMeetRooms()
        return
      }
      const area_rooms = this.page_cache_areas.filter((item) =>
        item.area_id === area_id
      )
      if (this.dayRrangeVal != 0) {
        this.dayRrange(this.dayRrangeVal)
      }
      console.log('Home getCurrentAreaRooms area_rooms', area_rooms)
      const tmp_areas = []
      tmp_areas.push(area_rooms)
      this.rooms = this.getAllRoom(tmp_areas[0])
      console.log('Home getCurrentAreaRooms this.rooms', this.rooms)
      // this.getMeetRooms()
      return


      Api.getAreaRooms({ id: area_id }).then(({ data, code, msg }) => {
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
      const minStart = this.min_start
      const maxEnd = this.max_end
      return { minStart, maxEnd }
    },

    getTimeSlotIndex(time) {
      const slot_index = this.localTimeSlots.indexOf(time)
      return slot_index
      // startTime: "08:00PM"
      const [hour, minutePeriod] = time.split(":")
      const [minute, period] = [minutePeriod.slice(0, -2), minutePeriod.slice(-2)]
      const baseTime = `${hour.padStart(2, '0')}:00${period.toUpperCase()}`
      const multiple = (1800 / this.minDuration)
      // const multiple = 1
      let baseIndex = this.timeSlots.indexOf(baseTime) * multiple
      if (baseIndex === -1) {
        // console.log('getTimeSlotIndex time baseTime',time,baseTime)
        return -1
      }
      // 适配5、10、15、20、25、30分钟
      const divideItems = 40 / (multiple * 2)
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
      this.filterDateStore.setCycleDays(day)
      this.startStamp = tempTime.start
      this.endStamp = tempTime.end
      this.startTime = moment.tz(tempTime.start * 1000, this.currentTimeZone).format('YYYY-MM-DD')
      this.endTime = moment.tz(tempTime.end * 1000, this.currentTimeZone).format('YYYY-MM-DD')
      this.filterDateStore.setCycleStartDate(this.startTime)
      this.filterDateStore.setCycleEndDate(this.endTime)
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
      console.log("Home toMeet room", room)
      console.log("Home toMeet time", time)
      console.log("Home toMeet day", day)
      this.form_mode = 0
      this.addParams.room_id = room.room_id
      const [tmp_area_name, tmp_room_name] = room.room_name.split(" ")
      this.addParams.room_name = tmp_room_name
      this.addParams.area_id = room.area_id
      this.addParams.resolution = room.resolution
      this.addParams.area_name = room.area_name
      const lang = Common.getLocalLang()
      console.log("Home toMeet day.date timeZone lang", day.date, this.currentTimeZone, this.localLangFormat)
      console.log("Home toMeet formatTime date", day.date)
      const appeedStr = day.date + ' ' + time
      console.log('Home toMeet appeedStr', appeedStr)
      const formatStr = Common.getAssignFormatWithAM(appeedStr, lang)
      console.log('Home toMeet formatStr', formatStr)
      const nextTimeStamp = moment.tz(formatStr, this.currentTimeZone).unix();
      console.log('Home toMeet nextTimeStamp currenTimestamp', nextTimeStamp, this.currenTimestamp)
      this.addParams.timeStamp = nextTimeStamp
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
      this.dialogCycleMeetForm = true
    },

    editMeet(event) {
      console.log('SingleMeet editMeet event', event)
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
      this.form_mode = 1
      this.entry_id = event.entry_id
      if (event.repeat_id) {
        this.repeat_id = event.repeat_id
        this.dialogCycleMeetForm = true
        return
      }
      this.dialogMeetForm = true
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
      const area = this.page_cache_areas.filter(area => area.area_id == e)
      console.log('Home choseArea areaName', area)
      const areaName = area[0].area_name
      this.currenAreaName = areaName
      this.filterDateStore.setCycleArea(e)
      this.filterDateStore.setCycleAreaName(areaName)
      this.getCurrentAreaRooms(this.currenArea)
      // this.getAreaRooms()
      this.getMeetRooms()
    },

    getAreaRooms() {
      console.log('Home getAreaRooms this.currenArea', this.currenArea)
      if (this.currenArea == 'All' || this.currenArea == '') {
        const temp_areas = this.page_cache_areas.flatMap(area => area.rooms)
        this.rooms = temp_areas.flatMap(room => room.room_name)
        console.log('Home getAreaRooms 1111 all rooms:', this.rooms)
      } else {
        const temp_areas = this.page_cache_areas.filter(area => area.area_id == this.currenArea)
        // this.rooms = temp_areas.rooms.flatMap(room => room.room_name)
        this.rooms = temp_areas.rooms
        console.log('Home getAreaRooms 22222 currenArea rooms:', this.rooms)
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
        this.startStamp = Common.getTimestamp(start_date,'start')
        this.endStamp = Common.getTimestamp(end_date,'end')

        this.filterDateStore.setCycleStartDate(start_date)
        this.filterDateStore.setCycleEndDate(end_date)
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
      console.log('Home getMeetRooms enter')
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
      console.log('Home getMeetRooms currenArea:  start: end: ', this.currenArea, this.startStamp, this.endStamp);
      Api.getMeetRooms({ id: this.currenArea, start_time: this.startStamp, end_time: this.endStamp, timezone: this.currentTimeZone }).then(({ data, code, msg }) => {
        if (!data && code != 0) {
          ElMessage({
            message: this.$t('base.getMeetRoomError'),
            type: 'error'
          })
          return
        }
        console.log('Home getMeetRooms api data:', data)
        this.currenTimestamp = data.timestamp
        this.min_start = Common.convertTo24Hour(data.min_time)
        this.max_end = Common.convertTo24Hour(data.max_time)
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
          if (room && room.entries && room.entries.length > 0) {
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
          }
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

.el-table {}

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
  flex-direction: row;
  position: relative;
  background-color: white;
  width: 100%;
  height: 600px;
  margin: 0px;
  padding: 0;
  flex: 1;
}

.time-table-view {
  margin-top: 85px;
  width: 100px;
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

.time-slots-wrapper {
  display: flex;
  flex-direction: column;
  width: 90px;
}

.time-slots {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  z-index: 2000;
  // border-right: 1px solid #9A9A9A;
}

.time-slot {
  height: 40px;
  color: #000;
  font-size: 12px;
  color: #000000;
  font-weight: normal;
  font-family: PingFangSC-regular;
  text-align: right;
  width: 80px;
}

.empty-abled-meet-div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 100px;
  width: 60px;
  height: 40px;
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
  height: 40px;
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
  width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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