<template>
  <div class="toolbar">
    <!-- Icon and Date-Time -->
    <el-row :gutter="20">
      <!-- Current Date -->
      <el-col :span="8">
        <el-icon class="home-time-icon">
        </el-icon>
        <span>{{ currentDateTime }}</span>
      </el-col>
      <!-- Dropdown Room -->
      <el-col :span="3">
        <el-select v-model="selectedRoom" placeholder="All Rooms" @change="choseArea">
          <el-option label="All Areas" value="All"></el-option>
          <el-option v-for="(area, index) in areas" :label="area.area_name" :value="area.area_id"
            :key="index"></el-option>
          <!-- <el-option label="Room A" value="A"></el-option>
            <el-option label="Room B" value="B"></el-option>
            <el-option label="Room C" value="C"></el-option>
            <el-option label="Room D" value="D"></el-option> -->
        </el-select>
      </el-col>
      <!-- Calendar Icon -->
      <el-col :span="2" class="home-calendar">
        <el-icon class="home-calendar-icon" type="text"></el-icon>
      </el-col>
      <!-- Buttons Group -->
      <el-col :span="8">
        <el-button-group>
          <el-button :class="[dayRrangeVal == 1 ? 'button-selected' : 'button-normal']"
            @click="dayRrange(1)">Today</el-button>
          <el-button :class="[dayRrangeVal == 3 ? 'button-selected' : 'button-normal']" @click="dayRrange(3)">3
            Days</el-button>
          <el-button :class="[dayRrangeVal == 7 ? 'button-selected' : 'button-normal']"
            @click="dayRrange(7)">Week</el-button>
        </el-button-group>
      </el-col>
      <!-- Date-picker -->
      <el-col :span="6">
        <el-date-picker v-model="baseTime" type="daterange" range-separator="To" :start-placeholder="startTime"
          :end-placeholder="endTime" @change="choseDate" />
      </el-col>
    </el-row>
  </div>

  <div class="table-container">
    <el-scrollbar ref="scrollContainer" class="scroll-table-view" always>
      <!-- calendar header -->
      <div class="calendar-header">
        <!-- time line -->
        <div class="time-header">
          <div class="time-slots">
            <div v-for="(time, timeIndex) in timeSlots" :key="time" class="time-slot">
              {{ time }}
            </div>
          </div>
        </div>
        <!-- day room -->
        <div v-for="(day, indexday) in days" :key="indexday" class="day-header" :style="{ backgroundColor: day.color }">
          {{ day.date }}
          <div class="room-header">
            <div v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-name"
              :style="{ height: timeSlots.length * 60 + 40 + 'px', width: itemWidth + 'px' }">
              {{ room.room_name }}
              <template v-for="(time, timeIndex) in tempTimeSlots">
                <div class="empty-meet-div"
                  :style="{ height: 55 + 'px', width: itemWidth + 'px', top: (timeIndex + 1) * 60 + 'px' }"
                  @click="toMeet(time, room)"></div>
              </template>

              <template v-for="(event, indexeve) in events">
                <!-- Rooms and Schedule -->
                <template v-if="day.date == event.date && room.room_id == event.room_id">
                  <div :key="indexeve" class="room-meet-event" @click="editMeet(event)"
                    :style="{ top: 60 * getTimeSlotIndex(event.startTime) + 60 + 'px', left: ((itemWidth + 20) * roomIndex) + 'px', width: itemWidth + 'px', height: (getTimeSlotIndex(event.endTime) - getTimeSlotIndex(event.startTime)) * 60 + 'px' }">
                    <div class="event-title">{{ event.entry_name }}</div>
                    <div class="event-time">{{ event.duration }}</div>
                    <div class="event-person">{{ event.book_by }}</div>
                  </div>
                </template>
              </template>
            </div>
            <div class="room-devide-line"></div>
          </div>
        </div>
      </div>
      <!-- test -->
      <template v-if="getTimeSlotIndex(testam)">
      </template>
    </el-scrollbar>
  </div>
</template>

<script>

