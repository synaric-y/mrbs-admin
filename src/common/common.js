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
        if (lang == 'en-US' || lang == 'en') {
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
        if (lang == 'en-US' || lang == 'en') {
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

    static getAssignFormatYearToMinute() {
        console.log('common getAssignFormatYearToMinute', lang)
        let format;
        if (lang == 'zh-cn') {
            // 2024年09月09日 星期一 09:00AM
            const parsedDate = moment(dateStr, 'YYYY年MM月DD日 HH:mm');
            const result = parsedDate.format('YYYY-MM-DD HH:mm:ss');
            console.log('common getAssignFormat result', result)
            format = result;
        } else if (lang == 'en-US' || lang == 'en') {
            const parsedDate = moment(dateStr, 'dddd, MMMM Do YYYY HH:mm');
            const result = parsedDate.format('YYYY-MM-DD HH:mm:ss');
            console.log('common getAssignFormat result', result)
            format = result;
        } else if (lang == 'ko') {
            const parsedDate = moment(dateStr, 'YYYY년MM월DD일 H:mm');
            const result = parsedDate.format('YYYY-MM-DD HH:mm:ss');
            console.log('common getAssignFormat result', result)
            format = result
        } else {
            const parsedDate = moment(dateStr, 'YYYY年MM月DD日 HH:mm');
            const result = parsedDate.format('YYYY-MM-DD HH:mm:ss');
            console.log('common getAssignFormat result', result)
            format = result;
        }
        return format
    }

    static getAssignFormat(dateStr, lang) {
        // console.log('common getAssignFormat',lang)
        // 2024年09月09日 星期一 09:00AM
        const parsedDate = moment(dateStr, 'YYYY-MM-DD HH:mm');
        const result = parsedDate.format('YYYY-MM-DD HH:mm:ss');
        console.log('common getAssignFormat result', result)
        return result
    }

    static getAssignFormatWithAM(dateStr, lang) {
        // console.log('common getAssignFormat',lang)
        let format;
        if (lang == 'zh-cn') {
            // 2024年09月09日 星期一 09:00AM
            const parsedDate = moment(dateStr, 'YYYY年MM月DD日 hh:mmA');
            const result = parsedDate.format('YYYY-MM-DD HH:mm:ss');
            format = result;
        } else if (lang == 'en-US' || lang == 'en') {
            const parsedDate = moment(dateStr, 'dddd, MMMM Do YYYY hh:mmA');
            const result = parsedDate.format('YYYY-MM-DD HH:mm:ss');
            format = result;
        } else if (lang == 'ko') {
            const parsedDate = moment(dateStr, 'YYYY년MM월DD일 h:mmA');
            const result = parsedDate.format('YYYY-MM-DD HH:mm:ss');
            format = result
        } else {
            const parsedDate = moment(dateStr, 'YYYY年MM月DD日 hh:mmA');
            const result = parsedDate.format('YYYY-MM-DD HH:mm:ss');
            format = result;
        }
        return format
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
        const startOfDay = moment.tz(timeZone).startOf('day').unix();
        const endOfDay = moment.tz(timeZone).endOf('day').unix();
        return {
            start: startOfDay,
            end: endOfDay
        };
    }

    static getThreeDaysTimestamps(timeZone) {
        const startOfDay = moment.tz(timeZone).startOf('day').unix();
        const endOfThreeDays = moment.tz(timeZone).add(2, 'days').endOf('day').unix();
        return {
            start: startOfDay,
            end: endOfThreeDays
        };
    }

    static getThisWeekTimestamps(timeZone) {
        const startOfWeek = moment.tz(timeZone).startOf('week').unix();
        const endOfWeek = moment.tz(timeZone).endOf('week').unix();
        return {
            start: startOfWeek,
            end: endOfWeek
        };
    }

    static getCurrenTimeZoneStamp(timeZone) {
        return Math.floor(moment().valueOf() / 1000);;
    }

    static getTimestampForTodayWithTime(timeString) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const [hours, minutes] = timeString.split(':').map(Number);
        const timeInMs = (hours * 60 * 60) + (minutes * 60);
        return timeInMs;
    }

    static getYearToDay() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate
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

    static generateTimeSlots(startTime, endTime) {
        const timeSlots = [];
        const localTimeSlots = [];
        let currentTime = Common.parseTime(startTime);
        const endTimeDate = Common.parseTime(endTime);
        while (currentTime <= endTimeDate) {
            const formattedTime = Common.formatTime(currentTime);
            // Add to timeSlots (full hour only with separator "ㆍ")
            if (currentTime.getMinutes() === 0) {
                timeSlots.push(formattedTime);
                if (currentTime.getTime() !== endTimeDate.getTime()) {
                    timeSlots.push("ㆍ");
                }
            }
            // Add to localTimeSlots (every 30 minutes)
            localTimeSlots.push(formattedTime);
            // Increment by 30 minutes
            currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        return { timeSlots, localTimeSlots };
    }

    static parseTime(timeStr) {
        const [time, modifier] = timeStr.split(/(AM|PM)/);
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        } else if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes || 0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    static formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        if (hours < 10) {
            hours = '0' + hours
        }
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutesStr + ampm;
    }

    static formatAMPMTo24(str) {
        const [times, amstr] = str.split(' ')
        if (times) {
            let [hours, minutes] = times.split(':')
            let numberHour = Number(hours)
            let numberMinute = Number(minutes)
            let hoursStr = ''
            if (amstr == 'PM' && numberHour != 12) {
                numberHour += 12
                hoursStr = `${numberHour}`
            }
            if (numberHour < 10) {
                hoursStr = '0' + hours
            }
            return hoursStr + ':' + minutes;
        }
        
    }
}