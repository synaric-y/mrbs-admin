<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main" v-if="!showLoading">
      <div class="sub-title-wrapper">
        <div class="sub-title">{{$t('base.singleMeet')}}</div>
      </div>
      <div class="menu-content-wrapper">
        <div class="toolbar" v-if="!showLoading">
          <div class="toolbar-filter">
            <div class="now-time">
              <el-icon class="home-time-icon"></el-icon>
              <span class="now-time-span">{{ nowTime }}</span>
            </div>
            <div class="all-area">
              <el-select v-model="currenAreaName" :placeholder="$t('base.allAreas')" @change="choseArea">
                <el-option v-for="(area, index) in page_cache_areas" :label="area.area_name" :value="area.area_id"
                  :key="index">
                </el-option>
              </el-select>
            </div>
            <div class="group-buttons">
              <el-button v-for="(item, index) in groupButtons" type="primary" size="small"
                :class="['', item.day == dayRrangeVal ? 'day-button-active' : 'day-button']"
                @click="dayRrange(item.day,false)">{{
                item.name }}</el-button>
            </div>
            <div class="date-picker">
              <el-date-picker v-model="baseTime" type="daterange" value-format="YYYY-MM-DD"
                :range-separator="$t('base.to')" :start-placeholder="startTime" :end-placeholder="endTime"
                @change="choseDate" />
            </div>
          </div>
        </div>
        <div class="table-container">
          <div class="calendar-scrollbar-wrapper">
            <div class="placeholder-view"></div>
            <el-scrollbar ref="calendarScroll" class="calendar-scrollbar" :style="{ width: scrollbarWidth }"
              @scroll="syncScroll('calendarScroll')">
              <div class="day-header-wrapper">
                <div v-for="(day, indexday) in days" class="day-header" :key="indexday"
                  :style="{ backgroundColor: day.color }">
                  {{ day.date }}
                  <div class="room-header-wrapper">
                    <div class="room-header" :style="{ width: itemWidth + 20 + 'px' }"
                      v-for="(room, roomIndex) in rooms" :key="roomIndex">
                      {{ room.room_name }}
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </div>
          <div class="meet-scrollbar-wrapper" v-if="!showLoading">
            <el-scrollbar ref="timeScroll" id="time-scrollbar" class="slots-time-scrollbar"
              @scroll="syncScroll('timeScroll')" :style="{ height: 'calc(100vh - 150px - 65px)' }">
              <div class="time-slots-wrapper">
                <div v-for="(time, timeIndex) in timeSlots" :key="timeIndex" class="time-slot">
                  {{ time }}
                </div>
              </div>
            </el-scrollbar>
            <el-scrollbar :view-style="{ width: scrollbarWidth }" ref="contentScroll" id="content-scrollbar"
              class="content-meet-scrollbar" @scroll="syncScroll('contentScroll')" always
              :style="{ height: 'calc(100vh - 150px - 25px)' }">
              <div class="calendar-header">
                <template v-for="(day, indexday) in days" :key="indexday" :style="{ backgroundColor: day.color }">
                  <div v-for="(room, roomIndex) in rooms" class="room-border-wrapper" :key="roomIndex"
                    :style="{ height: timeSlots.length * 40 + 30 + 'px', width: itemWidth + 20 + 'px', left: roomIndex * (itemWidth + 21 - 0.5 * indexday) + 'px', top: 0,borderLeft: '1px solid #9A9A9A' }">
                    <template v-for="(time, timeIndex) in localTimeSlots">
                      <div v-if="timeIndex != localTimeSlots.length - 1"
                        :class="[getMeetStatusText(day, room, time) == $t('base.roomAbled') ? 'empty-abled-meet-div' : 'empty-meet-div']"
                        :style="{ height: minItemHeight + 'px', width: itemWidth + 'px', left: (indexday * rooms.length + roomIndex) * (itemWidth + 21) + 'px', top: ((timeIndex) * minItemHeight + 30) + 'px' }"
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
                            :style="{top: event.top + 'px', left: (itemWidth + 21) * (indexday * rooms.length + roomIndex) + 'px', width: itemWidth + 'px', height: event.height + 'px' }">
                            <div class="event-center">
                              <template v-if="((event.end_time - event.start_time) / 60 < 5)">
                                <div class="event-title" :style="{ margin: 1 + 'px' }"></div>
                              </template>

                              <template v-else-if="((event.end_time - event.start_time) / 60 >= 5) && (event.end_time - event.start_time) / 60 < 15">
                                <div class="event-title" :style="{ margin: 1 + 'px' }">{{ event.entry_name
                                  }}</div>
                                <template v-if="event.src">
                                  <img style="position: absolute;top:1px;right: 1px;width: 10px;height: 10px;"
                                    :src="event.src" alt="">
                                </template>
                              </template>

                              <template v-else-if="((event.end_time - event.start_time) / 60 >= 15) && (event.end_time - event.start_time) / 60 <= 20">
                                <div class="event-title" :style="{ margin: 1 + 'px' }">{{ event.entry_name
                                  }}</div>
                                <div class="event-person" :style="{ margin: 1 + 'px' }">{{ event.duration }}-({{
                                  event.book_by }})</div>
                                <template v-if="event.src">
                                  <img style="position: absolute;top:1px;right: 1px;width: 20px;height: 20px;"
                                    :src="event.src" alt="">
                                </template>
                              </template>
                              <template v-else>
                                <div class="event-title">{{ event.entry_name }}</div>
                                <div class="event-time">{{ event.duration }}</div>
                                <div class="event-person">{{ event.book_by }}</div>
                                <template v-if="event.src">
                                  <img style="position: absolute;top:1px;right: 1px;width: 20px;height: 20px;"
                                    :src="event.src" alt="">
                                </template>
                              </template>
                            </div>
                          </div>
                        </template>
                      </template>
                    </template>
                  </div>
                </template>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <SingleMeetCMP v-if="dialogMeetForm" :mode="form_mode" :add_params="addParams" :areas="page_cache_areas"
          :entry_id="entry_id" @close="closeDialogMeetForm" />
        <CycleMeetCMP v-if="dialogCycleMeetForm" :mode="form_mode" :add_params="addParams" :areas="page_cache_areas"
          :repeat_id="repeat_id" :entry_id="entry_id" @close="closeDialogCycleMeetForm" />
      </div>
    </el-main>
    <el-skeleton v-if="showLoading" :rows="15" animated />

    <div class="slider-container-horizontal">
      <el-slider v-model="scrollLeft" @input="scrollHorizontalDebounce" />
    </div>
  </el-container>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { PageMixin } from "@/pages/PageMixin.js";
