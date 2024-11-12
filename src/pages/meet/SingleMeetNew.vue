<template>
  <el-container class="container-sub-page">
    <el-main class="container-sub-page-main">
      <div class="sub-page-content">
        <div class="title-container">
          <div class="title">单次会议</div>
          <div class="toolbar" v-if="!showLoading">
            <div class="toolbar-filter">
              <!--          <div class="now-time">-->
              <!--            <el-icon class="home-time-icon"></el-icon>-->
              <!--            <span class="now-time-span">{{ nowTime }}</span>-->
              <!--          </div>-->
              <div class="all-area">
                <el-select v-model="currenAreaName" placeholder="All Areas" @change="chooseArea">
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
        </div>


        <div class="section">
          <el-skeleton v-if="showLoading" :rows="15" animated />
          <div class="main" id="table-container">
            <template v-for="(e,eventIndex) in events" :key="eventIndex">
              <div :class="e.class_name" :style="'top:'+e.top+'px;height:'+e.height+'px;width:200px;left:'+getEntryLeft(e.date,e.room_id)+'px'" @click="editMeet(e)">
                <div class="event-title">{{ e.entry_name }}</div>
                <div class="event-time">{{ e.duration }}</div>
                <div class="event-person">{{ e.book_by }}</div>
              </div>
            </template>

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
                  <template v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-name">
                    <th>{{ room.display_room_name }}</th>
                  </template>
                </template>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(time, timeIndex) in timeListTs" :key="timeIndex" class="time-slot">
                <td>
                  <div class="time">{{ ts2Hr(time) }}</div>
                </td>
                <template v-for="(day, dayIndex) in days" :key="dayIndex" class="day-header"
                          :style="{ backgroundColor: day.color }">
                  <template v-for="(room, roomIndex) in rooms" :key="roomIndex" class="room-name">
                    <td>
                      <div class="entry-wrapper">
                        <div :class="[getMeetStatusText(day, room, ts2Hr(time)) === $t('base.roomAbled') ? 'entry-content' : 'entry-content entry-content-disabled']"
                             @click="toMeet(time, room, day)">
                          <text class="empty-meet-duration">{{ ts2Hr(time) }}</text>
                          <text class="empty-meet-reason">{{ getMeetStatusText(day, room, ts2Hr(time)) }}</text>
                        </div>
                      </div>
                    </td>
                  </template>
                </template>

              </tr>
              </tbody>
            </table>

          </div>
        </div>



      </div>

    </el-main>
    <div class="slider-container-horizontal">
      <el-slider v-model="scrollLeft" @input="scrollHorizontal" />
    </div>
    <div class="slider-container-vertical">
      <el-slider :show-tooltip="false" v-model="scrollTop" vertical height="calc( 100vh - 75px - 40px )" @input="scrollVertical" />
    </div>
  </el-container>




  <SingleMeetCMP
      v-if="dialogMeetForm"
      :mode="form_mode"
      :add_params="addParams"
      :areas="page_cache_areas"
      :entry_id="entry_id"
      @close="()=>{dialogMeetForm=false;getAllMeetings()}"/>
  <CycleMeetCMP
      v-if="dialogCycleMeetForm"
      :mode="form_mode"
      :add_params="addParams"
      :areas="page_cache_areas"
      :repeat_id="repeat_id"
      :entry_id="entry_id"
      @close="()=>{dialogCycleMeetForm=false;getAllMeetings()}" />

</template>

<script>
import {defineComponent} from 'vue';
import {PageMixin} from "@/pages/PageMixin.js";
import {Common} from "@/common/common";
import {ElMessage} from "element-plus/es";
import {Api} from '@/network/api';
import {MEETING_STATUS, ROOM_STATUS, SELECT_DAY, STORAGE, USER_TYPE} from "@/const";
import moment from 'moment';
import {FilterDateStore} from '@/stores/filterDateStore';
import SingleMeetCMP from '@/components/SingleMeetCMP.vue';
import CycleMeetCMP from '@/components/CycleMeetCMP.vue';
import Layout from "@/components/Layout.vue";
import _ from "lodash"
import dayjs from "dayjs";

