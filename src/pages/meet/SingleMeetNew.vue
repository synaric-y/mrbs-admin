<template>
  <Layout title="单次会议">
    <template #filter>
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
                       @click="dayRrange(item.day)">{{item.name }}</el-button>
          </div>
          <div class="date-picker">
            <el-date-picker v-model="baseTime" type="daterange" value-format="YYYY-MM-DD" :range-separator="$t('base.to')"
                            :start-placeholder="startTime" :end-placeholder="endTime" @change="choseDate" />
          </div>
        </div>
      </div>
    </template>
    <template #table>
      <el-skeleton v-if="showLoading" :rows="15" animated />
      <div class="main" id="table-container">

        <table cellspacing="0" cellpadding="0" id="meeting-table" >
          <thead>
          <tr>
            <th></th> <!--空内容-->
            <template v-for="(day, indexday) in days" :key="indexday" class="day-header">
              <th :colspan="rooms.length" :style="{width:getDayWidth+'px', backgroundColor: day.color, color: '#fff' }">{{ day.date }}</th>
            </template>
          </tr>
          <tr>
            <th></th> <!--空内容-->
            <template v-for="(day, indexday) in days" :key="indexday" class="day-header"
                 :style="{ backgroundColor: day.color }">
              <template v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-name"
                   :style="{ height: timeSlots.length * 40 + 70 + 'px', width: itemWidth + 'px' }">
                <th>{{ room.room_name }}</th>
              </template>
            </template>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(time, timeIndex) in timeListTs" :key="timeIndex" class="time-slot">
            <td>{{ ts2Hr(time) }}</td>
            <template v-for="(day, indexday) in days" :key="indexday" class="day-header"
                      :style="{ backgroundColor: day.color }">
              <template v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-name">
                <td>
                  <div class="entry-wrapper">
                    <div :class="[getMeetStatusText(day, room, ts2Hr(time)) == $t('base.roomAbled') ? 'entry-content' : 'entry-content entry-content-disabled']"
                         @click="toMeet(time, room, day)">
                      <text class="empty-meet-duration">{{ ts2Hr(time) }}</text>
                      <text class="empty-meet-reason">{{ getMeetStatusText(day, room, ts2Hr(time)) }}</text>
                    </div>
                    <div style="display:none;">{{ev = getEvent(day.date, room.room_id, time)}}</div>
                    <div v-if="ev!==undefined"
                         :class="getEntryClass(ev.status)"
                         :style="'height:'+getEntryHeight(ev.start_time,ev.end_time)+'px' "
                         @click="editMeet(getEvent(day.date, room.room_id, time))">
                      <div class="event-title">{{ ev.entry_name }}</div>
                      <div class="event-time">{{ ev.duration }}</div>
                      <div class="event-person">{{ ev.book_by }}</div>
                    </div>

                  </div>
                </td>
              </template>
            </template>

          </tr>
          </tbody>
        </table>
      </div>

    </template>
  </Layout>
  <div class="slider-container-horizontal">
    <el-slider v-model="scrollLeft" @input="scrollHorizontal" />
  </div>
  <div class="slider-container-vertical">
    <el-slider :show-tooltip="false" v-model="scrollTop" vertical height="calc( 100vh - 75px - 40px )" @input="scrollVertical" />
  </div>


  <SingleMeetCMP v-if="dialogMeetForm" :mode="form_mode" :add_params="addParams" :areas="page_cache_areas" :entry_id="entry_id"
                 @close="closeDialogMeetForm" />
  <CycleMeetCMP v-if="dialogCycleMeetForm" :mode="form_mode" :add_params="addParams" :areas="page_cache_areas" :repeat_id="repeat_id" :entry_id="entry_id"
                @close="closeDialogCycleMeetForm" />

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
import Layout from "@/components/Layout.vue";
import _ from "lodash"
import dayjs from "dayjs";
import Decimal from "decimal.js";

const SEC_PER_MIN = 60
const PX_PER_15MIN = 60 // 每15分钟px
const WIDTH_PER_ROOM = 200 // 每个房间宽度px

