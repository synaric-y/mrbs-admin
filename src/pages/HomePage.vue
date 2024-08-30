<template>

  <div class="toolbar">
    <!-- Icon and Date-Time -->
    <el-row :gutter="20" align="middle">
      <!-- Current Date -->
      <el-col :span="8">
        <el-icon class="home-time-icon">
          <!-- <location /> -->
        </el-icon>
        <span>{{ currentDateTime }}</span>
      </el-col>

      <!-- Dropdown Room -->
      <el-col :span="3">
        <el-select v-model="selectedRoom" placeholder="All Rooms">
          <el-option label="All Rooms" value="all"></el-option>
          <el-option label="Room A" value="room1"></el-option>
          <el-option label="Room B" value="room2"></el-option>
          <el-option label="Room C" value="room3"></el-option>
          <el-option label="Room D" value="room4"></el-option>
        </el-select>
      </el-col>
      <!-- Calendar Icon -->
      <el-col :span="2" class="home-calendar">
        <el-icon class="home-calendar-icon" type="text"></el-icon>
      </el-col>
      <!-- Buttons Group -->
      <el-col :span="8">
        <el-button-group>
          <el-button type="primary">Today</el-button>
          <el-button>3 Days</el-button>
          <el-button>Week</el-button>
        </el-button-group>
      </el-col>
      <!-- Date-picker -->
      <el-col :span="6">
        <el-date-picker v-model="value1" type="daterange" range-separator="To" start-placeholder="Start date"
          end-placeholder="End date" :size="size" />
      </el-col>
    </el-row>
  </div>

  <div class="table-container">
    <el-scrollbar class="scroll-table-view" always>
      <!-- calendar header -->
      <div class="calendar-header">
        <!-- time line -->
        <div class="time-header">
          <div class="time-slots">
            <div v-for="time in timeSlots" :key="time" class="time-slot">
              {{ time }}
            </div>
          </div>
        </div>
        <!-- day room -->
        <div v-for="(day, indexday) in days" :key="indexday" class="day-header" :style="{ backgroundColor: day.color }">
          {{ day.date }}
          <div class="room-header">
            <div v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-name"
              :style="{ height: timeSlots.length * 60 + 30 + 'px' }">
              {{ room }}
              <template v-for="(event, indexeve) in events">
                <!-- Rooms and Schedule -->
                <!--  计算当前会议是属于day、room、time-line -->
                <template v-if="day.date == event.date && room == event.room">
                  <div :key="indexeve" class="room-meet-event" :style="{ top: 60*getTimeSlotIndex(event.startTime) + 60 + 'px', left: (228*roomIndex + (indexday>=1?1:0)*20) + 'px', height: (getTimeSlotIndex(event.endTime) - getTimeSlotIndex(event.startTime)) * 60 + 'px'}">
                    <div class="event-title">{{ event.title }}</div>
                    <div class="event-time">{{ event.time }}</div>
                    <div class="event-person">{{ event.person }}</div>
                  </div>
                </template>
              </template>
            </div>
            <div class="room-devide-line"></div>
          </div>
        </div>
      </div>

      <template v-if="getTimeSlotIndex(testam)">

      </template>

      <template v-if="getTimeSlotIndex(testam2)">

</template>
<template v-if="getTimeSlotIndex(testam3)">

</template>

      <!-- <div class="room-schedules">
            <div v-for="room in rooms" :key="room" class="room-column">
              <div v-for="(event, index) in getEventsForRoom(room)" :key="index" class="event"
                :style="getEventStyle(event)">
                <div class="event-title">{{ event.title }}</div>
                <div class="event-time">{{ event.time }}</div>
                <div class="event-person">{{ event.person }}</div>
              </div>
            </div>
          </div> -->

    </el-scrollbar>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ElRow, ElCol, ElSelect, ElOption, ElButton, ElIcon, ElButtonGroup } from 'element-plus';
import { Location } from '@element-plus/icons-vue';

// picker date
import { ref } from 'vue'
const size = ref < 'default' | 'large' | 'small' > ('default')
const value1 = ref('')

