import {defineStore} from 'pinia'
import router from "@/router/index.js";
import {STORAGE} from "@/const.js";
import {Api} from "@/network/api.js";


export const UserStore = defineStore('user', {
    state: () => ({
        userInfo: {level: 0},
        isLoginPage: false,
    }),
    getters: {
        // double: (state) => state.currentTab,
    },

    actions: {
        login(info) {
            if (info) {
                this.userInfo = info
            }
            localStorage.setItem(STORAGE.USER_INFO, JSON.stringify(info))
        },
        logout(callback) {
            localStorage.removeItem(STORAGE.USER_INFO)
            this.userInfo = {level: 0}
            Api.logout({}).then(() => {
                if (callback) {
                    callback()
                }
            })
        },
        enterLogin() {
            this.isLoginPage = true
            let user = localStorage.getItem(STORAGE.USER_INFO)
            if (!user) {
                this.userInfo = {level: 0}
            }
        },
        exitLogin() {
            this.isLoginPage = false
        },
        getCacheUserInfo() {
            let user = localStorage.getItem(STORAGE.USER_INFO)
            if (user && (!this.userInfo || !this.userInfo.display_name)) {
                this.userInfo = JSON.parse(user)
            }
            return user
        }
    }
})
