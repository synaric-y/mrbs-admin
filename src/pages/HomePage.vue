<template>
  <div class="toolbar">
    <el-row :gutter="10">
      <el-col :span="7">
        <el-icon class="home-time-icon">
        </el-icon>
        <span class="now-time">{{ nowTime }}</span>
      </el-col>
      <el-col :span="3">
        <el-select v-model="currenAreaName" placeholder="All Areas" @change="choseArea">
          <el-option v-for="(area, index) in areas" :label="area.area_name" :value="area.area_id"
            :key="index"></el-option>
        </el-select>
      </el-col>

      <el-col :span="10">
        <el-button-group class="buttons-margin">
          <el-button :class="[dayRrangeVal == 1 ? 'button-selected' : 'button-normal']" @click="dayRrange(1)">{{
            $t('base.today') }}</el-button>
          <el-button :class="[dayRrangeVal == 3 ? 'button-selected' : 'button-normal']" @click="dayRrange(3)">{{
            $t('base.threeDays') }}</el-button>
          <el-button :class="[dayRrangeVal == 7 ? 'button-selected' : 'button-normal']" @click="dayRrange(7)">{{
            $t('base.week') }}</el-button>
        </el-button-group>
      </el-col>

      <el-col :span="2" class="home-calendar">
        <el-icon class="home-calendar-icon" type="text"></el-icon>
      </el-col>
      <el-col :span="6">
        <el-date-picker v-model="baseTime" type="daterange" :range-separator="$t('base.to')"
          :start-placeholder="startTime" :end-placeholder="endTime" @change="choseDate"  clearable="false"/>
      </el-col>
    </el-row>
  </div>

  <div class="table-container">
    <el-scrollbar class="scroll-table-view" :style="{ height: (this.screenHeight - 170) + 'px' }">
      <div class="calendar-header">
        <div class="time-header">
          <div class="time-slots">
            <div v-for="(time, timeIndex) in timeSlots" :key="time" class="time-slot">
              {{ time }}
            </div>
          </div>
        </div>
        <div v-for="(day, indexday) in days" :key="indexday" class="day-header" :style="{ backgroundColor: day.color }">
          {{ day.date }}
          <div class="room-header">
            <div v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-name"
              :style="{ height: timeSlots.length * 60 + 50 + 'px', width: itemWidth + 'px' }">
              {{ room.room_name }}
              <template v-for="(time, timeIndex) in localTimeSlots">
                <div class="empty-meet-div"
                  :style="{ height: 60 + 'px', width: itemWidth + 'px', top: (timeIndex * 60 + 70)  + 'px' }"
                  @click="toMeet(time, room, day)">
                  <text class="empty-meet-duration">{{ time }}</text>
                </div>
              </template>
              <template v-for="(event, indexeve) in events">
                <template v-if="day.date == event.date && room.room_id == event.room_id">
                  <template v-if="event.status == 0">
                    <div :key="indexeve" class="room-meet-event" @click="editMeet(event)"
                      :style="{ top: 60 * getTimeSlotIndex(event.startTime) + 70 + 'px', left: ((itemWidth + 20) * roomIndex) + 'px', width: itemWidth + 'px', height: (getTimeSlotIndex(event.endTime) - getTimeSlotIndex(event.startTime)) * 60 + 'px' }">
                      <div class="event-center">
                        <div class="event-title">{{ event.entry_name }}</div>
                        <div class="event-time">{{ event.duration }}</div>
                        <div class="event-person">{{ event.book_by }}</div>
                      </div>
                    </div>
                  </template>
                  <template v-if="event.status == 1">
                    <div :key="indexeve" class="room-meet-in-event" @click="editMeet(event)"
                      :style="{ top: 60 * getTimeSlotIndex(event.startTime) + 70 + 'px', left: ((itemWidth + 20) * roomIndex) + 'px', width: itemWidth + 'px', height: (getTimeSlotIndex(event.endTime) - getTimeSlotIndex(event.startTime)) * 60 + 'px' }">
                      <div class="event-center">
                        <div class="event-title" style="color: black;">{{ event.entry_name }}</div>
                        <div class="event-time" style="color: black;">{{ event.duration }}</div>
                        <div class="event-person" style="color: black;">{{ event.book_by }}</div>
                      </div>
                    </div>
                  </template>
                  <template v-if="event.status == 2">
                    <div :key="indexeve" class="room-meet-timeout-event"
                      :style="{ top: 60 * getTimeSlotIndex(event.startTime) + 70 + 'px', left: ((itemWidth + 20) * roomIndex) + 'px', width: itemWidth + 'px', height: (getTimeSlotIndex(event.endTime) - getTimeSlotIndex(event.startTime)) * 60 + 'px' }">
                      <div class="event-center">
                        <div class="event-title">{{ event.entry_name }}</div>
                        <div class="event-time">{{ event.duration }}</div>
                        <div class="event-person">{{ event.book_by }}</div>
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
    <!-- <div class="empty-bottom"></div> -->
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { ElButton, ElButtonGroup, ElCol, ElIcon, ElOption, ElRow, ElSelect } from 'element-plus';
import moment from "moment";
import { PageMixin } from "@/pages/PageMixin.js";
import { Common } from "@/common/common";
import { ElMessage } from "element-plus/es";
import { Api } from '@/network/api';
import { STORAGE } from "@/config";
import { STORAGE_DAY, STORAGE_IS_EDIT } from '@/const';

