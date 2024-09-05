import moment from "moment";

export class Common {

    static getBrowserLanguege() {
        let lang = navigator.language || navigator.userLanguage
        console.log('lang:',lang)
        let dateFormat = 'dddd, MMMM Do YYYY'
        if(lang == 'en') {
             dateFormat = 'dddd, MMMM Do YYYY'
        } else if(lang == 'zh-CN') {
             dateFormat = 'YYYY年MM月DD日 dddd'
        } else if(lang == 'ko') {
             dateFormat = 'YYYY년MM월DD일 dddd'
        } else {
            dateFormat = 'dddd, MMMM Do YYYY'
        }
        return dateFormat
    }

    static translateWeekDay(ymdDay) {
        // 2024年09月05日 Thursday
        // 2024년09월05일 Thursday
        let lang = navigator.language || navigator.userLanguage
        if(lang == 'en') {
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
        if(lang == 'zh-CN') {
            return `${datePart} ${weekDays.zh[weekIndex]}`
        } else if(lang == 'ko') {
            return `${datePart} ${weekDays.ko[weekIndex]}`
        } else {
            return ymdDay
        }
    }

    static getTodayTimestamps() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
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