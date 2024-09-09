import momentzone from "moment-timezone";
import moment from "moment";

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

    static getTimestampForWeek(weekDay, lang, timeZone) {

        // 获取时间对应的日期格式
        // 2024-09-09 12:00 +0800 2024-09-09 12:00 -0400 2024-09-09 12:00 +0900
        var zh = moment.tz("2024-09-09 12:00:00", "Asia/Shanghai").format('YYYY-MM-DD HH:mm ZZ');
        var en = moment.tz("2024-09-09 12:00:00", "America/New_York").format('YYYY-MM-DD HH:mm ZZ');
        var ko = moment.tz("2024-09-09 12:00:00", "Asia/Seoul").format('YYYY-MM-DD HH:mm ZZ');
        console.log('getTimestampForWeek zh: en: ko:', zh, en, ko)

        // 获取指定时间、时区的时间戳
        // 1725854400 1725897600 1725850800
        var zhtemp = moment.tz("2024-09-09 12:00:00", "Asia/Shanghai").unix();
        var entmp = moment.tz("2024-09-09 12:00:00", "America/New_York").unix();
        var kotmp = moment.tz("2024-09-09 12:00:00", "Asia/Seoul").unix();
        console.log('getTimestampForWeek zhtemp: entmp: kotmp:', zhtemp, entmp, kotmp)

        // 获取时间戳对应的日期格式
        // 2024-09-09 12:00 2024-09-09 12:00 2024-09-09 12:00
        var zhFormat = moment.tz(zhtemp * 1000, "Asia/Shanghai").format('YYYY-MM-DD HH:mm');
        var enFormat = moment.tz(entmp * 1000, "America/New_York").format('YYYY-MM-DD HH:mm');
        var koFormat = moment.tz(kotmp * 1000, "Asia/Seoul").format('YYYY-MM-DD HH:mm');
        console.log('getTimestampForWeek zhFormat: enFormat: kotmp:', zhFormat, enFormat, koFormat)

        return


        // 获取日期格式对应
        var zhFormat = moment.tz("Thursday, 09/05/2024", "Asia/Shanghai").unix();
        var enFormat = moment.tz("2024年09月05日 星期四", "America/New_York").unix();
        var koFormat = moment.tz("2024년09월05일 목요일", "Asia/Seoul").unix();
        console.log('getTimestampForWeek zhFormat: enFormat: kotmp:', zhFormat, enFormat, koFormat)
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

    static getTodayTimestamps(timeZone) {
        // const now = new Date();
        // const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        // const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
        // return {
        //     start: Math.floor(startOfDay / 1000),
        //     end: Math.floor(endOfDay / 1000)
        // };

        // 获取当天的开始时间 (00:00:00)
        const startOfDay = moment.tz(timeZone).startOf('day').unix(); // 返回秒级时间戳
        // 获取当天的结束时间 (23:59:59)
        const endOfDay = moment.tz(timeZone).endOf('day').unix(); // 返回秒级时间戳
        return {
            start: startOfDay,
            end: endOfDay
        };
    }

    static getThreeDaysTimestamps(timeZone) {
        // const now = new Date();
        // const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        // const endOfThreeDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 23, 59, 59, 999).getTime();
        // return {
        //     start: Math.floor(startOfDay / 1000),
        //     end: Math.floor(endOfThreeDays / 1000)
        // };

        // 获取当天的开始时间 (00:00:00)
        const startOfDay = moment.tz(timeZone).startOf('day').unix(); // 返回秒级时间戳
        // 获取三天后的结束时间 (第三天的 23:59:59)
        const endOfThreeDays = moment.tz(timeZone).add(3, 'days').endOf('day').unix(); // 返回秒级时间戳
        return {
            start: startOfDay,  // 今天的 00:00:00 时间戳
            end: endOfThreeDays // 三天后的 23:59:59 时间戳
        };
    }

    static getThisWeekTimestamps(timeZone) {
        // const now = new Date();
        // const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
        // const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7, 23, 59, 59, 999).getTime();
        // return {
        //     start: Math.floor(startOfWeek / 1000),
        //     end: Math.floor(endOfWeek / 1000)
        // };

        // 获取本周的开始时间（周日的 00:00:00）
        const startOfWeek = moment.tz(timeZone).startOf('week').unix(); // 返回秒级时间戳
        // 获取本周的结束时间（周六的 23:59:59）
        const endOfWeek = moment.tz(timeZone).endOf('week').unix(); // 返回秒级时间戳
        return {
            start: startOfWeek,  // 本周开始时间 00:00:00
            end: endOfWeek       // 本周结束时间 23:59:59
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