const size = ref < 'default' | 'large' | 'small' > ('default')
const value1 = ref('')

export default defineComponent({
  mixins: [PageMixin],
  components: {
    ElRow,
    ElCol,
    ElSelect,
    ElOption,
    ElButton,
    ElIcon,
    ElButtonGroup,
  },
  data() {
    return {
      currenArea: '',
      currenAreaName: this.$t('base.all'),
      customDate: null,
      hoursNumber: 24,
      dayRrangeVal: STORAGE_DAY.THREE,
      baseTime: '',
      startTime: this.$t('base.startDate'),
      endTime: this.$t('base.endDate'),
      areas: [],
      // tempNetworkAreas:[],
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
      // localRooms: ["A", "B", "C", "D"],
    };
  },

  mounted() {
    // window.onload = window.onresize = function () {
    //   console.log('Home  window.onload zoom')
    //   document.body.style.zoom = 1.0
    // };
    this.setTab('/')
    console.log('Home getBrowserLanguege:', Common.getBrowserLanguege())
    this.localLangFormat = Common.getBrowserLanguege()
    const screenWidth = window.screen.width
    this.screenSize['width'] = screenWidth
    const screenHeight = window.screen.height
    this.screenSize['height'] = screenHeight
    this.screenHeight = screenHeight
    console.log('Home screenSize:', this.screenSize)
    this.startSync()
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
      }, 20000)
    },
    getSyncInterval() {
      console.log('Home getSyncInterval')
      const selectDays = Number(localStorage.getItem(STORAGE.SELECT_DAYS))
      const selectStartDate = localStorage.getItem(STORAGE.SELECT_START_DATE)
      const selectEndDate = localStorage.getItem(STORAGE.SELECT_END_DATE)
      const selectArea = localStorage.getItem(STORAGE.SELECT_AREA)
      const selectAreaName = localStorage.getItem(STORAGE.SELECT_AREA_NAME)
      this.getAllAreas();
      if (selectStartDate && selectEndDate) {
        this.startTime = selectStartDate
        this.endTime = selectEndDate
        const days = this.getDaysBetween(selectStartDate, selectEndDate)
        const tempdays = this.formatDays(days)
        this.days = tempdays
        // this.getMeetRooms()
      } else {
        this.startStamp = Common.getThreeDaysTimestamps().start
        this.endStamp = Common.getThreeDaysTimestamps().end
        if (selectDays) {
          this.dayRrangeVal = selectDays
          this.dayRrange(selectDays)
          // this.getMeetRooms();
        } else {
          this.dayRrange(STORAGE_DAY.THREE);
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
      Api.getAreaRooms({}).then(({ data, code }) => {
        if (code != 0) {
          ElMessage({
            message: this.$t('base.getAreaError'),
            type: 'error'
          })
          return
        }
        let areas = data.areas
        const firstArea = {
          "area_id": "",
          "area_name": this.$t('base.all'),
          "rooms": []
        }
        data.splice(0, 0, firstArea)
        this.areas = areas
        // this.tempNetworkAreas = data.areas
      })
    },

    getCurrentAreaRooms(area_id) {
      // this.rooms = this.localRooms
      // console.log('Home getCurrentAreaRooms area_id', area_id)
      // console.log('Home getCurrentAreaRooms this.areas', this.areas)
      // const tempArea = this.this.tempNetworkAreas.filter(area => area.area_id == area_id)
      // if (this.dayRrangeVal != 0) {
      //   this.dayRrange(this.dayRrangeVal)
      // }
      // console.log('Home getCurrentAreaRooms data', tempArea)
      // this.rooms = this.getAllRoom(tempArea)
      // this.getMeetRooms()
      // return
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
        this.getMeetRooms()
      })
    },

    getEventStyle(event) {
      const startHour = parseInt(event.startTime.split(':')[0])
      const endHour = parseInt(event.endTime.split(':')[0])
      const startMin = parseInt(event.startTime.split(':')[1].replace('AM', '').replace('PM', ''))
      const endMin = parseInt(event.endTime.split(':')[1].replace('AM', '').replace('PM', ''))
      const startPosition = ((startHour - 9) * 60 + startMin) / 60 * 60
      const endPosition = ((endHour - 9) * 60 + endMin) / 60 * 60
      const duration = endPosition - startPosition
      return {
        top: `${startPosition}px`,
        height: `${duration}px`,
      };
    },

    getTimeSlotIndex(time) {
      const [hour, minutePeriod] = time.split(":")
      const [minute, period] = [minutePeriod.slice(0, -2), minutePeriod.slice(-2)]
      const baseTime = `${hour.padStart(2, '0')}:00${period.toUpperCase()}`
      const baseIndex = this.timeSlots.indexOf(baseTime)
      if (baseIndex === -1) {
        return -1
      }
      if (minute === "30") {
        return baseIndex + 1
      }
      return baseIndex
    },

    dayRrange(day) {
      let days = []
      let tempTime = {}
      if (day == STORAGE_DAY.TODAY) {
        console.log('Home One Days:', this.getCurrenDay())
        days = this.getCurrenDay()
        tempTime = Common.getTodayTimestamps()
        console.log(Common.getTodayTimestamps())
      } else if (day == STORAGE_DAY.THREE) {
        console.log('Home Next Three Days:', this.getThreeDays())
        days = this.getThreeDays()
        tempTime = Common.getThreeDaysTimestamps()
        console.log(Common.getThreeDaysTimestamps())
      } else if (day == STORAGE_DAY.WEEK) {
        console.log('Home Week Days:', this.getCurrenWeek())
        days = this.getCurrenWeek()
        tempTime = Common.getThisWeekTimestamps()
        console.log(Common.getThisWeekTimestamps())
      } else {
        console.log('Home Next Three Days:', this.getThreeDays())
        days = this.getThreeDays()
        tempTime = Common.getThreeDaysTimestamps()
        console.log(Common.getThreeDaysTimestamps())
      }
      localStorage.setItem(STORAGE.SELECT_DAYS, day)
      this.startStamp = tempTime.start
      this.endStamp = tempTime.end
      this.startTime = moment(tempTime.start * 1000).format('YYYY-MM-DD')
      this.endTime = moment(tempTime.end * 1000).format('YYYY-MM-DD')
      localStorage.setItem(STORAGE.SELECT_START_DATE, this.startTime)
      localStorage.setItem(STORAGE.SELECT_END_DATE, this.endTime)
      console.log('Home dayRrange tempTime', this.startTime, this.endTime)
      this.dayRrangeVal = day
      this.days = this.formatDays(days)
      this.getMeetRooms()
    },

    getCurrenDay() {
      const today = moment()
      const oneDays = [
        Common.translateWeekDay(today.format(this.localLangFormat)),
      ];
      return oneDays
    },

    getThreeDays() {
      const today = moment();
      const nextThreeDays = [
        Common.translateWeekDay(today.format(this.localLangFormat)),
        Common.translateWeekDay(today.add(1, 'days').format(this.localLangFormat)),
        Common.translateWeekDay(today.add(1, 'days').format(this.localLangFormat))
      ];
      return nextThreeDays
    },

    getCurrenWeek() {
      const startOfWeek = moment().startOf('week')
      const endOfWeek = moment().endOf('week')
      const weekDays = []
      let day = startOfWeek
      while (day <= endOfWeek) {
        weekDays.push(Common.translateWeekDay(day.format(this.localLangFormat)))
        day = day.add(1, 'days');
      }
      return weekDays
    },

    getDaysBetween(startDate, endDate) {
      console.log('Home getDaysBetween startDate endDate', startDate, endDate)
      const start = moment(startDate)
      const end = moment(endDate)
      this.dayRrangeVal = 0
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

    toMeet(time, room, day) {
      // const timeZone = Common.getCurrenTimeZone()
      const lang = Common.getLocalLang()
      // console.log("Home toMeet day.date timeZone lang",day.date,timeZone,lang)
      // const formatTime = Common.formatDateWithTimeZone(day.date, timeZone, lang, this.localLangFormat)
      // console.log("Home toMeet formatTime",formatTime)

      Common.getTimestampForWeek(day.date,lang);
      // const endTime = Common.formatDate(end_time, 'Asia/Shanghai', 'zh-cn', this.localLangFormat);

      if (room.disabled == STORAGE_IS_EDIT.DISABLED) {
        console.log('Home toMeet disabled', room.disabled)
        return
      }
      console.log('Home toMeet time', day)
      const dayTimestamp = moment(day.date, this.localLangFormat).unix()
      const ymd = moment(dayTimestamp * 1000).format('YYYY-MM-DD')
      console.log('Home toMeet ymd', ymd)
      console.log('Home toMeet time', time)
      const tempTime = Common.getTimestampFromDateAndTime(ymd, time)
      console.log('Home toMeet tempTime:', tempTime)
      this.push(`/meet_detail/0/${room.room_id}/${room.area_id}/${tempTime}`)
    },

    editMeet(event) {
      if (event.disabled == STORAGE_IS_EDIT.DISABLED) {
        console.log('Home editMeet disabled', event.disabled)
        return
      }
      this.push(`/meet_detail/${event.entry_id}/${event.room_id}/${event.area_id}/0`)
    },

    choseArea(e) {
      this.currenArea = e;
      console.log('Home choseArea e')
      localStorage.setItem(STORAGE.SELECT_AREA, e)
      const area = this.areas.filter(area => area.area_id == e)
      console.log('Home choseArea areaName', area)
      const areaName = area[0].area_name
      this.currenAreaName = areaName
      localStorage.setItem(STORAGE.SELECT_AREA, e)
      localStorage.setItem(STORAGE.SELECT_AREA_NAME, areaName)
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
        localStorage.setItem(STORAGE.SELECT_START_DATE, start_date)
        localStorage.setItem(STORAGE.SELECT_END_DATE, end_date)
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
      if (this.startTime && this.startTime != this.$t('base.startDate')) {
        this.startStamp = this.formatTime(this.startTime) || 0
        this.endStamp = this.formatTime(this.endTime) || 0
      } else {
        const temp = Common.getThreeDaysTimestamps()
        this.startStamp = temp.start
        this.endStamp = temp.end
      }
      const itemNumber = this.rooms.length * this.days.length
      if (itemNumber == 1) {
        this.itemWidth = this.screenSize['width']
      } else if (itemNumber >= 2 && itemNumber <= 6) {
        this.itemWidth = this.screenSize['width'] / itemNumber * 2
      } else {
        this.itemWidth = 228
      }
      console.log('Home getMeetRooms currenArea:  start: end: ', this.currenArea, this.startStamp, this.endStamp);
      Api.getMeetRooms({ id: this.currenArea, start_time: this.startStamp / 1000, end_time: this.endStamp / 1000 }).then(({ data, code }) => {
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

<style scoped>
::-webkit-scrollbar {
  display: none;
}

* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.container-sub-page-main {
  min-width: 930px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
}

.toolbar {
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 150px;
  padding-right: 150px;
}

.now-time {
  font-size: 16px;
  color: #333333;
}

.home-time-icon {
  width: 20px;
  height: 20px;
  background-image: url('/imgs/home_time_icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
}

.buttons-margin {
  margin-left: 60px;
}

.button-selected {
  height: 30px;
  line-height: 30px;
  background-color: rgba(89, 27, 183, 1);
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  text-align: center;
  font-family: Roboto;
}

.button-normal {
  height: 30px;
  line-height: 30px;
  color: rgba(89, 27, 183, 1);
  font-size: 14px;
  text-align: center;
  font-family: Roboto;
  border: 2px solid rgba(89, 27, 183, 1);
}

.el-icon {
  margin-right: 8px;
}

.el-row {
  flex-wrap: nowrap;
}

.el-col {
  display: flex;
  align-items: center;
}

.el-button-group .el-button {
  margin-right: 0px;
  margin-left: 0px;
}

.el-select {
  min-width: 150px;
}

.home-calendar-icon {
  width: 30px;
  height: 30px;
  margin-right: -70px;
  background-image: url('/imgs/home_calendar_icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
}

.home-calendar {
  margin-left: 20px;
}

.table-container {
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
}

.scroll-table-view {
  /* height: 420px; */
  height: 550px;
  width: 100%;
}

.scroll-table-big-view {
  height: 660px;
  width: 100%;
}

.calendar-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  font-family: Arial, sans-serif;
}

.calendar-header {
  display: flex;
  flex-direction: row;
  background-color: #f0f0f0;
  text-align: center;
  width: 50%;
  padding: 5px;
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
  font-weight: bold;
  z-index: 1000;
}

.time-slot {
  height: 60px;
  color: #000;
  font-size: 16px;
  color: #000000;
  font-weight: normal;
  font-family: PingFangSC-regular;
  text-align: right;
}

.empty-meet-div {
  position: absolute;
  top: 100px;
  width: 60px;
  height: 60px;
  transition: all 0.3s ease;
}

.empty-meet-duration {
  color: #e1e1e1;
  font-size: 16px;
}

.empty-meet-div:hover {
  color: white;
  background-color: rgba(89, 27, 183, 1);
}

.day-header {
  padding: 5px 0px;
  padding-bottom: 0px;
  color: #FFFFFF;
  font-size: 12px;
  -webkit-line-clamp: 2;
  /* height: 60px; */
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
}

.room-name {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  height: 800px;
  padding: 10px;
  padding-bottom: 0px;
  border-right: 1px solid #9A9A9A;
  background-color: #e1e1e1;
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
  background-color: #ffb3b3;
  width: 218px;
  padding: 0px 5px;
  margin: 2px 0;
  color: #000;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-left: 10px solid #ff9999;
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