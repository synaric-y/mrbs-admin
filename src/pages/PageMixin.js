import {mapActions, mapState, mapStores} from "pinia";
import {NavigationStore} from "@/stores/navigationStore.js";
import router from "@/router/index.js";

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
        }
    }
}