import momentzone from "moment-timezone";
import moment  from "moment";

export class Common {

    static getLocalLang() {
        let lang = navigator.language || navigator.userLanguage
        if (lang == 'zh-CN') {
            return 'zh-cn'
        }
        return lang
    }

    static getBrowserLanguege() {
        let lang = navigator.language || navigator.userLanguage
        console.log('lang:', lang)
        let dateFormat = 'dddd, MMMM Do YYYY'
        if (lang == 'en') {
            dateFormat = 'dddd, MMMM Do YYYY'
        } else if (lang == 'zh-CN') {
            dateFormat = 'YYYY年MM月DD日 dddd'
        } else if (lang == 'ko') {
            dateFormat = 'YYYY년MM월DD일 dddd'
        } else {
            dateFormat = 'dddd, MMMM Do YYYY'
        }
        return dateFormat
    }

    static getCurrenTimeZone() {
        let lang = navigator.language || navigator.userLanguage
        let timeZone = 'America/New_York'
        if (lang == 'en') {
            timeZone = 'America/New_York'
        } else if (lang == 'zh-CN') {
            timeZone = 'Asia/Shanghai'
        } else if (lang == 'ko') {
            timeZone = 'Asia/Seoul'
        } else {
            timeZone = 'America/New_York'
        }
        return timeZone
    }

    static getTimestampForWeek(weekDay, lang) {
        if (lang == 'en') {
            moment.locale('en');  // 设置语言为英文（默认）
            const enDate = moment('Thursday, 09/05/2024', 'dddd, MM/DD/YYYY').unix();
            console.log('英文日期:', enDate);  // 输出：1725484800
            return enDate
        } else if (lang == 'zh-cn') {
            moment.locale('zh-cn');  // 设置语言为中文
            // 替换 '年', '月', '日' 为标准的日期格式
            const zhDateStr = '2024年09月05日 星期四';
            const zhFormattedDate = zhDateStr.replace('年', '-').replace('月', '-').replace('日', '').trim();
            const zhDate = moment(zhFormattedDate, 'YYYY-MM-DD dddd').unix();
            console.log('中文日期:', zhDate);  // 输出：1725484800
            return zhDate
        } else if (lang == 'ko') {
            moment.locale('ko');  // 设置语言为韩文
            // 替换 '년', '월', '일' 为标准的日期格式
            const koDateStr = '2024년09월05일 목요일';
            const koFormattedDate = koDateStr.replace('년', '-').replace('월', '-').replace('일', '').trim();
            const koDate = moment(koFormattedDate, 'YYYY-MM-DD dddd').unix();
            console.log('韩文日期:', koDate);  // 输出：1725484800
            return koDate
        }

    }


    static formatDateWithTimeZone(timestamp, timeZone, locale, dateFormat) {
        return moment.unix(timestamp)
            .tz(timeZone)
            .locale(locale)
            .format(dateFormat);
    }

    static translateWeekDay(ymdDay) {
        // 2024年09月05日 Thursday
        // 2024년09월05일 Thursday
        let lang = navigator.language || navigator.userLanguage
        if (lang == 'en') {
            return ymdDay
        }
        const weekDays = {
            zh: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            ko: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
        };
        const [datePart, weekPart] = ymdDay.split(' ');
        const weekIndex = weekDays.en.indexOf(weekPart);
        if (weekIndex === -1) {
            return ymdDay;
        }
        if (lang == 'zh-CN') {
            return `${datePart} ${weekDays.zh[weekIndex]}`
        } else if (lang == 'ko') {
            return `${datePart} ${weekDays.ko[weekIndex]}`
        } else {
            return ymdDay
        }
    }

    static getTodayTimestamps() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59, 999).getTime();
        return {
            start: Math.floor(startOfDay / 1000),
            end: Math.floor(endOfDay / 1000)
        };
    }

    static getThreeDaysTimestamps() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfThreeDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 23, 59, 59, 999).getTime();
        return {
            start: Math.floor(startOfDay / 1000),
            end: Math.floor(endOfThreeDays / 1000)
        };
    }

    static getThisWeekTimestamps() {
        const now = new Date();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).getTime();
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7, 23, 59, 59, 999).getTime();
        return {
            start: Math.floor(startOfWeek / 1000),
            end: Math.floor(endOfWeek / 1000)
        };
    }

    static getTimestampForTodayWithTime(timeString) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const [hours, minutes] = timeString.split(':').map(Number);
        const timeInMs = (hours * 60 * 60) + (minutes * 60);
        return timeInMs;
    }

    static getTimestampFromDateAndTime(dateString, timeString) {
        const [year, month, day] = dateString.split('-').map(Number);
        let [time, modifier] = timeString.split(/(AM|PM)/);
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === "PM" && hours < 12) {
            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }
        const date = new Date(year, month - 1, day, hours, minutes);
        return Math.floor(date.getTime() / 1000);
    }

    static getTimestampForDateAndTime(dateString, timeString) {
        const [year, month, day] = dateString.split('-').map(Number);
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date(year, month - 1, day, hours, minutes);
        return Math.floor(date.getTime() / 1000);
    }

    static getTimestampForTodayWithTime(timeString) {
        const now = moment();
        const time = moment(timeString, 'hh:mmA');
        const combined = now.set({
            hour: time.get('hour'),
            minute: time.get('minute'),
            second: 0,
            millisecond: 0
        });
        return Math.floor(combined.valueOf() / 1000);
    }
} 