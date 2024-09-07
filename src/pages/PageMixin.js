import {mapActions, mapGetters, mapState, mapStores} from "pinia";
import {NavigationStore} from "@/stores/navigationStore.js";
import {UserStore} from "@/stores/userStore.js";
import {SettingStore} from "@/stores/settingStore.js";

export const PageMixin = {

    computed: {
        ...mapStores(NavigationStore, UserStore, SettingStore),
        ...mapState(NavigationStore, ['currentTab']),
        ...mapState(UserStore, ['userInfo', 'isLoginPage']),
        ...mapState(SettingStore, ['getLang'])
    },
    methods: {
        ...mapActions(NavigationStore, ['setTab']),
        ...mapActions(UserStore, ['login', 'logout', 'getCacheUserInfo', 'enterLogin', 'exitLogin']),
        ...mapActions(SettingStore, ['setLang']),
        switchTab(path) {
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
    },
    mounted() {
        this.getCacheUserInfo()
    }
}