export default defineComponent({
  components: {Layout, SingleMeetCMP, CycleMeetCMP },
  mixins: [PageMixin],
  data() {
    return {
      scrollLeft: 0,
      scrollTop: 100,
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
      timeListTs: [], // 时间戳列表(s)
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
      },
      repeat_id: 0,
    };
  },
  computed:{
    hr2Ts(){
      return (hrStr)=>{
        const hr = parseInt(hrStr.split(':')[0]);
        const min = parseInt(hrStr.split(':')[1]);

        const ts = dayjs().startOf('day').add(hr, 'hour').add(min,'minute').unix()

        return ts
      }
    },
    ts2Hr(){
      return (ts)=>{
        return dayjs.unix(ts).format('hh:mm A')
      }
    },
    getEntryHeight(){
      return (startTs, endTs)=>{
        console.log(startTs,endTs)
        return (Number)(new Decimal(endTs-startTs).div(15*SEC_PER_MIN).times(PX_PER_15MIN))
      }
    },
    getDayWidth(){
      return this.rooms.length * WIDTH_PER_ROOM
    },
    getEntryClass(){
      return (status)=>{
        const mapping = ['entry-to-start','entry-in-progress','entry-disabled']

        return 'entry '+mapping[status]
      }
    },
    getTimeListTs(){
      return ()=>{

        const minStartTs = this.hr2Ts(this.min_start)
        const maxEndTs = this.hr2Ts(this.max_end)

        const tempList = _.range(minStartTs, maxEndTs+1, SEC_PER_MIN*15);

        return tempList
      }
    },
    getEvent(){
      return (date,room_id,time)=>{
        return _.find(this.events,{ 'date': date, 'room_id': room_id, 'start_time':time })
      }
    }
  },
  mounted() {
    this.timeListTs = this.getTimeListTs()
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
    scrollHorizontal(){
      const that = this
      const scrollDom = document.getElementById('table-container')
      const table = document.getElementById('meeting-table')


      if (window.requestAnimationFrame) {
        let fun = () => {
          scrollDom.scrollLeft = that.scrollLeft / 100 * (table.scrollWidth-scrollDom.clientWidth)
        };
        window.requestAnimationFrame(fun);
      }
    },
    scrollVertical(){

      const that = this
      const scrollDom = document.getElementById('table-container')
      const table = document.getElementById('meeting-table')


      if (window.requestAnimationFrame) {
        let fun = () => {
          scrollDom.scrollTop = (100-that.scrollTop) / 100 * (table.scrollHeight-scrollDom.clientHeight)
        };
        window.requestAnimationFrame(fun);
      }
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
      }, 20000000)
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
      console.log("Home toMeet room", room)
      console.log("Home toMeet time", time)
      console.log("Home toMeet day", day)
      this.form_mode = 0
      this.addParams.room_id = room.room_id
      const [tmp_area_name, tmp_room_name] = room.room_name.split(" ")
      this.addParams.room_name = tmp_room_name
      this.addParams.area_id = room.area_id
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
      this.dialogMeetForm = true
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
      this.filterDateStore.setArea(e)
      this.filterDateStore.setAreaName(areaName)
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
        // 2024-11-01(2024-11-01 00:00:00) 2024-11-09(2024-11-09 23:59:59)
        this.startTime = start_date
        this.endTime = end_date
        console.log('Home choseDate start_date-end_date',start_date,end_date)
        this.startStamp = Common.getTimestamp(start_date,'start')
        this.endStamp = Common.getTimestamp(end_date,'end')
        console.log('Home choseDate this.startStamp-this.endStamp',this.startStamp,this.endStamp)

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
        this.currenTimestamp = data.timestamp
        // max_time: "05:00 AM"
        // min_time: "02:00 PM"
        this.min_start = Common.convertTo24Hour(data.min_time)
        this.max_end = Common.convertTo24Hour(data.max_time)
        console.log('Home getMeetRooms api this.min_start:', this.min_start,data.min_time)
        console.log('Home getMeetRooms api this.max_end:', this.max_end,data.max_time)
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
.main{
  width: 100%;
  overflow:auto;
  height:550px;  /* 设置固定高度 */
  position: relative;

  table {
    table-layout: fixed;
    width: 200px; /* 固定宽度 */
  }

  td, th {
    /* 设置td,th宽度高度 */
    border:1px solid #d8d8d8;
    border-bottom: 0;
    border-right: 0;
    width:100px;
    height:60px;
    box-sizing: border-box;
  }

  /* 第一列  */
  td:first-child, th:first-child {
    position:sticky;
    left:0;
    z-index:20;
    background-color:#fff;
    border-color: transparent;
    width: 90px;
    color: #4e5969;
    text-align: center;
  }
  /* 表头  */
  //thead{
  //  position:sticky;
  //  top:0;
  //  z-index: 19;
  //  background-color: #fff;
  //}

  thead tr th {
    background-color: #e4daf3;
    width: 200px;
    height: 30px;
    font-weight: normal;
  }

  thead tr:first-of-type th{
    position:sticky;
    top:0;
    z-index: 19;
  }

  thead tr:last-of-type th{
    position:sticky;
    top:30px;
    z-index: 19;
  }

  /* 左上角  */
  thead tr th:first-child{
    z-index:21;
    background-color:#fff;
  }

  /* 逻辑元素：会议  */
  .entry-wrapper{ /* 外层  */
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;

    .entry-content{
      position: absolute;
      z-index: 16;

      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      color: white;
      background-color: #6a1b9a;
      transition: opacity 0.3s ease;
      opacity: 0;
    }

    .entry-content:hover{
      opacity: 1;
    }

    .entry-content-disabled{
      background-color: #cecece;
    }


    .entry{ /* 内层，绝对定位  */
      position: absolute;
      z-index: 17;
      height: 200px;
      width: 100%;
      background-color: #eee;
      color: #3D3D3D;
      border: 1px solid #E1E1E1;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
    }

    .entry-to-start{
      background-color: rgba(117, 249, 253, 0.22);
    }

    .entry-in-progress{
      background-color: rgba(245, 63, 63, 0.22);
    }

    .entry-disabled{
      background-color: #F7F8FA;
    }

    .entry-disabled:hover{
      cursor: not-allowed;
    }

    .entry-to-start:hover{
      background-color: rgba(118, 207, 211, 0.5);
      transition: 0.3s;
      cursor: pointer;
    }

    .entry-in-progress:hover{
      background-color: rgba(220, 102, 102, 0.5);
      transition: 0.3s;
      cursor: pointer;
    }

  }

}


* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.toolbar {
  display: flex;
  width: 100%;
  //height: 60px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;

  .toolbar-filter {
    display: flex;
    align-items: center;
    width: auto;

    .now-time {
      display: flex;
      flex-direction: row;
      justify-content: center;

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
    }

    .all-area {
      margin-left: 35px;
      min-width: 100px;
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

  }
}

.slider-container-horizontal{
  position: fixed;
  z-index: 999;
  width: calc(100vw - 189px - 40px);
  bottom: 0;
  right: 20px;
}

.slider-container-vertical{
  position: fixed;
  z-index: 999;
  bottom: 20px;
  right: 0;
}

</style>