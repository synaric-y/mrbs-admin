import {defineStore} from 'pinia'
import router from "@/router/index.js";
import {STORAGE} from "@/const.js";
import {Api} from "@/network/api.js";


export const SettingStore = defineStore('setting', {
    state: () => ({
        lang: 'en',
    }),
    getters: {
        getLang: (state) => {
            let lang = navigator.language || navigator.userLanguage;
            if (!lang) {
                lang = 'en'
            } else if (lang.startsWith('zh')) {
                lang = 'zh'
            } else if (lang.startsWith('ko')) {
                lang = 'ko'
            } else {
                lang = 'en'
            }
            return lang
        },
    },

    actions: {
        setLang(lang) {
            this.lang = lang
        }
    }
})