const SEC_PER_MIN = 60
const PX_PER_15MIN = 60 // 每15分钟px（height）
const WIDTH_PER_ROOM = 200 // 每个房间宽度px（width）

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
      areas: [],
      meetRooms: [],
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
      dialogMeetForm: false,
      dialogCycleMeetForm: false,
      form_mode: 0,
      currentHourMinute: '',
      currentTimeZone: 'Asia/Shanghai',
      page_cache_areas: [], // area选择器缓存的数据，含房间信息
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
      return (hrStr,dateTs)=>{
        const hr = parseInt(hrStr.split(':')[0]);
        const min = parseInt(hrStr.split(':')[1]);

        if(dateTs) return dayjs.unix(dateTs).startOf('day').add(hr, 'hour').add(min,'minute').unix()

        return dayjs().startOf('day').add(hr, 'hour').add(min,'minute').unix()
      }
    },
    ts2Hr(){
      return (ts)=>{
        return dayjs.unix(ts).format('hh:mm A')
      }
    },
    getDayWidth(){
      return this.rooms.length * WIDTH_PER_ROOM
    },
    getEntryTop(){
      return (start_time)=>{
        const begTs = this.hr2Ts(this.min_start,start_time)

        const begDayObj = dayjs.unix(begTs)
        const endDayObj = dayjs.unix(start_time)

        const mins = endDayObj.diff(begDayObj, 'minute')

        return Math.trunc(mins / 15) * PX_PER_15MIN + 60 // 表头空间
      }
    },
    getEntryLeft(){
      return (date,room_id)=>{
        const idx = _.findIndex(this.rooms,{'room_id':room_id})
        console.log(idx)

        return idx*WIDTH_PER_ROOM + 90
      }
    },
    getEntryHeight(){
      return (start_time,end_time)=>{

        const begDayObj = dayjs.unix(start_time)
        const endDayObj = dayjs.unix(end_time)

        const mins = endDayObj.diff(begDayObj, 'minute')

        return Math.trunc(mins / 15) * PX_PER_15MIN
      }
    },
    getEntryClass(){
      return (status, disabled)=>{

        // console.log(status,disabled)

        if(disabled) return 'entry entry-disabled'

        const mapping = ['entry-to-start','entry-in-progress','entry-disabled']

        return 'entry '+mapping[status]
      }
    },
    getTimeListTs(){
      return ()=>{

        const minStartTs = this.hr2Ts(this.min_start)
        const maxEndTs = this.hr2Ts(this.max_end)

        return _.range(minStartTs, maxEndTs + 1, SEC_PER_MIN * 15)
      }
    }
  },
  mounted() {
    // 左侧时间轴
    this.timeListTs = this.getTimeListTs()

    this.localLangFormat = Common.getBrowserLanguege()

    this.currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    this.startSync()
    this.$nextTick(() => {
      this.showLoading = false
    })
  },

  methods: {

    stopSync(){
      this.interval && clearInterval(this.interval)
      this.interval = null
    },
    startSync() {
      this.stopSync()

      // 开启定时器
      this.getSyncInterval()
      this.interval = setInterval(() => { // 5小时？
        this.getSyncInterval()
      }, 20000000)
    },
    getSyncInterval() {

      this.days = this.getDays(1,this.currentTimeZone)
      this.getAllAreas()
          .then(this.getAllRoom)
          .then(this.getAllMeetings)
    },

    getAllAreas() {
      return new Promise((resolve, reject)=>{
        if (this.page_cache_areas && this.page_cache_areas.length > 0){
          resolve(0)
          return // 有缓存
        }

        // 无缓存
        Api.getAreaRooms().then(({ data, code, msg }) => {
          if (!data && code !== 0) {
            ElMessage({
              message: this.$t('base.getAreaError'),
              type: 'error'
            })
            reject()
            return
          }

          let temp_areas = data.areas
          temp_areas.unshift({
            "area_id": "0",
            "area_name": this.$t('base.all'),
            "resolution": '1800',
            "rooms": []
          })


          this.page_cache_areas = temp_areas
          resolve(0)

        })
      })
    },

    // 特定区域的房间，看areas传什么
    getAllRoom(area_id) {
      return new Promise((resolve, reject) => {
        let areas = []

        if(area_id && area_id !== 0 && area_id !== '0')
          areas = [_.find(this.page_cache_areas,{'area_id': area_id})]
        else
          areas = this.page_cache_areas

        const res = []
        _.forEach(areas,area=>{
          _.forEach(area.rooms, room=>{
            res.push(
                {
                  area_id: area.area_id,
                  area_name: area.area_name,
                  resolution: area.resolution,
                  start_time: area.start_time,
                  end_time: area.end_time,
                  disabled: room.disabled,
                  room_id: room.room_id,
                  display_room_name: `${area.area_name} ${room.room_name}`,
                  room_name: room.room_name
                }
            )
          })
        })

        this.rooms = res

        resolve()
      })
    },

    getDays(number,timeZone){
      console.log(number,timeZone)
      const today = moment().tz(timeZone);

      let res = []
      for (let i = 0; i < number; i++)
        res.push(
            {
              date: Common.translateWeekDay(today.add(i, 'days').format(this.localLangFormat)),
              color: i % 2 === 0 ? "#6a1b9a": "#0288d1"
            }
        )

      return res
    },

    dayRrange(day) {

      this.dayRrangeVal = day

      this.startStamp = moment.tz(this.currentTimeZone).startOf('day').unix();
      this.endStamp = moment.tz(this.currentTimeZone).add(day,'day').endOf('day').unix();

      this.startTime = moment.tz(this.startStamp * 1000, this.currentTimeZone).format('YYYY-MM-DD')
      this.endTime = moment.tz(this.endStamp * 1000, this.currentTimeZone).format('YYYY-MM-DD')

      console.log(day)
      this.days = this.getDays(day,this.currentTimeZone)

      this.getAllMeetings()
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
      if (room.disabled == ROOM_STATUS.DISABLED) { // 禁用的房间不能开启会议
        console.log('Home toMeet disabled', room.disabled)
        return
      }

      if (this.normalUser()) { // 普通用户不能开启会议
        return
      }

      this.form_mode = 0

      this.addParams.room_id = room.room_id
      this.addParams.room_name = room.room_name
      this.addParams.area_id = room.area_id
      this.addParams.area_name = room.area_name
      this.addParams.timeStamp = time

      // const lang = Common.getLocalLang()
      // console.log("Home toMeet day.date timeZone lang", day.date, this.currentTimeZone, this.localLangFormat)
      // console.log("Home toMeet formatTime date", day.date)
      // const appeedStr = day.date + ' ' + time
      // console.log('Home toMeet appeedStr', appeedStr)
      // const formatStr = Common.getAssignFormatWithAM(appeedStr, lang)
      // console.log('Home toMeet formatStr', formatStr)
      // const nextTimeStamp = moment.tz(formatStr, this.currentTimeZone).unix();
      // console.log('Home toMeet nextTimeStamp currenTimestamp', nextTimeStamp, this.currenTimestamp)
      // this.addParams.timeStamp = nextTimeStamp
      // if (nextTimeStamp < this.currenTimestamp) {
      //   return
      // }

      
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

    chooseArea(area_id) {

      console.log(area_id)

      this.currenArea = area_id;
      this.currenAreaName = _.find(this.page_cache_areas,{'area_id':area_id}).area_name

      Promise.all([this.getAllRoom(area_id),this.getAllMeetings()])

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

        this.getAllMeetings()
        const days = this.getDaysBetween(start_date, end_date)
        const tempdays = this.formatDays(days)
        console.log('Home tempdays:', tempdays)
        this.days = tempdays
      }
    },

    getAllMeetings() { // 获取所有会议
      return new Promise((resolve, reject)=>{
        console.log('Home getAllMeetings enter')
        if (this.startStamp && this.endStamp) {
        } else {
          const temp = Common.getThreeDaysTimestamps()
          this.startStamp = temp.start
          this.endStamp = temp.end
        }

        console.log('Home getAllMeetings currenArea:  start: end: ', this.currenArea, this.startStamp, this.endStamp);
        Api.getMeetRooms({
          id: this.currenArea,
          start_time: this.startStamp,
          end_time: this.endStamp,
          timezone: this.currentTimeZone
        }).then(({ data, code, msg }) => {
          if (!data && code !== 0) {
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
          console.log('Home getAllMeetings api this.min_start:', this.min_start,data.min_time)
          console.log('Home getAllMeetings api this.max_end:', this.max_end,data.max_time)
          this.nowTime = data.time
          this.getInMeeting(data?.areas)
          this.$nextTick(() => {
            this.showLoading = false
          })
        })
      })
    },

    getInMeeting(areas) { // 格式化会议
      if (!areas || areas.length === 0) return

      const that = this
      const entriesRoom = [];

      _.forEach(areas, area=>{
        _.forEach(area.rooms, room=>{
          _.forEach(room.entries, entry=>{
            entriesRoom.push({
              ...entry,
              area_id: area.areaId,
              area_name: area.areaName,
              room_id: room.room_id,
              room_name: room.room_name,
              disabled: room.disabled,
              date: Common.translateWeekDay(moment(Number(entry.start_time * 1000)).format(this.localLangFormat)),
              startTime: entry.duration.split('-')[0].trim(),
              endTime: entry.duration.split('-')[1].trim(),
              height: that.getEntryHeight(entry.start_time,entry.end_time),
              top: that.getEntryTop(entry.start_time),
              class_name: that.getEntryClass(entry.status, room.disabled),
            });
          })
        })
      })

      this.events = entriesRoom
      console.log('Home getAllMeetings entriesRoom:', entriesRoom)
    },

    /*===================================滚动函数======================================*/

    // 横向滚动
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
    // 纵向滚动
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
  },



  unmounted() {
    this.stopSync()
  }
});
</script>

<style lang="scss" scoped>
/* 标题 */
.title{
  font-family: PingFang SC;
  font-size: 20px;
  font-weight: 500;
  flex-shrink: 0;
  align-items: center;
}

.title-container{
  display: flex;
  flex-direction: row;
  justify-content: start;
  gap: 20px;
}

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

    .time{
      color: #4e5969;
      text-align: center;
      transform: translateY(calc(-30px + 50%));
    }
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
    background-color: #e1feff;
  }

  .entry-in-progress{
    background-color: #fdd5d5;
  }

  .entry-disabled{
    background-color: #F7F8FA;
  }

  .entry-disabled:hover{
    cursor: not-allowed;
  }

  .entry-to-start:hover{
    background-color: #bae7e9;
    transition: 0.3s;
    cursor: pointer;
  }

  .entry-in-progress:hover{
    background-color: #edb2b2;
    transition: 0.3s;
    cursor: pointer;
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

  .toolbar-filter {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
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