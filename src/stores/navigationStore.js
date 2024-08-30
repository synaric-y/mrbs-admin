import { defineStore } from 'pinia'
import router from "@/router/index.js";


export const NavigationStore = defineStore('navigation', {
  state: () => ({ currentTab: '/' }),
  getters: {
    // double: (state) => state.currentTab,
  },
  actions: {
    setTab(path) {
      this.currentTab = path
    }
  }
})