export default defineComponent({
  components: {
    ElRow,
    ElCol,
    ElSelect,
    ElOption,
    ElButton,
    ElIcon,
    ElButtonGroup,
    Location,
  },
  data() {
    return {
      currentDateTime: '12:00 pm August 30, 2024',
      selectedRoom: 'all',
      customDate: null,
      hoursNumber: 24,
      testam:'09:00AM',
      testam2:'11:30AM',
      testam3:'05:30PM',

      days: [
        { date: "Saturday, August 24, 2024", color: "#6a1b9a" },
        { date: "Sunday, August 25, 2024", color: "#0288d1" },
        { date: "Monday, August 26, 2024", color: "#6a1b9a" },
        { date: "Tuesday, August 27, 2024", color: "#0288d1" },
      ],
      rooms: ["Room A", "Room B", "Room C", "Room D"],
      // rooms: ["Room A", "Room B", "Room C", "Room D","Room E","Room F","Room G"],
      timeSlots: [
        "09:00AM", "ㆍ", "10:00AM", "ㆍ", "11:00AM", "ㆍ", "12:00PM", "ㆍ",
        "01:00PM", "ㆍ", "02:00PM", "ㆍ", "03:00PM", "ㆍ", "04:00PM", "ㆍ",
        "05:00PM", "ㆍ", "06:00PM", "ㆍ", "07:00PM", "ㆍ", "08:00PM", "ㆍ", "09:00PM"
      ],
      events: [
        { date: "Saturday, August 24, 2024", room: "Room A", title: "A 24 EN meeting", time: "09:00AM - 11:30AM", person: "Carol", startTime: "09:00AM", endTime: "11:30AM" },
        { date: "Sunday, August 25, 2024", room: "Room C", title: "C 25 EN meeting", time: "03:00PM - 06:00PM", person: "John Zhang", startTime: "03:00PM", endTime: "06:00PM" },
        { date: "Monday, August 26, 2024", room: "Room B", title: "B 26 Quick meeting", time: "12:30PM - 01:00PM", person: "N/A", startTime: "12:30PM", endTime: "01:00PM" },
        { date: "Tuesday, August 27, 2024", room: "Room D", title: "D 27 Research meeting", time: "01:00PM - 02:00PM", person: "Tina", startTime: "01:00PM", endTime: "02:00PM" },
        { date: "Monday, August 26, 2024", room: "Room B", title: "B 26 Research meeting", time: "01:30PM - 03:00PM", person: "Zhang", startTime: "01:30PM", endTime: "03:00PM" },
      ]
    };
  },


  methods: {
    getEventsForRoom(room) {
      return this.events.filter(event => event.room === room);
    },
    getEventStyle(event) {
      const startHour = parseInt(event.startTime.split(':')[0]);
      const endHour = parseInt(event.endTime.split(':')[0]);
      const startMin = parseInt(event.startTime.split(':')[1].replace('AM', '').replace('PM', ''));
      const endMin = parseInt(event.endTime.split(':')[1].replace('AM', '').replace('PM', ''));
      const startPosition = ((startHour - 9) * 60 + startMin) / 60 * 60; // assuming the calendar starts at 9am
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
    }
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
  background-color: #b33e3e;
}

.home-time-icon {
  width: 30px;
  height: 30px;
  background-image: url('@/assets/icons/home_time_icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
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
  background-image: url('@/assets/icons/home_calendar_icon.png');
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
}

.scroll-table-view {
  height: 700px;
  width: 100%;
}

.calendar-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 600px; */
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
  font-weight: bold;
  color: white;
}

.time-slots {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  font-weight: bold;
  /* background-color: #b33e3e; */
}

.time-slot {
  height: 60px;
  color: #000;
  background-color: #c61010;
  font-size: 16px;
  text-align: right;
}

.day-header {
  /* padding: 10px; */
}

.room-header {
  display: flex;
  background-color: #c61010;
  text-align: center;
  padding: 5px 0px;
  font-weight: bold;
  position: relative;
}

.room-name {
  flex-shrink: 0;
  display: flex;
  /* align-items: center; */
  justify-content: center;
  width: 218px;
  height: 800px;
  padding: 10px;
  /* border-left: 1px solid #b33e3e; */
  border-right: 1px solid #b33e3e;
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