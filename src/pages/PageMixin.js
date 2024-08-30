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
            router.replace(path)
        },
        push(path) {
            router.push(path)
        },
        replace(path) {
            router.replace(path)
        }
    }
}