import { Common } from "@/common/common";
import { ElMessage } from "element-plus/es";
import { Api } from '@/network/api';
import { MEETING_STATUS, MRBS_MAX, STORAGE } from "@/const";
import { SELECT_DAY, ROOM_STATUS, USER_TYPE } from '@/const';
import moment from 'moment';
import { FilterDateStore } from '@/stores/filterDateStore';
import SingleMeetCMP from '@/components/SingleMeetCMP.vue';
import CycleMeetCMP from '@/components/CycleMeetCMP.vue';
import { MAX } from 'uuid';

export default defineComponent({
  components: { SingleMeetCMP, CycleMeetCMP },
  mixins: [PageMixin],
  data() {
    return {
      currenArea: '',
      currenAreaName: this.$t('base.all'),
      dayRrangeVal: SELECT_DAY.THREE,
      baseTime: '',
      startTime: this.$t('base.startDate'),
      endTime: this.$t('base.endDate'),
      currentTimeZone: 'Asia/Shanghai',
      screenSize: {},
      itemWidth: 228,
      startStamp: 0,
      endStamp: 0,
      nowTime: '',
      min_time: '',
      max_time: '',
      screenHeight: 700,
      localLangFormat: 'dddd, MMMM Do YYYY',
      interval: null,
      currenTimestamp: 0,
      min_start: '06:00',
      max_end: '21:00',
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
      timeSlots: [],
      localTimeSlots: [],
      dialogMeetForm: false,
      dialogCycleMeetForm: false,
      form_mode: 0,
      page_cache_areas: [],
      addParams: {
        area_id: '',
        area_name: '',
        room_id: '',
        room_name: '',
        timeStamp: 0,
        resolution: 1800,
      },
      repeat_id: 0,
      isSyncing: false,
      isScrolling: false,
      scrollLeft: 0,
      debounceTimer: null,
      contentScrollRef: null,
    };
  },
  computed: {
    scrollbarWidth() {
      return this.rooms.length * this.days.length * (this.itemWidth + 21) + 'px'
    },
  },

  mounted() {
    this.getAllAreas()
    this.localLangFormat = Common.getBrowserLanguege()
    const screenWidth = window.screen.width
    this.screenSize['width'] = screenWidth
    const screenHeight = window.screen.height
    this.screenSize['height'] = screenHeight
    this.screenHeight = screenHeight
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.currentTimeZone = timeZone
    this.startSync()
    this.contentScrollRef = this.$refs.contentScroll?.$refs.wrapRef
  },

  methods: {
    startSync() {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
      this.getSyncInterval()
      this.interval = setInterval(() => {
        this.getSyncInterval()
      }, 1000 * 20)
    },
    getSyncInterval() {
      this.filterDateStore = FilterDateStore()
      const selectDays = this.filterDateStore.days
      const selectStartDate = this.filterDateStore.startDate
      const selectEndDate = this.filterDateStore.endDate
      const selectArea = this.filterDateStore.area
      const selectAreaName = this.filterDateStore.areaName
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
          this.dayRrange(selectDays,true)
        } else {
          this.dayRrange(SELECT_DAY.THREE,true)
        }
      }
      if (selectArea && selectAreaName) {
        this.currenAreaName = selectAreaName
        this.currenArea = selectArea
      }
      this.getCurrentAreaRooms(this.currenArea,true)
      this.getMeetRooms()
    },

    syncScroll(refName) {
      if (this.isSyncing) return
      this.isSyncing = true
      const contentScrollWrap = this.$refs.contentScroll?.$refs.wrapRef
      const timeScrollWrap = this.$refs.timeScroll?.$refs.wrapRef
      const calendarScrollWrap = this.$refs.calendarScroll?.$refs.wrapRef
      if (!contentScrollWrap || !timeScrollWrap || !calendarScrollWrap) {
        this.isSyncing = false
        return
      }
      requestAnimationFrame(() => {
        if (refName === 'contentScroll') {
          timeScrollWrap.scrollTop = contentScrollWrap.scrollTop
          calendarScrollWrap.scrollLeft = contentScrollWrap.scrollLeft
        } else if (refName === 'timeScroll') {
          contentScrollWrap.scrollTop = timeScrollWrap.scrollTop
        } else if (refName === 'calendarScroll') {
          contentScrollWrap.scrollLeft = calendarScrollWrap.scrollLeft
        }
        this.isSyncing = false
      });
    },

    scrollHorizontalDebounce(scrollValue) {
      this.scrollHorizontal(scrollValue)
    },

    scrollHorizontal(scrollValue) {
      if (this.isScrolling) return
      this.isScrolling = true
      const maxScrollLeft = this.$refs.contentScroll.$refs.wrapRef.scrollWidth - this.$refs.contentScroll.$refs.wrapRef.clientWidth
      const tempScrollValue = Math.max(0, Math.min(maxScrollLeft, maxScrollLeft))
      const scrollLeft = maxScrollLeft / 100 * scrollValue
      setTimeout(() => {
        if (window.requestAnimationFrame) {
          const syncHirizontalScroll = () => {
            this.$refs.contentScroll.$refs.wrapRef.scrollLeft = scrollLeft
            this.$refs.calendarScroll.$refs.wrapRef.scrollLeft = scrollLeft
            this.isScrolling = false
            this.scrollLeft = scrollValue
          }
          window.requestAnimationFrame(syncHirizontalScroll)
        }
      }, 10)
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
      const allRoom = []
      areas.forEach(area => {
        const areaId = area.area_id
        const areaName = area.area_name
        area.rooms.forEach(room => {
          const roomId = room.room_id
          const roomName = room.room_name
          allRoom.push({
            area_id: areaId,
            area_name: areaName,
            resolution: area.resolution,
            start_time: area.start_time,
            end_time: area.end_time,
            disabled: room.disabled,
            room_id: roomId,
            room_name: `${areaName} ${roomName}`,
          })
        })
      })
      console.log('SingleMeet allRoom:', allRoom)
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
        }, 900)
        this.minDuration = minResolution
        const firstArea = {
          "area_id": "",
          "area_name": this.$t('base.all'),
          "resolution": '1800',
          "rooms": []
        }
        this.minItemHeight = 40
        const { timeSlots, localTimeSlots } = Common.generateTimeSlots(this.min_start, this.max_end)
        this.timeSlots = timeSlots
        this.localTimeSlots = localTimeSlots
        if (temp_areas) {
          temp_areas.splice(0, 0, firstArea)
        }
        this.page_cache_areas = temp_areas
        this.getCurrentAreaRooms(this.currenArea)
      })
    },

    getCurrentAreaRooms(area_id,timedRefresh) {
      if (!this.page_cache_areas || this.page_cache_areas.length == 0) {
        this.getAllAreas()
        return
      }
      console.log('SingleMeet getCurrentAreaRooms area_id', area_id)
      if (area_id == 0 || !area_id) {
        this.rooms = this.getAllRoom(this.page_cache_areas)
        this.getMeetRooms()
        return
      }
      const area_rooms = this.page_cache_areas.filter((item) =>
        item.area_id === area_id
      )
      if (this.dayRrangeVal != 0) {
        this.dayRrange(this.dayRrangeVal,timedRefresh?true:false)
      }
      const tmp_areas = []
      tmp_areas.push(area_rooms)
      this.rooms = this.getAllRoom(tmp_areas[0])
      console.log('SingleMeet getCurrentAreaRooms this.rooms', this.rooms)
      return
    },

    dayRrange(day,timedRefresh) {
      let days = []
      let tempTime = {}
      if (day == SELECT_DAY.TODAY) {
        days = this.getCurrenDay(this.currentTimeZone)
        tempTime = Common.getTodayTimestamps(this.currentTimeZone)
      } else if (day == SELECT_DAY.THREE) {
        days = this.getThreeDays(this.currentTimeZone)
        tempTime = Common.getThreeDaysTimestamps(this.currentTimeZone)
      } else if (day == SELECT_DAY.WEEK) {
        days = this.getCurrenWeek(this.currentTimeZone)
        tempTime = Common.getThisWeekTimestamps(this.currentTimeZone)
      } else {
        days = this.getThreeDays(this.currentTimeZone)
        tempTime = Common.getThreeDaysTimestamps(this.currentTimeZone)
      }
      this.filterDateStore.setDays(day)
      this.startStamp = tempTime.start
      this.endStamp = tempTime.end
      this.startTime = moment.tz(tempTime.start * 1000, this.currentTimeZone).format('YYYY-MM-DD')
      this.endTime = moment.tz(tempTime.end * 1000, this.currentTimeZone).format('YYYY-MM-DD')
      this.filterDateStore.setStartDate(this.startTime)
      this.filterDateStore.setEndDate(this.endTime)
      this.dayRrangeVal = day
      this.days = this.formatDays(days)
      if (!timedRefresh) {
        this.resetScroll()
      }
      this.getMeetRooms()
    },

    getCurrenDay(timeZone) {
      const today = moment().tz(timeZone)
      const oneDays = [
        Common.translateWeekDay(today.format(this.localLangFormat)),
      ]
      return oneDays
    },

    getThreeDays(timeZone) {
      const today = moment().tz(timeZone)
      const nextThreeDays = [
        Common.translateWeekDay(today.format(this.localLangFormat)),
        Common.translateWeekDay(today.add(1, 'days').format(this.localLangFormat)),
        Common.translateWeekDay(today.add(1, 'days').format(this.localLangFormat))
      ]
      return nextThreeDays
    },

    getCurrenWeek(timeZone) {
      const startDay = moment().tz(timeZone)
      const startOfWeek = startDay.clone().startOf('week')
      const endOfWeek = startDay.clone().endOf('week')
      const weekDays = []
      let day = startOfWeek
      while (day <= endOfWeek) {
        weekDays.push(Common.translateWeekDay(day.format(this.localLangFormat)))
        day = day.add(1, 'days')
      }
      return weekDays
    },

    getDaysBetween(startDate, endDate) {
      const start = moment(startDate)
      const end = moment(endDate)
      const days = []
      while (start <= end) {
        days.push(Common.translateWeekDay(start.format(this.localLangFormat)))
        start.add(1, 'days')
      }
      return days
    },

    formatDays(days) {
      const formattedDates = days.map((day, index) => {
        return {
          date: day,
          color: (index + 1) % 2 == 0 ? "#0288d1" : "#6a1b9a"
        }
      })
      console.log('formatDays days :',formattedDates)
      return formattedDates
    },

    getMeetStatusText(dayTime, roomStatus, minuteTime) {
      const userinfo = JSON.parse(localStorage.getItem(STORAGE.USER_INFO))
      if (!userinfo || userinfo.level == 0) {
        return this.$t('base.loginoutUser')
      }
      if (roomStatus.disabled == ROOM_STATUS.DISABLED) {
        return this.$t('base.roomDisabled')
      }
      const nextTimeStamp = this.getDateTimeStamp(dayTime.date,minuteTime)
      if (nextTimeStamp < this.currenTimestamp) {
        return this.$t('base.passTime')
      }
      return this.$t('base.roomAbled')
    },

    getDateTimeStamp(date,hour_minute) {
      if (!date || !hour_minute) {
        return 0
      }
      const lang = Common.getLocalLang()
      const appeedStr = date + ' ' + hour_minute
      const formatStr = Common.getAssignFormatWithAM(appeedStr, lang)
      const nextTimeStamp = moment.tz(formatStr, this.currentTimeZone).unix()
      return nextTimeStamp
    },

    toMeet(time, room, day) {
      this.form_mode = 0
      this.addParams.room_id = room.room_id
      const [tmp_area_name, tmp_room_name] = room.room_name.split(" ")
      this.addParams.room_name = tmp_room_name
      this.addParams.resolution = room.resolution
      this.addParams.area_id = room.area_id
      this.addParams.area_name = room.area_name
      this.addParams.area_min_time = room.start_time
      this.addParams.area_max_time = room.end_time

      // const min = Common.formatAMPMTo24HM(this.addParams.area_min_time)
      // const max = Common.formatAMPMTo24HM(this.addParams.area_max_time)
      // console.log('singleMeet toMeet day.date--time',day,time,room)
      // console.log('singleMeet toMeet min_hour-min_minute',min)
      // console.log('singleMeet toMeet max_hour-max_minute',max)
      // return
      // 计算当前会议室的会议室时间
      let hover_start_time = this.getDateTimeStamp(day.date,time)
      let hover_end_time = hover_start_time + 60 * 15
      let min_entry_start_time = MRBS_MAX
      let min_entry_end_time = MRBS_MAX
      let min_end_gap = MRBS_MAX
      let min_start_gap = MRBS_MAX
      console.log('singleMeet toMeet hover_start_time - hover_end_time',hover_start_time,hover_end_time)
      for (let index = 0; index < this.events.length; index++) {
        const entry = this.events[index]
        if (entry.room_id === room.room_id && day.date === entry.date) {
          console.log('singleMeet toMeet entry.start_time -- entry.end_time',entry)
          const start_gap = hover_start_time - entry.end_time
          const end_gap = entry.start_time - hover_end_time
          if (start_gap > 0 && start_gap < min_start_gap) {
            min_entry_end_time = entry.end_time
            min_start_gap = start_gap
            continue
          }
          if (end_gap > 0 && end_gap < min_end_gap) {
            min_entry_start_time = entry.start_time
            min_end_gap = end_gap
            continue
          }
          // if (entry.end_time >= hover_start_time && entry.end_time <= min_entry_end_time) {
          //   min_entry_end_time = entry.end_time
          //   continue
          // }
          // if (entry.start_time >= hover_end_time && entry.start_time <= min_entry_start_time) {
          //   min_entry_start_time = entry.start_time
          //   continue
          // }
        }
      }
      console.log('singleMeet toMeet min_entry_start_time - min_entry_end_time',min_entry_start_time,min_entry_end_time)
      // if (min_entry_start_time != MRBS_MAX) {
      //   hover_end_time = Math.min(min_entry_start_time,hover_end_time)
      // }
      // if (min_entry_end_time != MRBS_MAX) {
      //   hover_start_time = Math.min(min_entry_end_time,hover_start_time)
      // }
      console.log('singleMeet toMeet hover_start_time - hover_end_time:',hover_start_time,hover_end_time)
      // 间隔少于5分钟不可以编辑
      if ((hover_end_time - hover_start_time) < 900) {
        return
      }
      this.addParams.start_time = hover_start_time
      this.addParams.end_time = hover_end_time
      // return
      this.addParams.timeStamp = this.getDateTimeStamp(day.date,time)
      if (this.addParams.timeStamp < this.currenTimestamp) {
        return
      }
      if (room.disabled == ROOM_STATUS.DISABLED) {
        return
      }
      this.dialogMeetForm = true
    },

    editMeet(event) {
      const userinfo = JSON.parse(localStorage.getItem(STORAGE.USER_INFO))
      console.log('SingleMeet editMeet event', event,userinfo)
      if (Common.normalUser() && event.book_by !== userinfo.username) {
        return
      }
      if (event.status == MEETING_STATUS.END) {
        return
      }
      if (event.disabled == ROOM_STATUS.DISABLED) {
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

    resetScroll() {
      if (this.isSyncing) return
      this.isSyncing = true
      const contentScrollWrap = this.$refs.contentScroll?.$refs.wrapRef
      const timeScrollWrap = this.$refs.timeScroll?.$refs.wrapRef
      const calendarScrollWrap = this.$refs.calendarScroll?.$refs.wrapRef
      if (!contentScrollWrap || !timeScrollWrap || !calendarScrollWrap) {
        this.isSyncing = false
        return
      }
      requestAnimationFrame(() => {
        timeScrollWrap.scrollTop = 0
        calendarScrollWrap.scrollLeft = 0
        contentScrollWrap.scrollTop = 0
        contentScrollWrap.scrollLeft = 0
        this.scrollLeft = 0
        this.isSyncing = false
      })
    },

    choseArea(selected_area) {
      this.currenArea = selected_area
      const area = this.page_cache_areas.filter(area => area.area_id == selected_area)
      const areaName = area[0].area_name
      this.currenAreaName = areaName
      this.filterDateStore.setArea(selected_area)
      this.filterDateStore.setAreaName(areaName)
      this.getCurrentAreaRooms(this.currenArea)
      this.resetScroll()
      this.getMeetRooms()
    },

    getAreaRooms() {
      console.log('SingleMeet getAreaRooms this.currenArea', this.currenArea)
      if (this.currenArea == 'All' || this.currenArea == '') {
        const temp_areas = this.page_cache_areas.flatMap(area => area.rooms)
        this.rooms = temp_areas.flatMap(room => room.room_name)
      } else {
        const temp_areas = this.page_cache_areas.filter(area => area.area_id == this.currenArea)
        this.rooms = temp_areas.rooms
      }
    },

    choseDate(date) {
      if (date.length > 0) {
        const start_date = moment(date[0]).format('YYYY-MM-DD')
        const end_date = moment(date[1]).format('YYYY-MM-DD')
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
        // 2024-11-01(2024-11-01 00:00:00) 2024-11-09(2024-11-09 23:59:59)
        this.startTime = start_date
        this.endTime = end_date
        this.startStamp = Common.getTimestamp(start_date, 'start')
        this.endStamp = Common.getTimestamp(end_date, 'end')
        this.filterDateStore.setStartDate(start_date)
        this.filterDateStore.setEndDate(end_date)
        this.resetScroll()
        this.getMeetRooms()
        const days = this.getDaysBetween(start_date, end_date)
        const tempdays = this.formatDays(days)
        this.days = tempdays
      }
    },

    formatTime(timestr) {
      if (!timestr) {
        return 0
      }
      const date = new Date(timestr)
      const timestamp = date.getTime()
      return timestamp
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
      Api.getMeetRooms({ id: this.currenArea, start_time: this.startStamp, end_time: this.endStamp, timezone: this.currentTimeZone }).then(({ data, code, msg }) => {
        if (!data && code != 0) {
          ElMessage({
            message: this.$t('base.getMeetRoomError'),
            type: 'error'
          })
          return
        }
        this.currenTimestamp = data.timestamp
        this.min_time = data.min_time
        this.max_time = data.max_time
        this.min_start = Common.convertTo24Hour(data.min_time)
        this.max_end = Common.convertTo24Hour(data.max_time)
        this.nowTime = data.time
        this.getInMeeting(data)
        this.$nextTick(() => {
          this.showLoading = false
        })
      })
    },

    getMinIndexTimeSlots(date,event) {
      let top = 0
      for (let index = 0; index < this.localTimeSlots.length - 1; index++) {
        const timeslot = this.localTimeSlots[index]
        const timestamp = this.getDateTimeStamp(date,timeslot)
        const nextTimeslot = this.localTimeSlots[index + 1]
        const nextTimestamp = this.getDateTimeStamp(date,nextTimeslot)
        if (event.start_time >= timestamp && event.start_time <= nextTimestamp) {
          top = index * 40 + (event.start_time - timestamp) * (40 / 900) + 30
          // console.log('getMinIndexTimeSlots event.date-timeslot-timestamp-index',date,timeslot,timestamp,index)
          break
        }
      }
      return top
    },

    getInMeeting(data) {
      console.log('SingleMeet getInMeeting areas', data.areas)
      if (!data || data.areas == null || data.areas.length == 0) {
        return
      }
      const entriesRoom = []
      data.areas.forEach(area => {
        const areaId = area.area_id
        const areaName = area.area_name
        area.rooms.forEach(room => {
          const roomId = room.room_id
          const roomName = room.room_name
          if (room && room.entries && room.entries.length > 0) {
            room.entries.forEach(entry => {
              const week_day = Common.translateWeekDay(moment(Number(entry.start_time * 1000)).format(this.localLangFormat))
              const min_stamp = this.getDateTimeStamp(week_day,this.min_time)
              const max_stamp = this.getDateTimeStamp(week_day,this.max_time)
              entriesRoom.push({
                area_id: areaId,
                area_name: areaName,
                room_id: roomId,
                room_name: roomName,
                disabled: room.disabled,
                date: week_day,
                startTime: entry.duration.split('-')[0].trim(),
                endTime: entry.duration.split('-')[1].trim(),
                src: Common.normalSelfMeet(entry.book_by)?'/admin/imgs/person_meet_tag.png':entry.repeat_id > 0?'/admin/imgs/cycle_meet_tag.png':'',
                top: this.getMinIndexTimeSlots(week_day,entry),
                height: (entry.end_time - entry.start_time) / 900 * this.minItemHeight,
                ...entry
              })
            })
          }
        })
      })
      this.$nextTick(() => {
        this.events = entriesRoom
        this.showLoading = false
      })
      console.log('SingleMeet getMeetRooms entriesRoom:', entriesRoom)
    },
  },

  unmounted() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
});
</script>

