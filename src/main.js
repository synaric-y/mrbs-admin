import ElementPlus from 'element-plus'
import '@/assets/mytheme.scss'
// import 'element-plus/dist/index.css'
import en from 'element-plus/es/locale/lang/en'
import VueCookies from 'vue3-cookies';
import {createI18n} from "vue-i18n";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import {messages} from "@/assets/language/lang.js";

const app = createApp(App)

router.afterEach((to, from) => {
    // 基准
    const baseSize = 16
    // 设置 rem 函数
    function setRem() {
        // 当前页面宽度相对于 1920宽的缩放比例，可根据自己需要修改。
        const scale = document.documentElement.clientWidth / 1920
        // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
        document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
    }
    setRem()
})

app.use(createPinia())
app.use(router)
app.use(VueCookies)
app.use(ElementPlus, {
    locale: en,
})

const i18n = createI18n({
    legacy: false,
    locale: 'en', // set locale
    messages, // set locale messages
})
app.use(i18n)

app.mount('#app')
