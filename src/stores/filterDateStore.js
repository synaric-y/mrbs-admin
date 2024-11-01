import { defineStore } from 'pinia'
import router from "@/router/index.js";


export const FilterDateStore = defineStore('filterDate', {
  state: () => ({ days: '1', startDate: '', endDate: '', area: '', areaName: 'all',cycleDays: '1',cycleStartDate: '', cycleEndDate: '', cycleArea: '', cycleAreaName: 'all' }),
  getters: {
    daysFn: (state) => state.days,
    startDateFn: (state) => state.startDate,
    endDateFn: (state) => state.endDate,
    areaFn: (state) => state.area,
    areaNameFn: (state) => state.areaName,

    daysCycleFn: (state) => state.cycleDays,
    startDateCycleFn: (state) => state.cycleStartDate,
    endDateCycleFn: (state) => state.cycleEndDate,
    areaCycleFn: (state) => state.cycleArea,
    areaNameCycleFn: (state) => state.cycleAreaName,
  },
  actions: {
    setDays(day) {
      this.days = day
    },

    setCycleDays(day) {
      this.cycleDays = day
    },

    setStartDate(date) {
      this.startDate = date
    },

    setCycleStartDate(date) {
      this.cycleStartDate = date
    },

    setEndDate(date) {
      this.endDate = date
    },

    setCycleEndDate(date) {
      this.cycleEndDate = date
    },

    setArea(area_id) {
      this.area = area_id
    },

    setCycleArea(area_id) {
      this.cycleArea = area_id
    },

    setAreaName(area_name) {
      this.areaName = area_name
    },

    setCycleAreaName(area_name) {
      this.cycleAreaName = area_name
    },

  }
})