<style lang="scss" scoped>
// 不可以选择复制
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container-sub-page-main {
  background-color: white;
  margin-left: 20px;
  margin-top: 20px;
  margin-bottom: 5px;
}

.menu-content-wrapper {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  z-index: 200;
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

.el-icon {
  margin-right: 8px;
}

.el-button {
  margin: 10px;
}

.el-select {
  min-width: 150px;
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

.meet-scrollbar-wrapper {
  display: flex;
  flex-direction: row;
  background-color: white;
}

.home-calendar {
  margin-left: 20px;
}

.calendar-scrollbar:deep(.el-scrollbar__bar.is-horizontal) {
  height: 0 !important;
}

.content-meet-scrollbar:deep(.el-scrollbar__bar.is-horizontal) {
  // z-index: 1000;
  // height: 10px;
  height: 0 !important;
}

.slots-time-scrollbar:deep(.el-scrollbar__bar.is-vertical) {
  width: 0 !important;
  display: none !important;
}

.content-meet-scrollbar:deep(.el-scrollbar__bar.is-vertical) {
  z-index: 1000;
  width: 10px;
}

/* 会议展示公共代码 */
.table-container {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: white;
  height: 620px;
  margin: 0px;
  padding: 0;
  flex: 1;
}

.calendar-scrollbar-wrapper {
  display: flex;
  flex-direction: row;
  height: auto;
  width: auto;
  background-color: white;
}

.placeholder-view {
  min-width: 99px;
  width: 46px !important;
  height: 80px;
  background-color: clear;
}

.day-header-wrapper {
  background-color: white;
  display: flex;
  flex-direction: row;
  height: 80px;
  width: auto;
}

.day-header {
  display: flex;
  flex-direction: column;
  text-align: center;
  color: #FFFFFF;
  font-size: 12px;
  padding: 9px 0;
  font-weight: 600;
  border-bottom: 2px solid #9A9A9A;
  /* // -webkit-line-clamp: 2; */
}

// .day-header-wrapper:last-child {
//   border-right: 1px solid #9A9A9A;
// }

.room-header-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: 3px;
}

.room-header {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 12px;
  text-align: center;
  padding: 5px 0px;
  padding-bottom: 0px;
  font-weight: bold;
  // width: 100%;
  line-height: 45px;
  height: 45px;
  text-align: center;
  background-color: white;
  margin: 0px;
  border-left: 1px solid #9A9A9A;
  border-bottom: 1px solid #9A9A9A;
  position: relative;
  z-index: 99;
}

.slots-time-scrollbar {
  margin-top: 25px;
  width: 90px;
}

.time-slots-wrapper {
  display: flex;
  flex-direction: column;
  width: 80px;
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

.content-meet-scrollbar {
  height: 550px;
  width: 100%;
  margin-left: 14.5px;
  padding: 0px;
  background-color: white;
  position: relative;
}

.calendar-header {
  display: flex;
  flex-direction: row;
  background-color: #f0f0f0;
  text-align: center;
  border-right: 1px solid #9A9A9A;
  font-weight: bold;
  color: white;
  position: relative;
}

// .room-border-wrapper:first-child {

// }

.room-border-wrapper:last-child {
  border-right: 1px solid #9A9A9A;
}

.room-border-wrapper {
  width: 229px;
  margin: 0px;
  padding: 0px;
  background-color: white;
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
  z-index: 100;
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
  z-index: 100;
  pointer-events: auto;
}

.empty-meet-duration {
  color: white;
  font-size: 12px;
}

.empty-meet-reason {
  color: white;
  font-size: 12px;
}

#content-scrollbar .empty-meet-div:hover {
  color: white;
  background-color: #CECECE;
  z-index: 100;
}

#content-scrollbar .empty-abled-meet-div:hover {
  color: white;
  background-color: #6a1b9a;
  z-index: 100;
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
  opacity: 1;
  z-index: 101;
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
  z-index: 101;
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
  z-index: 101;
}

.event-title {
  font-weight: bold;
  margin-bottom: 2px;
  width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 101;
}

.event-time,
.event-person {
  font-size: 10px;
  color: #555;
  z-index: 101;
}

.slider-container-horizontal {
  position: fixed;
  z-index: 999;
  width: calc(100vw - 189px - 30px);
  bottom: 0px;
  right: 20px;
}

</style>