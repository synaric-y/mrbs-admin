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
        <div v-for="(day, index) in days" :key="index" class="day-header" :style="{ backgroundColor: day.color }">
          {{ day.date }}
          <div class="room-header">

            <div v-for="room in rooms" :key="room" class="room-name" :style="{height: timeSlots.length * 60 + 30 + 'px'}">
                {{ room }}
              </div>
            <div class="room-devide-line"></div>
          </div>
        </div>
      </div>

      <!-- Rooms and Schedule -->
      <div class="calendar-body">
        <div class="time-room-grid">

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
        </div>
      </div>

      <!--  -->



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

      days: [
        { date: "Friday, August 28, 2024", color: "#6a1b9a" },
        { date: "Saturday, August 29, 2024", color: "#0288d1" },
        { date: "Friday, August 30, 2024", color: "#6a1b9a" },
        { date: "Saturday, August 31, 2024", color: "#0288d1" },
      ],
      rooms: ["Room A", "Room B", "Room C", "Room D"],
      // rooms: ["Room A"],
      timeSlots: [
        "09:00AM", "ㆍ", "10:00AM", "ㆍ", "11:00AM", "ㆍ", "12:00PM", "ㆍ",
        "01:00PM", "ㆍ", "02:00PM", "ㆍ", "03:00PM", "ㆍ", "04:00PM", "ㆍ",
        "05:00PM", "ㆍ", "06:00PM", "ㆍ", "07:00PM", "ㆍ", "08:00PM", "ㆍ", "09:00PM"
      ],
      events: [
        { room: "Room A", title: "EN meeting", time: "09:00am - 11:30am", person: "Carol Zhang", startTime: "09:00am", endTime: "11:30am" },
        { room: "Room B", title: "Quick meeting", time: "12:30pm - 01:00pm", person: "N/A", startTime: "12:30pm", endTime: "01:00pm" },
        { room: "Room C", title: "EN meeting", time: "03:00pm - 06:00pm", person: "Carol Zhang", startTime: "03:00pm", endTime: "06:00pm" },
        { room: "Room D", title: "Research meeting", time: "01:00pm - 02:00pm", person: "Tina Zhang", startTime: "01:00pm", endTime: "02:00pm" },
        { room: "Room B", title: "Research meeting", time: "01:30pm - 03:00pm", person: "Tina Zhang", startTime: "01:30pm", endTime: "03:00pm" },
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
      const startMin = parseInt(event.startTime.split(':')[1].replace('am', '').replace('pm', ''));
      const endMin = parseInt(event.endTime.split(':')[1].replace('am', '').replace('pm', ''));

      const startPosition = ((startHour - 9) * 60 + startMin) / 60 * 60; // assuming the calendar starts at 9am
      const endPosition = ((endHour - 9) * 60 + endMin) / 60 * 60;
      const duration = endPosition - startPosition;

      return {
        top: `${startPosition}px`,
        height: `${duration}px`,
      };
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

.time-room-grid {
  display: flex;
  grid-template-columns: 150px 1fr;
  flex-grow: 1;
}

.room-schedules {
  display: flex;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  border-left: 1px solid #e0e0e0;
}

.room-column {
  position: relative;
  border-right: 1px solid #e0e0e0;
  min-height: 600px;
  /* Adjust based on total time slots */
}

.event {
  position: absolute;
  left: 5px;
  right: 5px;
  background-color: #e1f5fe;
  border-radius: 4px;
  padding: 5px;
  margin: 2px 0;
  color: #000;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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