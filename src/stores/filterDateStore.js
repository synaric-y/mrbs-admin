import { defineStore } from 'pinia'
import router from "@/router/index.js";


export const FilterDateStore = defineStore('filterDate', {
  state: () => ({ days: '1', startDate: '', endDate: '', area: 'all-TEST', areaName: 'all' }),
  getters: {
    daysFn: (state) => state.days,
    startDateFn: (state) => state.startDate,
    endDateFn: (state) => state.endDate,
    areaFn: (state) => state.area,
    areaNameFn: (state) => state.areaName,
  },
  actions: {
    setDays(day) {
      this.days = day
    },

    setStartDate(date) {
      this.startDate = date
    },

    setEndDate(date) {
      this.endDate = date
    },

    setArea(area_id) {
      this.area = area_id
    },

    setAreaName(area_name) {
      this.areaName = area_name
    },

  }
})