import router from "@/router/index.js";
import { defineComponent } from 'vue';
import { ElRow, ElCol, ElSelect, ElOption, ElButton, ElIcon, ElButtonGroup } from 'element-plus';
// picker date
import { ref } from 'vue'
import { Api } from '@/network/api';
import { areaData, homeData } from './home';
const size = ref < 'default' | 'large' | 'small' > ('default')
const value1 = ref('')
import moment from "moment";
import { PageMixin } from "@/pages/PageMixin.js";
import { Common } from "@/common/common";
import { ElMessage } from "element-plus/es";

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
      currentDateTime: '12:00 pm August 30, 2024',
      selectedRoom: 'All',
      currenArea: '',
      customDate: null,
      hoursNumber: 24,
      testam: '09:00AM',
      dayRrangeVal: 3,
      baseTime: '',
      startTime: 'Start date',
      endTime: 'End date',
      areas: [],
      meetRooms: [],
      screenSize: {},
      itemWidth: 228,
      scrollY: 0,
      startStamp: 0,
      endStamp: 0,
      days: [
        { date: "Monday, September 2nd 2024", color: "#6a1b9a" },
        { date: "Tuesday, September 3rd 2024", color: "#0288d1" },
        { date: "Wednesday, September 4th 2024", color: "#6a1b9a" },
        { date: "Thursday, September 5th 2024", color: "#0288d1" },
      ],
      rooms: ["Room A", "Room B", "Room C", "Room D"],
      // rooms: ["Room A", "Room B", "Room C", "Room D","Room E","Room F","Room G"],
      timeSlots: [
        "09:00AM", "ㆍ", "10:00AM", "ㆍ", "11:00AM", "ㆍ", "12:00PM", "ㆍ",
        "01:00PM", "ㆍ", "02:00PM", "ㆍ", "03:00PM", "ㆍ", "04:00PM", "ㆍ",
        "05:00PM", "ㆍ", "06:00PM", "ㆍ", "07:00PM", "ㆍ", "08:00PM", "ㆍ", "09:00PM"
      ],
      tempTimeSlots: [
        "09:00AM", "09:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM", "12:00PM", "12:30PM",
        "01:00PM", "01:30PM", "02:00PM", "02:30PM", "03:00PM", "03:30PM", "04:00PM", "04:30PM",
        "05:00PM", "05:30PM", "06:00PM", "06:30PM", "07:00PM", "07:30PM", "08:00PM", "08:30PM", "09:00PM"
      ],
      events: [],
      events1: [
        { date: "Monday, September 2nd 2024", entry_id: 1, room: "Room A", entry_name: "A 24 EN meeting", duration: "09:00AM - 11:30AM", book_by: "Carol", startTime: "09:00AM", endTime: "11:30AM" },
        { date: "Monday, September 2nd 2024", entry_id: 2, room: "Room B", entry_name: "B 24 EN meeting", duration: "10:00AM - 11:30AM", book_by: "Carol", startTime: "10:00AM", endTime: "11:30AM" },
        { date: "Monday, September 2nd 2024", entry_id: 3, room: "Room C", entry_name: "C 24 EN meeting", duration: "12:00PM - 01:30PM", book_by: "Carol", startTime: "12:00PM", endTime: "01:30PM" },
        { date: "Monday, September 2nd 2024", entry_id: 4, room: "Room D", entry_name: "D 24 EN meeting", duration: "03:00PM - 04:30PM", book_by: "Carol", startTime: "03:00PM", endTime: "04:30PM" },
        { date: "Tuesday, September 3rd 2024", entry_id: 5, room: "Room C", entry_name: "C 25 EN meeting", duration: "03:00PM - 06:00PM", book_by: "John Zhang", startTime: "03:00PM", endTime: "06:00PM" },
        { date: "Wednesday, September 4th 2024", entry_id: 6, room: "Room B", entry_name: "B 26 Quick meeting", duration: "12:30PM - 01:00PM", book_by: "N/A", startTime: "12:30PM", endTime: "01:00PM" },
        { date: "Thursday, September 5th 2024", entry_id: 7, room: "Room D", entry_name: "D 27 Research meeting", duration: "01:00PM - 02:00PM", book_by: "Tina", startTime: "01:00PM", endTime: "02:00PM" },
        { date: "Wednesday, September 4th 2024", entry_id: 8, room: "Room B", entry_name: "B 26 Research meeting", duration: "01:30PM - 03:00PM", book_by: "Zhang", startTime: "01:30PM", endTime: "03:00PM" },
      ]
    };
  },




  mounted() {
    const screenWidth = window.screen.width;
    this.screenSize['width'] = screenWidth;
    const screenHeight = window.screen.height;
    this.screenSize['height'] = screenHeight;
    console.log('当前屏幕的高度为:', this.screenSize, '像素');
    console.log('mounted getRooms enter')
    this.startStamp = Common.getThreeDaysTimestamps().start
    this.endStamp = Common.getThreeDaysTimestamps().end



    Api.getAreaRooms({}).then(data => {
      console.log('mounted getRooms data:', data)
      if (!data) {
        ElMessage({
          message: this.$t('base.getAreaError'),
          type: 'fail'
        })
        return
      }
      console.log('mounted this.areas data', data)
      this.areas = data.areas
      this.rooms = this.getAllRoom(data)
      this.getMeetRooms()
    })
  },

  methods: {
    getAllRoom(data) {
      // 拼接 entries 数组
      const allRoom = [];
      data.areas.forEach(area => {
        const areaId = area.area_id;
        const areaName = area.area_name;
        area.rooms.forEach(room => {
          const roomId = room.room_id;
          const roomName = room.room_name;
           // 拼接信息
           allRoom.push({
              area_id: areaId,
              area_name: areaName,
              room_id: roomId,
              room_name: `${areaName} ${roomName}`,
            });
        });
      });
      console.log('allRoom:', allRoom)
      return allRoom
    },

    getEventStyle(event) {
      const startHour = parseInt(event.startTime.split(':')[0]);
      const endHour = parseInt(event.endTime.split(':')[0]);
      const startMin = parseInt(event.startTime.split(':')[1].replace('AM', '').replace('PM', ''));
      const endMin = parseInt(event.endTime.split(':')[1].replace('AM', '').replace('PM', ''));
      const startPosition = ((startHour - 9) * 60 + startMin) / 60 * 60;
      const endPosition = ((endHour - 9) * 60 + endMin) / 60 * 60;
      const duration = endPosition - startPosition;
      return {
        top: `${startPosition}px`,
        height: `${duration}px`,
      };
    },

    getTimeSlotIndex(time) {
      const [hour, minutePeriod] = time.split(":");
      const [minute, period] = [minutePeriod.slice(0, -2), minutePeriod.slice(-2)];
      const baseTime = `${hour.padStart(2, '0')}:00${period.toUpperCase()}`;
      const baseIndex = this.timeSlots.indexOf(baseTime);
      if (baseIndex === -1) {
        return -1;
      }
      if (minute === "30") {
        return baseIndex + 1;
      }
      return baseIndex;
    },

    dayRrange(day) {
      this.dayRrangeVal = day;
      let days = [];
      let tempTime = {};
      if (day == 1) {
        console.log('One Days:', this.getCurrenDay());
        days = this.getCurrenDay();
        tempTime = Common.getTodayTimestamps()
        console.log(Common.getTodayTimestamps())
      } else if (day == 3) {
        console.log('Next Three Days:', this.getThreeDays());
        days = this.getThreeDays();
        tempTime = Common.getThreeDaysTimestamps()
        console.log(Common.getThreeDaysTimestamps())
      } else if (day == 7) {
        console.log('Week Days:', this.getCurrenWeek());
        days = this.getCurrenWeek();
        tempTime = Common.getThisWeekTimestamps()
        console.log(Common.getThisWeekTimestamps())
      } else {
        console.log('Next Three Days:', this.getThreeDays());
        days = this.getThreeDays();
        tempTime = Common.getThreeDaysTimestamps()
        console.log(Common.getThreeDaysTimestamps())
      }
      this.startStamp = tempTime.start
      this.endStamp = tempTime.end
      this.days = this.formatDays(days);
      this.getMeetRooms();
    },

    getCurrenDay() {
      const today = moment();
      const oneDays = [
        today.format('dddd, MMMM Do YYYY'),
      ];
      return oneDays;
    },

    getThreeDays() {
      const today = moment();
      const nextThreeDays = [
        today.format('dddd, MMMM Do YYYY'),
        today.add(1, 'days').format('dddd, MMMM Do YYYY'),
        today.add(1, 'days').format('dddd, MMMM Do YYYY')
      ];
      return nextThreeDays;
    },

    getCurrenWeek() {
      const startOfWeek = moment().startOf('week');
      const endOfWeek = moment().endOf('week');
      const weekDays = [];
      let day = startOfWeek;
      while (day <= endOfWeek) {
        weekDays.push(day.format('dddd, MMMM Do YYYY'));
        day = day.add(1, 'days');
      }
      return weekDays;
    },

    getDaysBetween(startDate, endDate) {
      console.log('getDaysBetween startDate', startDate);
      console.log('getDaysBetween endDate', endDate);
      const start = moment(startDate);
      const end = moment(endDate);
      const days = [];
      while (start <= end) {
        days.push(start.format('dddd, MMMM Do YYYY'));
        start.add(1, 'days');
      }
      console.log('getDaysBetween days', days);
      return days;
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

    toMeet(time, room) {
      console.log('toMeet time:', time, room)
      this.push(`/meet_detail/0`);
    },

    editMeet(event) {
      this.push(`/meet_detail/${event.entry_id}`);
    },

    choseArea(e) {
      this.currenArea = e;
      console.log('choseArea currenArea', this.currenArea);
      this.getAreaRooms();
      this.getMeetRooms();
    },

    getAreaRooms() {
      console.log('getAreaRooms this.currenArea', this.currenArea);
      if (this.currenArea == 'All' || this.currenArea == '') {
        const temprooms = this.areas.flatMap(area => area.rooms);
        this.rooms = temprooms.flatMap(room => room.room_name);
        console.log('getAreaRooms all rooms:', this.rooms);
      } else {
        const temprooms = this.areas.find(area => area.area_id == this.currenArea);
        this.rooms = temprooms.rooms.flatMap(room => room.room_name);
        console.log('getAreaRooms currenArea rooms:', this.rooms);
      }
    },

    choseDate(e) {
      if (e.length > 0) {
        this.startTime = e[0];
        this.endTime = e[1];
        this.getMeetRooms();
        const days = this.getDaysBetween(moment(e[0]).format('YYYY-MM-DD'), moment(e[1]).format('YYYY-MM-DD'));
        const tempdays = this.formatDays(days);
        console.log('tempdays:', tempdays);
        this.days = tempdays;
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
      console.log('getMeetRooms enter');
      if (this.startTime && this.startTime != 'Start date') {
        this.startStamp = this.formatTime(this.startTime) || 0;
        this.endStamp = this.formatTime(this.endTime) || 0;
      } else {
        const temp = Common.getThreeDaysTimestamps()
        this.startStamp = temp.start
        this.endStamp = temp.end
      }
      const itemNumber = this.rooms.length * this.days.length;
      console.log('getMeetRooms itemNumber:', itemNumber);
      // 动态计算会议的宽度
      if (itemNumber == 1) {
        this.itemWidth = this.screenSize['width'];
      } else if (itemNumber >= 2 && itemNumber <= 6) {
        this.itemWidth = this.screenSize['width'] / itemNumber * 2;
      } else {
        this.itemWidth = 228;
      }
      // console.log('getMeetRooms itemWidth:', this.itemWidth);
      console.log('getMeetRooms currenArea:  start: end: ', this.currenArea, this.startStamp, this.endStamp);
      // 获取开始、结束时间的时间戳
      Api.getMeetRooms({ id: this.currenArea, start_time: this.startStamp, end_time: this.endStamp }).then(data => {
        if (!data) {
          return
        }
        console.log('getMeetRooms api data:', data)
        this.getInMeeting(data)
      })
    },

    getInMeeting(data) {
      if (!data || data.area_room == null || data.area_room.length == 0) {
        return
      }
      // 拼接 entries 数组
      const entriesRoom = [];
      data.area_room.forEach(area => {
        const areaId = area.area_id;
        const areaName = area.area_name;
        area.rooms.forEach(room => {
          const roomId = room.room_id;
          const roomName = room.room_name;
          room.entries.forEach(entry => {
            // 拼接信息
            entriesRoom.push({
              area_id: areaId,
              area_name: areaName,
              room_id: roomId,
              room_name: roomName,
              date: moment(entry.start_time).format('dddd, MMMM Do YYYY'),
              startTime: entry.duration.split('-')[0].trim(),
              endTime: entry.duration.split('-')[1].trim(),
              ...entry
            });
          });
        });
      });
      this.events = entriesRoom
      console.log('getMeetRooms entriesRoom:', entriesRoom)
    },
  }

});
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 150px;
  padding-right: 150px;
}

.home-time-icon {
  width: 30px;
  height: 30px;
  background-image: url('/imgs/home_time_icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
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
  margin-right: 30px;
}

.el-select {
  min-width: 150px;
}

.home-calendar-icon {
  width: 30px;
  height: 30px;
  background-image: url('/imgs/home_calendar_icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
}

.home-calendar {
  margin-left: 100px;
}

.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

.table-container {
  display: flex;
  position: relative;
  flex: 1;
}

.scroll-table-view {
  height: 700px;
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
  /* background-color: red; */
  transition: all 0.3s ease;
}

.empty-meet-div:hover {
  background-color: beige;
}

.day-header {
  padding: 5px 0px;
  padding-bottom: 0px;
  color: #FFFFFF;
  font-size: 18px;
}

.room-header {
  display: flex;
  color: #000000;
  font-size: 20px;
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
  position: absolute;
  left: 5px;
  right: 5px;
  background-color: #e1f5fe;
  border-radius: 4px;
  width: 218px;
  padding: 5px;
  margin: 2px 0;
  color: #000;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  border-left: 10px solid #54BCBD;
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
</style>