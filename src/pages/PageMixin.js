import {mapActions, mapState, mapStores} from "pinia";
import {NavigationStore} from "@/stores/navigationStore.js";
import {STORAGE} from "@/config.js";
import {Api} from "@/network/api.js";
import {UserStore} from "@/stores/userStore.js";

export const PageMixin = {

    computed: {
        ...mapStores(NavigationStore, UserStore),
        ...mapState(NavigationStore, ['currentTab']),
        ...mapState(UserStore, ['userInfo', 'isLoginPage'])
    },
    methods: {
        ...mapActions(NavigationStore, ['setTab']),
        ...mapActions(UserStore, ['login', 'logout', 'getCacheUserInfo', 'enterLogin', 'exitLogin']),
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
        // login(info) {
        //     if (info) {
        //         this.userInfo = info
        //     }
        //     localStorage.setItem(STORAGE.USER_INFO, JSON.stringify(info))
        // },
        // logout(callback) {
        //     localStorage.removeItem(STORAGE.USER_INFO)
        //     this.userInfo = {level: 0}
        //     Api.logout({}).then(() => {
        //         if (callback) {
        //             callback()
        //         }
        //     })
        // },
    }
}