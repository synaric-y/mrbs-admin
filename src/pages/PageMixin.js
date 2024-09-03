import {mapActions, mapState, mapStores} from "pinia";
import {NavigationStore} from "@/stores/navigationStore.js";
import {STORAGE} from "@/config.js";

export const PageMixin = {

    computed: {
        ...mapStores(NavigationStore),
        ...mapState(NavigationStore, ['currentTab'])
    },
    methods: {
        ...mapActions(NavigationStore, ['setTab']),
        switchTab(path) {
            this.setTab(path)
            this.$router.replace(path)
        },
        push(path) {
            this.$router.push(path)
        },
        replace(path) {
            this.$router.replace(path)
        },
        back() {
            this.$router.back()
        },
        login(info) {
            localStorage.setItem(STORAGE.USER_INFO, JSON.stringify(info))
        },
        logout() {
            localStorage.removeItem(STORAGE.USER_INFO)
            // document.cookie = ''
        },
        getUserInfo() {
            let json = localStorage.getItem(STORAGE.USER_INFO)
            if (json) {
                return JSON.parse(json)
            }
            return null
        },
    }
}